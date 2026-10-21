// Your 2027 roadmap (spec v2.2/v2.3): pure port of mapMode(), mapTopics(), monthAt(), rng() and mapSteps() from the prototype.
// Columns 1..17 are months Dec 2026 to Apr 2028 for a December year-end; a different year-end shifts every date.
import { STAT, TOPICS } from "./data.js";
import { isScopeComplete, verdict } from "./scope.js";

export const MN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Plan type from the scope answers: "open" (scope check not finished), "refresh" (wave 1 and in scope) or "scratch".
// basis: [text before the badge, badge or null, text after] for the line above the timeline.
export function mapMode(A) {
  if (!isScopeComplete(A)) return { k: "open", label: "DMA refresh or from scratch", basis: null };
  const big = A.hq === "eu" && A.emp === "y" && A.turn === "y";
  const v = verdict(A);
  if (A.hq === "eu" && A.wave1 === "y" && big)
    return { k: "refresh", label: "DMA refresh", badge: v.b, basis: "You reported for FY2024, so we plan a refresh of your earlier work." };
  const out = v.c !== "v-in";
  return {
    k: "scratch",
    label: "DMA from scratch",
    badge: v.b,
    basis: out
      ? "You may not need to report. This is the plan if you report voluntarily or customers ask. You have no earlier report, so it starts from scratch."
      : `This is your first report, so we plan the DMA from scratch.${A.hq === "non" ? " Non-EU groups under Article 40a report from FY2028, so shift the plan by a year." : ""}`,
  };
}

export function mapTopics(topics) {
  const sel = TOPICS.map((t) => t[0]).filter((c) => topics.includes(c));
  return { n: sel.length, m: STAT["ESRS 2"][1] + sel.reduce((a, c) => a + STAT[c][1], 0) };
}

// fyEnd: 1..12 (month the financial year ends), or 0/empty for the December default.
export const fyShift = (fyEnd) => (+fyEnd ? +fyEnd : 12) % 12;
export function monthAt(c, shift) {
  const i = 11 + (c - 1) + shift;
  return { m: i % 12, y: 2026 + Math.floor(i / 12) };
}
function rng(a, b, shift) {
  const s = monthAt(a, shift), e = monthAt(b - 1, shift);
  if (a === b - 1) return `${MN[s.m]} ${s.y}`;
  return s.y === e.y ? `${MN[s.m]} to ${MN[e.m]} ${e.y}` : `${MN[s.m]} ${s.y} to ${MN[e.m]} ${e.y}`;
}

// Bars with their dates recomputed for the year-end.
export function mapSteps(A, topics, fyEnd) {
  const shift = fyShift(fyEnd);
  return mapSteps0(mapMode(A).k, mapTopics(topics)).map((x) => {
    const m = (x.when || "").match(/, up to \d+ months$/);
    return { ...x, when: x.fin ? `${rng(x.a, x.b, shift)}, each year` : rng(x.a, x.b, shift) + (m ? m[0] : "") };
  });
}

const GOV = "Agree who is responsible, accountable, consulted and informed for each topic and IRO, set up board and committee reporting, and train teams on what reporting means for them. Embed the targets in yearly goals, OKRs and budget (budget rounds often close in Q4).";
const FIX = "Close the gaps the dry run found, brief data owners on the year-end instructions, and draft the narrative parts that do not depend on year-end figures (strategy, policies, governance).";
const FIN = { t: "Annual financial reporting", s: "Annual report", when: "Jan to Apr, each year", d: "The sustainability statement is published with the same annual report. Align your calendar with finance.", a: 2, b: 6, a2: 14, b2: 18, fin: 1 };
const topicWord = (n) => `topic${n === 1 ? "" : "s"}`;

