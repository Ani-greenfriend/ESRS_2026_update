import { useEffect, useState } from "react";
import { ChapterHead } from "./Icons.jsx";

// When: roadmap (spec v2.4): one general plan for everyone, no dates. A snaking road with KICK-OFF, eight stops (strategy added) and
// FINAL REPORT; details only in the hover card (hover, focus, tap). Port of renderMap() in the prototype.
const SVN = ["Where you stand", "Double materiality", "Strategy", "Governance", "Reporting"];

// Fine line icons (1.3 px stroke): magnifier, scales, signpost, checklist, two people, replay with play, document, shield with tick.
const ICO = [
  <><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5" /></>,
  <path d="M12 4v16M5 8h14M5 8l-2.5 6a3 3 0 0 0 5 0zM19 8l-2.5 6a3 3 0 0 0 5 0z" transform="translate(-0.5 0)" />,
  <path d="M12 3v18M12 6h7l-2 3 2 3h-7M12 12H5l2-3-2-3" />,
  <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V3h6v1M8.5 11l1.5 1.5 3-3M8.5 17h7" /></>,
  <><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M16.5 5.5a3 3 0 0 1 0 5.5M18 14.5c2 .7 3.5 2.6 3.5 5.5" /></>,
  <><path d="M20 12a8 8 0 1 1-2.5-5.8M20 4v4h-4" /><path d="M10 9l5 3-5 3z" /></>,
  <path d="M6 3h9l4 4v14H6zM15 3v4h4M9 12h7M9 16h7M9 8.5h3" />,
  <><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="M8.5 12l2.5 2.5 4.5-5" /></>,
];

const MAIN = [
  { t: "Screening and scoping", sv: 0, d: "Check whether you report, from which year and on which standard route. Collect what you already have (policies, reports, data sources, owners) and bring sponsor, finance, HR, legal, IT and the data holders together." },
  { t: "Double materiality assessment", sv: 1, d: "Refresh your last assessment or run a new one. Conclude at topic level: the lighter top-down approach no longer asks you to test every impact, risk and opportunity." },
  { t: "Strategy development", sv: 2, d: "Build your strategy on the material topics: an objective, a starting point and a target for each, with the policies and actions behind them. The targets then feed your yearly goals and the report." },
  { t: "Data gap analysis", sv: 4, d: "Compare the datapoints for your material topics with the data you have today. List what is missing, where it could come from and how big the gap is." },
  { t: "Data set-up and owner mapping", sv: 4, d: "Name an owner for every datapoint. Set up templates, controls and a calendar so the data is captured during the year, not at the end." },
  { t: "Data collection and quality checks", sv: 4, d: "Collect the data, run the process on part-year figures first, close the gaps it shows and brief data owners on the year-end instructions." },
  { t: "Report draft", sv: 4, d: "Draft the narrative and tables with the final figures, and review the draft with finance and legal." },
  { t: "Assurance", sv: null, d: "Your auditor reviews the statement (limited assurance), usually in parallel with the financial audit. Agree the check-ins and the evidence needed early." },
];

const SIDE = [
  { k: "gov", t: "Reporting governance", d: "Reporting governance runs all along, like the auditor track: a named sponsor, owners per topic, regular board and committee updates and a log of decisions, from the first screening to the published report." },
  { k: "aud", t: "Auditor alignment", d: "The auditor stays independent of the project team, so this is a separate track. Agree all check-ins and the evidence expected at each one up front.", ck: ["Scope and approach agreed", "DMA conclusions", "Gap analysis and data controls", "Dry-run findings", "Year-end plan and evidence", "Assurance findings"] },
];

// Stop centres in % of the road box (row 1 left to right, row 2 right to left, row 3 left to right).
// Eight stops (builder request, 3 Nov 2026: strategy after the DMA): rows of 3, 3 and 2, then FINAL REPORT.
const POS = [[23, 15.25], [50, 15.25], [77, 15.25], [77, 49.15], [50, 49.15], [23, 49.15], [23, 83.05], [50, 83.05]];
const ARROWS = [[36.5, 15.25], [63.5, 15.25], [63.5, 49.15, 1], [36.5, 49.15, 1], [36.5, 83.05], [63.5, 83.05]];
const ROAD = "M 55 90 H 900 A 100 100 0 0 1 900 290 H 100 A 100 100 0 0 0 100 490 H 770";

export default function Roadmap() {
  const [open, setOpen] = useState(null);
  // One card at a time; a click outside the stops closes it.
  useEffect(() => {
    const close = (e) => { if (!(e.target instanceof Element && e.target.closest(".sn"))) setOpen(null); };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  return (
    <section className="ch" id="roadmap">
      <ChapterHead icon="calendar" eyebrow="When: steps" title="What does your 2027 in the sustainability department look like?" short="The steps in order, from where you stand to assurance. No fixed dates: your own timing depends on your year-end, size, data and auditor." />
      <div className="rsteps">
        <div className="snake">
          <svg viewBox="0 0 1000 590" preserveAspectRatio="none" aria-hidden="true">
            <path className="rd" d={ROAD} />
            <path className="rl" d={ROAD} />
          </svg>
          <div className="se st" style={{ left: "6.5%", top: "15.25%" }} aria-hidden="true">KICK-<br />OFF</div>
          {ARROWS.map(([x, y, l]) => <span key={`${x}-${y}`} className="ar" style={{ left: `${x}%`, top: `${y}%` }} aria-hidden="true">{l ? "◀" : "▶"}</span>)}
          <div className="se fi" style={{ left: "77%", top: "83.05%" }} aria-hidden="true">FINAL<br />REPORT</div>
          {MAIN.map((x, i) => {
            const [left, top] = POS[i];
            const al = left < 30 ? "l" : left > 70 ? "r" : "c";
            return (
              <div key={x.t} className={`sn ${al}${open === i ? " open" : ""}`} style={{ left: `${left}%`, top: `${top}%` }}>
                <button type="button" className="sb" aria-expanded={open === i} aria-label={`Step ${i + 1}: ${x.t}`} onClick={() => setOpen(open === i ? null : i)}>
                  <span className="n">
                    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#3a3fd1" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICO[i]}</svg>
                  </span>
                </button>
                <div className="sl"><b>{x.t}</b></div>
                <div className="sp" role="region" aria-label={x.t}>
                  <h3>{x.t}</h3>
                  <p>{x.d}</p>
                  {x.sv != null && <span className="svp">greenfriend step {x.sv} · {SVN[x.sv]}</span>}
                </div>
              </div>
            );
          })}
        </div>
          <div className="salong below">
            <div className="alh">
              <b>Runs alongside all steps</b>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#ee7b5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v15M6 13l6 6 6-6" /></svg>
            </div>
            {SIDE.map((x) => (
              <div key={x.k} className={`alc ${x.k}`} tabIndex={0}>
                <b>{x.t}</b>
                <div className="sp up" role="region" aria-label={x.t}>
                  <h3>{x.t}</h3>
                  <p>{x.d}</p>
                  {x.ck && <p className="cks"><b>Check-ins:</b> {x.ck.join(" · ")}</p>}
                </div>
              </div>
            ))}
          </div>
      </div>
      <div className="rnotes">
        <div><b>Make it yours</b><p>This is a generic planning guide, not a legal requirement. Length, order and overlap of the blocks depend on your size, your data, your existing assessments and your auditor. Use it as a first draft.</p></div>
      </div>
    </section>
  );
}
