# Product Spec — ESRS 2026 Update Check

**Version:** 1.0
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
| Supabase ↔ Netlify connection | The Supabase extension in Netlify, never copy-paste. Netlify → Extensions → Supabase → Install; then on the site → Connect → sign into Supabase → pick the project and framework (Vite). The extension writes the Supabase variables into the site's environment. Redeploy afterwards. **When:** new project, so after Claude Code creates it in session 1 and before the first functional deploy. **Key check, once:** values should start with `sb_`. If they start with `eyJ`, the extension wrote the retiring legacy keys: replace the public one by hand with the publishable key, and rotating the secret one becomes a dated handover item. |
| Platform owner | Anika Lerch's existing accounts (Supabase and Netlify under anikalerch@greenfriend.org). |
| Cost rule | **No new costs.** Netlify Free, Supabase Free, Cloudflare Turnstile (free). No paid service may be added without a spec change. |

**GitHub:** a new repo for this tool, created by the builder before the first Claude Code session. `product-spec.md`, `CLAUDE.md`, `PROGRESS.md`, `access-matrix.md`, `user-stories.md` and `prototype-reference.html` go to the repo root. Claude Code moves them into `docs/` (the prototype into `docs/reference/`) in its first session.

### Supabase project

**Supabase project status:** New. Claude Code creates it at the start of the build session.

**Supabase plan:** Free, for building and running at zero cost. The builder accepts the Free plan's limits: **no backups** and **pause after about one week without activity**. Mitigations: (1) a **monthly CSV export** of the leads table by the builder, stored outside Supabase, as the backup; (2) the handover runbook explains how to restore a paused project in the dashboard. Switch to Pro only if the lead list becomes business-critical, which would be a spec change because it adds cost.

