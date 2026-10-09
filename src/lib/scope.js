// Scope check: pure port of next(), totalSteps() and verdict() from the prototype (spec Section 9.1).
import { Q } from "./data.js";

// The next unanswered question key on the current path, or null when the path is complete.
export function nextQuestion(A) {
  if (!A.hq) return "hq";
  if (A.hq === "eu") {
    if (!A.role) return "role";
    if (A.role === "parent" && !A.fhc) return "fhc";
    if (!A.emp) return "emp";
    if (!A.turn) return "turn";
    if (!A.wave1) return "wave1";
    if (A.role === "sub" && !A.covered) return "covered";
    return null;
  }
  if (!A.listed) return "listed";
  if (!A.euturn) return "euturn";
  if (A.euturn === "y" && !A.anchor) return "anchor";
  if (!A.bigsub) return "bigsub";
  return null;
}

export function totalSteps(A) {
  return A.hq === "non" ? 4 : A.role === "sub" ? 6 : A.role === "parent" ? 6 : 5;
}

export const isScopeComplete = (A) => nextQuestion(A) === null;

// [question without its trailing text, chosen answer label] for each answered key, in order.
export function answerLines(hist, A) {
  return hist.map((k) => [Q[k].q.replace(/\?.*/, "?"), Q[k].o.find((o) => o[0] === A[k])[1]]);
}

// Returns {c, b, h, l, fy?} or null if the path is not complete. First match wins.
export function verdict(A) {
  if (!isScopeComplete(A)) return null;
  if (A.hq === "eu") {
    const big = A.emp === "y" && A.turn === "y";
    if (A.role === "parent" && A.fhc === "y")
      return { c: "v-maybe", b: "Opt-out possible", h: "Financial holding: consolidated report optional", l: ["As a financial holding undertaking, the parent may choose not to publish a consolidated sustainability report.", "Each subsidiary that itself exceeds 1,000 employees and €450M turnover must still report from FY2027.", big && A.wave1 === "y" ? "If you report for FY2026, see the FY2026 options below." : "Check each large subsidiary separately."] };
    if (A.role === "sub" && A.covered === "y")
      return { c: "v-out", b: "Exempt via parent", h: "Covered by your parent's consolidated report", l: ["Subsidiaries included in a parent's consolidated sustainability report are exempt from their own report, subject to formal conditions (such as naming the parent and linking its report).", "Omnibus I extends this exemption to subsidiaries listed on EU regulated markets.", big ? "Your own figures exceed both thresholds, so the exemption is what keeps you out. Check that the parent's report really covers you." : "Your own figures are below the thresholds, so you would not have to report anyway."] };
    if (big && A.wave1 === "y")
      return { c: "v-in", b: "In scope", h: "Keep reporting: FY2026 route, then revised ESRS from FY2027", l: ["You stay in scope without a break.", "For FY2026, choose: existing ESRS, existing ESRS plus reliefs, or revised ESRS in full.", "From FY2027 the revised ESRS are mandatory.", "The value chain cap applies to what you can ask suppliers with up to 1,000 employees."], fy: true };
    if (big)
      return { c: "v-in", b: "In scope from FY2027", h: "First report on FY2027, published in 2028", l: ["You report under the revised ESRS from the start.", "Phase-ins: you may defer E4, S2, S3 and S4 for your first two years, and explain missing value chain data for three years.", "Start the double materiality assessment in 2026; a top-down approach is now allowed.", A.role === "parent" ? "Your EU subsidiaries are exempt if covered by your consolidated report." : "If you belong to a group, a parent's consolidated report could exempt you."] };
    if (A.wave1 === "y")
      return { c: "v-maybe", b: "Leaving scope", h: "Out from FY2027; FY2025–2026 depends on national law", l: ["Below the new thresholds, you fall out of mandatory reporting from FY2027.", "For FY2025 and FY2026, your Member State may exempt you. This is a national option, not automatic.", "If your country does not use the option and you report FY2026, the FY2026 options below apply.", "Afterwards, the voluntary standard is an option, and the value chain cap protects you if you have up to 1,000 employees."], fy: true };
    return { c: "v-out", b: "Out of scope", h: "No mandatory CSRD reporting", l: ["You do not exceed both thresholds, so no mandatory CSRD report.", "The new voluntary standard (based on VSME) gives a simple, recognised format if customers or banks ask.", A.emp === "n" ? "With up to 1,000 employees, customers in scope cannot ask you for more than the voluntary standard covers." : "Watch for growth: if you exceed both thresholds, you come into scope.", "Check again if your group structure changes."] };
  }
  const r40 = A.euturn === "y" && A.anchor === "y";
  const l = [];
  if (A.listed === "y") l.push("As an issuer listed on an EU regulated market, you are tested like an EU company: more than 1,000 employees and €450M turnover means reporting from FY2027.");
  if (A.bigsub === "y") l.push("Your large EU subsidiary (or sub-group) reports from FY2027, unless you voluntarily publish a consolidated report under the full ESRS or an equivalent standard that covers it.");
  if (r40) l.push("Article 40a applies: a group-level report on FY2028, published in 2029 by your EU subsidiary or branch.", "Dedicated standards for non-EU groups are expected from October 2027 at the earliest.");
  else l.push(A.euturn === "n" ? "Article 40a does not apply: EU turnover is not above €450M in both of the last two years." : "Article 40a does not apply: no EU subsidiary or branch above €200M.");
  if (r40) return { c: "v-40a", b: "In scope (Art. 40a)", h: A.bigsub === "y" ? "Two obligations: EU subsidiary from FY2027, group from FY2028" : "Group report from FY2028", l };
  if (A.bigsub === "y" || A.listed === "y") return { c: "v-in", b: "Partly in scope", h: "Your EU entity reports from FY2027", l };
  return { c: "v-out", b: "Out of scope", h: "No CSRD obligation at group level", l: l.concat(["EU customers may still ask for data; the value chain cap limits requests for EU suppliers with up to 1,000 employees."]) };
}

// Every badge verdict() can return, for server-side shape validation.
export const SCOPE_BADGES = ["Opt-out possible", "Exempt via parent", "In scope", "In scope from FY2027", "Leaving scope", "Out of scope", "In scope (Art. 40a)", "Partly in scope"];
