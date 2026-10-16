# PROGRESS — ESRS 2026 Update Check

> Claude Code: read this file at the start of every session, before touching
> anything. Update it at every save point. Replace content — do not append.
> History lives in git.

**Session:** 0 — build not started
**Last updated:** 15 October 2026 — by Project Governor, pre-build (spec v2.3)
**Live URL:** none yet [Rule: fill in after the first successful deploy]
**Stage:** business logic and database [Rule: one of — business logic and database / second screen and access design / login and access rules together / deploy and maintain. Advance it when that stage's items are absorbed into Current state. The stage is decided by what exists, never by a week or a version number.]
**Supabase project:** exists and empty — "ESRS 2026 update tool", ref jfalwveuccerzeffxftx, URL https://jfalwveuccerzeffxftx.supabase.co (confirm the ref with the builder in session 1; never create a second project) [Rule: the only place project existence is recorded; CLAUDE.md never carries it]

## Current state
Nothing built. Repo contains CLAUDE.md, PROGRESS.md and docs/ (product-spec.md, access-matrix.md, user-stories.md, first-prompt.md, update-prompt.md, reference/prototype-reference.html, reference/assets/ photos, reference/sample PDFs and slides).
[Rule: this section describes what exists and works right now — never what is planned. Completed checklist items get absorbed here in compressed form.]

## Last session
None — the first build session has not happened yet.
[Rule: 3–5 lines maximum. Replace each session — what was built, changed, or fixed.]

## Remaining work
- [ ] First Session Setup: create docs/ and docs/reference/, move the spec, the two access files and prototype-reference.html (the final mockup) into docs/reference/ and the rest into docs/ and check each is there, commit (see CLAUDE.md Session Protocol)
- [ ] Builder: create the GitHub repo, connect it to a Netlify site (one-time), connect Supabase to the site with the Supabase extension (the project already exists; this can happen before session 1)
- [ ] Connect to Supabase project jfalwveuccerzeffxftx via MCP: confirm the ref with the builder, check the project is still empty, never create a new one
- [ ] Build tables `unlocks` and `profiles` (named migrations saved in supabase/migrations/) with RLS on from creation, login-ready columns, anon grants revoked and the short-form rules from docs/access-matrix.md; no Auth, no screen reads a table; then write docs/supabase-setup.md following the structure in CLAUDE.md
- [ ] Build the pg_cron clean-up job (named migration): daily 03:00 Europe/Amsterdam; anonymise no-consent rows after 30 days, delete rows after 24 months; execute revoked from everyone but the job
- [ ] Set up the React + Vite + Tailwind project: self-hosted fonts (WOFF2), colour tokens and dark mode from CLAUDE.md Brand, pure logic functions for scope and estimator, data tables from the mockup
- [ ] Build Cover — plain dark band, "greenfriend." brand line, H1, one-line lede and one "Check your company" button (no alert, stamps or colour planes), then the "30-second version" strip (three tiles with icons)
- [ ] Build Sticky chapter menu — fixed left sidebar (230 px, brand line on top) from 1180 px wide, sticky top bar below that; jump links, active chapter follows the scroll position (including "Who we are"), scrolls sideways on phones and keeps the active link in view
- [ ] Build What changed — six expandable cards (closed by default, i icon with source, "Source" line inside) and the key-dates timeline
- [ ] Build Who reports when — threshold cards with "What it means for you" lines and the cohort timeline table (cohorts say EU; "Good to know" explains wave 1 and links to the national transposition measures); every cell and key item explains itself on hover, focus and tap (one floating tooltip)
- [ ] Build Check your scope — questionnaire, "Your reading" panel, verdict (reasons locked)
- [ ] Build Datapoints — fact sheet and buckets, own-number estimator (with the "plus 31 general datapoints" total line). No standard-by-standard section
- [ ] Build Non-EU groups — guided three-question stepper (numbered steps, Yes/No answer boxes, fine-print and Good to know toggles), the "Our tip" line
- [ ] Build Example cases — seven tabs with org charts (tabs 3–7 and their "Why" locked)
- [ ] Build Your 2026 route (id fy2026) — three route cards A/B/C (plain names, Pre-Omnibus / Revised ESRS names, effort dots, "Fits if", source icon), Good to know, Our tip (route C as the natural fit for those starting now) and the "Where the three routes come from" toggle. No questions, no scoring, nothing locked
- [ ] Build Unlock section and Unlock dialog — email-only form, one optional consent box, one-line notice, button "Get it free", four numbered squares (Scope result, FY2026 routes, Datapoint estimate, One-page PDF), "Download again"
- [ ] Build Who we are and how we help — pitch, three cards, two profile cards with the round photos from docs/reference/assets, steps 0–4 as five cards side by side, each with a service label and a + toggle for the details
- [ ] Build Footer — no CTA box, AI disclosure in the General information note (spec Footer section), disclaimer, data source line, sources, link to /privacy
- [ ] Build Privacy notice view at /privacy — full notice, version 2026-10-07
- [ ] Wire Export: browser-generated square one-page PDF (bundled jsPDF) per spec Section 3 and the sample PDFs in docs/reference/, with the three datapoint states and the general-guidance sections; downloads right after a successful unlock
- [ ] Wire slides export (v2.3): bundled PptxGenJS builds the 5-slide .pptx from the same inputs as the PDF (see docs/reference/ESRS-update-check-slides-sample.pptx); "Take your results internally or present them in a deck?" box with Download PDF and Download slides after unlock
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
Open before launch: check the Netherlands note in the Dutch group example case (repair clause for first-wave reporters; sources checked February 2026 only); per-topic datapoint count table (STAT in the prototype) was checked by the builder against the first version, confirm no change since; the FY2026 route section may be rebuilt as a recommendation by situation (Big 4 sources) — wait for the builder before building it; who updates the "rules status" date on cover and PDF; final EFRAG list (end 2026) may change the counts.
[Rule: bugs, edge cases, and deferred fixes. One line each. Remove when resolved.]

## Backlog
- Contacts dashboard with login (Tool B on this database; first reader Anika Lerch) — its own full Access Architect run first
- Confirmation email / double opt-in (Resend, greenfriend.org verified) — builder chose format check only
- Mailbox or domain verification of emails; emailing the PDF — format check and a browser download are enough
- EFRAG datapoint names or IDs — needs EFRAG's written permission
- Update greenfriend.org's main privacy policy — separate website task
- Bot check (Cloudflare Turnstile) — builder's decision for the first version; add if junk submissions appear
- Analytics or tracking — GDPR and simplicity; Supabase Pro — adds cost
- Not in place: unit-test suite for scope and estimator logic — what it would take: a test runner and one test file per logic function (spec Section 9 asks for it)
- Not in place: rate limit and bot check on the submit function (v1 has only the 16 KB limit and validation) — what it would take: a free Cloudflare Turnstile widget, a site key and secret key in Netlify, and a token check in the function (a spec change)
- Handover: backups (Free has none; the builder's monthly CSV export of `unlocks` and the migration files are the rebuild path); a paused project is restored in the Supabase dashboard; check the pg_cron job history monthly; where the keys live and how to rotate one; accounts held by Anika (anikalerch@greenfriend.org); who supports the tool; how to retire it
[Rule: deferred and approved items live here, nowhere else. When a new stage starts or the spec is revised, review this list: an item now in scope is promoted into Remaining work and removed from here, with a Build decisions line saying so. Nothing here is built without being promoted.]

## Notes for next session
None.
[Rule: the builder writes here between sessions. Claude Code reads these aloud at session start, acts on them, then clears this section.]
