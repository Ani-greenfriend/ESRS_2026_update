# PROGRESS — ESRS 2026 Update Check

> Claude Code: read this file at the start of every session, before touching
> anything. Update it at every save point. Replace content — do not append.
> History lives in git.

**Session:** 0 — build not started
**Last updated:** 7 October 2026 — by Project Governor, pre-build
**Live URL:** none yet [Rule: fill in after the first successful deploy]
**Stage:** business logic and database [Rule: one of — business logic and database / second screen and access design / login and access rules together / deploy and maintain. Advance it when that stage's items are absorbed into Current state. The stage is decided by what exists, never by a week or a version number.]
**Supabase project:** exists and empty — "ESRS 2026 update tool", ref jfalwveuccerzeffxftx, URL https://jfalwveuccerzeffxftx.supabase.co (confirm the ref with the builder in session 1; never create a second project) [Rule: the only place project existence is recorded; CLAUDE.md never carries it]

## Current state
Nothing built. Repo contains CLAUDE.md, PROGRESS.md, product-spec.md, access-matrix.md, user-stories.md, prototype-reference.html.
[Rule: this section describes what exists and works right now — never what is planned. Completed checklist items get absorbed here in compressed form.]

## Last session
None — the first build session has not happened yet.
[Rule: 3–5 lines maximum. Replace each session — what was built, changed, or fixed.]

## Remaining work
- [ ] First Session Setup: create docs/ and docs/reference/, move the spec, the two access files and the prototype into them and check each is there, commit (see CLAUDE.md Session Protocol)
- [ ] Builder: create the GitHub repo, connect it to a Netlify site (one-time), connect Supabase to the site with the Supabase extension (the project already exists; this can happen before session 1)
- [ ] Connect to Supabase project jfalwveuccerzeffxftx via MCP: confirm the ref with the builder, check the project is still empty, never create a new one
- [ ] Build tables `unlocks` and `profiles` (named migrations saved in supabase/migrations/) with RLS on from creation, login-ready columns, anon grants revoked and the short-form rules from docs/access-matrix.md; no Auth, no screen reads a table; then write docs/supabase-setup.md following the structure in CLAUDE.md
- [ ] Build the pg_cron clean-up job (named migration): daily 03:00 Europe/Amsterdam; anonymise no-consent rows after 30 days, delete rows after 24 months; execute revoked from everyone but the job
- [ ] Set up the React + Vite + Tailwind project: self-hosted fonts (WOFF2), colour tokens and dark mode from CLAUDE.md Brand, pure logic functions for scope, route and estimator, data tables from the prototype
- [ ] Build Cover — hook and urgency, "greenfriend." brand line, colour planes, alert strip
- [ ] Build Sticky chapter menu — jump links, active chapter highlighted, scrolls sideways on phones
- [ ] Build What changed — six expandable cards and the key-dates timeline
- [ ] Build Datapoints — fact sheet and buckets, own-number estimator, standard-by-standard drill-down (requirements beyond 3 locked)
- [ ] Build Who reports when — threshold cards and the cohort timeline table
- [ ] Build Check your scope — questionnaire, "Your reading" panel, verdict (reasons locked)
- [ ] Build Non-EU groups — two route cards and the three-step flow
- [ ] Build Example cases — seven tabs with org charts (tabs 3–7 and their "Why" locked)
- [ ] Build FY2026 options — three route cards, seven questions, recommendation panel (reasons locked)
- [ ] Build Unlock section and Unlock dialog — form, consent logic, short notice, "Download again"
- [ ] Build Who we are and how we help — pitch, three cards, two profile cards with initials avatars
- [ ] Build Footer — CTA box, disclaimer, data source line, sources, link to /privacy
- [ ] Build Privacy notice view at /privacy — full notice, version 2026-10-07
- [ ] Wire Export: browser-generated one-page A4 PDF (bundled jsPDF), downloads right after a successful unlock, per spec Section 3
- [ ] Wire Submit function `submit-unlock`: 16 KB body limit, every field validated, supersede rule, insert with the secret key; the form posts here only
- [ ] Public endpoint protections before the first public deploy: confirm no anon policy or grant on any table, the browser bundle holds no Supabase key or client, and the function refuses bad email and oversized bodies. No rate limit, no bot check.
- [ ] Show the confirmed short data notice under the form, and the consent checkbox (not pre-ticked, `consent_at` and `notice_version` recorded with the row)
- [ ] Local test pass — full walkthrough of every view and every scope path, desktop and 375 px
- [ ] Acceptance criteria pass — verify all 18 criteria in spec Section 13 before deploy
- [ ] Builder: check the Supabase variable values in Netlify start with `sb_`, add the custom domain check.greenfriend.org in Netlify and the CNAME in Wix DNS; redeploy
- [ ] Push to main → Netlify auto-deploys
[Rule: completed items leave this list and are absorbed into Current state. This list only shrinks.]

## Build decisions
None yet.
[Rule: one line per decision made during the build that is not in the spec — prompt structures, field formats, naming choices, library picks. Future sessions depend on these to stay consistent.]

## Known issues
Before going public (builder): send EFRAG (digital-reporting@efrag.org) the courtesy note on using datapoint counts with attribution; have an auditor or partner read the scope logic; privacy contact signs off the notice.
Unit tests for the logic are in the spec but not seeded here (see Backlog); the local test pass covers every scope path by hand.
Open: headshots for the profile cards; who updates the "rules status" date on cover and PDF; final EFRAG list (end 2026) may change the counts.
[Rule: bugs, edge cases, and deferred fixes. One line each. Remove when resolved.]

## Backlog
- Contacts dashboard with login (Tool B on this database; first reader Anika Lerch) — its own full Access Architect run first
- Confirmation email / double opt-in (Resend, greenfriend.org verified) — builder chose format check only
- Mailbox or domain verification of emails; emailing the PDF — format check and a browser download are enough
- EFRAG datapoint names or IDs — needs EFRAG's written permission
- Update greenfriend.org's main privacy policy — separate website task
- Bot check (Cloudflare Turnstile) — builder's decision for the first version; add if junk submissions appear
- Analytics or tracking — GDPR and simplicity; real profile photos — waiting for headshots; Supabase Pro — adds cost
- Not in place: unit-test suite for scope, route and estimator logic — what it would take: a test runner and one test file per logic function (spec Section 9 asks for it)
- Not in place: rate limit and bot check on the submit function (v1 has only the 16 KB limit and validation) — what it would take: a free Cloudflare Turnstile widget, a site key and secret key in Netlify, and a token check in the function (a spec change)
- Handover: backups (Free has none; the builder's monthly CSV export of `unlocks` and the migration files are the rebuild path); a paused project is restored in the Supabase dashboard; check the pg_cron job history monthly; where the keys live and how to rotate one; accounts held by Anika (anikalerch@greenfriend.org); who supports the tool; how to retire it
[Rule: deferred and approved items live here, nowhere else. When a new stage starts or the spec is revised, review this list: an item now in scope is promoted into Remaining work and removed from here, with a Build decisions line saying so. Nothing here is built without being promoted.]

## Notes for next session
Netlify variables were entered by hand, not by the extension. Verify the names and that the values start with sb_ on the first live build.
[Rule: the builder writes here between sessions. Claude Code reads these aloud at session start, acts on them, then clears this section.]
