# Product Spec — ESRS 2026 Update Check

**Version:** 2.3
**Date:** 7 October 2026
**Author:** Anika Lerch (greenfriend)
**Status:** Confirmed

---

## Section 1 — Tool Summary

**Tool name:** ESRS 2026 Update Check

**What it does:** A free, public web tool that explains what the revised ESRS (Delegated Regulation (EU) 2026/1563) and the Omnibus I Directive (EU) 2026/470 change. It lets a company check its own position: whether it is in scope and from when, the three FY2026 reporting routes and when each fits, and how many datapoints apply to its material topics. One email unlock reveals the detailed results and immediately downloads a one-page PDF. Each unlock is stored as a lead.

**Who uses it:** Potential clients of greenfriend: sustainability, CSRD and finance leads at mid-to-large companies (EU and non-EU groups with EU operations), mostly arriving from LinkedIn posts.

**Why it exists:** The revised ESRS enter into force on 10 November 2026, and companies must choose an FY2026 reporting route. The tool gives a fast, credible answer and turns that interest into qualified leads for greenfriend (company, industry, scope result, route, and the services the person is interested in).

**Build status:** First build, with no prior version. A clickable prototype exists and is the binding reference for copy, data, behaviour and visual design: `docs/reference/prototype-reference.html` (version "A"). Where this spec and the prototype differ, this spec wins.

---

## Section 2 — Classification

### Data Model

**Decision:** D3

| Label | What it means | This tool? |
|-------|--------------|-----------|
| D1 — Hardcoded | All data is written into the code by the developer. | No |
| D2 — Session | Data enters during use and disappears when the tab closes. | No |
| D3 — Persisted | Data is written to a database and survives after the session ends. Supabase is required. | Yes |

**Reason:** Every email unlock must be stored so greenfriend can build a lead list and follow up with people who consented.

**D3 triggers:**
- [x] Data must be retrievable after the session ends
- [x] Multiple sessions contribute to the same dataset
- [ ] An audit trail or history is needed
- [x] Data submitted by one person must be visible to another (greenfriend reads the leads)
- [ ] Results must be accessible via a URL after the session ends
- [ ] Files uploaded by users must be stored and retrievable later

### Access Model

**Decision:** A1

| Label | What it means | This tool? |
|-------|--------------|-----------|
| A1 — Public | Anyone with the URL can use it. No login. | Yes |
| A2 — Authentication | Users must log in, all with the same rights. | No |
| A3 — Authorization | Users log in with different roles. | No |

**Reason:** A lead magnet must work for any visitor from LinkedIn with no account. The email unlock collects the email without a login. A login was considered and rejected: it lowers conversion and adds cost and upkeep without collecting anything more.

> Leads are read by greenfriend in the Supabase dashboard (table view and CSV export). A future contacts dashboard with a login is a separate tool on the same database (see Section 12). Its first reader is **Anika Lerch, anikalerch@greenfriend.org**, so the database is built ready for that login.

### Tier

**Tier:** 2 (D3 + A1), meaning a public tool with no login whose submissions are kept in a Supabase database.

### Standalone or Stack

**This tool is:** Standalone for now. A later internal contacts dashboard (Tool B, with a login) will share the same Supabase project. This tool creates the schema and is the canonical repo for the database documents.

---

## Section 3 — Arms

### AI API Arm

**Active:** No

### Export Arm

**Active:** Yes

| Detail | Answer |
|--------|--------|
| Format | PDF |
| What is exported | A one-page "Your revised ESRS one-pager", built from the visitor's own session: scope result, the three FY2026 route options, datapoint numbers for their material topics, key dates, and greenfriend's call to action. Company name (if given) appears in the header. |
| How | Generated **in the browser** (bundled PDF library, e.g. jsPDF installed via npm, not loaded from a CDN). It downloads automatically right after a successful unlock. Nothing is stored on a server and no email is sent. A "Download again" button stays available on the page after unlock. |
| PDF design intent | **One page, square (280 x 280 mm), v2.3**, in the look of the page. Page background #f5f7fd. **Header** (full width, 40 mm): the indigo gradient (#121745 > #252b8c > #3a3fd1, 135 degrees, drawn as an image from a canvas), yellow dot, "greenfriend." bold, yellow kicker "ESRS UPDATE 2026" right, title "Your revised ESRS check" (24 pt bold white), subline "Prepared [date] · Status of rules: 7 Oct 2026". **Inputs strip** (soft indigo, 3 columns): Scope check (Completed / Not completed: general guide below), Topics (N selected / Not selected: all topics shown), Financial year-end (month or December). **Row 1:** left a soft indigo card "1 Scope" (badge, verdict headline, 3-4 bullets; general guide with the four scope rules when not completed); right "2 FY2026 route options": three white cards (Route A coral label, B indigo, C teal) with name and "Fits if". **Row 2:** left a white card "3 Datapoints": own selection = old number struck through > new number in indigo + yellow pill "-X%" + one sentence; otherwise "57 to 292 mandatory datapoints" with the per-topic counts in two columns; right a white card "4 Dates to plan around" (10 Nov 2026; 19 Mar 2027; FY2027; FY2028). **Row 3:** "5 Your 2027 roadmap", full width: year and month header, one bar per step (indigo), auditor arrow in teal with yellow check-in diamonds (label placed clear of the diamonds), annual report bars in light coral, legend line with the plan type. Sections not based on the user's answers carry the tag "General guidance, not based on your answers". **Footer** (28 mm, same gradient): "Report what you do.", "Want a second opinion? Book a free 20-minute call at greenfriend.org", then the disclaimer: "Automated view generated from the inputs you entered. Indicative reading of Directive (EU) 2026/470 and the revised ESRS (Delegated Regulation (EU) 2026/1563), provided without warranty and not legal advice. greenfriend is not responsible for this output or for how it is used. Prepared with AI support and reviewed by greenfriend. Confirm your position with your auditor or legal adviser." Fonts: the PDF library's built-in Helvetica. Characters outside its encoding are replaced with plain equivalents. One PDF only: both sign-up forms deliver this file. The prototype's `buildPdf()` is the reference implementation. |

### Email Arm

**Active:** No. A confirmation (double opt-in) email is deferred (Section 12).

### Scheduled Automation Arm

**Active:** Yes, database-only. No email and no external call.

| Detail | Answer |
|--------|--------|
| Schedule | Daily at 03:00 Europe/Amsterdam |
| What happens automatically | (1) Rows older than 30 days where `consent_contact` is false: `email` and `company` are set to null and `anonymised_at` is set. Industry, results and dates stay. (2) Rows older than 24 months, whatever the consent: deleted. |
| Placement | Supabase `pg_cron` job calling one SQL function (free on the Free plan; no Netlify scheduled function needed). Claude Code creates it as a named migration. |
| Triggers an email | No |
| Triggers a database update | Yes |
| If it fails | The job's run history in Supabase shows the failure. The monthly check in the runbook (Section 14) includes looking at it. No retries are designed. |

---

## Section 4 — Stack and Deployment

### All Tiers

| Detail | Answer |
|--------|--------|
| Frontend framework | React + Vite + Tailwind |
| Deployment target | Netlify |
| Deployment | GitHub push to main → Netlify auto-deploy. Claude Code is connected to GitHub and pushes to main. The repo is connected to a Netlify site once in the Netlify dashboard, and every push then deploys. Netlify is not connected to Claude: no Netlify connector or MCP is used. One-time builder steps in the Netlify dashboard: connect the repo to a site, and connect Supabase to the site with the Supabase extension (below). |
| Custom domain | **check.greenfriend.org**. Added in Netlify (Domain management → Add a domain you already own). The DNS record Netlify shows (a CNAME for `check`) is added in **Wix DNS** for greenfriend.org. HTTPS through Netlify's free certificate. No cost. |
| Supabase ↔ Netlify connection | The Supabase extension in Netlify, never copy-paste. Netlify → Extensions → Supabase → Install; then on the site → Connect → sign into Supabase → pick the project and framework (Vite). The extension writes the Supabase variables into the site's environment. Redeploy afterwards. **When:** the project already exists, so this can be done before the first build session. **Key check, once:** values should start with `sb_`. If they start with `eyJ`, the extension wrote the retiring legacy keys: replace the public one by hand with the publishable key, and rotating the secret one becomes a dated handover item. |
| Platform owner | Anika Lerch's existing accounts (Supabase and Netlify under anikalerch@greenfriend.org). |
| Cost rule | **No new costs.** Netlify Free, Supabase Free. No paid service may be added without a spec change. |

