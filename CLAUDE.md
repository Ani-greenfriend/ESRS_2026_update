# ESRS 2026 Update Check
## Identity
A free public lead-magnet tool that explains the revised ESRS, checks scope, recommends an FY2026 route and unlocks a one-page PDF for an email. Used by prospective clients reaching it from LinkedIn at check.greenfriend.org.
Tier: 2 — public tool, no login, submissions persist to Supabase (D3+A1)
Spec version governed: v1.1 — the version of docs/product-spec.md these rules were derived from.
Position: Standalone for now; a later contacts dashboard (Tool B, with a login) will share the Supabase project. This tool creates the schema and holds the canonical docs/access-matrix.md, docs/user-stories.md and docs/supabase-setup.md.
## Session Protocol
At the start of every session:
1. Pull the latest from main before reading anything else.
2. Check docs/product-spec.md: if its version is newer than "Spec version governed" above, STOP and tell the builder: "The spec has changed since this CLAUDE.md was written — re-run the Project Governor on the revised spec before building, or these rules may contradict it."
3. Read PROGRESS.md in the project root — it is the current state of this build. If missing, recreate it with the structure at the end of this section, then continue.
4. Increment the session number and update the date in PROGRESS.md.
5. If "Notes for next session" has content: repeat it to the builder, treat it as this session's priorities, then clear the section.
6. If this is session 1, run First Session Setup below before any build work.
Save point — after completing any module, feature, fix, or schema change:
1. Update PROGRESS.md: current state, remaining work, build decisions, known issues.
2. If the database was touched (table, policy, trigger, function, cron job), update docs/supabase-setup.md in the same save point and commit the migration file in supabase/migrations/ with it.
3. Commit and push to main.
4. Tell the builder in one line: "Save point committed: [what changed]."
Do not start the next piece of work before the save point is pushed. An ending session is a save point.
First Session Setup (session 1 only):
1. Create docs/ and move product-spec.md, access-matrix.md and user-stories.md into it; move prototype-reference.html to docs/reference/. Check every file is there; if one is missing, stop: "I cannot find [file]; upload it to the repo root and I will move it". Nothing is built while a required document is missing.
2. Announce what moved, then commit and push before building anything.
PROGRESS.md structure (for the recreate rule): status header (Session / Last updated / Live URL / Stage / Supabase project), Current state, Last session (3–5 lines, replace each session), Remaining work (shrinking checklist), Build decisions (one line each), Known issues, Backlog (deferred and approved items, promoted only deliberately), Notes for next session.
## Commands
`npm install` · `npm run dev` · `npm run build`
## Tech Stack
React · Vite · Tailwind CSS · Netlify (static site + Netlify Functions) · Supabase
Deployment: GitHub push to main → Netlify auto-deploys. Claude Code pushes to main; it does NOT connect to Netlify and no Netlify connector or MCP is used. The builder connects the repo to a Netlify site once, connects Supabase to that site with the Supabase extension (it writes the Supabase variables), then redeploys (Vite reads browser variables at build time). A missing Supabase variable is fixed by the extension connection, never a pasted value.
No new costs: Netlify Free, Supabase Free. Add no paid service without a spec change.
## Arms
Export — browser only, no server function — one-page A4 PDF built with a bundled jsPDF (npm, never a CDN), design per spec Section 3; downloads automatically after a successful unlock; the prototype's buildPdf() is the reference
Scheduled — Supabase pg_cron (not a Netlify function) — daily 03:00 Europe/Amsterdam — one SQL function: (1) rows older than 30 days with consent_contact false: email and company set to null, anonymised_at set; (2) rows older than 24 months deleted. No email.
Submit — user-triggered — /netlify/functions/submit-unlock — the only write path to the database (see Hard Rules)
## Environment Variables
VITE_SUPABASE_URL — written by the Supabase extension — read by the submit function only, never imported by browser code — public
VITE_SUPABASE_ANON_KEY — written by the Supabase extension — not used by this tool — public (publishable key, `sb_publishable_…`)
SUPABASE_SERVICE_ROLE_KEY — written by the Supabase extension — submit function only — SECRET; value is the secret key (`sb_secret_…`); never VITE_-prefixed
SUPABASE_DATABASE_URL — written by the Supabase extension — not used by this tool — SECRET
Names are verified on the first live build; if the extension writes different ones, tell the builder and record them in docs/supabase-setup.md §8. Values must start with `sb_` (publishable/secret keys; the older anon/service_role keys are a separate retiring system). If one starts with `eyJ`, tell the builder: replace the public one by hand; rotating the secret one becomes a dated Backlog item.
Key storage follows function placement: Netlify Functions read Netlify env vars. A key in the wrong store fails silently. At session start confirm these exist before first use and prompt the builder for any missing. No value ever appears in code or any committed file. The browser bundle contains no Supabase key and no Supabase client.
## Supabase
Project: "ESRS 2026 update tool" — ref jfalwveuccerzeffxftx — URL https://jfalwveuccerzeffxftx.supabase.co — EU (Frankfurt, eu-central-1). It ALREADY EXISTS and is empty (no tables, no supabase-setup.md at spec time). In session 1 confirm this ref with the builder, check with list_tables that it is still empty, and build into it via Supabase MCP. Never create a second project.
Plan: Free — no backups, pauses after ~1 week idle; mitigation is the builder's monthly CSV export. Pro would add cost and is a spec change.
Every schema, policy, trigger, function and cron change goes through `apply_migration` with a descriptive name AND is saved as supabase/migrations/[timestamp]_[name].sql, committed with the save point. `execute_sql` is for reads and data fixes only. The migration files can rebuild this database from nothing.