| Detail | Answer |
|--------|--------|
| Proposed project name | greenfriend-tools |
| Confirmed project name | **esrs-update-project** (the builder's choice; the later contacts dashboard joins this same project) |
| Region | EU, Frankfurt (eu-central-1) |

> Claude Code pauses at the start of the session, confirms the project name, and creates the Supabase project via MCP before building anything. The project ID is recorded in docs/supabase-setup.md.

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
| industry | Industry | Text, one of the fixed list in Section 8 | Visitor | No |
| consent_contact | "I'd like greenfriend to contact me about my results" | Boolean, default false | Visitor | Yes |
| interests | Services of interest | Text array, values from the fixed list in Section 8 | Visitor | No |
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

**Personal data collected:** work email address; company name (optional). Industry, answers and results are not personal data on their own but are linked to the email until anonymisation.

**Lawful basis (two purposes):**
1. **Delivering the requested results and recording the request.** Basis: legitimate interest (the visitor asks for their results; greenfriend records the request and understands demand). Email required.
2. **Contacting the person about their results and the services they ticked.** Basis: consent, through an unticked checkbox. Ticking any service of interest also ticks the consent box. Consent is **never** a condition for getting the PDF.

The basis was derived during the architect interview as a starting point; it is to be signed off by greenfriend's privacy contact (anikalerch@greenfriend.org).

**Notice on the form:** Yes, always (short version under the form, with a link to the full notice view). **Consent checkbox:** yes, for purpose 2 only; not pre-ticked; the tick is recorded with `consent_at` and `notice_version`.

**Short notice shown under the unlock form:**
> We use your email to send you your results and to record your request (legitimate interest). We only contact you if you tick the box above (consent, which you can withdraw at any time). Without consent, your email and company are deleted after 30 days; all data is deleted after 24 months. Full privacy notice →

**Full privacy notice (own view, see Section 8), covering the six required points without personal names:**
> **Who is responsible:** greenfriend, Amsterdam, the Netherlands (KVK 91346169). Contact for all privacy questions: anikalerch@greenfriend.org.
> **What we collect:** your work email, and optionally your company name and industry, your answers in this tool and the results calculated from them, the services you ticked, and where your visit came from (a campaign tag in the link, if any).
> **Why and on what basis:** to give you your results and record your request (legitimate interest); to contact you about your results and the services you ticked, only if you ticked the box (consent).
> **How long:** if you did not consent to contact, your email and company name are deleted after 30 days and only anonymous results stay. All data is deleted after 24 months.
> **Who else processes it:** Supabase (database, EU region Frankfurt), Netlify (hosting), Cloudflare Turnstile (bot check). Fonts are served from this site, and no analytics or tracking cookies are used. Your unlock is remembered in your own browser only.
> **Your rights:** access, correction, deletion, objection, restriction, data portability and withdrawing consent at any time, by emailing anikalerch@greenfriend.org. You can complain to the Dutch Data Protection Authority (Autoriteit Persoonsgegevens).
> Notice version: 2026-10-07.

**Retention:** consent rows are kept 24 months, then deleted; non-consent rows have email and company removed after 30 days (scheduled job, Section 3), and the anonymous remainder is deleted after 24 months.

**Deletion mechanism:** a person emails anikalerch@greenfriend.org. The builder deletes every row with that email (current and superseded) in the Supabase dashboard, or with one Claude Code admin command, within 30 days, and confirms by email. "Deletion" removes the row completely. Withdrawal of consent: set `consent_contact` to false on the current row; the 30-day clean-up then applies from that date.

**Other GDPR measures (hard rules):** fonts (Literata, Figtree) self-hosted from the site, never loaded from Google; no analytics, no tracking cookies, no third-party scripts except Cloudflare Turnstile; browser storage only for the unlock flag (strictly necessary for the function the visitor requested).

> The basis, the notice, the retention period and the deletion route are the standard this tool is built to. The notice drafted here is greenfriend's privacy contact's to sign off. greenfriend's main website privacy policy (https://www.greenfriend.org/privacy-policy) is separate and out of scope for this build (Section 12).

---

## Section 8 — Screen and UI Structure

One long single page with a sticky chapter menu, plus a separate privacy notice view and an unlock dialog. **The prototype file is the reference for all copy, data tables and layout.** Remove its "Preview" badges and the "Mockup controls / Lock again" footer button. Change the brand line to read "greenfriend." with no personal names on the cover.

Below, **[locked]** marks content that is blurred with an "Unlock your action plan" bar until the visitor unlocks.

### Cover
- **Purpose:** Hook and urgency.
- **What is visible:** Dark ink band (#17302e) with overlapping translucent colour planes on the right (teal, coral, yellow, lilac; diagonal, blending; slow drift, disabled under reduced motion; faded on phones); brand line "greenfriend."; H1 "The revised ESRS, in five minutes"; lede; alert strip with yellow left border: "The revised ESRS apply from **10 Nov 2026**. Reporting on FY2026? Choose your route now." with a link to the FY2026 section; three mono "stamp" pills (Omnibus I · Directive (EU) 2026/470; Revised ESRS · Reg. (EU) 2026/1563; Status [rules date]); one line "Independent tool by greenfriend. Not affiliated with EFRAG or the European Commission."
- **User actions:** jump to FY2026.

### Sticky chapter menu
- What changed · Datapoints · Who reports when · Check your scope · Non-EU groups · Example cases · FY2026 options · Get the PDF · Who we are. The active chapter is highlighted while scrolling. Scrolls sideways on phones.

### What changed
- Six expandable cards (number, title, one line; detail list on click): Fewer companies in scope (~80%) · 323 datapoints in total · Top-down materiality · VSME value chain cap · 3 FY2026 routes · Assurance stays limited. Below them, a horizontal key-dates timeline: 26 Feb 2026, 18 Mar 2026, 3 Jul 2026, 21 Sep 2026, 10 Nov 2026 (highlighted "now"), 19 Mar 2027 (coral), FY2027.

### Datapoints
- **Fact sheet:** dot chart (108 dots ≈ 10 datapoints each: 29 kept mandatory, 3 new general, 49 removed mandatory, 27 removed voluntary) with legend, and a bucket table: Mandatory "shall" 783 → 292 (of which 195 apply whenever the topic is material); Voluntary "may" 269 → 0; Policies, actions, targets, metrics "separate*" → 31; Total 1,052* → 323. Headline figures −63% mandatory and −72% mandatory plus voluntary, with the footnote about 2023 MDR counting.
- **Your own number (estimator):** ten topic checkboxes (E1 Climate change, E2 Pollution, E3 Water, E4 Biodiversity, E5 Resource use, S1 Own workforce, S2 Value chain workers, S3 Communities, S4 Consumers, G1 Business conduct; default ticked: E1, E5, S1, S2, G1). Output: "You go from X to Y datapoints. That is Z% fewer." plus three bars (2023, revised, unconditional).
- **Standard by standard:** 12 cards (ESRS 2, GDR, E1–E5, S1–S4, G1) showing "2023 → revised" counts and a tag. The selected standard's panel shows count bars, key changes (pill "Removed / Changed / Relief / Unchanged" + text), and **Disclosure requirements**: one row per requirement with the code, a plain-language summary (ours), the official title from the regulation (small), the datapoint count, the conditional count and phase-in chips for the chosen company type (selector: Wave 1 above thresholds / Wave 1 below / First report FY2027 or later), a "Hide conditional" toggle and a search box (searches codes, titles and summaries). **[locked]** after the first 3 requirements, with "See all N disclosure requirements and M datapoints for [standard]". Link below: "Read the full text in EFRAG's ESRS Knowledge Hub" (https://knowledgehub.efrag.org, new tab). **No EFRAG datapoint names or IDs anywhere**, including the page source.

### Who reports when
- Two threshold cards (EU: >1,000 employees AND >€450M net turnover on the balance sheet date; non-EU Article 40a: >€450M EU turnover in each of the last two years AND an EU subsidiary or branch >€200M), each with the old thresholds. A timeline table (FY2024–FY2028) for six cohorts, with colour-coded cells and a key.

### Check your scope
- Left: one question at a time with progress bar, Back and Start again. Right: "Your reading", showing answers so far, then the verdict: badge + headline (free) and reasons and next steps **[locked]**, with buttons "Pick your FY2026 route" (when relevant) and "Get this as a PDF".

### Non-EU groups
- Two route cards (EU subsidiary from FY2027; Article 40a from FY2028) and a three-step flow.

### Example cases
- Seven tabs (Dutch group, Large daughter, Wave 1 now too small, US group mid-size EU, US group big EU daughter, Swiss group below EU line, Branch only), each with an org chart (parent → subsidiaries, status chip per entity, dashed border for non-EU) and a "Why" list. Cases 1–2 are free; tabs 3–7 show a lock icon, and their "Why" is **[locked]**.

### FY2026 options
- Three route cards (A, B, C) with fit meters; "Best fit" label on the winner. Seven questions as segmented buttons, pre-filled with example answers. Recommendation panel (dark, with colour planes): route name (free), reasons **[locked]**, and the "our reading, not a legal requirement" note.

### Unlock your action plan (section) and Unlock dialog
- **Purpose:** collect the lead and deliver the PDF.
- **What is visible (section):** "Unlock your full action plan", a list of what unlocks, a status list (scope done? route from example answers? datapoints), and the form. **Dialog:** opens from every "Unlock your action plan" button, with the same form. Closes on ×, Escape or backdrop click.
- **Form fields:** Work email (required; format check on the page and in the function); Company (optional); Industry (optional dropdown: Energy and utilities, Automotive, FMCG and food, Industrial and manufacturing, Chemicals, Financial services, Retail, Tech, Other); checkbox "I'd like greenfriend to contact me about my results" (unticked); "Interested in (optional)" checkboxes: DMA and strategy development · Governance · Reporting and assurance · Custom tool and dashboard builds · FY2026 (ticking any of them ticks the contact box); Cloudflare Turnstile widget (managed or invisible); button "Unlock my action plan"; the short privacy notice (Section 7) with a link to the full notice view.
- **User actions:** submit.
- **What happens next:** the submit function validates and stores. On success, everything unlocks (flag kept in browser storage), the PDF downloads automatically, and a confirmation reads "Unlocked. Your one-pager is downloading." with a "Download again" button. On error: a plain message saying what went wrong (invalid email format, bot check failed, server unavailable); nothing unlocks; the visitor can retry.

### Who we are and how we help
- Pitch (H2 "We help companies report what they actually do" + lede + pull quote); **How we work differently**: three numbered cards (You work with us, not a junior team · Inside experience, consulting and tech in one team · Strategy first, box-ticking last); two profile cards: **Anika Lerch, MSc** (Founder, greenfriend · Strategy, governance and CSRD; four bullets as in the prototype; LinkedIn link) and **Elena Zayakova, MSc** (Founder, CoreWorks Consultancy · Strategy, reporting and governance; four bullets; LinkedIn link), using initials avatars until photos are supplied; **How we help, step by step**: steps 0–4 (Know where you stand · Find what really matters · Turn topics into goals · Make clear who owns what · Report what you did), each with "What we do" and "You get".

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

**Brand reference:** No brand skill file. Version "A" of the prototype defines the look.

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

**Visual feel:** calm, factual and friendly, with attention only where action is needed.
- Yellow highlighter strokes behind key numbers.
- Coral for deadlines and the unlock buttons.
- Thick ink top border on the scope box, estimator and unlock box.
- Overlapping translucent diagonal colour planes (no circles) on the cover, the CTA box and the recommendation panel.
- 12–16 px radii, no heavy shadows, no emoji.
- Phone-ready at 375 px with no sideways page scroll.
- Reduced-motion respected.

**Reference:** `docs/reference/prototype-reference.html` (version A). The calm variant is **not** used.

---

## Section 11 — API and Credentials

| Service | What it does in this tool | Key required | Where key is stored |
|---------|--------------------------|-------------|-------------------|
| Supabase | Database for leads (`unlocks`); pg_cron clean-up job | Publishable key (`sb_publishable_…`, not used by the browser in this tool) + secret key (`sb_secret_…`, used only by the submit function) | Netlify environment variables, written by the Supabase extension; value checked once (starts with `sb_`) |
| Public-tool protections | The submit Netlify Function `submit-unlock` is the only write path: it verifies the Turnstile token, refuses bodies over 16 KB, validates every field (email format, lengths, allowed values for industry, interests, route, topics and answers), lower-cases the email, applies the supersede rule, and inserts with the secret key. No rate limit; the CAPTCHA is the abuse control. | Cloudflare Turnstile site key (public) + secret key | `VITE_TURNSTILE_SITE_KEY` (public) and `TURNSTILE_SECRET_KEY` (secret) as Netlify environment variables, added by hand |

> **Security rule, no exceptions:** no API key, token, password or credential in any HTML or JavaScript file or anything committed to GitHub. The browser bundle contains no Supabase key and no Supabase client.

**Environment variable contract:**

| Variable name (exact) | Read by | Set where | Public or secret |
|-----------------------|---------|-----------|------------------|
| `VITE_SUPABASE_URL` | the submit Netlify Function (not imported by the browser code) | Netlify env, written by the Supabase extension | public |
| `VITE_SUPABASE_ANON_KEY` | not used by this tool; written by the extension | Netlify env, written by the Supabase extension | public (publishable key) |
| `SUPABASE_SERVICE_ROLE_KEY` | the submit Netlify Function only | Netlify env, written by the Supabase extension | secret (value: `sb_secret_…`) |
| `SUPABASE_DATABASE_URL` | not used by this tool | Netlify env, written by the Supabase extension | secret |
| `VITE_TURNSTILE_SITE_KEY` | the unlock form (browser) | Netlify env, added by hand | public |
| `TURNSTILE_SECRET_KEY` | the submit Netlify Function | Netlify env, added by hand | secret |

> The Supabase variable names are verified on the first live build; if the extension writes different names, this table and supabase-setup.md are corrected in the same session.

**Credentials readiness:**

| Credential | Status | Where to get it |
|-----------|--------|----------------|
| Supabase URL and keys | Written by the Supabase extension after the project exists | Netlify → site → Connect (Supabase extension) |
| Turnstile site key + secret key | Needs creating (free) | Cloudflare dashboard → Turnstile → Add widget, hostname check.greenfriend.org (plus the Netlify preview domain for testing) |

---

## Section 12 — Out of Scope — Phase 2

| Deferred feature | Reason it is deferred |
|-----------------|----------------------|
| Contacts dashboard with login (Tool B on the same Supabase project; first reader Anika Lerch, anikalerch@greenfriend.org) | Not needed to validate the lead magnet; leads are read in the Supabase dashboard for now |
| Confirmation email / double opt-in (Resend free tier with greenfriend.org verified) | Builder chose format validation only for the first build |
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
| 3 | Fonts self-hosted, no third-party requests | Network tab shows no requests to Google or any host except Cloudflare Turnstile and the site itself | [ ] |
| 4 | Scope check, EU and non-EU paths | Each prototype verdict reproduces for its answer path (unit tests cover every path) | [ ] |
| 5 | FY2026 route | Example answers give Route B; a tie gives the earlier route; reasons match the table | [ ] |
| 6 | Estimator | Default ticks give 569 → 237 (−58%), 163 unconditional; all ticked gives 783 → 292 (195 unconditional) | [ ] |
| 7 | Drill-down | E1 shows 11 requirements, 84 datapoints; the page source contains no "ESRS26_" IDs or EFRAG datapoint names | [ ] |
| 8 | Gating before unlock | Scope reasons, route reasons, cases 3–7 and requirements beyond 3 are blurred with unlock bars | [ ] |
| 9 | Unlock with a valid email and Turnstile | One row in `unlocks` with correct fields; everything unlocks; the PDF downloads automatically; reload keeps it unlocked | [ ] |
| 10 | Invalid email / missing Turnstile / body over 16 KB | The function refuses; a clear error shows; nothing unlocks; no row | [ ] |
| 11 | Consent logic | Unticked by default; ticking an interest ticks consent; PDF works without consent; `consent_at` set only with consent | [ ] |
| 12 | Supersede | A second unlock with the same email (different case) creates a new row and sets `superseded_by` on the old one | [ ] |
| 13 | No browser access to the database | A direct call with the publishable key to read or insert `unlocks` is refused | [ ] |
| 14 | PDF | One A4 page matching the design intent; company in header if given; "not completed" text if the scope check was skipped; no broken characters | [ ] |
| 15 | Clean-up job | Test rows older than 30 days without consent are anonymised; rows older than 24 months are deleted; the job appears in pg_cron | [ ] |
| 16 | Privacy notice | `/privacy` shows the full notice; linked from the form and the footer; the short notice sits under the form | [ ] |
| 17 | No secrets in the bundle | The built JS contains no Supabase key or Turnstile secret | [ ] |
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
- [ ] Turnstile widget created in Cloudflare (free); both keys ready to enter in Netlify by hand

### Tier 2 build session
- [ ] Open Claude Code in the project folder; First Session Setup (docs/, docs/reference/)
- [ ] Claude Code reads product-spec.md, CLAUDE.md, PROGRESS.md, access-matrix.md and the prototype
- [ ] Supabase, new project: Claude Code proposes **esrs-update-project** (EU, Frankfurt), waits for confirmation, creates it via MCP
- [ ] Tables via named migrations saved in the repo, RLS on from creation, no anon policy or grant; login-ready columns; the pg_cron clean-up job
- [ ] docs/supabase-setup.md created
- [ ] Frontend built from the prototype (React + Vite + Tailwind; logic as pure, unit-tested functions; self-hosted fonts)
- [ ] `submit-unlock` Netlify Function with Turnstile verification, size limit, validation and supersede rule
- [ ] Test locally
- [ ] Connect Supabase to the Netlify site with the Supabase extension; add the Turnstile keys by hand; check that values start with `sb_`; redeploy
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
| Does Cloudflare Turnstile need to be named in a cookie banner? (It sets no tracking cookies; the notice names it.) | Builder / privacy contact | No |
| Rules status date shown on the cover and PDF ("Status 7 Oct 2026"): who updates it when rules change? | Builder | No |
| Headshots for the profile cards | Builder | No |
| Final EFRAG datapoint list (expected end of 2026) may change the counts: update the tables when published | Builder / Claude Code | No |

---

## Section 16 — Tool Version History

| Version | Date | What changed in the tool |
|---------|------|--------------------------|
| v1.0 | 7 October 2026 | Initial build from prototype version A |

---

*This spec is written for Claude Code. It assumes zero prior context. Every decision, rule and requirement must be explicit enough that the builder can hand this document to Claude Code without a single verbal explanation.*