**GitHub:** a new repo for this tool, created by the builder before the first Claude Code session. `product-spec.md`, `CLAUDE.md`, `PROGRESS.md`, `access-matrix.md`, `user-stories.md` and `prototype-reference.html` go to the repo root. Claude Code moves them into `docs/` (the prototype into `docs/reference/`) in its first session.

### Supabase project

**Supabase project status:** Existing and empty. The builder created it on 7 October 2026; it has no tables yet and no supabase-setup.md. Claude Code **connects to this project and does not create a new one**, builds the schema, and writes docs/supabase-setup.md at the end of session 1.

**Supabase plan:** Free, for building and running at zero cost. The builder accepts the Free plan's limits: **no backups** and **pause after about one week without activity**. Mitigations: (1) a **monthly CSV export** of the leads table by the builder, stored outside Supabase, as the backup; (2) the handover runbook explains how to restore a paused project in the dashboard. Switch to Pro only if the lead list becomes business-critical, which would be a spec change because it adds cost.

| Detail | Answer |
|--------|--------|
| Project name | ESRS 2026 update tool |
| Project ID | jfalwveuccerzeffxftx |
| Project URL | https://jfalwveuccerzeffxftx.supabase.co |
| Region | EU, Frankfurt (eu-central-1) |
| State at spec time | Empty: no tables in `public`, no supabase-setup.md yet (checked 7 October 2026) |

> At the start of session 1 Claude Code confirms the project ID jfalwveuccerzeffxftx with the builder, checks that it is still empty, and builds into it via MCP. It never creates a second project. The later contacts dashboard joins this same project.

**supabase-setup.md:** created by Claude Code at the end of the first build session and updated every time Claude Code touches the database.

---

## Section 5 — Data Architecture

**What data is collected or stored:**

| Field name | Plain language label | Data type | Who provides it | Required? |
|-----------|---------------------|-----------|----------------|-----------|
| id | Record ID | UUID | Automatic | Yes |
| created_at | Date and time of unlock | Timestamp (UTC) | Automatic | Yes |
| email | Work email | Text, lower-cased, max 254 characters | Visitor | Yes (until anonymised) |
| company | Company name | Text, max 120 characters | Visitor | No |
| industry | Industry | Text. Not collected in v1; stays empty | Visitor | No |
| consent_contact | "I'd like greenfriend to contact me about my results" | Boolean, default false | Visitor | Yes |
| interests | Services of interest | Text array. Not collected in v1 (form removed in v1.7); stays empty | Visitor | No |
| consent_at | When contact consent was given | Timestamp, null if no consent | Automatic | If consent |
| notice_version | Version of the privacy notice shown | Text, e.g. "2026-10-07" | Automatic | Yes |
| scope_badge | Scope verdict label | Text, e.g. "In scope from FY2027" | Calculated | No (null if not completed) |
| scope_headline | Scope verdict headline | Text | Calculated | No |
| scope_answers | Scope questionnaire answers | JSON (question key → answer key) | Visitor | No |
| route | FY2026 route (not collected in v2.2, no recommendation; stays empty) | Text: A / B / C | Not collected | No |
| route_from_example | Not collected in v2.0 (no questionnaire); stays empty | Boolean | Not collected | No |
| route_answers | Not collected in v2.0 (no questionnaire); stays empty | JSON | Not collected | No |
| topics | Material topics chosen in the estimator | Text array (E1…G1) | Visitor | Yes (may be empty) |
| datapoints_old / datapoints_new / datapoints_unconditional | Estimator results | Integer | Calculated | Yes |
| utm_source, utm_campaign | Where the visit came from | Text, max 80, from the page URL | Automatic | No |
| superseded_by | Newer unlock with the same email | UUID, null if current | Automatic | No |
| anonymised_at | When email and company were removed | Timestamp | Automatic (scheduled job) | No |
| status, created_by, updated_by, updated_at | Login-ready columns | as seeded by the Governor | Automatic | — |

**Tables needed:**

| Table name | What it stores | Key fields |
|-----------|---------------|-----------|
| unlocks | One row per email unlock (the lead) | email, company, industry, consent_contact, interests, route, scope_badge, created_at |

**Main record and its states:**

| Detail | Answer |
|--------|--------|
| Main record | One row = one email unlock |
| States, in order | current → superseded (a newer unlock with the same email) → anonymised (no consent, after 30 days) → deleted (after 24 months). No manual states in this build. |
| Login-ready columns | Seeded by the Governor: `created_by` (empty, since there is no login), `status`, `created_at`, `updated_by`, `updated_at`; plus `profiles`, because a later login is planned (first reader: Anika Lerch, anikalerch@greenfriend.org). |

**Supersede rule:** when an unlock arrives for an email (case-insensitive) that already has a current row, the submit function inserts the new row and sets `superseded_by` on the old one. The old row is not edited otherwise. Consent is taken from the newest row.

**File storage:** No.

**Derived or calculated data:** Yes. Scope verdict and datapoint numbers are calculated in the browser (Section 9) and sent with the unlock. The submit function re-validates their shape and allowed values, not the logic.

---

## Section 6 — Access and Permissions

Not applicable in this build (A1, no login).

> The row-level access rules live in `access-matrix.md`, produced by the Access Architect (short run: the population pattern is "public stays anonymous", and the public writes only through the submit function). Claude Code builds the policies from that file. The browser has no Supabase access at all: no anon policy and no anon grant on `unlocks`. Greenfriend reads leads in the Supabase dashboard. This section does not duplicate the grid.

---

## Section 7 — GDPR

**GDPR outcome:** Applies. Personal data is collected through the unlock form.

**Personal data collected:** work email address; no company name or industry in v1. Answers and results are not personal data on their own but are linked to the email until anonymisation.

**Lawful basis (two purposes):**
1. **Delivering the requested results and recording the request.** Basis: legitimate interest (the visitor asks for their results; greenfriend records the request and understands demand). Email required.
2. **Contacting the person about their results.** Basis: consent, through an unticked checkbox. No newsletter is sent. Consent is **never** a condition for getting the PDF.

The basis was derived during the architect interview as a starting point; it is to be signed off by greenfriend's privacy contact (anikalerch@greenfriend.org).

**Notice on the form:** Yes, always (short version under the form, with a link to the full notice view). **Consent checkbox:** yes, for purpose 2 only; not pre-ticked; the tick is recorded with `consent_at` and `notice_version`.

**Short notice shown under the unlock form:**
> We use your email to send you your results and to record your request (legitimate interest). We only contact you if you tick the box above (consent, which you can withdraw at any time). Without consent, your email is deleted after 30 days; all data is deleted after 24 months. Full privacy notice →

**Full privacy notice (own view, see Section 8), covering the six required points without personal names:**
> **Who is responsible:** greenfriend, Amsterdam, the Netherlands (KVK 91346169). Contact for all privacy questions: anikalerch@greenfriend.org.
> **What we collect:** your work email, and your answers in this tool and the results calculated from them, and where your visit came from (a campaign tag in the link, if any).
> **Why and on what basis:** to give you your results and record your request (legitimate interest); to contact you about your results, only if you ticked the box (consent).
> **How long:** if you did not consent to contact, your email and company name are deleted after 30 days and only anonymous results stay. All data is deleted after 24 months.
> **Who else processes it:** Supabase (database, EU region Frankfurt), Netlify (hosting). Fonts are served from this site, and no analytics or tracking cookies are used. Your unlock is remembered in your own browser only.
> **Your rights:** access, correction, deletion, objection, restriction, data portability and withdrawing consent at any time, by emailing anikalerch@greenfriend.org. You can complain to the Dutch Data Protection Authority (Autoriteit Persoonsgegevens).
> Notice version: 2026-10-07.