function mapSteps0(md, tp) {
  if (md === "refresh") {
    const n = tp.n;
    return [
      { t: "Confirm your FY2026 route", s: "Route A, B or C", when: "Dec 2026 to Jan 2027", d: "Confirm which route you report on for FY2026 (keep it, keep it with shortcuts, or switch early) and agree it with your auditor.", a: 1, b: 3 },
      { t: "Year-end data", s: "Year-end data", when: "Jan to Feb 2027", d: "Collect the full-year FY2026 data alongside the financial close.", a: 2, b: 4 },
      { t: "Draft the FY2026 statement", s: "Draft statement", when: "Feb to Mar 2027", d: "Draft the sustainability statement on your chosen route and review it with finance and legal.", a: 3, b: 5 },
      { t: "Assurance", s: "Assurance", when: "Mar to Apr 2027", d: "Your auditor reviews the statement, usually in parallel with the financial audit.", a: 4, b: 6 },
      { t: "Publish the FY2026 report", s: "Publish", when: "Apr 2027", d: "Approval and publication with the annual report (for a December year-end, by about end of April for listed companies).", a: 5, b: 6 },
      { t: "Refresh your DMA for the revised ESRS", s: "DMA refresh", when: "May to Jul 2027", d: "Update impacts, risks and opportunities and conclude at topic level. The revised ESRS apply from FY2027.", a: 6, b: 9 },
      { t: "Gap analysis and match to earlier reports", s: "Gap analysis", when: "Jun to Aug 2027", d: "Match what you reported for FY2026 to the revised datapoints. Keep what carries over and list what is missing.", a: 7, b: 10 },
      { t: "Refresh your strategy", s: "Strategy refresh", when: "May to Aug 2027", d: "Link the material topics to your strategy, targets, policies and actions, and update what changed after the DMA refresh.", a: 6, b: 10 },
      { t: "Build governance and embed strategy", s: "Governance, embed strategy", when: "Aug to Nov 2027", d: GOV, a: 9, b: 13 },
      { t: "Set up data collection for FY2027", s: "Data set-up", when: "Jul to Sep 2027", d: `Owners, templates and controls for ESRS 2 plus ${n} ${topicWord(n)} (up to ${tp.m} mandatory datapoints and the 31 general ones). FY2027 runs from 1 January 2027, so data is captured during the year.`, a: 8, b: 11 },
      { t: "Dry run on half-year data", s: "Dry run", when: "Sep to Oct 2027", d: "Run the process on H1 figures to find errors and missing owners while there is time to fix them.", a: 10, b: 12 },
      { t: "Fix findings and pre-draft", s: "Fix, pre-draft", when: "Nov to Dec 2027", d: FIX, a: 12, b: 14 },
      { t: "FY2027 year-end, draft and assurance", s: "FY2027 close, draft, assurance", when: "Jan to Apr 2028", d: "Full-year data, drafting and assurance for the FY2027 report.", a: 14, b: 18 },
      { t: "Auditor alignment", s: "Auditor", when: "Jan 2027 to Apr 2028", d: "The auditor stays independent of the project team, so this is a separate track. Agree all check-ins and the evidence expected at each one up front.", a: 2, b: 18, arrow: 1, ck: [[2, "Route confirmed"], [4, "Draft FY2026 statement reviewed"], [5, "FY2026 assurance"], [8, "DMA conclusions for the revised ESRS"], [11, "Dry-run findings"], [15, "FY2027 assurance"]] },
      FIN,
    ];
  }
  const sc = md === "scratch";
  return [
    { t: sc ? "Screen your documentation and data sources" : "Screen what you have", s: sc ? "Documentation screening" : "Screening", when: sc ? "Dec 2026 to Mar 2027" : "Dec 2026 to Jan 2027", d: sc ? "First-time reporters need more time here. Collect policies, existing reports (annual, CSR, ratings), earlier assessments, data sources and owners. Map what exists against the topics." : "Read your last DMA, strategy and sustainability reports. Note what still holds.", a: 1, b: sc ? 5 : 3 },
    { t: "Internal kick-off", s: "Kick-off", when: "Jan to Feb 2027", d: "Executive sponsor, sustainability core team, finance, HR, procurement, legal, IT and the site or operations leads who hold the numbers. Agree owners and fix the calendar around your annual close.", a: 2, b: 4 },
    { t: sc ? "Run your DMA from scratch" : "Refresh or run your DMA", s: sc ? "DMA from scratch" : "DMA refresh or scratch", when: sc ? "Feb to Jul 2027, up to 6 months" : "Feb to May 2027, up to 4 months", d: sc ? "Identify impacts, risks and opportunities, involve stakeholders, assess and conclude at topic level. A first DMA takes longer than a refresh. The material topics decide which data you need." : "Refresh your last assessment, or start from scratch if you have none. Conclude at topic level.", a: 3, b: sc ? 9 : 7 },
    { t: "Gap analysis", s: "Gap analysis", when: sc ? "Jul to Sep 2027" : "May to Jul 2027", d: "Compare the data you already collect with the datapoints for your material topics. List what is missing and who owns it.", a: sc ? 8 : 6, b: sc ? 11 : 9 },
    { t: sc ? "Build your strategy" : "Refresh your strategy", s: sc ? "Strategy" : "Strategy refresh", when: sc ? "Jun to Sep 2027" : "May to Aug 2027", d: sc ? "Link each material topic to targets, policies and actions." : "Link the material topics to your strategy, targets, policies and transition plan.", a: sc ? 7 : 6, b: sc ? 11 : 10 },
    { t: "Build governance and embed strategy", s: "Governance, embed strategy", when: sc ? "Sep to Dec 2027" : "Aug to Nov 2027", d: GOV, a: sc ? 10 : 9, b: sc ? 14 : 13 },
    { t: "Set up data collection", s: "Data set-up", when: sc ? "Sep to Nov 2027" : "Jul to Sep 2027", d: `Owners, templates and controls for ESRS 2 plus ${tp.n} ${topicWord(tp.n)} (up to ${tp.m} mandatory datapoints and the 31 general ones). The financial year is already running, so data must be captured during the year.`, a: sc ? 10 : 8, b: sc ? 13 : 11 },
    { t: sc ? "Dry run on nine-month data" : "Dry run on half-year data", s: "Dry run", when: sc ? "Oct to Nov 2027" : "Sep to Oct 2027", d: sc ? "Run the process on Q3 figures. This finds errors and missing owners while there is still time to fix them." : "Run the process on H1 figures. This finds errors and missing owners while there is still time to fix them.", a: sc ? 11 : 10, b: sc ? 13 : 12 },
    { t: "Fix findings and pre-draft", s: "Fix, pre-draft", when: "Nov to Dec 2027", d: FIX, a: 12, b: 14 },
    { t: "Year-end data and drafting", s: "Year-end data and draft", when: "Jan to Mar 2028", d: "Collect full-year data alongside the financial close, complete the draft with the final figures and review it with finance and legal.", a: 14, b: 17 },
    { t: "Assurance", s: "Assurance", when: "Feb to Apr 2028", d: "Your auditor reviews the statement, usually in parallel with the financial audit.", a: 15, b: 18 },
    { t: "Auditor alignment", s: "Auditor", when: "Feb 2027 to Apr 2028", d: "The auditor stays independent of the project team, so this is a separate track. Agree all check-ins and the evidence expected at each one up front, in February.", a: 3, b: 18, arrow: 1, ck: sc ? [[4, "Scope and approach agreed"], [8, "DMA conclusions"], [11, "Gap analysis and data controls"], [12, "Dry-run findings"], [14, "Year-end plan and evidence"], [16, "Assurance findings"]] : [[4, "Scope and approach agreed"], [7, "DMA conclusions"], [10, "Gap analysis and data controls"], [12, "Dry-run findings"], [14, "Year-end plan and evidence"], [16, "Assurance findings"]] },
    FIN,
  ];
}

// Our step from "How we help, step by step" under each bar we support (dotted terracotta line).
export const SV = [
  [0, "Where you stand", "Know where you stand: check scope, timeline and route"],
  [1, "Double materiality", "Find what really matters: value chain map, signed-off material topics"],
  [2, "Strategy", "Turn topics into goals: objectives, KPIs and targets per topic"],
  [3, "Governance", "Make clear who owns what: roles, board updates, team training"],
  [4, "Reporting", "Report what you did: gap list, evidence file for your auditor"],
];
export const svOf = (t) =>
  /^Build governance/.test(t) ? 3
  : /^(Screen|Confirm your FY2026 route)/.test(t) ? 0
  : /DMA/.test(t) ? 1
  : /strategy/i.test(t) ? 2
  : /^(Internal kick-off|Build governance)/.test(t) ? 3
  : /^(Gap analysis|Set up data|Dry run|Fix findings|Year-end|Draft the FY2026|Assurance|FY2027 year-end)/.test(t) ? 4
  : -1;
