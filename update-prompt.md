Use this only if you have already started building from spec v1.9. Read the updated CLAUDE.md, PROGRESS.md and docs/product-spec.md (now v2.0), replace docs/reference/prototype-reference.html with the new file, then bring the build in line. Do not touch the database, the submit function or the PDF code except where listed. Make a save point after each item and update PROGRESS.md.

What changed from v1.9 to v2.0 (details in product-spec.md Section 8, Section 9 and the version history):
- Cover: plain band, "greenfriend.", H1 "ESRS update 2026 in 5 min", one line, one button "Check your company" (no alert, stamps or colour planes).
- Chapter order: 30-second strip, What changed, Who reports when, Check your scope, Datapoints, Non-EU groups, Example cases, Your 2026 route, Get the PDF, Who we are. Update the sticky menu to match.
- 30-second strip, third tile: "From FY2027 — mandatory for financial years starting on or after 1 January 2027. For FY2026 you choose."
- Who reports when: replace the two threshold cards with the decision flow (two criteria chips, three outcome cards, non-EU strip). Say "criteria", not "tests". Table cohorts say EU; the Good to know line explains wave 1 and links to the national transposition measures.
- "For you" is now "What it means for you" everywhere.
- Naming: "Pre-Omnibus ESRS" (never "existing ESRS") and "Revised ESRS".
- Datapoints: remove the standard-by-standard section and the requirement drill-down (no DRS/DRT tables). Add "What are the 31 general datapoints?" as four question cards with chips (Policies, Actions, Metrics, Targets); no single datapoints and no EFRAG names or IDs.
- Your 2026 route: remove the seven questions, scoring and recommendation. Show three route cards A/B/C with "Fits if", source icons, Good to know, Our tip and the "Where the three routes come from" toggle. Nothing locked here. The route, route_from_example and route_answers columns stay empty.
- Unlock: squares are Scope result, FY2026 routes, Datapoint estimate, One-page PDF. Two locked areas only (scope reasons, example cases 3–7). The PDF section 2 lists the three route options instead of a recommendation.
- Who we are: one light teal background with white cards, shorter text, five step cards side by side with a + toggle.
- "~80%" on the What changed card is now "~90%".
- Navigation: from 1180 px wide the chapter menu is a fixed left sidebar (230 px, "greenfriend." on top, links stacked, content to the right); below that it stays the sticky top bar.


## v2.1 additions (15 Oct 2026)
- New look from the prototype: teal #07806f palette, soft shadows, orange chapter pills, cover gradient, dark-mode tokens (copy the :root blocks from docs/reference/prototype-reference.html). Fonts unchanged.
- Non-EU groups: replace the two route cards and the three-step row with the guided stepper (three numbered questions with Yes/No answer boxes). Copy and logic are in spec Section 8, Non-EU groups.
- Your 2026 route: replace the "Where the three routes come from" toggle with the small folded "Where this comes from" toggle (closed by default) and the visible "General information" copyright note (spec Section 8, FY2026 routes). Elena profile text is as in the last code version.

