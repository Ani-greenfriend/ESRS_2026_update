# PROGRESS — ESRS 2026 Update Check

> Claude Code: read this file at the start of every session, before touching
> anything. Update it at every save point. Replace content — do not append.
> History lives in git.

**Session:** 6
**Last updated:** 2 November 2026
**Live URL:** https://esrs2026update.netlify.app (Netlify default address until check.greenfriend.org is connected); release v1.0 = merge commit 1f047f6 on main [Rule: fill in after the first successful deploy]
**Stage:** business logic and database [Rule: one of — business logic and database / second screen and access design / login and access rules together / deploy and maintain. Advance it when that stage's items are absorbed into Current state. The stage is decided by what exists, never by a week or a version number.]
**Supabase project:** exists and built — "ESRS 2026 update tool", ref jfalwveuccerzeffxftx, URL https://jfalwveuccerzeffxftx.supabase.co, confirmed with the builder in session 1 [Rule: the only place project existence is recorded; CLAUDE.md never carries it]

## Current state
- Docs in place (spec v2.4, 2 Nov 2026): docs/product-spec.md, first-prompt.md, update-prompt.md, access-matrix.md, user-stories.md, supabase-setup.md; docs/reference/prototype-reference.html (v2.4 mockup) and the two v2.4 sample PDFs; docs/reference/assets/anika.png and elena.png (unchanged). CLAUDE.md is the v2.4 version (uploaded to main on 2 Nov 2026, merged into the branch).
- Session 6 (2 Nov 2026): the v2.4 changes are built on branch claude/determined-hawking-moo4nu; main (the live site) is unchanged until the builder merges. Session 5's v2.3 rebuild was merged to main (pull request 3, 21 Oct 2026).
- Frontend (React 18 + Vite 6 + Tailwind 3) builds with `npm run build`, in the v2.4 order: cover with the scope check, who is in scope (who reports when), non-EU groups (hidden unless needed), parent/subsidiary/neither (example cases), what changed, which standard (FY2026 routes), what: datapoints, when: roadmap, get the PDF, who we are, footer, /privacy. Matches the v2.4 mockup in light and dark: short-answer bars, chapter icons, three-step pill lines, "What it means for you" / "Our tip" / "Good to know" lines, toggles, one floating tooltip (hover, focus, tap), source i icons, scroll-following eight-link menu; no sideways scroll at 375 px.
- Logic in src/lib as pure functions: scope.js, estimator.js (hand-checked: defaults 569 → 237, −58%, 163; all topics 783 → 292, 195; every scope verdict path). roadmap.js is gone (v2.4: the roadmap has no dates or variants).
- Estimator shows the "Plus 31 general datapoints" total line (defaults 268, all ten 323); fact sheet has the legend highlight and the "Why the numbers differ between sources" toggle.
- Unlock form: email plus one optional unticked consent box, button "Get my PDF" (v2.4 mockup); company, industry and interests are not asked (columns stay, empty).
- Datapoints v2.3 (session 5): fact sheet and estimator; the headline ("You go from … to …") is free, the bars and the "Plus 31 general datapoints" total are locked; "What are the 31 general datapoints?" with the four P/A/M/T cards and Good to know; standard-by-standard, labels and drill-down removed with their data (DRS, DRT, STDS, TAGS). Ticking or unticking a topic marks the selection as the visitor's own for the PDF.
- Your 2026 route v2.0+ (session 5): three fixed cards A/B/C (Pre-Omnibus / Pre-Omnibus plus reliefs / Revised in full, effort dots, "Fits if", source i icon, eight shortcuts toggle on B), Good to know, Our tip, folded "Where this comes from"; nothing locked, no questionnaire.
- When: roadmap v2.4 (session 6): one general plan for everyone, no dates and no year-end selector: a coral snaking road (SVG) with KICK-OFF, seven icon stops and FINAL REPORT; titles visible, details only in the hover card (hover, focus, tap; one at a time, a click outside closes) with the "greenfriend step n" pill; "Runs alongside all steps" with Reporting governance and Auditor alignment (check-ins); "Make it yours" note. Under 760 px the stops stack with their text open. Not in the PDF.
- Gating: two locked areas (datapoint breakdown, cases 3–7 "Why") blurred until unlock; the scope reasons show in full in the cover (builder request, 3 Nov 2026), with the v2.4 lock labels ("… come with your free PDF") and the button "Get your free PDF"; `esrs-unlocked` flag kept across reloads.
- Get the PDF v2.4 (session 6): "Your results, as one PDF" with four tiles matching the PDF (Scope, FY2026 route options, Datapoints, Dates to plan around), the A2 format line and a live status list (scope done or not, topics selected or not; no roadmap line); after unlock "Your PDF is ready." and the "Take your results with you" box with one Download PDF button (kept per CLAUDE.md v2.4, although the v2.4 mockup dropped it; its line now names the A2 page). Dialog: "Get your results as one PDF", with the Download PDF button in the dialog itself.
- Who we are v2.3 (session 5): "Want our help?" band with "Book a free call" (greenfriend.org) on top, light indigo background with white cards, shorter lede and quote, 64 px round photos (public/assets, 128 px JPEG, alt text), five step cards side by side with a + toggle; the "Leave your email" contact mode and the footer CTA box are removed.
- Footer v2.3: disclaimer, data source, sources, /privacy, then the "General information" note with the AI disclosure verbatim.
- Export v2.4 (session 6): one A2 landscape page (594 × 420 mm, drawn on a 420 × 297 grid scaled by 594/420) built in the browser with bundled jsPDF 4.2.1, port of the prototype's buildPdf(): lavender background, gradient header "Your ESRS 2026 Update Check", three columns (Scope with pill badge, YOUR ANSWERS table with the wave answer highlighted and WHAT IT MEANS bullets, or the general guide; three route cards with accent bar, effort dots and FITS IF pill; Datapoints: own selection with headline, three bars and the PER TOPIC table, otherwise 57 to 292 per topic and 88 to 323 in total), dates strip, three-column disclaimer (v2.4 wording) and the gradient CTA band at the bottom; no roadmap, no inputs strip. Checked against both sample PDFs.
- Leads: `unlocks.request_type` is `download` for every new row (the contact mode is gone; earlier `contact` rows keep their value). route, route_from_example and route_answers are no longer sent or stored (migration 20261021112904 made them nullable).
- Submit: netlify/functions/submit-unlock.mjs (16 KB limit, strict validation, lower-cased email, insert plus supersede, secret key). Session 5: route fields are refused as unknown fields and `request_type` must be `download`; the page's real payloads (no scope, full scope, no topics) passed the function's validation in the browser test.
- Live: v1.0 deployed from main; a real unlock on the live site stored one row (9 Oct 2026).
- Database: `unlocks` and `profiles` built with RLS on, no policy and no grant for anon or authenticated; Anika's profile seeded; pg_cron enabled. The built-in `rls_auto_enable()` RPC is no longer executable by anon.
- Brand v2.3 (session 4): blue "Bold indigo" tokens in light and dark (spec Section 10), soft shadows instead of borders, coral chapter-eyebrow pills, larger chapter headings, gradient cover background; League Spartan Bold (self-hosted WOFF2, OFL added) for the "greenfriend." word mark; colour planes removed everywhere; indigo favicon. Checked in the browser at 1,400 px light and dark and at 375 px (no sideways scroll). The PDF keeps the old colours until it is rebuilt.
- Cover v2.4 (session 6): gradient band with "greenfriend.", H1 "Do you have to report?", one line, and the scope check in the cover (quiz left, reading right); the 30-second strip and the "Check your company" button are gone.
- What changed and Who reports when v2.4 (session 6): What changed has the heading "Six things changed in the ESRS 2026", the pill line Scan / Tap / Note and the key dates as the "Remember these dates" block. Who reports when ("Who is in scope"): Test / Find / Check pills, the two thresholds as one centred strip, the non-EU line with "See the three questions", and the "Find your row" table restyled (group as a small pill, bold description, equal year columns, taller cells, row hover). The builder's wave wording and toggle stay. Parent/subsidiary/neither ends with the "Not sure on which level you report?" box and "Email us" (mailto with the spec subject). Which standard: heading "Which standards for your 2026 report? You choose" with the notes in one framed block. Example cases and datapoints sit on tinted full-width bands.
- Non-EU groups: the v2.1 guided stepper, hidden under "Who is in scope" until the first scope answer is "Outside the EU" (the cover reading then says the guide is below) or the visitor taps "See the three questions".
- Browser bundle checked: no Supabase key or client, no "ESRS26_" strings, only same-site requests, no "Preview" or "Lock again" leftovers.

## Last session
Session 6: placed the spec v2.4 docs (five documents from the root upload, then the mockup and the two sample PDFs from the chat upload; no _new-docs/ folder existed). The v2.4 CLAUDE.md and a new PROGRESS.md template arrived later on main: CLAUDE.md replaced; PROGRESS.md kept (it holds the build state) and its new points taken over. Built the v2.4 additions on branch claude/determined-hawking-moo4nu: new page order and eight-link menu, scope check in the cover, What changed / Who reports when / Which standard / cases CTA, "Find your row" restyle, the snaking-road roadmap, the "Your results, as one PDF" section and the A2 landscape PDF. Tested in Chromium: example, wave-1 parent, non-EU with own topics, no topics at 375 px dark; no console errors, no sideways scroll; all PDF states checked as images.
[Rule: 3–5 lines maximum. Replace each session — what was built, changed, or fixed.]

## Remaining work
Spec v2.4 — open:
- [ ] Builder: review the branch (deploy preview once a pull request exists) and merge it to main
- [ ] Builder: have a lawyer read the PDF disclaimer wording before launch (spec Section 8, v2.4 block)
- [ ] Source policy: re-check every source line against its link before launch
- [ ] Acceptance criteria 14, 19, 20 and 21 (spec Section 13, v2.4) on the deployed site

Carried over from session 3:
- [ ] Builder: check the Supabase variable values in Netlify start with `sb_` (the names work: a live unlock was stored); make sure they apply to deploy previews too if previews should save unlocks
- [ ] HTTP refusal test as a logged-out visitor with the publishable key (REST read/insert/update/delete on unlocks and profiles, RPC, GraphQL); paste the result into "Refusal test record" in docs/supabase-setup.md §3
- [ ] Live test of supersede on the deployed site: a second unlock with the same email in different case supersedes the first (one live row already stored correctly)
- [ ] If a live unlock fails again: read Netlify → Logs → Functions → submit-unlock for that moment (the first live try on 9 Oct failed before reaching the database)
- [ ] Acceptance criteria pass — verify all 18 criteria in spec Section 13 (v2.3 wording) on the deployed site
- [ ] Builder: add the custom domain check.greenfriend.org in Netlify and the CNAME in Wix DNS
[Rule: completed items leave this list and are absorbed into Current state. This list only shrinks.]

## Build decisions
- Builder request (9 Oct 2026): sections reordered from large to small for a sustainability manager: What changed → Who reports when → Check your scope → Non-EU groups → Example cases → Your 2026 route → Datapoints → Get the PDF → Who we are (the mockup had Datapoints second). The menu and the 30-second strip (size test, FY2027, then 323 datapoints) follow the same order.
- Builder request (9 Oct 2026): on screens 1,420 px and wider the chapter menu is a slim list in the empty left margin ("On this page"), shown once the cover has scrolled away; below that width the sticky top bar stays as before.
- Builder request (9 Oct 2026): wave logic clarified with the builder's wording: scope question 5 help text (wave 1 = old NFRD public-interest entities >500 employees; unlisted never wave 1), timeline row "Old wave 2, now >1,000 employees & >€450M" with postponement tooltips, and a "What are wave 1 and wave 2?" toggle under the timeline. Not checked against the legal texts in this environment.
- Builder correction (9 Oct 2026): Elena's profile no longer calls Sage a FTSE 100 company (bullet "Former Senior Director of Sustainability at Sage", chip "Ex-Sage · Senior Director").
- Builder request (9 Oct 2026): the "Fewer companies in scope" card stays at ~80% (the final law, Directive (EU) 2026/470: 1,000 employees and €450M) and its detail explains that the 90% figure was the European Parliament's negotiating proposal (1,750 employees), not the law. Wording and figures (about 50,000 to 10,000) from the builder; not checked against a primary source in this environment.
- Builder request (9 Oct 2026): `unlocks.request_type` ('download' | 'contact', default 'download'); since session 5 (v2.3, no contact mode) the function accepts only 'download'; the column and its check stay for the earlier rows.
- Builder feedback (9 Oct 2026, "no downloadable page displayed"): the unlock confirmation offers "Open your one-pager (PDF)" in a new tab and "Download again" as plain links to a prebuilt blob URL; CSP object-src changed from 'none' to 'self' blob: so the browser's PDF viewer can show it.
- Release tags are created by the builder on GitHub (Releases → new release): this environment can push only to its working branch.
- Prototype CSS ported as one global stylesheet (src/styles/app.css); Tailwind is set up with brand tokens and preflight off, so the prototype's look is exact.
- Prototype data tables extracted verbatim into src/lib/data.js; shared constants (industries, interests, notice version, rules date, email check) in src/lib/constants.js, imported by both the browser and the function.
- Vite `envPrefix` is `PUBLIC_`, so no `VITE_SUPABASE_*` value can reach the browser bundle.
- Fonts: Latin WOFF2 files for Literata 500/500i/700/800, Figtree 400–700 and DM Mono 400/500 committed in src/fonts with OFL.txt; no font package at runtime.
- jsPDF 4.2.1 (versions ≤ 4.2.0 have security advisories), loaded on demand only when a PDF is built.
- Industry and interests are stored as their display labels, so the CSV export reads plainly.
- `notice_version` and `consent_at` are set by the function, not trusted from the browser.
- The function sends no data back except `{ok}` or an error code; it never logs email or IP.
- The privacy link under the form opens /privacy in a new tab so the visitor keeps their answers; /privacy is served by a Netlify rewrite to the single page.
- The case-tab lock uses an inline SVG instead of the prototype's emoji (no emoji rule).
- The clean-up job runs at 01:00 and 02:00 UTC and acts only in the hour that is 03:00 in Amsterdam (pg_cron uses UTC; this follows daylight saving).
- The clean-up function lives in a non-exposed `private` schema.
- Applied migration files are named after the versions Supabase recorded; an unapplied migration waits in supabase/pending/.
- Work is pushed to branch claude/determined-hawking-moo4nu (the session's assigned branch) instead of directly to main; main receives it by merge.
- Netlify headers: a Content-Security-Policy that allows only same-site scripts, fonts and connections.
- Service labels on "How we help" steps 1–4 use the mockup's yellow `.svc` pill (replaces the session-1 teal tag).
- Builder request (8 Oct 2026): steps 1–4 show a round line icon on the left (DMA target, Strategy signpost, Governance people, Reporting document). This knowingly bends the "no circles" brand rule at the builder's request; on phones the circle sits above the text.
- Builder request (8 Oct 2026): step 1's label reads "Double materiality assessment (DMA) optimization".
- Builder request (9 Oct 2026): the dark footer box no longer says "Report what you do."; it is now the "Need our help?" box ("Need to report? Need more information? We will reach out to you." plus "Leave your email", "Contact us" and the greenfriend.org tag), and the separate help box under the steps is removed. The PDF footer still says "Report what you do."
- Builder request (8 Oct 2026): a "Want our help?" box under the steps with "Leave your email" (opens the email dialog in contact mode: button "Send", the consent box must be ticked, no PDF download; stored as a normal unlock row with consent_contact true, so the supersede rule applies) and "Contact us" (mailto anikalerch@greenfriend.org).
- The privacy notice stays a separate view at /privacy (spec), not the mockup's #privacy hash view; form links open it in a new tab.
- After an unlock from the dialog, the dialog stays open and shows the confirmation and "Download again" (the mockup closes it; spec Section 8 asks for the confirmation).
- The cover no longer carries "Independent tool by greenfriend. Not affiliated with EFRAG or the European Commission." (spec v2.0: "Nothing else" on the cover); the line stays in the footer.
- The submit function still validates company, industry and interests if ever sent; the browser no longer sends them.
- Session 4 (16 Oct 2026): docs follow the new CLAUDE.md layout — docs/ (spec, access-matrix, user-stories, first-prompt, update-prompt, supabase-setup), docs/reference/ (prototype, sample PDFs), docs/reference/assets/ (anika.png = blond person, elena.png = glasses person).
- Session 4 (16 Oct 2026): the builder asked for this clean-up to be pushed straight to main.
- Builder decision (16 Oct 2026): follow spec v2.3 on all five open conflicts. This replaces the session-3 requests for the 9 Oct section order (now the v2.2 order), the 1,420 px margin menu (now the 1,180 px sidebar), ~80% (now the ~90% card with the 80%-or-90% note), the "Leave your email" contact mode (now the "Book a free call" band) and the round icons on steps 1–4 (removed).
- Who reports when keeps the builder's 9 Oct wave wording (the "What are wave 1 and wave 2?" toggle, the "Old wave 2, now >1,000 employees & >€450M" row label and the postponement tooltips) next to the v2.2 Good to know line: the spec does not contradict it and it was not one of the five conflicts. The old "For you" threshold cards are replaced by the decision flow.
- The scope question on wave 1 keeps the builder's 9 Oct help text (old NFRD, unlisted never wave 1) instead of the prototype's shorter line; every other question and verdict text matches the prototype's `Q` and `verdict()`.
- The ~90% card's table and note are stored as data (not HTML strings) and drawn as JSX.
- Menu: links are built only for chapters that exist on the page, so no link points nowhere while a chapter is still to be built; the sidebar layout is switched on by a `withnav` class on body, so /privacy keeps its full width.
- Fixed: a later `body{overflow-x:hidden}` rule made body a scroll container and stopped the sticky top bar from sticking; removed (the earlier `overflow-x:clip` rule already prevents sideways scroll).
- Brand: the mockup's variable names stay (--olive = indigo primary, --terra = coral) so ported CSS keeps working; hardcoded yellows now use var(--mark-solid) (#ffe27a); the dot-chart greys stay as in the prototype.
- Session 5: route, route_from_example and route_answers were made nullable (not dropped), so the live v1 site keeps writing while the preview writes nulls; dropping them can follow once v2.3 is merged.
- Session 5: with no topic ticked the PDF shows "127 -> 57" for ESRS 2 alone without the percentage pill (update prompt v2.3); the prototype showed the general range there.
- Session 5: the PDF file is named greenfriend-revised-esrs-check.pdf (title "Your revised ESRS check").
- Session 5: profile photos are 128 px JPEGs in public/assets made from docs/reference/assets (the originals stay as the source).
- Session 6 (v2.4): where the v2.4 mockup and spec differ, the build keeps "What are the 31 general datapoints?" (spec Section 8 still describes it; the mockup dropped it and moved one line into the 323 card instead, which the build does not add) and keeps the builder's "Find your row" wording (row names, wave toggle); the pill and bold line come from splitting each row name, as the prototype's whoHtml() does.
- Session 6 (v2.4): copy and layout not described in the spec text come from the v2.4 mockup: cover heading and scope check in the cover, removal of the 30-second strip, section headings and lock labels, "Get my PDF" and the unlock confirmation "Your PDF is ready.". The "Take your results with you" box stays (CLAUDE.md v2.4 names it); its text "One page, A2 landscape, with your scope, route options, datapoints and the dates to plan around. Forward it to your CFO or board." is adapted from the v2.3 line and the v2.4 format line; the builder may want to word it.
- Session 6 (v2.4): the PDF route cards all use the indigo accent as in the mockup and the sample PDFs; the YOUR ANSWERS table has short labels for the non-EU questions too (the prototype mapped only the EU questions, so long non-EU questions overlapped the answers); the PER TOPIC table's two columns have a 3-unit gap.
- Session 6 (v2.4): the roadmap hover cards and stop labels follow the dark theme (the mockup is light only); the PDF file is named greenfriend-esrs-2026-update-check.pdf.
- Builder request (3 Nov 2026, preview of pull request 4): the scope result in the cover shows its reasons in full (no blur, no "Get your free PDF" lock) and drops the "Pick your FY2026 route" and "Get this as a PDF" buttons; one line follows: "Run through this one-pager and download your personalized PDF below." This replaces the locked scope reasons of the spec and CLAUDE.md.
- Builder request (3 Nov 2026): "Who reports when" drops the Test / Find / Check pill line; its short answer reads "Check the new legal thresholds that changed in 2026." (spec v2.4 kept the pills only there, so no chapter has them now except What changed and the roadmap).
- Builder request (3 Nov 2026): the non-EU line in "Who reports when" is shortened to "If you are outside the EU, keep reading below."; "keep reading below" is the link that opens the hidden non-EU guide under it and scrolls to it (it replaces "See the three questions").
[Rule: one line per decision made during the build that is not in the spec — prompt structures, field formats, naming choices, library picks. Future sessions depend on these to stay consistent.]

## Known issues
Before going public (builder): send EFRAG (digital-reporting@efrag.org) the courtesy note on using datapoint counts with attribution; have an auditor or partner read the scope logic; privacy contact signs off the notice.
Clean-up job deferred (see Backlog): until it runs, nothing is anonymised after 30 days or deleted after 24 months automatically, although the privacy notice promises both.
The project still has an enabled legacy anon JWT key (eyJ…). It reaches nothing (no grants), but Netlify must hold the `sb_` keys.
Anonymisation counts 30 days from created_at; a manual consent withdrawal on an older row is anonymised at the next run.
Gated content is blurred in the page, not withheld from it (as in the prototype); a technical visitor can read it in the page source.
Unit tests for the logic are in the spec but not seeded here (see Backlog); the logic was checked by hand against every scope path in session 1.
Spec Section 7 full notice still says "email and company name are deleted after 30 days"; the build follows the mockup and v1.7 ("your email is deleted"). Align the spec text when it is next revised.
Spec v2.3 contradictions to fix in the next spec revision: Section 9.5 and CLAUDE.md say two locked areas, but v2.2 (Section 8, Entry points, criterion 8) has three (adds the datapoint breakdown; the build follows three); Sections 8 and 12 still say initials avatars and "waiting for headshots", but v2.3 and CLAUDE.md use the photos; the Section 8 menu list has no roadmap link but the text says nine links; the update prompt's "PDF now 2 pages" line was replaced by the one square page.
The uploaded PROGRESS.md of 2 Nov 2026 was a pre-build template (Session 0, "Supabase empty"); it was not used to overwrite this file, which holds the build state. CLAUDE.md v2.4 still says one unlock opens two locked areas; the build keeps three (see the spec contradiction line below).
The FY2026 route section may be rebuilt as a recommendation by situation (Big 4 sources): wait for the builder before building it (from the 2 Nov 2026 PROGRESS template).
Open: the Netherlands note in the Dutch group case (sources checked Feb 2026 only); the per-topic counts (STAT) — confirm no change since the first version; who updates the "rules status" date on cover and PDF (src/lib/constants.js RULES_DATE); final EFRAG list (end 2026) may change the counts.
[Rule: bugs, edge cases, and deferred fixes. One line each. Remove when resolved.]

## Backlog
- Clean-up job (pg_cron, daily 03:00 Amsterdam: anonymise no-consent rows after 30 days, delete rows after 24 months) — deferred by the builder on 8 Oct 2026, to be resolved later. Ready to apply: supabase/pending/create_cleanup_job.sql (pg_cron is already enabled); applying it needs the builder to approve Supabase's confirmation for its DELETE within 60 seconds.
- Contacts dashboard with login (Tool B on this database; first reader Anika Lerch) — its own full Access Architect run first
- Confirmation email / double opt-in (Resend, greenfriend.org verified) — builder chose format check only
- Mailbox or domain verification of emails; emailing the PDF — format check and a browser download are enough
- EFRAG datapoint names or IDs — needs EFRAG's written permission
- Update greenfriend.org's main privacy policy — separate website task
- Bot check (Cloudflare Turnstile) — builder's decision for the first version; add if junk submissions appear
- Analytics or tracking — GDPR and simplicity; Supabase Pro — adds cost
- Not in place: unit-test suite for scope, estimator and roadmap logic — what it would take: a test runner and one test file per logic function (spec Section 9 asks for it)
- Not in place: rate limit and bot check on the submit function (v1 has only the 16 KB limit and validation) — what it would take: a free Cloudflare Turnstile widget, a site key and secret key in Netlify, and a token check in the function (a spec change)
- Handover: backups (Free has none; the builder's monthly CSV export of `unlocks` and the migration files are the rebuild path); a paused project is restored in the Supabase dashboard; check the pg_cron job history monthly; where the keys live and how to rotate one; accounts held by Anika (anikalerch@greenfriend.org); who supports the tool; how to retire it
[Rule: deferred and approved items live here, nowhere else. When a new stage starts or the spec is revised, review this list: an item now in scope is promoted into Remaining work and removed from here, with a Build decisions line saying so. Nothing here is built without being promoted.]

## Notes for next session
[Rule: the builder writes here between sessions. Claude Code reads these aloud at session start, acts on them, then clears this section.]
