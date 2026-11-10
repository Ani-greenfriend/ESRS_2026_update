import { useState } from "react";
import { STAT, TOPICS } from "../lib/data.js";
import { estimate } from "../lib/estimator.js";
import { ChapterHead } from "./Icons.jsx";
import { Gated, useUnlock } from "./unlock.jsx";

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
          </ul>
        </details>
      </div>
    </div>
  );
}

function Bars({ o, n, max, topics }) {
  const base = STAT["ESRS 2"][1] + 31;
  return (
    <div className="bars">
      <div className="bar"><span>2023</span><span className="tr"><i style={{ width: `${(o / max) * 100}%`, background: "var(--sand)" }} /></span><b className="num">{o}</b></div>
      {/* Builder request (6 Nov 2026): revised plus the 31 GDR in one bar, split into two colours. */}
      <div className="bar"><span>Revised + GDR</span><span className="tr split"><i style={{ width: `${(n / max) * 100}%`, background: "var(--olive)" }} /><i className="gdrseg" style={{ width: `${(31 / max) * 100}%` }} /></span><b className="num">{n + 31}</b></div>
      <div className="barkey"><span><i style={{ background: "var(--olive)" }} />Revised {n}</span><span><i className="gdrseg" />GDR 31</span></div>
      {/* Builder request (4 Nov 2026): revised ESRS 2 plus the 31 GDR first, then each ticked topic, then the total. The 31 never enter the bars. */}
      <div className="bdown">
        <div className="brow"><span>ESRS 2 + GDR</span><span className="tnote" /><b className="num">{base}</b></div>
        {topics.map((c) => {
          const name = TOPICS.find((t) => t[0] === c)[1];
          return <div key={c} className="brow"><span><b>{c}</b> {name}</span><span className="tnote" /><b className="num">+{STAT[c][1]}</b></div>;
        })}
        <div className="brow total"><span>Total</span><span className="tnote" /><b className="num">{n + 31}</b></div>
      </div>
    </div>
  );
}

function Estimator({ topics, setTopics }) {
  const e = estimate(topics);
  const { unlocked } = useUnlock();
  const result = (
    <>
      <p className="headline">
        You go from <span className="num">{e.old}</span> to <em className="num">{e.now}</em> mandatory datapoints. That is <em className="num">{e.pct}%</em> fewer.
      </p>
      <Bars o={e.old} n={e.now} max={Math.max(e.old, e.now + 31)} topics={e.topics} />
    </>
  );
  const toggle = (code) => setTopics(topics.includes(code) ? topics.filter((t) => t !== code) : [...topics, code]);
  return (
    <div className="est">
      <div className="estpick">
        <p className="qhelp">Tick the topics that are material for you. ESRS 2 and its GDR always apply.</p>
        <div className="estboxes">
          {/* Builder request (4 Nov 2026): ESRS 2 shown as a fixed, ticked first box; it is always in the count. */}
          <label className="always" title="Always applies">
            <input type="checkbox" checked disabled />{" "}
            <span><b>ESRS 2</b> General disclosures</span>
          </label>
          {/* Builder request (4 Nov 2026): the 31 GDR datapoints as a second fixed box; counted once, outside the percentage. */}
          <label className="always" title="Always applies">
            <input type="checkbox" checked disabled />{" "}
            <span><b>ESRS 2 GDR</b> Policies, actions, targets, metrics</span>
          </label>
          {TOPICS.map(([code, name]) => (
            <label key={code}>
              <input type="checkbox" checked={topics.includes(code)} onChange={() => toggle(code)} />{" "}
              <span><b>{code}</b> {name}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="estout" aria-live="polite">
        {/* Builder request (10 Nov 2026): ESRS 2 + GDR is always shown; the rest of the result opens with an email (stored as unlock_datapoints). */}
        {unlocked ? result : (
          <>
            <div className="bdown open"><div className="brow total"><span>ESRS 2 + GDR</span><span className="tnote">always apply</span><b className="num">{STAT["ESRS 2"][1] + 31}</b></div></div>
            <Gated kind="datapoints" label={e.topics.length ? "Enter your email address to see your full number" : "Tick your topics, then enter your email address to see your full number"} button="Show me">{result}</Gated>
          </>
        )}
          <p className="est-add">
            <b>GDR (General Disclosure Requirements) are the 31 new general datapoints</b> on policies, actions, targets and metrics. They count once, whatever topics you tick, and stay out of the percentage.
          </p>
        <p className="qhelp">
          Your real number also depends on which conditions apply to you.
        </p>
      </div>
    </div>
  );
}


export default function Datapoints({ topics, setTopics }) {
  return (
    <section className="ch" id="datapoints">
      <ChapterHead icon="grid" eyebrow="What: datapoints" title="From 1,052 datapoints to 323" short="Short answer: a lot less to report. Try your own number below." />
      <FactSheet />

      <h3 className="sec-h">Your own number</h3>
      <Estimator topics={topics} setTopics={setTopics} />

    </section>
  );
}
