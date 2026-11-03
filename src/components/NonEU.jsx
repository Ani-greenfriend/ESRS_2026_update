import { ChapterHead } from "./Icons.jsx";

// Builder request (3 Nov 2026): "Outside the EU? Two ways in" replaces the hidden three-question stepper.
// Always visible, directly under "Who reports when".
const ROUTES = [
  {
    k: "r1",
    tag: "Route 1",
    fy: "FY2027",
    h: "Your EU subsidiary reports",
    tests: ["> 1,000 employees", "> €450M net turnover"],
    note: "Same thresholds as EU companies, tested on the subsidiary itself.",
  },
  {
    k: "r2",
    tag: "Route 2 · Article 40a",
    fy: "FY2028",
    h: "Your EU entity reports for the group",
    tests: ["> €450M net turnover in the EU in each of the last 2 consecutive financial years", "EU subsidiary > €200M, or qualifying EU branch > €200M"],
    note: "Different thresholds. No employee threshold applies.",
  },
];

export default function NonEU() {
  return (
    <section className="ch" id="noneu">
      <ChapterHead icon="globe" eyebrow="Non-EU groups" title="Outside the EU? Two ways in" short="A non-EU group can fall under both routes. Check both." />
      <div className="ways">
        {ROUTES.map((r) => (
          <div key={r.k} className={`way2 ${r.k}`}>
            <div className="w2tag">{r.tag}</div>
            <div className="w2fy">{r.fy}</div>
            <h3>{r.h}</h3>
            <div className="w2tests">
              {r.tests.map((t) => <div key={t}>{t}</div>)}
            </div>
            <p className="w2note">{r.note}</p>
          </div>
        ))}
      </div>
      <details className="hov w2more">
        <summary>Good to know</summary>
        <ul>
          <li>Route 1: the EU subsidiary can be exempt if the non-EU parent voluntarily publishes a consolidated report under the full ESRS (or an equivalent standard) that covers it.</li>
          <li>Route 2: dedicated standards for non-EU groups are expected from October 2027 at the earliest. Financial holding undertakings can opt out.</li>
        </ul>
      </details>
      <p className="advice"><b>Our tip</b> Start with your EU subsidiary. Its deadline comes first (FY2027). Not sure where you stand? Run the <a href="#scope">scope check</a> above or <a href={`mailto:anikalerch@greenfriend.org?subject=${encodeURIComponent("ESRS update check: non-EU group")}`}>email us</a>.</p>
    </section>
  );
}
