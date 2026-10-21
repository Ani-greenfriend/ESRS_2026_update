import { useState } from "react";
import { TOPICS } from "../lib/data.js";
import { estimate } from "../lib/estimator.js";
import { Gated } from "./unlock.jsx";
import { ChapterHead } from "./Icons.jsx";

function DotGrid({ hl }) {
  // 108 dots, each about 10 datapoints: 29 kept mandatory, 3 new general, 49 removed mandatory, 27 removed voluntary.
  const dots = [...Array(29).fill("keep"), ...Array(3).fill("gdr"), ...Array(49).fill(""), ...Array(27).fill("vol")];
  return (
    <div className={`dotgrid${hl ? " f" : ""}`} role="img" aria-label="Each dot is about 10 datapoints: 29 mandatory kept, 3 new general, 49 mandatory removed, 27 voluntary removed">
      {dots.map((c, i) => (
        <i key={i} className={[c, hl && (c || "rm") === hl ? "on" : ""].filter(Boolean).join(" ") || undefined} />
      ))}
    </div>
  );
}

const LEGEND = [
  ["k", "keep", "Mandatory ('shall') datapoints that stay in the revised ESRS.", "Kept (292)"],
  ["g", "gdr", "New general datapoints, repeated for each policy, action, target or metric you report.", "New (31)"],
  ["r", "rm", "Mandatory datapoints in the 2023 ESRS that are deleted.", "Mandatory, removed (491)"],
  ["v", "vol", "Voluntary ('may') datapoints of 2023. All are deleted.", "Voluntary, removed (269)"],
];

function FactSheet() {
  const [hl, setHl] = useState(null);
  return (
    <div className="dp-hero">
      <div>
        <DotGrid hl={hl} />
        <div className="legend">
          {LEGEND.map(([cls, key, tip, label]) => (
            <span key={key} className={cls} tabIndex={0} data-tip={tip}
              onMouseEnter={() => setHl(key)} onMouseLeave={() => setHl(null)} onFocus={() => setHl(key)} onBlur={() => setHl(null)}>
              {label}
            </span>
          ))}
        </div>
        <p className="qhelp" style={{ marginTop: 6 }}>One dot ≈ 10 datapoints. Hover a label to highlight it.</p>
      </div>
      <div className="buckets">
        <table>
          <thead>
            <tr><th>Bucket</th><th className="r">ESRS 2023</th><th className="r">Revised</th></tr>
          </thead>
          <tbody>
            <tr><td>Mandatory <span className="tag">"shall"</span></td><td className="r num">783</td><td className="r num"><b>292</b></td></tr>
            <tr className="sub"><td>of which apply whenever the topic is material</td><td className="r num">–</td><td className="r num">195</td></tr>
            <tr><td>Voluntary <span className="tag">"may"</span></td><td className="r num">269</td><td className="r num"><b>0</b></td></tr>
            <tr><td>Policies, actions, targets, metrics <span className="sub2">repeated per item you report</span></td><td className="r num muted">separate*</td><td className="r num"><b>31</b></td></tr>
            <tr className="tot"><td>Total</td><td className="r num">1,052*</td><td className="r num">323</td></tr>
          </tbody>
        </table>
        <div className="bigfig">
          <div><small>Mandatory</small><strong className="num" id="fig-pct">−63%</strong></div>
          <div><small>Mandatory + voluntary</small><strong className="num">−72%</strong></div>
        </div>
        <p className="tip"><b>Good to know</b> * The 2023 count excludes the policy, action and target datapoints, which sat inside each topic.</p>
        <details className="numnote">
          <summary>Why the numbers differ between sources</summary>
          <ul>
            <li><b>323 = 292 + 31.</b> All counts come from EFRAG's 2026 draft list and explanatory note. Other sources may use a different stage or basis.</li>
            <li><b>More rows in EFRAG's sheet.</b> 30 heading rows (3 per topic) and 6 technical rows are not disclosures, so we skip them. E1: 87 rows, 84 datapoints.</li>
            <li><b>Percentages.</b> 783 → 292 = −63%. 1,052 → 292 = −72%. 1,052 → 323 = −69%.</li>
          </ul>
        </details>
      </div>
    </div>
  );
}

