import { useMemo, useState } from "react";
import { DRS, DRT, PHNAME, PL, STAT, STDS, TOPICS } from "../lib/data.js";
import { estimate } from "../lib/estimator.js";
import { useUnlock, UnlockButton } from "./unlock.jsx";

function DotGrid() {
  // 108 dots, each about 10 datapoints: 29 kept mandatory, 3 new general, 49 removed mandatory, 27 removed voluntary.
  const dots = [...Array(29).fill("keep"), ...Array(3).fill("gdr"), ...Array(49).fill(""), ...Array(27).fill("vol")];
  return (
    <div className="dotgrid" role="img" aria-label="Each dot is about 10 datapoints: 29 mandatory kept, 3 new general, 49 mandatory removed, 27 voluntary removed">
      {dots.map((c, i) => (
        <i key={i} className={c || undefined} />
      ))}
    </div>
  );
}

function FactSheet() {
  return (
    <div className="dp-hero">
      <div>
        <DotGrid />
        <div className="legend">
          <span className="k">Mandatory, kept</span>
          <span className="g">New: policies, actions, targets, metrics</span>
          <span>Mandatory, removed</span>
          <span className="v">Voluntary, removed</span>
        </div>
        <p className="qhelp" style={{ marginTop: 6 }}>Each dot is about 10 datapoints.</p>
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
        <p className="qhelp">* In 2023 the policy, action and target datapoints sat inside each topical standard and EFRAG counted them separately, so the 1,052 excludes them. Like for like, mandatory plus voluntary falls from 1,052 to 292. The Commission's own headline figures are about −60% mandatory and −70% in total.</p>
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
          You go from <span className="num">{e.old}</span> to <em className="num">{e.now}</em> datapoints. That is <em className="num">{e.pct}%</em> fewer.
        </p>
        <Bars o={e.old} n={e.now} u={e.unc} max={e.old} />
        <p className="qhelp">
          ESRS 2 plus {e.topics.length} material topic{e.topics.length === 1 ? "" : "s"}
          {e.topics.length ? ` (${e.topics.join(", ")})` : ""}. Counts from EFRAG's 2026 Draft List, excluding the general datapoints you repeat per policy, action, target and metric. Your real number also depends on which conditions apply to you.
        </p>
      </div>
    </div>
  );
}

const HUB = (
  <a className="hub" href="https://knowledgehub.efrag.org" target="_blank" rel="noopener noreferrer">
    Read the full text in EFRAG’s ESRS Knowledge Hub ↗
  </a>
);

function DrRow({ g }) {
  const t = DRT[g.dr] || ["", ""];
  return (
    <div className="drrow">
      <span className="c">{g.dr}</span>
      <span className="dt"><b>{t[1]}</b><small>{t[0]}</small></span>
      <span className="n num">{g.n} datapoint{g.n === 1 ? "" : "s"}</span>
      <span className="chips">
        {g.c ? <span className="chip cond">{g.c} conditional</span> : null}
        {g.gdr ? <span className="chip tech">+ general policy/action/target datapoints</span> : null}
        {g.tech ? <span className="chip tech">technical</span> : null}
        {g.ph.map((p) => (
          <span key={p} className="chip ph">Phase-in: {p}</span>
        ))}
      </span>
    </div>
  );
}

