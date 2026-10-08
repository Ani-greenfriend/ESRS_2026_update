# Product Spec — ESRS 2026 Update Check

**Version:** 1.9
**Date:** 7 October 2026
**Author:** Anika Lerch (greenfriend)
**Status:** Confirmed

---

## Section 1 — Tool Summary

**Tool name:** ESRS 2026 Update Check

**What it does:** A free, public web tool that explains what the revised ESRS (Delegated Regulation (EU) 2026/1563) and the Omnibus I Directive (EU) 2026/470 change. It lets a company check its own position: whether it is in scope and from when, which FY2026 reporting route fits, and how many datapoints apply to its material topics. One email unlock reveals the detailed results and immediately downloads a one-page PDF. Each unlock is stored as a lead.

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
| What is exported | A one-page "Your revised ESRS one-pager", built from the visitor's own session: scope result, FY2026 route with reasons, datapoint numbers for their material topics, key dates, and greenfriend's call to action. Company name (if given) appears in the header. |
| How | Generated **in the browser** (bundled PDF library, e.g. jsPDF installed via npm, not loaded from a CDN). It downloads automatically right after a successful unlock. Nothing is stored on a server and no email is sent. A "Download again" button stays available on the page after unlock. |
| PDF design intent | A4 portrait, one page. **Header band** in ink #17302e (full width, about 34 mm): small yellow dot (#ffe066), "GREENFRIEND" (no personal names) in small caps, title "Your revised ESRS one-pager", subline with company (if given) · "Prepared [date]" · "Status of rules: [rules date]". **Body**, 16 mm margins, numbered section heads in coral #e2553f, small caps: (1) "Are you in scope?": pale teal box (#d6ebe5) with the verdict badge text and headline, then bullet reasons (teal bullets), then a small grey line "Your answers: …"; if the scope check was not completed, say so in grey. (2) "Your FY2026 route": route name in bold, its one-line description, the reasons as bullets, a grey note if example answers were used, and the line about stating the applied version (Article 2 of the delegated act). (3) "Your datapoints": large "OLD -> NEW" numbers (old in ink, new in teal #17635c) with a yellow pill "−X%", then a grey line naming ESRS 2 plus the chosen topics and the unconditional count, credited to EFRAG's 2026 draft list. (4) "Dates to plan around": four bullets (10 Nov 2026; 19 Mar 2027; FY2027; FY2028). **Footer band** in ink, 30 mm: "Report what you do." in bold, "Want a second opinion? Book a free 20-minute call at greenfriend.org", then the disclaimer in small light text. Fonts: the PDF library's built-in Helvetica. Characters outside its encoding (→, −, curly quotes, °) are replaced with plain equivalents. The prototype's `buildPdf()` function is the reference implementation. |

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
| route | Recommended FY2026 route | Text: A / B / C | Calculated | Yes |
| route_from_example | Whether the route used the pre-filled example answers | Boolean | Automatic | Yes |
| route_answers | FY2026 questionnaire answers | JSON | Visitor | Yes |
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

**Derived or calculated data:** Yes. Scope verdict, FY2026 route and datapoint numbers are calculated in the browser (Section 9) and sent with the unlock. The submit function re-validates their shape and allowed values, not the logic.

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

One long single page with a sticky chapter menu, plus a separate privacy notice view and an unlock dialog. **The reference mockup (docs/reference/prototype-reference.html, the final mockup of spec v1.9) is the reference for all copy, data tables, layout and voice.** In the build, remove its "Mockup only / Lock again" footer button and the on-page PDF preview (the real PDF downloads instead), and load fonts from the repo, not from Google. The brand line reads "greenfriend." with no personal names on the cover.

**Voice and layout rules (v1.9).** Friendly supporter for sustainability managers and C-level: warm, light, plain words, "we", no jokes. Every chapter opens with a one-line **short answer** marked with a yellow bar. A small line icon sits in each chapter eyebrow. Where it helps the reader, a yellow **For you** line says what it means for them, and an **Our tip** line closes a section. Disclaimers appear as **Good to know** tips. Detail and fine print sit behind toggles or hover (hover, keyboard focus and tap all work, since phones have no hover). Sources sit behind a small *i* icon. Tooltips that must not be clipped by a scrolling area use one floating tooltip element.