## v2.2 additions (15 Oct 2026)
- New chapter "Your 2027 roadmap" between "Your 2026 route" and "Get the PDF" (tenth nav link). It has no questions: it reads the scope answers and the ticked topics and draws a simple timeline (quarters Q4 2026 to Q2 2028). Wave 1 and in scope gives DMA refresh, everything else DMA from scratch. Copy, steps and dates are in spec Section 8 and in the prototype (`mapSteps`). Not gated. Closing box "Want our help?" links to "Who we are".
- Gate the datapoint breakdown (bars, unconditional count, total with the 31) behind the unlock.
- Unlock squares: Scope reasons and next steps, Datapoint breakdown, All seven example cases, One-page PDF (with the roadmap as section 4).
- Move the "General information" copyright note to the very end of the page.
- Non-EU groups: remove the chapter from the menu and the main flow. Keep it hidden under "Check your scope" and show it when the first scope answer is "Outside the EU" or when the visitor taps "See the three questions" in "Who reports when" (replaces the non-EU strip there). Menu has nine links.
- What changed: ~90% card opens full width with a company-type table (before, now) and the "80% or 90%?" note; keep every other fold-out to two short bullets (copy in the prototype, `CHUNKS`).
- Source policy (spec, "Source policy"): add the rule to CLAUDE.md, name the source on every figure, update the ~90% card note and the roadmap "our planning guide" line, and add the source sentence to the General information note.
- 2027 roadmap: compact rows (title, dates, bar); step details only in the hover tooltip (`data-ftip`), rows focusable.
- v2.2 roadmap look: bars carry their own short text (Gantt style, Dec 2026 to Apr 2028, annual-report bars hatched); hover for detail; scrolls sideways on phones.
- v2.2 roadmap steps revised: internal kick-off widened, separate auditor alignment, gap analysis moved to May-Jul, added data set-up, H1 dry run, year-end data and drafting, assurance. Publication Mar-Apr 2028.
- v2.2 roadmap: wave 1 (in scope, reported FY2024) now sees the FY2026 report in 2027 first (route, year-end data, draft, assurance, publish Apr 2027), then the move to revised ESRS for FY2027. Others keep the first-report plan.
- v2.2 roadmap 'Good to know' now includes our work-backwards rule of thumb (data cut-off ~3 weeks after year-end, draft end Feb, audit committee/auditor March, board 1-2 weeks before publication), labelled as ours.
- v2.2 roadmap: first-time reporters get a longer plan (screening to Mar, DMA up to 6 months Feb-Jul, strategy Jun-Sep, gap analysis Jul-Sep, data set-up Sep-Nov, dry run on nine-month data Oct-Nov).
- v2.2 roadmap: visible note above the timeline for non-calendar financial years (everything shifts; first revised-ESRS year starts on first FY beginning on/after 1 Jan 2027). Needs a source check before launch.
- v2.2 roadmap: auditor alignment is now a violet arrow track through the whole process with six check-in diamonds (agreed up front); wave 1 variant starts Jan 2027.
- v2.2: "Want our help?" band moved from under the roadmap to the top of "We help companies" (button Book a free call to greenfriend.org); the footer "Report what you do." CTA box removed.
- v2.2: the five "What we do and what you get" fold-outs in the service steps show only the plus (text is visually hidden for screen readers).
- v2.2 roadmap: new bar "Fix, pre-draft" (Nov-Dec 2027, all plans) closes the empty gap between dry run and year-end data.
- v2.2 roadmap: dotted terracotta line with label under bars we support, mapped to our five steps (0 Where you stand, 1 Double materiality, 2 Strategy, 3 Governance, 4 Reporting); legend line added; rows taller.
- v2.2 roadmap: new bar "Governance, embed strategy" (Aug-Nov 2027; Sep-Dec for first-time reporters) with our step 3; data set-up now under step 4 Reporting.
- v2.2 roadmap: timeline compressed by packing non-overlapping bars into shared rows (about six rows); auditor track on top, annual reporting at the bottom.
- v2.2 roadmap: back to one bar per row in time order with tight spacing; auditor track moved near the bottom above annual reporting.
- v2.2 roadmap: field "Financial year ends in" (month select, empty = December); the timeline axis and all dates in tooltips and the PDF section 4 shift automatically; note text updated.
- v2.2: logo word mark "greenfriend." set in League Spartan Bold (page menu, cover, preview); PDF header still Helvetica until the font is embedded in jsPDF.
- v2.3 colour: the tool uses the blue "Bold indigo" palette instead of teal (tokens in spec Section 10; copy them from docs/reference/prototype-reference.html). Auditor track uses var(--info) teal; jsPDF colours updated (ink #141a4a, indigo #3a3fd1, coral #e8503f).
- v2.3 AI disclosure: footer "General information" note and the PDF disclaimer line say AI is used as a support tool and greenfriend reviews the content (wording in spec Footer section).
- v2.3 PDF: now 2 pages. Page 2 is the roadmap (bars, auditor arrow and check-ins, annual report), drawn from the same data as the page. One PDF behind both sign-ups. buildPdf() in the prototype is the reference.
- v2.3 PDF datapoints: three states (own selection / untouched default shown as example / no topic ticked = ESRS 2 alone, no percentage pill). Track "touched" on the estimator checkboxes. Reference: estState() and buildPdf() in the prototype.
- v2.3 PDF self-contained: inputs strip plus a "General guidance, not based on your answers" tag and general content for every section the user did not complete (scope rules, per-topic datapoint counts, general roadmap), so nobody has to repeat the check or the email step. Reference: buildPdf() and previewHTML().
- v2.3 disclaimer and slides: PDF footer now says automated view, without warranty, not responsible for output or use. New box "Take your results internally or present them in a deck?" with Download PDF and Download slides (.pptx) after unlock; slides built from the same inputs (5 slides, same disclaimer). Add PptxGenJS to the stack for this.
- v2.3 PDF is now ONE SQUARE PAGE (280 x 280 mm) in the slide look: gradient header and footer, inputs strip, scope card plus route cards, datapoints card plus dates card, full-width roadmap. Replaces the earlier 2-page A4 layout. Reference: buildPdf() and gradURL() in the prototype.