**Retention:** consent rows are kept 24 months, then deleted; non-consent rows have email and company removed after 30 days (scheduled job, Section 3), and the anonymous remainder is deleted after 24 months.

**Deletion mechanism:** a person emails anikalerch@greenfriend.org. The builder deletes every row with that email (current and superseded) in the Supabase dashboard, or with one Claude Code admin command, within 30 days, and confirms by email. "Deletion" removes the row completely. Withdrawal of consent: set `consent_contact` to false on the current row; the 30-day clean-up then applies from that date.

**Other GDPR measures (hard rules):** fonts (Literata, Figtree) self-hosted from the site, never loaded from Google; no analytics, no tracking cookies, no third-party scripts; browser storage only for the unlock flag (strictly necessary for the function the visitor requested).

> The basis, the notice, the retention period and the deletion route are the standard this tool is built to. The notice drafted here is greenfriend's privacy contact's to sign off. greenfriend's main website privacy policy (https://www.greenfriend.org/privacy-policy) is separate and out of scope for this build (Section 12).

---

## Section 8 — Screen and UI Structure

One long single page with a sticky chapter menu, plus a separate privacy notice view and an unlock dialog. **The reference mockup (docs/reference/prototype-reference.html, the final mockup of spec v2.0) is the reference for all copy, data tables, layout and voice.** In the build, remove its "Mockup only / Lock again" footer button and the on-page PDF preview (the real PDF downloads instead), and load fonts from the repo, not from Google. The brand line reads "greenfriend." with no personal names on the cover.

**Voice and layout rules (v1.9, unchanged in v2.0).** Friendly supporter for sustainability managers and C-level: warm, light, plain words, "we", no jokes. Every chapter opens with a one-line **short answer** marked with a yellow bar. A small line icon sits in each chapter eyebrow. Where it helps the reader, a yellow **What it means for you** line says what it means for them, and an **Our tip** line closes a section. Disclaimers appear as **Good to know** tips. Detail and fine print sit behind toggles or hover (hover, keyboard focus and tap all work, since phones have no hover). Sources sit behind a small *i* icon. Tooltips that must not be clipped by a scrolling area use one floating tooltip element.

Below, **[locked]** marks content that is blurred with an "Unlock your action plan" bar until the visitor unlocks.