function StandardPanel({ s }) {
  const { unlocked } = useUnlock();
  const [ph, setPh] = useState(1);
  const [fCond, setFCond] = useState(false);
  const [fq, setFq] = useState("");
  const st = STAT[s.c];

  const groups = useMemo(() => {
    const q = fq.trim().toLowerCase();
    return (DRS[s.k] || [])
      .filter((g) => {
        const t = DRT[g[0]] || ["", ""];
        return !q || `${g[0]} ${t[0]} ${t[1]}`.toLowerCase().includes(q);
      })
      .map((g) => ({ dr: g[0], n: fCond ? g[1] - g[2] : g[1], c: fCond ? 0 : g[2], ph: g[3][ph - 1], gdr: g[4], tech: g[5] }))
      .filter((g) => g.n > 0 || g.gdr > 0);
  }, [s, ph, fCond, fq]);

  let list;
  if (!groups.length) list = <p className="qhelp">No disclosure requirements match.</p>;
  else if (!unlocked) {
    const total = groups.reduce((a, g) => a + g.n, 0);
    list = (
      <>
        {groups.slice(0, 3).map((g) => <DrRow key={g.dr} g={g} />)}
        <div className="dplock">
          <span>See all <b className="num">{groups.length}</b> disclosure requirements and <b className="num">{total}</b> datapoints for {s.c}, with phase-ins and conditions</span>
          <UnlockButton />
        </div>
        {HUB}
      </>
    );
  } else list = (<>{groups.map((g) => <DrRow key={g.dr} g={g} />)}{HUB}</>);

  return (
    <div className="stdpanel">
      <div style={{ display: "grid", gap: 4 }}>
        <div className="eyebrow">{s.c}</div>
        <h3>{s.n}</h3>
      </div>
      {st && (
        <>
          <Bars o={st[0]} n={st[1]} u={st[2]} max={st[0]} />
          <p className="qhelp">{Math.round((1 - st[1] / st[0]) * 100)}% fewer "shall" datapoints than in 2023.</p>
        </>
      )}
      <div className="rows">
        {s.rows.map((r) => (
          <div className="chg" key={r[1]}>
            <span className={`pill ${PL[r[0]][0]}`}>{PL[r[0]][1]}</span>
            <div><b>{r[1]}</b><p className="qhelp" style={{ color: "var(--fg)" }}>{r[2]}</p></div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gap: 10 }}>
        <h3 style={{ fontSize: "1.05rem" }}>Disclosure requirements in {s.c}</h3>
        <div className="dpctl">
          <label htmlFor="phsel">Phase-ins for</label>
          <select id="phsel" value={ph} onChange={(e) => setPh(+e.target.value)}>
            {[1, 2, 3].map((v) => (
              <option key={v} value={v}>{PHNAME[v]}</option>
            ))}
          </select>
          <label><input type="checkbox" checked={fCond} onChange={(e) => setFCond(e.target.checked)} /> Hide conditional</label>
          <input type="search" value={fq} onChange={(e) => setFq(e.target.value)} placeholder="Search, e.g. E1-6 or emissions" aria-label="Search disclosure requirements" />
        </div>
        <div className="drs">{list}</div>
      </div>
    </div>
  );
}

export default function Datapoints({ topics, setTopics }) {
  const [cur, setCur] = useState(2);
  return (
    <section className="ch" id="datapoints">
      <div className="chead">
        <div className="eyebrow">Datapoints</div>
        <h2>From 1,052 datapoints to 323</h2>
        <p className="lede">The 2023 ESRS had 783 mandatory and 269 voluntary datapoints. The revised ESRS keep 292 mandatory ones, delete every voluntary one, and add 31 general datapoints for policies, actions, targets and metrics. Everything that remains still passes through your materiality assessment.</p>
      </div>
      <FactSheet />

      <h3>Your own number</h3>
      <Estimator topics={topics} setTopics={setTopics} />

      <h3>Standard by standard</h3>
      <p className="qhelp">Pick a standard to see the count, what changed, and how many datapoints sit under each disclosure requirement. Requirement titles come from the revised ESRS (Delegated Regulation (EU) 2026/1563); the plain-language summaries are ours. Datapoint counts are derived from EFRAG's draft list (non-authoritative; final list expected end of 2026). For the full text, use EFRAG's ESRS Knowledge Hub.</p>
      <div className="stds">
        {STDS.map((s, i) => {
          const st = STAT[s.c];
          return (
            <button type="button" key={s.c} className="std" aria-pressed={i === cur} onClick={() => setCur(i)}>
              <span className="code">{s.c}</span>
              <span className="nm">{s.n}</span>
              <span className="num" style={{ fontSize: ".85rem" }}>
                {st ? (<><span style={{ color: "var(--muted)", textDecoration: "line-through" }}>{st[0]}</span> → <b>{st[1]}</b></>) : "31 per item"}
              </span>
              <span className={`tag ${s.tag === "Phase-in" ? "ph" : ""}`}>{s.tag}</span>
            </button>
          );
        })}
      </div>
      <StandardPanel s={STDS[cur]} />
    </section>
  );
}
