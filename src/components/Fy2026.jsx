import { OPT } from "../lib/data.js";
import { ChapterHead } from "./Icons.jsx";

// Spec v2.0+: three fixed route cards, no questionnaire, no scoring, nothing locked. No effort dots (builder request, 3 Nov 2026).
function RouteCard({ o }) {
  const src = `Source: Delegated Regulation (EU) 2026/1563, ${o.src}`;
  return (
    <div className="o3">
      <span className="src" tabIndex={0} data-ftip={src} aria-label={src}>i</span>
      <span className="L">{o.L}</span>
      <h3>{o.t}</h3>
      <small className="std2">{o.std}</small>
      <p>{o.d}</p>
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
      <ChapterHead icon="signpost" eyebrow="Which standard" title="Which standards for your 2026 report? You choose" short="We see most companies switch to the revised ESRS early, but you have the option. Compare the three routes and say in your report which one you used." />
      <div className="opts3">
        {OPT.map((o) => <RouteCard key={o.L} o={o} />)}
      </div>
      <div className="fynotes">
      <p className="advice"><b>Our tip</b> Starting with ESRS now? Route C is usually the natural fit: you have no 2025 report to compare with, so you can begin on the slimmer standards. Whichever route you choose, agree it with your auditor early.</p>
      </div>
    </section>
  );
}
