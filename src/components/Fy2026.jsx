import { OPT } from "../lib/data.js";
import { ChapterHead } from "./Icons.jsx";

const EFFORT = ["", "low", "medium", "high"];

// Spec v2.0+: three fixed route cards, no questionnaire, no scoring, nothing locked.
function RouteCard({ o }) {
  const src = `Source: Delegated Regulation (EU) 2026/1563, ${o.src}`;
  return (
    <div className="o3">
      <span className="src" tabIndex={0} data-ftip={src} aria-label={src}>i</span>
      <span className="L">{o.L}</span>
      <h3>{o.t}</h3>
      <small className="std2">{o.std}</small>
      <p>{o.d}</p>
      <div className="eff">
        <small>Effort now</small>
        <span className="dots" role="img" aria-label={EFFORT[o.eff]}>
          {[1, 2, 3].map((n) => <i key={n} className={n <= o.eff ? "on" : undefined} />)}
        </span>
      </div>
      <p className="mean"><b>Fits if</b> {o.bi}</p>
      {o.more && (
        <details className="o3more">
          <summary>The eight shortcuts</summary>
          <p>{o.more}</p>
        </details>
      )}
    </div>
  );
}

export default function Fy2026() {
  return (
    <section className="ch" id="fy2026">
      <ChapterHead icon="signpost" eyebrow="Your 2026 report" title="Three routes for your 2026 report" short="The delegated rules let you choose how to report FY2026. Pick one and say in your report which you used." />
      <div className="opts3">
        {OPT.map((o) => <RouteCard key={o.L} o={o} />)}
      </div>
      <p className="tip"><b>Good to know</b> Pre-Omnibus ESRS are the 2023 standards you used for FY2025 (as amended in 2025). Revised ESRS are the new, slimmer ones. From FY2027 the revised ESRS are mandatory for everyone in scope.</p>
      <p className="advice"><b>Our tip</b> Starting with ESRS now? Route C is usually the natural fit: you have no 2025 report to compare with, so you can begin on the slimmer standards. Whichever route you choose, agree it with your auditor early.</p>
      <details className="srcbox hov">
        <summary>Where this comes from</summary>
        <p>All three routes come from one legal text: Delegated Regulation (EU) 2026/1563 (Official Journal, 21 September 2026, in force from 10 November 2026). Article 2 sets the choice for FY2026.</p>
        <ul>
          <li><b>Route A and C</b> Article 2(1)(a): report FY2026 under the Pre-Omnibus ESRS (A) or the Revised ESRS (C).</li>
          <li><b>Route B</b> Article 2(1)(b): Pre-Omnibus ESRS plus up to eight reliefs, taken from ESRS 1 paragraphs 27, 32-33, 74-75, 90, 91, 92, 106 and 110.</li>
          <li><b>All routes</b> Article 2(2): state in your report which version you applied. Article 3: the Revised ESRS apply to all in scope from financial years starting on or after 1 January 2027.</li>
        </ul>
        <p className="srcnote"><b>Scope and dates</b> Who is in scope comes from the Omnibus I Directive (EU) 2026/470. Datapoint counts come from EFRAG's 2026 draft list and explanatory note.</p>
      </details>
    </section>
  );
}