function Bars({ o, n, u, max }) {
  return (
    <div className="bars">
      <div className="bar"><span>2023</span><span className="tr"><i style={{ width: `${(o / max) * 100}%`, background: "var(--sand)" }} /></span><b className="num">{o}</b></div>
      <div className="bar"><span>Revised</span><span className="tr"><i style={{ width: `${(n / max) * 100}%`, background: "var(--olive)" }} /></span><b className="num">{n}</b></div>
      <div className="bar"><span>Unconditional</span><span className="tr"><i style={{ width: `${(u / max) * 100}%`, background: "var(--terra)" }} /></span><b className="num">{u}</b></div>
    </div>
  );
}

function Estimator({ topics, setTopics }) {
  const e = estimate(topics);
  const toggle = (code) => setTopics(topics.includes(code) ? topics.filter((t) => t !== code) : [...topics, code]);
  return (
    <div className="est">
      <div className="estpick">
        <p className="qhelp">Tick the topics that are material for you. ESRS 2 always applies.</p>
        <div className="estboxes">
          {TOPICS.map(([code, name]) => (
            <label key={code}>
              <input type="checkbox" checked={topics.includes(code)} onChange={() => toggle(code)} />{" "}
              <span><b>{code}</b> {name}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="estout" aria-live="polite">
        <p className="headline">
          You go from <span className="num">{e.old}</span> to <em className="num">{e.now}</em> mandatory datapoints. That is <em className="num">{e.pct}%</em> fewer. Nice.
        </p>
        <Gated label="See your full datapoint breakdown">
          <Bars o={e.old} n={e.now} u={e.unc} max={e.old} />
          <p className="est-add">
            <b>Plus 31 general datapoints</b> on policies, actions, targets and metrics. They apply whatever topics you tick, so your total is <b className="num">{e.now + 31}</b> ({e.now} + 31). With all ten topics ticked that is 323, the headline figure above.
          </p>
        </Gated>
        <p className="qhelp">
          ESRS 2 plus {e.topics.length} material topic{e.topics.length === 1 ? "" : "s"}
          {e.topics.length ? ` (${e.topics.join(", ")})` : ""}. Counts from EFRAG's 2026 Draft List. Your real number also depends on which conditions apply to you.
        </p>
      </div>
    </div>
  );
}

const GDR = [
  ["P", "Policies", "What rules do you have?", ["What it says", "Who it covers", "Standards followed", "Human rights policy"]],
  ["A", "Actions", "What are you doing about it?", ["What and when", "Where", "Expected result", "Money involved"]],
  ["M", "Metrics", "How do you measure it?", ["Number and unit", "How calculated", "Data sources", "Change over time"]],
  ["T", "Targets", "Where do you want to get to?", ["Target level", "Baseline and year", "Milestones", "Methods used"]],
];

export default function Datapoints({ topics, setTopics }) {
  return (
    <section className="ch" id="datapoints">
      <ChapterHead icon="grid" eyebrow="Datapoints" title="From 1,052 datapoints to 323" short="Short answer: a lot less to report. Try your own number below." />
      <FactSheet />

      <h3>Your own number</h3>
      <Estimator topics={topics} setTopics={setTopics} />

      <h3>What are the 31 general datapoints?</h3>
      <p className="qhelp">Four questions you answer for every material topic. Together they make up the 31.</p>
      <div className="gdr4">
        {GDR.map(([l, h, q, chips]) => (
          <div key={l}>
            <span className="gl" aria-hidden="true">{l}</span>
            <h4>{h}</h4>
            <p className="gq">{q}</p>
            <div className="chips2">{chips.map((c) => <span key={c}>{c}</span>)}</div>
          </div>
        ))}
      </div>
      <p className="tip"><b>Good to know</b> You report these points each time you cover a policy, action, metric or target for a material topic. EFRAG's draft list counts 31 in total; we show what they consist of, not the single datapoints. Source: revised ESRS 2, GDR-P, GDR-A, GDR-M and GDR-T (Delegated Regulation (EU) 2026/1563).</p>
    </section>
  );
}