Schema (authoritative until docs/supabase-setup.md exists):
unlocks: id (uuid), created_at, email (lower-cased, max 254), company (max 120), industry, consent_contact (boolean, default false), interests (text[]), consent_at, notice_version, scope_badge, scope_headline, scope_answers (jsonb), route (A/B/C), route_from_example (boolean), route_answers (jsonb), topics (text[]), datapoints_old, datapoints_new, datapoints_unconditional (integer), utm_source, utm_campaign (max 80), superseded_by (uuid → unlocks.id, null if current), anonymised_at, created_by (→ profiles.id, empty, no login), status (current → superseded → anonymised; default current), updated_by, updated_at
profiles: id (own uuid), auth_user_id (uuid, unique, empty until a login exists), email (unique, the seed key), full_name, function, role, is_admin (default false), active (default true) — seeded with Anika Lerch (anikalerch@greenfriend.org) as the later dashboard's first reader; no Auth yet
RLS — enable on EVERY table the moment it is created; never disable it. Every rule is lifted from docs/access-matrix.md (short form, population pattern P1 public, stays anonymous); build each with the mechanism it names. `anon` has no policy and no table grant on any table (revoke after each table is created).
unlocks: anon: create only, through the submit function; no policy, no grant. No read, no update, no delete, no export. The supersede transition (current → superseded) is done by the submit function, never by the visitor.
The submit function (netlify/functions/submit-unlock) is the rule for its path: RLS does not apply to the secret key, so it refuses a body over 16 KB, validates every field and does nothing but the one insert and the supersede flip.
profiles: default deny, no policy (the matrix states no rule for it). Leads are read and exported only by the platform owner in the Supabase dashboard.
Configure no Auth. No screen reads a table.
After setup, write docs/supabase-setup.md (ten sections: header, tables, rules with mechanism and matrix line, triggers, functions, buckets, Auth, env variable names without values, notes and flags, change log by migration file) and update it at every database save point.
## Hard Rules
- API keys never in any frontend file or GitHub commit; always through a server-side function. Netlify Identity: never.
- RLS enabled on every table from creation, never disabled; if a query fails, fix the policy or the query. `anon` has no policy and no table grant on any table.
- Migrations: every schema, policy, trigger, function and cron change via `apply_migration`, saved in supabase/migrations/; `execute_sql` for reads and data fixes only.
- Function contract: database functions are SECURITY INVOKER unless one must write a protected column; exceptions are SECURITY DEFINER with `SET search_path = ''` and schema-qualified names, checking the caller first. The clean-up function runs from pg_cron only: REVOKE EXECUTE FROM public, anon, authenticated. No RPC is callable by anon. The Netlify function holding the secret key validates every input and returns only the fields the spec names.
- Every access rule comes from docs/access-matrix.md and is built with the mechanism its policy plan names. If a rule is missing, stop and tell the builder to revise the matrix; never invent one.
- Access rules lifted from the matrix: (1) The refusal happens in the database, or in a server function that holds the secret key and checks every request itself; never only in the screen. A hidden button is not a rule. RLS is enabled on every table and never disabled to make something work. `anon` has no policy and no table grant on any table; a public form writes only through the submit function. A function that holds the secret key bypasses RLS, so for its path the function is the rule. (2) No user can change their own `role`, `is_admin` or `active` through the app; a trigger refuses it. Those are set from the Supabase dashboard by the platform owner. (Applies once a login exists.) (3) A row in its final state is frozen. Nothing in this build edits a stored unlock; a newer unlock supersedes the old one. (4) Nothing is deleted through the app. No `DELETE` policy exists on any table. Deletion happens only through the scheduled clean-up job (24 months) or by the platform owner in the Supabase dashboard on a GDPR request. Copies already exported are outside the tool. (5) Every record table carries `created_by`, `created_at`, `updated_by`, `updated_at`.
- Public endpoint protections: every public write goes through submit-unlock; the browser never writes to a table. The function is the only user of SUPABASE_SERVICE_ROLE_KEY (a Netlify env var; it bypasses all RLS), rejects bodies over 16 KB, validates email format, lengths, and allowed values for industry, interests, route and topics, re-validates answer shape (not logic), lower-cases the email, applies the supersede rule and inserts with the secret key. There is no rate limit and, in v1, no bot check: Cloudflare Turnstile is deferred (see Out of scope); build no CAPTCHA. The visitor's IP is never stored or logged (duplicates are handled by the supersede rule, not an IP column).
- GDPR: lawful basis — legitimate interest for delivering results and recording the request; consent (unticked checkbox, recorded with consent_at and notice_version) for contact. Consent is never a condition for the PDF. Personal data: email, company. Retention: 30 days without consent (email and company removed), 24 months total. The short notice shows under the form and the full notice at /privacy before any submit. Deletion requests go to anikalerch@greenfriend.org; the builder deletes every row with that email (current and superseded) in the dashboard; withdrawal sets consent_contact false. Region EU (Frankfurt). Fonts self-hosted, no analytics, no tracking cookies, no third-party scripts; browser storage only for the `esrs-unlocked` flag.
- Complexity: build no rate limit, queue, retry, scan, monitor or test suite. Such lines go on the PROGRESS.md Backlog as "not in place; what it would take".
## Project Structure
Root: CLAUDE.md and PROGRESS.md only. /src (components, lib with pure logic, fonts) · /netlify/functions (submit-unlock) · /docs (spec, access-matrix, user-stories, supabase-setup, reference/prototype-reference.html) · /supabase/migrations (one .sql per applied migration) · /public/assets
## Brand
No brand skill. Version "A" of docs/reference/prototype-reference.html defines the look; the calm variant is not used. Hard rules:
- Background #eef3f0 (surface #ffffff, ink #17302e); dark mode follows the system setting (bg #0f1f1e) — never Tailwind gray defaults
- Primary teal #17635c; attention coral #e2553f (deadlines and unlock buttons); highlight yellow #ffe066; lilac #6c5fc7 — never Tailwind blue defaults
- Fonts: Literata (headings), Figtree (body), DM Mono (stamps, labels); WOFF2 self-hosted in the repo, never from Google
- No circles in the design: overlapping translucent diagonal colour planes; 12–16 px radii; no heavy shadows; no emoji; works at 375 px with no sideways scroll; respect reduced motion
- Text brand "greenfriend." with a yellow dot; no personal names on the cover or in the PDF. Remove the prototype's "Preview" badges and "Mockup only" controls.
## Business Rules
- Scope check, FY2026 route scoring and the estimator are pure functions implemented exactly as spec Section 9 and the prototype (verdict(), PQ, DRS/DRT). A scope verdict shows only when every question on the path is answered.
- Route: highest total wins; ties go to the earlier route (A before B before C); example answers keep route_from_example true until any answer changes.
- Estimator: reduction % = round((1 − new ÷ old) × 100). Defaults (E1, E5, S1, S2, G1) give 569 → 237, 163 unconditional; all ten topics give 783 → 292, 195.
- Show no EFRAG datapoint names or IDs (no "ESRS26_" strings) anywhere; the drill-down uses our plain summaries and the regulation's titles.
- Unlock: email lower-cased, standard format with a TLD of 2+ letters, max 254, no mailbox check; ticking any interest ticks consent; one unlock opens all four locked areas, remembered as `esrs-unlocked` in try/catch. Submitting before the scope check is finished is allowed; row and PDF say "not completed".
- Supersede: a new unlock for an email (case-insensitive) with a current row inserts the new row and sets superseded_by on the old one; consent comes from the newest row.

Out of scope — do not build:
- Contacts dashboard with login; confirmation email / double opt-in; mailbox or domain verification; emailing the PDF
- EFRAG datapoint names or IDs; updating greenfriend.org's main privacy policy; analytics or tracking
- Bot check / Cloudflare Turnstile (deferred by the builder); real profile photos (initials avatars); Supabase Pro; a calm colour variant
## Reference Docs
Read before building the related part:
- docs/product-spec.md — full screens, copy, logic, PDF design, GDPR text, acceptance criteria
- docs/supabase-setup.md — schema source of truth (created in session 1)
- docs/access-matrix.md — read before writing any RLS or touching a policy (short form: anon rules only)
- docs/user-stories.md — read before changing a screen or a role; every acceptance line is a test
- docs/reference/prototype-reference.html — all copy, data tables, layout
PROGRESS.md in the root is read at every session start per the Session Protocol.