Below, **[locked]** marks content that is blurred with an "Unlock your action plan" bar until the visitor unlocks.

### Cover
- **Purpose:** Hook and urgency.
- **What is visible:** Dark ink band (#17302e) with overlapping translucent colour planes on the right (teal, coral, yellow, lilac; diagonal, blending; slow drift, disabled under reduced motion; faded on phones); brand line "greenfriend."; H1 "The revised ESRS, in five minutes"; lede; alert strip with yellow left border: "The revised ESRS apply from **10 Nov 2026**. Reporting on 2026? Choose your route now." with a link to the FY2026 section; three mono "stamp" pills (Omnibus I · Directive (EU) 2026/470; Revised ESRS · Reg. (EU) 2026/1563; Status [rules date]); one line "Independent tool by greenfriend. Not affiliated with EFRAG or the European Commission."
- **User actions:** jump to FY2026.

### The 30-second version (strip under the menu)
- Three tiles with an icon each: **Up to 323** datapoints if every topic is material (yours will be fewer; it was 1,052) · **1,000 + €450M** employees and turnover, EU companies must exceed both · **FY2027** first year the revised ESRS are mandatory for everyone in scope.

### Sticky chapter menu
- What changed · Datapoints · Who reports when · Check your scope · Non-EU groups · Example cases · Your 2026 route · Get the PDF · Who we are. The active chapter follows the scroll position (scroll listener; "Who we are" is active at the bottom of the page; none on the cover) and the active link stays in view on phones.

### What changed
- Heading "Six things changed, the short version". Six expandable cards (number, title, one line; detail list on click, closed by default; an *i* icon with the source on hover and a "Source" line inside): Fewer companies in scope (~80%) · 323 datapoints in total · Top-down materiality · VSME value chain cap · 3 FY2026 routes · Assurance stays limited. Below them, a horizontal key-dates timeline: 26 Feb 2026, 18 Mar 2026, 3 Jul 2026, 21 Sep 2026, 10 Nov 2026 (highlighted "now"), 19 Mar 2027 (coral), FY2027.

### Datapoints
- **Fact sheet:** dot chart (108 dots ≈ 10 datapoints each: 29 kept mandatory, 3 new general, 49 removed mandatory, 27 removed voluntary; the legend shows the exact counts 292 / 31 / 491 / 269, and a caption explains that the dots show the 1,052 old datapoints plus the 31 new ones, 1,083 in all, so 1,052 − 491 − 269 = 292, plus 31 = 323) with legend, and a bucket table: Mandatory "shall" 783 → 292 (of which 195 apply whenever the topic is material); Voluntary "may" 269 → 0; Policies, actions, targets, metrics "separate*" → 31; Total 1,052* → 323. Under the bucket table a closed toggle "Why the numbers differ between sources" explains: 323 = 292 + 31, all counts from EFRAG's 2026 draft list and explanatory note only (no figures from other sources); EFRAG's spreadsheet has 30 heading rows (3 per topic standard) pointing to the general datapoints and 6 technical ESRS 2 BP-1 rows that are not counted (E1: 87 rows, 84 datapoints); percentages: −63% mandatory (783 to 292), −72% mandatory plus voluntary (1,052 to 292), −69% with the 31 (1,052 to 323). In the drill-down the three requirements that apply GDR-P, GDR-A and GDR-T (for example E1-4, E1-5, E1-6) carry the chip "also refers to the general policy/action/target datapoints (not counted twice)". Headline figures −63% mandatory and −72% mandatory plus voluntary, with the footnote about 2023 MDR counting.
- **Your own number (estimator):** ten topic checkboxes (E1 Climate change, E2 Pollution, E3 Water, E4 Biodiversity, E5 Resource use, S1 Own workforce, S2 Value chain workers, S3 Communities, S4 Consumers, G1 Business conduct; default ticked: E1, E5, S1, S2, G1). Output: "You go from X to Y mandatory datapoints. That is Z% fewer." plus three bars (2023, revised, unconditional), then a highlighted line: "Plus 31 general datapoints on policies, actions, targets and metrics. They apply whatever topics you tick, so your total is Y+31 (Y + 31). With all ten topics ticked that is 323." The 31 are never part of the topic counts or the percentage (like-for-like: mandatory 783 vs 292).
- **Standard by standard:** 12 cards (ESRS 2, GDR, E1–E5, S1–S4, G1) showing "2023 → revised" counts and a tag. Each tag is explained: tooltip on hover and on keyboard focus of the card, the meaning as a line at the top of the selected standard's panel, and a "What do the labels mean?" list under the cards for touch. Meanings: Always applies = ESRS 2 general disclosures apply whichever topics are material; Per policy / action = the 31 general datapoints repeat for each policy, action, target or metric; Changed = content or rules changed, not only fewer datapoints; Trimmed = datapoints cut, voluntary removed, otherwise similar; Phase-in = relief to leave out part or all of the standard in the first years (wave 1 until FY2027, new reporters first two years). The selected standard's panel shows count bars, key changes (pill "Removed / Changed / Relief / Unchanged" + text), and **Disclosure requirements**: one row per requirement with the code, a plain-language summary (ours), the official title from the regulation (small), the datapoint count, the conditional count and phase-in chips for the chosen company type (selector: Wave 1 above thresholds / Wave 1 below / First report FY2027 or later), a "Hide conditional" toggle and a search box (searches codes, titles and summaries). **[locked]** after the first 3 requirements, with "See all N disclosure requirements and M datapoints for [standard]". Link below: "Read the full text in EFRAG's ESRS Knowledge Hub" (https://knowledgehub.efrag.org, new tab). **No EFRAG datapoint names or IDs anywhere**, including the page source.

### Who reports when
- Heading "Do you have to report? Two quick tests", short answer "EU companies report from FY2027 if they pass both tests. Non-EU groups follow from FY2028." Two threshold cards (EU: >1,000 employees AND >€450M net turnover on the balance sheet date; non-EU Article 40a: >€450M EU turnover in each of the last two years AND an EU subsidiary or branch >€200M), each with a "For you" line and the old thresholds. A timeline table (FY2024–FY2028) for six cohorts, with colour-coded cells (revised-ESRS cells striped) and a key. Every cell and key item explains itself on hover, focus and tap (group, year, meaning).

### Check your scope
- Left: one question at a time with progress bar, Back and Start again. Right: "Your reading", showing answers so far, then the verdict: badge + headline (free) and reasons and next steps **[locked]**, with buttons "Pick your FY2026 route" (when relevant) and "Get this as a PDF".

### Non-EU groups
- Heading "Outside the EU? Two ways in". Two route cards (EU subsidiary from FY2027; Article 40a from FY2028), each with an icon, a "For you" line and "The fine print" toggle; a three-step flow with icons and one-liners (add up EU turnover, find the anchor entity, plan the first report; "Good to know" toggle); an "Our tip" line.

### Example cases
- Seven tabs (Dutch group, Large daughter, Wave 1 now too small, US group mid-size EU, US group big EU daughter, Swiss group below EU line, Branch only), each with an org chart (parent → subsidiaries, status chip per entity, dashed border for non-EU) and a "Why" list. Cases 1–2 are free; tabs 3–7 show a lock icon, and their "Why" is **[locked]**.

### Your 2026 route (chapter id fy2026)
- Heading "Which route should you take for your 2026 report?". Three route cards: A "Keep it as it is" (Existing ESRS), B "Keep it, with shortcuts" (Existing ESRS plus reliefs; "The eight shortcuts" toggle with their ESRS 1 paragraphs), C "Switch early" (Revised ESRS in full). Each card: plain name, official name small, one line, three effort dots, a "Best if" line, an *i* icon with the source (Delegated Regulation (EU) 2026/1563, Article 2(1)(a) or (b)), bar "Matches your answers"; label "Looks best for you" on the winner. Seven questions as segmented buttons, pre-filled with example answers. Recommendation panel (dark, with colour planes): route name (free), reasons **[locked]**, and the "our reading, not a legal requirement" note.

### Unlock your action plan (section) and Unlock dialog
- **Purpose:** collect the lead and deliver the PDF.
- **What is visible (section):** "Want it all on one page?" (dialog: "Unlock your full action plan"), four numbered squares (Scope result, FY2026 route, All requirements, One-page PDF), a status list (scope done? route from example answers? datapoints), and the form. **Dialog:** opens from every "Unlock your action plan" button, with the same form. Closes on ×, Escape or backdrop click.
- **Form fields:** Work email (required; format check on the page and in the function); nothing else. **Email only, to keep the commitment feeling small (v1.7).** Company, industry and interests are not asked in v1 (their columns stay in the table, empty, for later); checkbox "greenfriend may contact me about my results (optional)" (unticked; no newsletter, no updates list); button "Get it free"; one-line notice "Free. We use your email only to send your results. We contact you only if you tick the box." with a link to the full notice view (Section 7 has the full text).
- **User actions:** submit.
- **What happens next:** the submit function validates and stores. On success, everything unlocks (flag kept in browser storage), the PDF downloads automatically, and a confirmation reads "Unlocked. Your one-pager is downloading." with a "Download again" button. On error: a plain message saying what went wrong (invalid email format, server unavailable); nothing unlocks; the visitor can retry.

### Who we are and how we help
- Eyebrow "Hi, we are Anika and Elena". Pitch (H2 "We help companies report what they actually do" + lede + pull quote); **How we work differently**: three numbered cards showing only a title, the sentence opens on hover or tap (You work with us, not a junior team · Inside experience, consulting and tech · Strategy first, box-ticking last); two profile cards, each with three short chips and a "More about" toggle holding the bullets: **Anika Lerch, MSc** (Founder, greenfriend · Strategy, governance and CSRD; four bullets as in the prototype; LinkedIn link) and **Elena Zayakova, MSc** (Founder, CoreWorks Consultancy · Strategy, reporting and governance; four bullets; LinkedIn link), using initials avatars until photos are supplied; **How we help, step by step**: steps 0–4 (Know where you stand · Find what really matters · Turn topics into goals · Make clear who owns what · Report what you did). Steps 1–4 show a yellow service label under the title (1 Double materiality assessment · 2 Strategy · 3 Governance · 4 Reporting) and one plain sentence; "What we do" and "You get" sit behind a "What we do and what you get" toggle, closed by default, to keep the section short.

### Footer
- CTA box (teal, with colour planes): "Report what you do." + text + "greenfriend.org" in a yellow tag; disclaimer; data source line (EFRAG draft list, non-authoritative); sources links; link to the privacy notice.

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

**2. FY2026 route.**
- Seven questions; each answer adds points to [A, B, C] (table `PQ` in the prototype):
  - proc: solid [3,1,0], ok [1,2,1], weak [0,2,2]
  - effort: low [3,1,0], mid [0,3,1], high [0,1,3]
  - dma: fine [2,1,1], heavy [0,3,2], redo [0,1,3]
  - vc: good [2,1,1], gaps [0,3,2]
  - ma: no [1,1,1], yes [0,3,2]
  - ready: no [2,2,0], part [1,2,1], yes [0,1,3]
  - comp: high [3,2,0], low [0,1,2]
- Highest total wins; **ties go to the earlier route (A before B before C)**.
- Meter width = score ÷ max score.
- Reasons = the `REASON` text for each chosen answer that has one.
- Pre-filled example answers: proc ok, effort mid, dma heavy, vc gaps, ma no, ready part, comp high. `route_from_example` stays true until the visitor changes any answer.

**3. Datapoint estimator.**
- old = 127 + Σ old counts of ticked topics.
- new = 57 + Σ revised counts.
- unconditional = 27 + Σ unconditional counts.
- Counts per standard [2023, revised, unconditional]: ESRS 2 [127,57,27], E1 [187,84,47], E2 [44,17,5], E3 [27,8,7], E4 [54,9,5], E5 [42,15,14], S1 [127,49,48], S2 [47,12,9], S3 [45,12,8], S4 [44,9,7], G1 [39,20,18].
- Totals: 783 / 292 / 195; GDR 31; voluntary 2023: 269.
- Reduction % = round((1 − new ÷ old) × 100).
- Source: EFRAG 2026 draft list statistics and EFRAG IG 3.

**4. Drill-down.**
- Per disclosure requirement: code, datapoint count, conditional count, phase-ins per company type, and whether it refers to the general policy, action and target datapoints. These come from the prototype's `DRS` table (counts derived from EFRAG's list) and `DRT` table (official titles from Regulation 2026/1563 plus our plain-language summaries).
- ESRS 2 BP-1 is marked "technical".

**5. Unlock gating.**
- Free: everything except the four [locked] areas in Section 8.
- One successful unlock opens all four areas and is remembered in browser storage (key `esrs-unlocked`; wrapped in try/catch; the page works without it).

**Edge cases:**
- Submitting before finishing the scope check is allowed; the PDF and row say "not completed".
- Email format: a standard email regex with a TLD of at least 2 letters, max 254 characters.
- No mailbox or domain verification (builder's decision).

---

## Section 10 — Brand and Visual Direction

**Brand reference:** No brand skill file. The final mockup (docs/reference/prototype-reference.html) defines the look, copy and voice.

- **Colour tokens (light):**
  - bg #eef3f0, surface #ffffff, sunk #e3ebe7, line #d0dcd6
  - text #17302e, muted #566b67
  - primary teal #17635c, teal-soft #d6ebe5
  - attention coral #e2553f, coral-soft #fde3dc
  - neutral #b9c9c2, info lilac #6c5fc7, ok #2f8a5f, warn #d98a1c
  - highlight yellow #ffe066 (text on yellow #2a2400)
  - cover band #17302e
- **Dark mode:** bg #0f1f1e, surface #162a28, sunk #0c1918, line #27403d, text #e6f0ec, muted #9db3ae, teal #5fcbb8, teal-soft #1d3a36, coral #ff8a72, coral-soft #3b2421, neutral #3d5a55, lilac #a99cff, highlight band #6e5f17, cover band #0a1716. Follows the system setting.
- **Fonts:** Literata (headings, 500/700/800), Figtree (body, 400–700), DM Mono (stamps, IDs, small labels). **All self-hosted** (WOFF2 in the repo), never from Google Fonts.
- **Logo:** none. Text brand "greenfriend." with a yellow dot.

**Visual feel:** calm, factual and friendly, light and easy to read, with attention only where action is needed. Icons are simple 2 px line icons in the chapter eyebrows, tiles and steps; yellow marks short answers, "For you" and tips.
- Yellow highlighter strokes behind key numbers.
- Coral for deadlines and the unlock buttons.
- Thick ink top border on the scope box, estimator and unlock box.
- Overlapping translucent diagonal colour planes (no circles) on the cover, the CTA box and the recommendation panel.
- 12–16 px radii, no heavy shadows, no emoji.
- Phone-ready at 375 px with no sideways page scroll.
- Reduced-motion respected.

**Reference:** `docs/reference/prototype-reference.html` (the final mockup). There is no second variant.

---

## Section 11 — API and Credentials

| Service | What it does in this tool | Key required | Where key is stored |
|---------|--------------------------|-------------|-------------------|
| Supabase | Database for leads (`unlocks`); pg_cron clean-up job | Publishable key (`sb_publishable_…`, not used by the browser in this tool) + secret key (`sb_secret_…`, used only by the submit function) | Netlify environment variables, written by the Supabase extension; value checked once (starts with `sb_`) |
| Public-tool protections | The submit Netlify Function `submit-unlock` is the only write path: it refuses bodies over 16 KB, validates every field (email format, lengths, allowed values for industry, interests, route, topics and answers), lower-cases the email, applies the supersede rule, and inserts with the secret key. No rate limit and, in v1.1, no bot check (Cloudflare Turnstile is deferred, Section 12): the only controls are the body-size limit and strict validation. | None in v1.1 | none |

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
| 2 | Visual match with prototype version A | Colours, fonts, colour planes, highlighter, cards and dark mode match | [ ] |
| 3 | Fonts self-hosted, no third-party requests | Network tab shows no requests to Google or any host except the site itself | [ ] |
| 4 | Scope check, EU and non-EU paths | Each prototype verdict reproduces for its answer path (unit tests cover every path) | [ ] |
| 5 | FY2026 route | Example answers give Route B; a tie gives the earlier route; reasons match the table | [ ] |
| 6 | Estimator | Default ticks give 569 → 237 (−58%), 163 unconditional; all ticked gives 783 → 292 (195 unconditional); a line below shows the total with the 31 general datapoints (defaults 237 + 31 = 268; all ticked 292 + 31 = 323) | [ ] |
| 7 | Drill-down | E1 shows 11 requirements, 84 datapoints; the page source contains no "ESRS26_" IDs or EFRAG datapoint names | [ ] |
| 8 | Gating before unlock | Scope reasons, route reasons, cases 3–7 and requirements beyond 3 are blurred with unlock bars | [ ] |
| 9 | Unlock with a valid email | One row in `unlocks` with correct fields; everything unlocks; the PDF downloads automatically; reload keeps it unlocked | [ ] |
| 10 | Invalid email / body over 16 KB | The function refuses; a clear error shows; nothing unlocks; no row | [ ] |
| 11 | Consent logic | Unticked by default; PDF works without consent; `consent_at` set only with consent | [ ] |
| 12 | Supersede | A second unlock with the same email (different case) creates a new row and sets `superseded_by` on the old one | [ ] |
| 13 | No browser access to the database | A direct call with the publishable key to read or insert `unlocks` is refused | [ ] |
| 14 | PDF | One A4 page matching the design intent; no company line in v1 (header names greenfriend only); "not completed" text if the scope check was skipped; no broken characters | [ ] |
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
| Rules status date shown on the cover and PDF ("Status 7 Oct 2026"): who updates it when rules change? | Builder | No |
| Headshots for the profile cards | Builder | No |
| Final EFRAG datapoint list (expected end of 2026) may change the counts: update the tables when published | Builder / Claude Code | No |

---

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
| v1.9 | 8 October 2026 | Lighter, friendlier voice ("friendly supporter", for sustainability managers and C-level): "30-second version" strip with three facts above the first section; friendlier headlines (e.g. "Do you have to report? Two quick tests", "Want it all on one page?", "Hi, we are Anika and Elena"); every section opens with a one-line "short answer" marked with a yellow bar instead of a long intro; a small line icon per section; disclaimers shown as "Good to know" tips; "we" used throughout; fix: the AND connector in the two tests no longer clashes with the unlock card style. 30-second strip: first tile reads "Up to 323 datapoints if every topic is material. Yours will be fewer. It was 1,052."; each tile has an icon (grid, people + euro, calendar). Sources: each "what changed" card has an i icon (hover) and a "Source" line in its detail, and each FY2026 route card names its article. Verified against the provided documents: routes = Delegated Regulation (EU) 2026/1563 Art. 2(1)(a) (existing ESRS or revised ESRS), Art. 2(1)(b) (existing ESRS plus the eight reliefs: ESRS 1 paras 27, 32-33, 74-75, 90, 91, 92, 106, 110), Art. 2(2) (state which version), Art. 3 (in force 10 Nov 2026, applies from FY starting 1 Jan 2027); value chain cap = ESRS 1 para 66 and Delegated Regulation (EU) 2026/1560 Annex II. Scope and assurance cite Directive (EU) 2026/470 without article numbers (not verified). Fix: the "what changed" card details now stay closed until tapped. Advisor voice: a yellow "For you" line (what it means for the reader) on the two threshold cards and the two non-EU route cards, an "Our tip" line, icons on the three steps, fine print behind a "The fine print" toggle. Route cards (2026 report): plain names (A "Keep it as it is", B "Keep it, with shortcuts", C "Switch early") with the official name small under them, three effort dots, a "Best if" line, the source in an i icon, bar "Matches your answers", badge "Looks best for you"; "reporting year 2026" wording in headings and questions; nav label "Your 2026 route". Section 8 rewritten to match the final mockup |

---

*This spec is written for Claude Code. It assumes zero prior context. Every decision, rule and requirement must be explicit enough that the builder can hand this document to Claude Code without a single verbal explanation.*
