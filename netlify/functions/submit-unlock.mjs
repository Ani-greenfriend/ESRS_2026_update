// submit-unlock: the only write path to the database (docs/access-matrix.md, policy plan rows 1 and 4).
// It holds the Supabase secret key, which bypasses RLS, so this function is the rule for its path:
// it refuses bodies over 16 KB, validates every field against the allowed values, lower-cases the
// email, inserts one row and flips the earlier current row for the same email to superseded.
// No rate limit and no bot check in v1 (deferred). The visitor's IP is never stored or logged.
import { Q, PQ, TOPICS } from "../../src/lib/data.js";
import { SCOPE_BADGES } from "../../src/lib/scope.js";
import { COMPANY_MAX, INDUSTRIES, INTERESTS, NOTICE_VERSION, UTM_MAX, isValidEmail } from "../../src/lib/constants.js";

const MAX_BYTES = 16 * 1024;
const TOPIC_CODES = TOPICS.map((t) => t[0]);
const FIELDS = [
  "email", "company", "industry", "consent_contact", "interests", "notice_version",
  "scope_badge", "scope_headline", "scope_answers", "route", "route_from_example", "route_answers",
  "topics", "datapoints_old", "datapoints_new", "datapoints_unconditional", "utm_source", "utm_campaign",
];

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

class Invalid extends Error {
  constructor(code = "invalid") { super(code); this.code = code; }
}
const need = (cond, code) => { if (!cond) throw new Invalid(code); };

const isObj = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const CTRL = /[\u0000-\u001f\u007f]/;

function optText(v, max) {
  if (v === null || v === undefined) return null;
  need(typeof v === "string" && !CTRL.test(v));
  const t = v.trim();
  need(t.length <= max);
  return t || null;
}

function subsetArray(v, allowed, max) {
  need(Array.isArray(v) && v.length <= max);
  need(v.every((x) => typeof x === "string" && allowed.includes(x)));
  need(new Set(v).size === v.length);
  return v;
}

function count(v) {
  need(Number.isInteger(v) && v >= 0 && v <= 10000);
  return v;
}

function validate(b) {
  need(isObj(b));
  need(Object.keys(b).every((k) => FIELDS.includes(k)));

  need(typeof b.email === "string", "invalid_email");
  const email = b.email.trim().toLowerCase();
  need(isValidEmail(email), "invalid_email");

  const industry = b.industry ?? null;
  need(industry === null || INDUSTRIES.includes(industry));

  need(typeof b.consent_contact === "boolean");
  need(b.notice_version === NOTICE_VERSION);

  // Scope: shape only (keys and answer values from the questionnaire), not the logic.
  need(isObj(b.scope_answers) && Object.keys(b.scope_answers).length <= Object.keys(Q).length);
  for (const [k, v] of Object.entries(b.scope_answers)) {
    need(Q[k] && Q[k].o.some((o) => o[0] === v));
  }
  const badge = b.scope_badge ?? null;
  need(badge === null || SCOPE_BADGES.includes(badge));
  const headline = optText(b.scope_headline, 200);
  need((badge === null) === (headline === null));

  // Route: all seven answers present with allowed values.
  need(["A", "B", "C"].includes(b.route));
  need(typeof b.route_from_example === "boolean");
  need(isObj(b.route_answers) && Object.keys(b.route_answers).length === PQ.length);
  for (const q of PQ) need(q.o.some((o) => o[0] === b.route_answers[q.id]));

  return {
    email,
    company: optText(b.company, COMPANY_MAX),
    industry,
    consent_contact: b.consent_contact,
    consent_at: b.consent_contact ? new Date().toISOString() : null,
    interests: subsetArray(b.interests ?? [], INTERESTS, INTERESTS.length),
    notice_version: NOTICE_VERSION,
    scope_badge: badge,
    scope_headline: headline,
    scope_answers: b.scope_answers,
    route: b.route,
    route_from_example: b.route_from_example,
    route_answers: b.route_answers,
    topics: subsetArray(b.topics ?? [], TOPIC_CODES, TOPIC_CODES.length),
    datapoints_old: count(b.datapoints_old),
    datapoints_new: count(b.datapoints_new),
    datapoints_unconditional: count(b.datapoints_unconditional),
    utm_source: optText(b.utm_source, UTM_MAX),
    utm_campaign: optText(b.utm_campaign, UTM_MAX),
    status: "current",
  };
}

export default async (req) => {
  if (req.method !== "POST") return json(405, { ok: false, error: "method" });

  const declared = Number(req.headers.get("content-length") || 0);
  if (declared > MAX_BYTES) return json(413, { ok: false, error: "too_large" });
  const raw = await req.text();
  if (new TextEncoder().encode(raw).length > MAX_BYTES) return json(413, { ok: false, error: "too_large" });

  let row;
  try {
    row = validate(JSON.parse(raw));
  } catch (e) {
    return json(400, { ok: false, error: e instanceof Invalid ? e.code : "invalid" });
  }

  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("submit-unlock: Supabase environment variables are missing");
    return json(500, { ok: false, error: "server" });
  }
  const rest = `${url.replace(/\/+$/, "")}/rest/v1/unlocks`;
  const headers = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };

  // 1. Insert the new unlock.
  let id;
  try {
    const res = await fetch(rest, { method: "POST", headers: { ...headers, Prefer: "return=representation" }, body: JSON.stringify(row) });
    if (!res.ok) {
      console.error("submit-unlock: insert failed", res.status, (await res.text()).slice(0, 300));
      return json(502, { ok: false, error: "server" });
    }
    id = (await res.json())[0]?.id;
  } catch (e) {
    console.error("submit-unlock: insert error", e?.message);
    return json(502, { ok: false, error: "server" });
  }

  // 2. Supersede: earlier current rows for the same (lower-cased) email point to the new row.
  try {
    const q = `?email=eq.${encodeURIComponent(row.email)}&status=eq.current&id=neq.${id}`;
    const res = await fetch(rest + q, {
      method: "PATCH",
      headers: { ...headers, Prefer: "return=minimal" },
      body: JSON.stringify({ status: "superseded", superseded_by: id }),
    });
    if (!res.ok) console.error("submit-unlock: supersede failed", res.status, (await res.text()).slice(0, 300));
  } catch (e) {
    // The unlock itself is stored; a missed supersede leaves two current rows, fixed by hand if ever seen.
    console.error("submit-unlock: supersede error", e?.message);
  }

  return json(200, { ok: true });
};