### Cover
- **Purpose:** Hook and urgency.
- **What is visible:** Dark indigo gradient (#121745 to #3a3fd1), no decoration; brand line "greenfriend."; H1 "ESRS update 2026 in 5 min"; one-line lede "What changed, who reports when, and which route to take for 2026."; one yellow button "Check your company" that jumps to the scope check. Nothing else (v2.0: the alert strip, stamp pills and colour planes were removed to keep the cover calm).
- **User actions:** jump to the scope check.

### The 30-second version (strip under the menu)
- Three tiles with an icon each: **Up to 323** datapoints if every topic is material (yours will be fewer; it was 1,052) · **1,000 + €450M** employees and turnover, EU companies must exceed both · **From FY2027** mandatory for financial years starting on or after 1 January 2027; for FY2026 you choose.

### Sticky chapter menu
- **Left-hand menu on desktop (v2.0):** from 1180 px wide the menu is a fixed left sidebar, 230 px wide, with the "greenfriend." brand line on top and the nine links stacked (Non-EU groups is not in the menu) (What changed · Who reports when · Check your scope · Datapoints · Example cases · Your 2026 route · Get the PDF · Who we are); the page content sits to its right. Below 1180 px (tablets and phones) it is the sticky top bar described below. The active chapter is highlighted in both layouts.
- What changed · Who reports when · Check your scope · Datapoints · Example cases · Your 2026 route · Get the PDF · Who we are. The active chapter follows the scroll position (scroll listener; "Who we are" is active at the bottom of the page; none on the cover) and the active link stays in view on phones.

### What changed
- Heading "Six things changed, the short version". Six expandable cards (number, title, one line; detail list on click, closed by default; an *i* icon with the source on hover and a "Source" line inside): Fewer companies in scope (~90%, an estimate; its detail opens full width with a table by company type, before and now, and a "80% or 90%?" note: the Commission's 2025 proposal was estimated at about 80%, some 35,000 of 45,000 companies; the final deal with the €450M test is about 90% by law-firm estimates; no official count of remaining companies; the source line says so) · 323 datapoints in total · Top-down materiality · VSME value chain cap · 3 FY2026 routes · Assurance stays limited. Below them, a horizontal key-dates timeline: 26 Feb 2026, 18 Mar 2026, 3 Jul 2026, 21 Sep 2026, 10 Nov 2026 (highlighted "now"), 19 Mar 2027 (coral), FY2027.

### Who reports when
- Heading "Do you have to report? Two quick criteria", short answer "Meet both criteria and you report under the revised ESRS from FY2027 (non-EU groups from FY2028)." **A small decision flow instead of text (v2.0):** (1) a card "EU company or EU group: do you meet both criteria?" with the two chips >1,000 employees AND >€450M net turnover (an *i* icon explains the old criteria, 250 employees and €50M, and that parents use group figures); an arrow down; (2) three outcome cards: "Yes, and you report today: Keep reporting, switch to the revised ESRS in FY2027" · "Yes, but you are new: Start reporting, your first report is FY2027" · "No, below a line: Not mandatory, out from FY2027, FY2025–26 depends on your country" (grey); (3) a purple strip "Non-EU group? Article 40a" with the chips >€450M EU turnover, 2 years AND EU entity >€200M and the line "FY2028: your EU entity reports for the whole group (published 2029). No headcount criterion." A timeline table (FY2024–FY2028) for six cohorts, with colour-coded cells (revised-ESRS cells striped) and a key. Every cell and key item explains itself on hover, focus and tap (group, year, meaning). Cohort names say "EU" (EU wave 1, Large EU company, Listed EU SME). The "Good to know" line says wave 1 means EU companies that already reported for FY2024, and links to the national transposition measures for Directive (EU) 2026/470 (EUR-Lex https://eur-lex.europa.eu/legal-content/EN/NIM/?uri=CELEX:32026L0470, new tab; the builder checks the link lists the measures once Member States publish them).

### Check your scope
- Left: one question at a time with progress bar, Back and Start again. Right: "Your reading", showing answers so far, then the verdict: badge + headline (free) and reasons and next steps **[locked]**, with buttons "Pick your FY2026 route" (when relevant) and "Get this as a PDF".

### Datapoints
- **Fact sheet:** dot chart (108 dots ≈ 10 datapoints each: 29 kept mandatory, 3 new general, 49 removed mandatory, 27 removed voluntary; the legend shows the exact counts 292 / 31 / 491 / 269, and a caption explains that the dots show the 1,052 old datapoints plus the 31 new ones, 1,083 in all, so 1,052 − 491 − 269 = 292, plus 31 = 323) with legend, and a bucket table: Mandatory "shall" 783 → 292 (of which 195 apply whenever the topic is material); Voluntary "may" 269 → 0; Policies, actions, targets, metrics "separate*" → 31; Total 1,052* → 323. Under the bucket table a closed toggle "Why the numbers differ between sources" explains: 323 = 292 + 31, all counts from EFRAG's 2026 draft list and explanatory note only (no figures from other sources); EFRAG's spreadsheet has 30 heading rows (3 per topic standard) pointing to the general datapoints and 6 technical ESRS 2 BP-1 rows that are not counted (E1: 87 rows, 84 datapoints); percentages: −63% mandatory (783 to 292), −72% mandatory plus voluntary (1,052 to 292), −69% with the 31 (1,052 to 323). In the drill-down the three requirements that apply GDR-P, GDR-A and GDR-T (for example E1-4, E1-5, E1-6) carry the chip "also refers to the general policy/action/target datapoints (not counted twice)". Headline figures −63% mandatory and −72% mandatory plus voluntary, with the footnote about 2023 MDR counting.
- **Your own number (estimator):** ten topic checkboxes (E1 Climate change, E2 Pollution, E3 Water, E4 Biodiversity, E5 Resource use, S1 Own workforce, S2 Value chain workers, S3 Communities, S4 Consumers, G1 Business conduct; default ticked: E1, E5, S1, S2, G1). Output: "You go from X to Y mandatory datapoints. That is Z% fewer." plus three bars (2023, revised, unconditional), then a highlighted line: "Plus 31 general datapoints on policies, actions, targets and metrics. They apply whatever topics you tick, so your total is Y+31 (Y + 31). With all ten topics ticked that is 323." The 31 are never part of the topic counts or the percentage (like-for-like: mandatory 783 vs 292).
- **What are the 31 general datapoints? (below the estimator):** heading, one line ("Four questions you answer for every material topic. Together they make up the 31.") and four cards with a yellow letter: P Policies "What rules do you have?" (What it says · Who it covers · Standards followed · Human rights policy); A Actions "What are you doing about it?" (What and when · Where · Expected result · Money involved); M Metrics "How do you measure it?" (Number and unit · How calculated · Data sources · Change over time); T Targets "Where do you want to get to?" (Target level · Baseline and year · Milestones · Methods used). Chips, not sentences; no single datapoints listed (EFRAG copyright, no datapoint names or IDs). Then a "Good to know" tip: reported each time a policy, action, metric or target is covered for a material topic; EFRAG's draft list counts 31; source revised ESRS 2 GDR-P/A/M/T. Free, not locked.

### Non-EU groups
- **Not in the main flow (v2.2).** The chapter sits directly under "Check your scope", hidden by default and not in the menu. It appears (a) automatically when the visitor answers "Outside the EU" to the first scope question, with the line "Your three-question guide for non-EU groups is right below" in the result, or (b) when the visitor taps "See the three questions" in the "Who reports when" chapter, which opens it in place and scrolls to it. "Start again" in the scope check hides it again unless it was opened by the link. In "Who reports when" the former non-EU strip is one line: "Group based outside the EU?" with a short sentence (large EU subsidiary FY2027, Article 40a FY2028) and that link. The non-EU row stays in the timetable.
- Heading "Outside the EU? Three questions" (v2.1). A guided stepper instead of route cards: one line "Answer in order. Stop as soon as one answer says it does not apply to you.", then three numbered steps joined by a vertical line. Each step is a white card with a route tag, one question and two answer boxes (Yes in indigo-soft, No in grey) that say what happens next. (1) Route 1, EU subsidiary, from FY2027: "Do you have an EU subsidiary with over 1,000 employees and over €450M turnover?" Yes: it reports like any EU company from FY2027, keep going; No: go to question 2. Fine print toggle: possible exemption if the non-EU parent voluntarily publishes a consolidated report under the full ESRS or an equivalent standard. (2) Route 2, Article 40a, from FY2028: "Did your group earn over €450M in the EU, two years in a row?" Yes: go to question 3; No: Article 40a does not apply. (3) "Do you have an EU subsidiary or branch with over €200M turnover?" Yes: that entity reports for the whole group from FY2028 (published 2029); No: does not apply. "Good to know" toggle: dedicated standards for non-EU groups expected from October 2027 at the earliest; financial holding undertakings can opt out. Then the "Our tip" line.

### Example cases
- Seven tabs (Dutch group, Large daughter, Wave 1 now too small, US group mid-size EU, US group big EU daughter, Swiss group below EU line, Branch only), each with an org chart (parent → subsidiaries, status chip per entity, dashed border for non-EU) and a "Why" list. Cases 1–2 are free; tabs 3–7 show a lock icon, and their "Why" is **[locked]**.

### Your 2026 route (chapter id fy2026)
- Heading "Three routes for your 2026 report", short answer "The delegated rules let you choose how to report FY2026. Pick one and say in your report which you used." Three route cards: A "Keep it as it is" (Pre-Omnibus ESRS), B "Keep it, with shortcuts" (Pre-Omnibus ESRS plus reliefs; "The eight shortcuts" toggle with their ESRS 1 paragraphs), C "Switch early" (Revised ESRS in full). Each card: letter, plain name, official name small, one line, three effort dots, a "Fits if" line, and an *i* icon with the source (Delegated Regulation (EU) 2026/1563, Article 2(1)(a) or (b)). No questionnaire, no scoring, no "best for you" label and nothing locked (v2.0: the seven questions were removed; the rationale lives in the "Fits if" lines). Below: a "Good to know" line that says what the names mean (Pre-Omnibus ESRS = the 2023 standards used for FY2025 as amended in 2025; Revised ESRS = the new, slimmer standards), an "Our tip" line (starting with ESRS now: route C is usually the natural fit, as there is no 2025 report to compare with; agree the route with your auditor early) and a toggle "Where the three routes come from" (Article 2(1)(a) = pre-Omnibus or revised ESRS, routes A and C; Article 2(1)(b) = pre-Omnibus ESRS plus up to eight reliefs, route B; Article 2(2) = state which version you applied). **Below the cards (v2.1):** a small folded "Where this comes from" toggle, closed by default (Delegated Regulation (EU) 2026/1563, OJ 21 September 2026, in force 10 November 2026: Article 2(1)(a) = routes A and C, Article 2(1)(b) = route B with the eight reliefs from ESRS 1 paras 27, 32-33, 74-75, 90, 91, 92, 106, 110, Article 2(2) = state the version, Article 3 = revised ESRS from FY2027; scope from Directive (EU) 2026/470; datapoint counts from EFRAG's 2026 draft list and explanatory note), then a "General information" note: greenfriend holds no rights to the ESRS or EFRAG materials, so the tool only explains meaning, structure and counts in its own words, never copies standard text, datapoint wording or EFRAG's list, and points to EUR-Lex and EFRAG for the exact wording; general information, not legal or audit advice. This replaces the earlier "Where the three routes come from" toggle.

### Unlock your action plan (section) and Unlock dialog
- **Purpose:** collect the lead and deliver the PDF.
- **Roadmap strategy step (v2.3):** every roadmap variant includes a strategy bar before governance: "Strategy refresh" May to Aug 2027 for companies that already assessed, "Build your strategy" Jun to Sep 2027 for first-time reporters. The PDF roadmap shows the same rows as the page.

- **Your 2027 roadmap (v2.2), its own chapter between "Your 2026 route" and "Get the PDF"; nav label "Your 2027 roadmap":** heading "Your roadmap for 2027", short answer "Built from your answers above. Plan it around your annual financial reporting, because the sustainability statement is published with it." No questions of its own and no picker. A line states what it is based on (the scope result, or "Run the scope check to tailor this plan"). A compact Gantt-style timeline (month columns Dec 2026 to Apr 2028, one bar per step), fully visible, not gated. Each bar carries its own short text (what happens, e.g. Screening, Kick-off, DMA refresh, Strategy, Gap analysis, Data collection and reporting, Annual report); the fuller detail shows on hover or keyboard focus (tap on phones) in the floating tooltip. The visualization is the focus; no separate label column. The grid scrolls sideways on phones. Steps (12 bars at most, our planning guide): (wave 1 only) FY2026 report, Jan to Apr 2027, in parallel; screening, Dec 2026 to Jan 2027; internal kick-off with executive sponsor, sustainability team, finance, HR, procurement, legal, IT and site leads, Jan to Feb 2027; auditor alignment as a separate track (the auditor stays independent): one violet arrow bar from Feb 2027 to Apr 2028 (wave 1: from Jan 2027) with check-in diamonds (scope and approach, DMA conclusions, gap analysis and data controls, dry-run findings, year-end plan and evidence, assurance findings), all agreed up front with the auditor; DMA, Feb to May 2027, up to 4 months; gap analysis, May to Jul 2027; strategy, May to Aug 2027; build governance and embed strategy (roles per topic, board and committee reporting, team training, targets in yearly goals, OKRs and budget), Aug to Nov 2027 (Sep to Dec for first-time reporters); data set-up, Jul to Sep 2027 (ticked topic count and mandatory datapoint count plus the 31 general ones, because the year runs from 1 Jan 2027 and data is captured during it); dry run on half-year data, Sep to Oct 2027; fix findings and pre-draft (close the dry-run gaps, brief data owners, draft the narrative parts that do not depend on year-end figures), Nov to Dec 2027, so there is no empty gap before year-end; year-end data and drafting, Jan to Mar 2028; assurance, Feb to Apr 2028; annual financial reporting as hatched bars (Jan to Apr, each year). Publication is with the annual report (Mar to Apr for a December year-end; sources: EY CSRD Barometer 2026, EFRAG statistics). **FY2026 report in 2027 (wave 1, scope result in scope with a FY2024 report):** the timeline leads with the FY2026 report: confirm route A, B or C (Dec 2026 to Jan 2027), year-end data (Jan to Feb 2027), draft statement (Feb to Mar), assurance (Mar to Apr), publish (Apr 2027); then the move to the revised ESRS for FY2027: DMA refresh (May to Jul), gap analysis (Jun to Aug), data set-up (Jul to Sep), dry run (Sep to Oct), FY2027 close, draft and assurance (Jan to Apr 2028); hatched annual reporting bars. All other results keep the first-report plan above (FY2027 as first report). **First-time reporters (no earlier report) get a longer plan:** documentation screening Dec 2026 to Mar 2027 (policies, existing reports, earlier assessments, data sources and owners), DMA from scratch Feb to Jul 2027 (up to 6 months), strategy Jun to Sep, gap analysis Jul to Sep, data set-up Sep to Nov, dry run on nine-month data Oct to Nov; the rest as in the other plan. **Our proposition on the timeline:** under the bars we support, a dotted line in terracotta with a small label shows our step from "How we help, step by step": 0 Where you stand (screening, route), 1 Double materiality (DMA), 2 Strategy, 3 Governance (kick-off, build governance and embed strategy), 4 Reporting (gap analysis, data set-up, dry run, fix and pre-draft, year-end draft, assurance evidence). Hover names the step; the legend explains the dotted line. Not shown on the auditor track or the annual financial reporting bars. **Layout:** one bar per row, in time order, with tight row spacing; the auditor track sits near the bottom, above the annual financial reporting bars (last row). **What changes with the visitor's answers:** wave 1 and in scope gives "Refresh your DMA", "Refresh your strategy" and "Gap analysis and match to earlier reports"; every other result gives "Run your DMA from scratch", "Build your strategy" and "Gap analysis" (non-EU groups under Article 40a get a note to shift the plan by a year; results that are out of scope or exempt get a note that it is the plan for voluntary reporting or customer requests); with no scope result both DMA options are named. Updates live when the scope answers or the ticked topics change. "Good to know": dates assume a calendar financial year, ask finance for the year-end close and annual report dates. Above the timeline, a field "Financial year ends in" (empty select "Select month", default December): choosing a month moves the whole timeline by the same number of months, redrawing the month and year axis and every date in the bar tooltips and the PDF section 4 (bars keep their position; the first financial year under the revised ESRS starts the month after the year-end, 1 July 2027 for a 30 June year-end); a line under the field states the shift. Below it, a folded note "Year-end not 31 December?": the plan assumes a calendar financial year; with another year-end (e.g. 30 June) every step shifts by the same months, the revised ESRS apply from the first financial year starting on or after 1 January 2027 (1 July 2027 for a 30 June year-end, reporting around the end of 2028), ask finance for year-end and annual report date. Our reading, to be checked with a source before launch. The box "Want our help?" no longer sits under the timeline: it is the top band of the "We help companies" section ("Who we are"), connected to it, with the button "Book a free call" (greenfriend.org). The plan appears in the one-page PDF and the on-page preview as section 4.
- **What is visible (section):** "Want it all on one page?" (dialog: "Unlock your full action plan"), four numbered squares (Scope reasons and next steps, Datapoint breakdown, All seven example cases, One-page PDF with your roadmap), a status list (scope done, datapoints, roadmap type), and the form. **Dialog:** opens from every "Unlock your action plan" button, with the same form. Closes on ×, Escape or backdrop click.
- **Form fields:** Work email (required; format check on the page and in the function); nothing else. **Email only, to keep the commitment feeling small (v1.7).** Company, industry and interests are not asked in v1 (their columns stay in the table, empty, for later); checkbox "greenfriend may contact me about my results (optional)" (unticked; no newsletter, no updates list); button "Get it free"; one-line notice "Free. We use your email only to send your results. We contact you only if you tick the box." with a link to the full notice view (Section 7 has the full text).
- **User actions:** submit.
- **What happens next:** the submit function validates and stores. On success, everything unlocks (flag kept in browser storage), the PDF downloads automatically, and a confirmation reads "Unlocked. Your one-pager is downloading." with a "Download again" button. On error: a plain message saying what went wrong (invalid email format, server unavailable); nothing unlocks; the visitor can retry.

### Who we are and how we help
- **One calm block (v2.0):** the whole section sits on one light blue background; every card (three "how we work" cards, two profiles, five step cards) is white on it. Text is kept short: one-line lede, one-line pull quote, profile cards show name, one-line role, two chips, a "More about" + toggle and the LinkedIn link in one row; step cards carry one short sentence each (0 In scope? From when? Which FY2026 route? · 1 We find the topics that matter, in a way your auditor accepts · 2 Each topic gets an objective, a starting point and a target · 3 Every topic gets an owner, and your board gets what it needs · 4 Your report shows progress and evidence, not just promises).
- Eyebrow "Hi, we are Anika and Elena". Pitch (H2 "We help companies report what they actually do" + lede + pull quote); **How we work differently**: three numbered cards showing only a title, the sentence opens on hover or tap (You work with us, not a junior team · Inside experience, consulting and tech · Strategy first, box-ticking last); two profile cards, each with three short chips and a "More about" toggle holding the bullets: **Anika Lerch, MSc** (Founder, greenfriend · Strategy, governance and CSRD; four bullets as in the prototype; LinkedIn link) and **Elena Zayakova, MSc** (Founder, CoreWorks Consultancy · Strategy, reporting and governance; four bullets; LinkedIn link), using initials avatars until photos are supplied; **How we help, step by step**: five cards side by side (three, two or one per row on narrower screens), steps 0–4 (Know where you stand · Find what really matters · Turn topics into goals · Make clear who owns what · Report what you did). Every card shows a yellow label under the title (0 This tool · 1 Double materiality · 2 Strategy · 3 Governance · 4 Reporting) (1 Double materiality assessment · 2 Strategy · 3 Governance · 4 Reporting) and one plain sentence; "What we do" and "You get" sit behind a "What we do and what you get" toggle with a + (– when open), closed by default, to keep the section short.

### Footer
- No separate footer CTA box (removed in v2.2; the "Want our help?" band at the top of "Who we are" replaces it); disclaimer; data source line (EFRAG draft list, non-authoritative); sources links; link to the privacy notice.
- **AI disclosure (v2.3):** the "General information" note in the footer states: "We use AI as a support tool to draft and check this content; we review it, and the responsibility for it stays with us." The PDF disclaimer line adds "Prepared with AI support and reviewed by greenfriend."

### Privacy notice (separate view)
- **Purpose:** the tool's own GDPR notice (Section 7 full text), at `/privacy`, linked from the form and the footer. Same header and footer styling, with a "Back to the check" link.

---

## Section 9 — Logic and Calculations

All logic below is implemented in the browser as pure functions with unit tests. Exact copy and data come from the prototype.

**1. Scope check.**
- **EU path:**
  - Q1 HQ (EU / outside EU).
  - Q2 role (parent / standalone / subsidiary).
  - If parent: financial holding? (yes / no).
  - Q3 employees >1,000? Q4 net turnover >€450M? (consolidated for a parent).
  - Q5 published a CSRD report for FY2024 (wave 1)?
  - If subsidiary: covered by a parent's consolidated ESRS (or equivalent) report?
- **EU verdicts**, first match wins:
  - Parent and financial holding: "Opt-out possible".
  - Subsidiary and covered: "Exempt via parent".
  - Both thresholds exceeded and wave 1: "In scope", keep reporting; FY2026 route; revised ESRS from FY2027.
  - Both exceeded: "In scope from FY2027".
  - Wave 1 but not both exceeded: "Leaving scope", out from FY2027; FY2025–26 depends on the Member State.
  - Otherwise: "Out of scope".
- **Non-EU path:**
  - Listed on an EU regulated market?
  - EU turnover >€450M in each of the last two years?
  - If yes: an EU subsidiary or branch >€200M?
  - Any EU subsidiary or sub-group itself >1,000 employees and >€450M?
- **Non-EU verdicts:**
  - Article 40a when both the EU turnover and the €200M answers are yes: "In scope (Art. 40a)", headline mentioning both obligations if the big-subsidiary answer is yes.
  - Else, if a big subsidiary or EU-listed: "Partly in scope".
  - Else: "Out of scope".
- The exact verdict texts and bullets are those of `verdict()` in the prototype.
- **Edge cases:** the verdict only appears when every question on the path is answered. Back removes the last answer.

**2. FY2026 route.** No logic (v2.0). The three routes are fixed content from the prototype (`OPT`); nothing is scored or recommended.

**3. Datapoint estimator.**
- old = 127 + Σ old counts of ticked topics.
- new = 57 + Σ revised counts.
- unconditional = 27 + Σ unconditional counts.
- Counts per standard [2023, revised, unconditional]: ESRS 2 [127,57,27], E1 [187,84,47], E2 [44,17,5], E3 [27,8,7], E4 [54,9,5], E5 [42,15,14], S1 [127,49,48], S2 [47,12,9], S3 [45,12,8], S4 [44,9,7], G1 [39,20,18].
- Totals: 783 / 292 / 195; GDR 31; voluntary 2023: 269.
- Reduction % = round((1 − new ÷ old) × 100).
- Source: EFRAG 2026 draft list statistics and EFRAG IG 3.

**4. Drill-down.** Removed in v2.0 (the standard-by-standard section is out). The per-requirement tables (`DRS`, `DRT`) are not in the prototype and are not built in v1.

**5. Unlock gating.**
- Free: everything except the two [locked] areas in Section 8 (scope reasons and next steps; example cases 3–7).
- One successful unlock opens both areas and is remembered in browser storage (key `esrs-unlocked`; wrapped in try/catch; the page works without it).

**Edge cases:**
- Submitting before finishing the scope check is allowed; the PDF and row say "not completed".
- Email format: a standard email regex with a TLD of at least 2 letters, max 254 characters.
- No mailbox or domain verification (builder's decision).

---

## Section 10 — Brand and Visual Direction

**Brand reference:** No brand skill file. The final mockup (docs/reference/prototype-reference.html) defines the look, copy and voice.

- **Colour tokens (light) — blue "Bold indigo" palette (v2.3):**
  - page background #f5f7fd, surface #ffffff, sunk #e9edf9, line #dde3f3
  - text #111a3d, muted #566089
  - primary indigo #3a3fd1 (var --olive), indigo-soft #e6e8ff
  - attention coral #e8503f (var --terra; deadlines, chapter pills, unlock buttons), coral-soft #ffe6e1
  - neutral #b8c0e6, info teal #0c8f8f (var --info; auditor track), ok #17996a, warn #e08a00
  - highlight yellow #ffe27a (text on yellow #2a2400)
  - band #141a4a (text on band #f4f6ff)
  - cover: gradient 135 degrees from #121745 through #252b8c (62%) to #3a3fd1
  - cards: no border, soft shadow (0 1px 2px rgba(17,26,61,.06) + 0 8px 24px -10px rgba(58,63,209,.18)), radius 14 px; "30-second" tiles with an indigo-soft to white fade; chapter eyebrows as soft coral pills; chapter headings up to 2.7 rem
  - PDF colours: ink #141a4a, indigo #3a3fd1, coral #e8503f, muted #566089, soft #e6e8ff, yellow #ffe27a
- **Dark mode:** bg #0d1128, surface #161b3d, sunk #0a0d20, line #2a3166, text #eaedff, muted #a3aad6, indigo #9aa0ff, indigo-soft #232a66, coral #ff8c7a, coral-soft #3c2230, neutral #444c8f, info teal #4fd1d1, highlight band #6a5a18, cover gradient #0a0d26 to #181d5c to #2a2f9a. Follows the system setting.
- **Fonts:** Literata (headings, 500/700/800), Figtree (body, 400–700), DM Mono (stamps, IDs, small labels). **All self-hosted** (WOFF2 in the repo), never from Google Fonts.
- **Logo:** none. Text brand "greenfriend." with a yellow dot.

**Visual feel:** calm, factual and friendly, light and easy to read, with attention only where action is needed. Icons are simple 2 px line icons in the chapter eyebrows, tiles and steps; yellow marks short answers, "For you" and tips.
- Yellow highlighter strokes behind key numbers.
- Orange for deadlines, chapter labels and the unlock buttons.
- Thick ink top border on the scope box, estimator and unlock box.
- Overlapping translucent diagonal colour planes (no circles) were used on the former CTA box, which is gone; the cover is plain (v2.0).
- 12–16 px radii, no heavy shadows, no emoji.
- Phone-ready at 375 px with no sideways page scroll.
- Reduced-motion respected.

**Reference:** `docs/reference/prototype-reference.html` (the final mockup). There is no second variant.

---

## Section 11 — API and Credentials

| Service | What it does in this tool | Key required | Where key is stored |
|---------|--------------------------|-------------|-------------------|
| Supabase | Database for leads (`unlocks`); pg_cron clean-up job | Publishable key (`sb_publishable_…`, not used by the browser in this tool) + secret key (`sb_secret_…`, used only by the submit function) | Netlify environment variables, written by the Supabase extension; value checked once (starts with `sb_`) |
| Public-tool protections | The submit Netlify Function `submit-unlock` is the only write path: it refuses bodies over 16 KB, validates every field (email format, lengths, allowed values for topics and answers), lower-cases the email, applies the supersede rule, and inserts with the secret key. No rate limit and, in v1.1, no bot check (Cloudflare Turnstile is deferred, Section 12): the only controls are the body-size limit and strict validation. | None in v1.1 | none |

> **Security rule, no exceptions:** no API key, token, password or credential in any HTML or JavaScript file or anything committed to GitHub. The browser bundle contains no Supabase key and no Supabase client.

**Environment variable contract:**

| Variable name (exact) | Read by | Set where | Public or secret |
|-----------------------|---------|-----------|------------------|
| `VITE_SUPABASE_URL` | the submit Netlify Function (not imported by the browser code) | Netlify env, written by the Supabase extension | public |
| `VITE_SUPABASE_ANON_KEY` | not used by this tool; written by the extension | Netlify env, written by the Supabase extension | public (publishable key) |
| `SUPABASE_SERVICE_ROLE_KEY` | the submit Netlify Function only | Netlify env, written by the Supabase extension | secret (value: `sb_secret_…`) |
| `SUPABASE_DATABASE_URL` | not used by this tool | Netlify env, written by the Supabase extension | secret |

> The Supabase variable names are verified on the first live build; if the extension writes different names, this table and supabase-setup.md are corrected in the same session.

**Credentials readiness:**

| Credential | Status | Where to get it |
|-----------|--------|----------------|
| Supabase URL and keys | Written by the Supabase extension after the project exists | Netlify → site → Connect (Supabase extension) |

---

## Section 12 — Out of Scope — Phase 2

| Deferred feature | Reason it is deferred |
|-----------------|----------------------|
| Contacts dashboard with login (Tool B on the same Supabase project; first reader Anika Lerch, anikalerch@greenfriend.org) | Not needed to validate the lead magnet; leads are read in the Supabase dashboard for now |
| Confirmation email / double opt-in (Resend free tier with greenfriend.org verified) | Builder chose format validation only for the first build |
| Bot check (Cloudflare Turnstile, free): site key in the form, token verified in `submit-unlock`, two Netlify env vars | Builder's decision for the first version: left out to launch quickly. Risk accepted: bots or scripts can post junk rows. Add before wide promotion if junk appears |
| Mailbox or domain verification of emails | Builder's decision: format check is enough |
| Emailing the PDF | Download in the browser covers it at zero cost |
| Showing EFRAG's datapoint names or IDs | Needs EFRAG's written permission |
| Updating greenfriend.org's main privacy policy | Separate website task |
| Analytics or tracking | GDPR and simplicity; not needed for the first build |
| Real profile photos | Waiting for headshots; initials avatars meanwhile |
| Supabase Pro (backups, no pause) | Adds cost; Free with monthly CSV export accepted |
| A calm colour variant | Version A chosen |

---

## Section 13 — Acceptance Criteria

| # | What to verify | Expected result | Done? |
|---|---------------|-----------------|-------|
| 1 | Page loads at check.greenfriend.org on desktop and on a 375 px phone | Every section renders; no sideways page scroll; the sticky menu works | [ ] |
| 2 | Visual match with prototype version A | Colours (blue palette), fonts, highlighter, cards and dark mode match | [ ] |
| 3 | Fonts self-hosted, no third-party requests | Network tab shows no requests to Google or any host except the site itself | [ ] |
| 4 | Scope check, EU and non-EU paths | Each prototype verdict reproduces for its answer path (unit tests cover every path) | [ ] |
| 5 | FY2026 routes | Three cards A, B, C with Pre-Omnibus / Revised ESRS names, "Fits if" lines, source icons and the Good to know / Our tip lines; no questionnaire | [ ] |
| 6 | Estimator | Default ticks give 569 → 237 (−58%), 163 unconditional; all ticked gives 783 → 292 (195 unconditional); a line below shows the total with the 31 general datapoints (defaults 237 + 31 = 268; all ticked 292 + 31 = 323) | [ ] |
| 7 | Datapoint sources | The page shows only EFRAG-derived counts; the page source contains no "ESRS26_" IDs or EFRAG datapoint names | [ ] |
| 8 | Gating before unlock | Scope reasons and next steps, the datapoint breakdown (bars, unconditional count, total with the 31) and cases 3–7 are blurred with unlock bars; headline answers and the 2027 roadmap stay free | [ ] |
| 9 | Unlock with a valid email | One row in `unlocks` with correct fields; everything unlocks; the PDF downloads automatically; reload keeps it unlocked | [ ] |
| 10 | Invalid email / body over 16 KB | The function refuses; a clear error shows; nothing unlocks; no row | [ ] |
| 11 | Consent logic | Unticked by default; PDF works without consent; `consent_at` set only with consent | [ ] |
| 12 | Supersede | A second unlock with the same email (different case) creates a new row and sets `superseded_by` on the old one | [ ] |
| 13 | No browser access to the database | A direct call with the publishable key to read or insert `unlocks` is refused | [ ] |
| 14 | PDF | One square page (280 x 280 mm) matching the design intent; no company line in v1 (header names greenfriend only); "not completed" text if the scope check was skipped; no broken characters | [ ] |
| 15 | Clean-up job | Test rows older than 30 days without consent are anonymised; rows older than 24 months are deleted; the job appears in pg_cron | [ ] |
| 16 | Privacy notice | `/privacy` shows the full notice; linked from the form and the footer; the short notice sits under the form | [ ] |
| 17 | No secrets in the bundle | The built JS contains no Supabase key | [ ] |
| 18 | Mockup leftovers removed | No "Preview" badges, no "Lock again" control | [ ] |

---

## Section 14 — Build Path

**This tool's tier:** Tier 2

### Pre-build steps (before opening Claude Code)
- [x] Tool Architect: interview complete, this spec confirmed
- [ ] Access Architect, short run: population pattern "public stays anonymous"; write-only rules (public writes only through `submit-unlock`; no anon read; superseded rows not edited otherwise; deletion only by the platform owner on request or by the clean-up job); `access-matrix.md` and `user-stories.md` in short form
- [ ] Project Governor: CLAUDE.md and PROGRESS.md from this spec and the matrix
- [ ] New GitHub repo created by the builder
- [ ] Uploaded to the repo root: product-spec.md, CLAUDE.md, PROGRESS.md, access-matrix.md, user-stories.md, prototype-reference.html
- [ ] Netlify site connected to the repo (one-time, Netlify dashboard)
- [ ] Supabase project "ESRS 2026 update tool" connected to that site with the Supabase extension (the project already exists)

### Tier 2 build session
- [ ] Open Claude Code in the project folder; First Session Setup (docs/, docs/reference/)
- [ ] Claude Code reads product-spec.md, CLAUDE.md, PROGRESS.md, access-matrix.md and the prototype
- [ ] Supabase, existing empty project: Claude Code confirms project ID **jfalwveuccerzeffxftx** ("ESRS 2026 update tool", EU Frankfurt) with the builder, checks it is empty, and builds into it via MCP (no new project)
- [ ] Tables via named migrations saved in the repo, RLS on from creation, no anon policy or grant; login-ready columns; the pg_cron clean-up job
- [ ] docs/supabase-setup.md created
- [ ] Frontend built from the prototype (React + Vite + Tailwind; logic as pure, unit-tested functions; self-hosted fonts)
- [ ] `submit-unlock` Netlify Function with size limit, validation and supersede rule
- [ ] Test locally
- [ ] Supabase connected to the Netlify site with the Supabase extension (can be done before session 1); values start with `sb_`; redeploy
- [ ] Custom domain check.greenfriend.org added in Netlify; CNAME added in Wix DNS
- [ ] Push to main → Netlify auto-deploys
- [ ] Optional: Supabase QA skill

### Before going public
- [ ] Send EFRAG (digital-reporting@efrag.org) the courtesy note about using datapoint counts with attribution
- [ ] Auditor or partner read of the scope logic (wave 1 FY2025–26 Member State option; two-consecutive-years rule under national law)
- [ ] Privacy contact signs off the notice

### Runbook item (monthly, builder)
- [ ] Export `unlocks` to CSV and store it outside Supabase (backup); check the pg_cron job history; restore the project if Supabase paused it

---

## Section 15 — Open Questions

| Question | Who answers it | Blocking? |
|----------|---------------|-----------|
| Rules status date shown on the PDF ("Status 7 Oct 2026"): who updates it when rules change? | Builder | No |
| Headshots for the profile cards | Builder | No |
| Final EFRAG datapoint list (expected end of 2026) may change the counts: update the tables when published | Builder / Claude Code | No |

---

## Entry points and rewards (v2.2)

| Where | What the visitor does | Free answer | Behind the email | Email asked? |
|---|---|---|---|---|
| Cover | Taps "Check your company" | Jumps to the scope check | Nothing | No |
| Check your scope | Answers the scope questions | Badge and headline (in scope or not, which wave) | Reasons and next steps, and the FY2026 route note | Yes, on "Unlock your action plan" in the result |
| Your own number (datapoints) | Ticks the material topics | "You go from X to Y mandatory datapoints, Z% fewer" | Comparison bars, unconditional count, total with the 31 general datapoints | Yes, on the lock bars |
| Example cases | Opens the seven cases | Cases 1 and 2 in full | Cases 3 to 7 | Yes, on the lock bar |
| Your 2027 roadmap | Reads it (it follows the scope and topic answers) | The whole timeline | Nothing locked; it is in the PDF; the "Want our help?" band (in "Who we are") leads to greenfriend | No, but it links to the PDF and to "How we help" |
| Want it all on one page? | Enters the email | Nothing extra | Everything above unlocked and the one-page PDF with scope result, route options, datapoints and the 2027 roadmap | Yes, the main form |
| "Want our help?" band, top of "Who we are" (replaces the footer box) | Reads, goes to greenfriend.org | Call booking via the website | Not applicable | No (the contact box is optional and unticked inside the unlock form) |

Every email entry point opens the same dialog and writes one row through `submit-unlock`. One unlock opens every locked area and downloads the PDF.

## Source policy (v2.2, hard rule)

Every fact, number and date on the page and in the PDF must come from one of these tiers, and the source is named wherever the claim appears (source line, i icon or fold-out).
1. **Primary:** EU legal texts (Official Journal, EUR-Lex), European Commission pages, other EU bodies (Council, Parliament), EFRAG publications.
2. **Interpretation:** Big 4 firms (PwC, Deloitte, KPMG, EY) and leading law firms, always named, used only for interpretation or estimates the EU has not published.
3. **Not allowed:** software vendors, consultancies' blogs, news and ESG media, social posts, AI summaries. A claim that only such a source supports is left out.
Estimates are labelled "estimate" with the author named (for example the 90% figure: A&O Shearman, because the Commission has not published one for the final text). Our own advice (route tips, the 2027 roadmap) is labelled as ours. EFRAG material is explained in our own words only; no standard text, datapoint wording or EFRAG list is copied. Before launch, every source line is re-checked against its link.

## Section 16 — Tool Version History

| Version | Date | What changed in the tool |
|---------|------|--------------------------|
| v1.0 | 7 October 2026 | Initial build from prototype version A (Supabase project corrected to the existing empty project jfalwveuccerzeffxftx before build) |
| v1.1 | 7 October 2026 | Cloudflare Turnstile removed from the first version (builder's decision); the submit function keeps the 16 KB limit and field validation; Turnstile moved to Section 12 |
| v1.2 | 8 October 2026 | Estimator now explains the 31 general datapoints: a line under the result shows the total (topic datapoints + 31) and that all ten topics give 323 |
| v1.3 | 8 October 2026 | Services section shortened: steps 1–4 carry a service label and one sentence, details behind a toggle |
| v1.4 | 8 October 2026 | Datapoint numbers made consistent: a "Why the numbers differ between sources" note under the fact sheet; requirements that apply the GDR content carry a "not counted twice" chip |
| v1.5 | 8 October 2026 | Number sources: only EFRAG's 2026 draft list and explanatory note (no outside figures); dot-grid legend shows exact counts and the caption reconciles 1,052, 1,083 and 323 |
| v1.6 | 8 October 2026 | Standard-by-standard labels (Always applies, Per policy / action, Changed, Trimmed, Phase-in) explained: tooltip on hover and keyboard focus, one-line meaning in the standard panel, and a "What do the labels mean?" list for touch. Wording from the datapoint list and change notes only. Dot-grid legend: darker dot colours, hover/focus explanation per legend item that also highlights those dots; short caption. Copy shortened across the page (keep sentences short, detail in disclaimers) |
| v1.7 | 8 October 2026 | Simpler unlock: email only plus an optional unticked box "greenfriend may contact me about my results" (no newsletter); company, industry and interests removed from the form and the notice; one-line notice; button "Get it free". Table columns unchanged (unused in v1) |
| v1.8 | 8 October 2026 | Phone-first: viewport meta, no sideways scroll at 375 px, tap targets at least 44 px, 16 px email field (no iOS zoom), full-width button, two-column standard cards on phones. Top nav highlight follows the scroll position, includes "Who we are", and keeps the active link in view on phones. Who-reports-when grid: every square and legend item explains itself on hover, focus and tap; "revised ESRS" squares are striped so they differ from "existing ESRS". FY2026 route cards: one line each plus Standard / Change for you / Best if rows, the eight reliefs in a toggle, bar labelled "Fit with your answers", badge "Best fit for your answers". "Who we are": the three "How we work differently" points show only a title and open on hover or tap; each person shows three short chips and a "More about" toggle (the full bullets); LinkedIn link stays |
| v1.9 | 8 October 2026 | Lighter, friendlier voice ("friendly supporter", for sustainability managers and C-level): "30-second version" strip with three facts above the first section; friendlier headlines (e.g. "Do you have to report? Two quick criteria", "Want it all on one page?", "Hi, we are Anika and Elena"); every section opens with a one-line "short answer" marked with a yellow bar instead of a long intro; a small line icon per section; disclaimers shown as "Good to know" tips; "we" used throughout; fix: the AND connector in the two tests no longer clashes with the unlock card style. 30-second strip: first tile reads "Up to 323 datapoints if every topic is material. Yours will be fewer. It was 1,052."; each tile has an icon (grid, people + euro, calendar). Sources: each "what changed" card has an i icon (hover) and a "Source" line in its detail, and each FY2026 route card names its article. Verified against the provided documents: routes = Delegated Regulation (EU) 2026/1563 Art. 2(1)(a) (existing ESRS or revised ESRS), Art. 2(1)(b) (existing ESRS plus the eight reliefs: ESRS 1 paras 27, 32-33, 74-75, 90, 91, 92, 106, 110), Art. 2(2) (state which version), Art. 3 (in force 10 Nov 2026, applies from FY starting 1 Jan 2027); value chain cap = ESRS 1 para 66 and Delegated Regulation (EU) 2026/1560 Annex II. Scope and assurance cite Directive (EU) 2026/470 without article numbers (not verified). Fix: the "what changed" card details now stay closed until tapped. Advisor voice: a yellow "For you" line (what it means for the reader) on the two threshold cards and the two non-EU route cards, an "Our tip" line, icons on the three steps, fine print behind a "The fine print" toggle. Route cards (2026 report): plain names (A "Keep it as it is", B "Keep it, with shortcuts", C "Switch early") with the official name small under them, three effort dots, a "Best if" line, the source in an i icon, bar "Matches your answers", badge "Looks best for you"; "reporting year 2026" wording in headings and questions; nav label "Your 2026 route". Section 8 rewritten to match the final mockup |
| v2.2 | 15 October 2026 | Every tool gives a simple free answer and the full answer sits behind the email: datapoint estimator headline free, breakdown bars, unconditional count and total with the 31 behind the unlock. New chapter "Your 2027 roadmap" built from the earlier answers (DMA refresh or from scratch, timeline with annual financial reporting, "Want our help?"), free and included in the PDF. Unlock squares: Scope reasons and next steps, Datapoint breakdown, All seven example cases, One-page PDF. Nav gets a tenth link. "General information" note moved to the very end of the page . Non-EU groups: chapter no longer in the main flow or the menu; shown when the scope check says outside the EU or via a link in "Who reports when" . "What changed" cards: the ~90% card shows company types with before and now plus the 80% versus 90% note; all other fold-outs cut to two short bullets . Source policy added; the ~90% note now names the Commission (80%, 2025 proposal) and A&O Shearman (90% estimate); roadmap labelled as our planning guide |
| v2.3 | 16 October 2026 | Tool colours switched from teal to the blue "Bold indigo" palette (Section 10, PDF colours, dark mode); same fonts and layout. | 
| v2.1 | 15 October 2026 | New look: fresh teal palette (colours, dark mode and cover gradient in Section 8), soft shadows instead of borders, orange chapter pills, larger chapter headings; same fonts. Non-EU groups rebuilt as a guided three-question stepper with Yes/No answer boxes. Mockup title "ESRS Update Check". FY2026 routes: visible source box and copyright note (General information) |
| v2.0 | 11 October 2026 | Simpler cover (no alert, stamps or colour planes); 30-second strip reads "From FY2027: mandatory for financial years starting on or after 1 January 2027"; "For you" renamed "What it means for you"; cohort names say EU, wave 1 explained, link to national transposition measures; "Existing ESRS" renamed "Pre-Omnibus ESRS"; FY2026 chapter rebuilt around the three routes of Article 2 (seven questions, scoring and recommendation removed; route C noted as the natural fit for those starting with ESRS now); standard-by-standard section and requirement drill-down removed; unlock squares now Scope result, FY2026 routes, Datapoint estimate, One-page PDF; two locked areas instead of four; "~80%" corrected to "~90%" (v1.9, press estimate); Who reports when cards redone as visuals (chips, first-year badge, two tiles); chapter order is now 30-second strip, What changed, Who reports when, Check your scope, Datapoints, then Non-EU groups, Example cases, Your 2026 route, Get the PDF, Who we are; datapoints chapter explains the 31 general datapoints in four cards (policies, actions, metrics, targets) as four question cards with chips, no single datapoints and no EFRAG datapoint names; services steps shown side by side as cards with a + toggle; Who we are on one background colour with white cards and shorter text; left-hand navigation sidebar on desktop (top bar kept on phones) |

---

*This spec is written for Claude Code. It assumes zero prior context. Every decision, rule and requirement must be explicit enough that the builder can hand this document to Claude Code without a single verbal explanation.*


**Logo font (v2.2):** the word mark "greenfriend." is set in League Spartan Bold (700) everywhere on the page (menu, cover band, one-pager preview); body fonts stay Literata, Figtree and DM Mono. The browser-generated PDF header uses the built-in Helvetica unless the League Spartan file is embedded in jsPDF (open item).
