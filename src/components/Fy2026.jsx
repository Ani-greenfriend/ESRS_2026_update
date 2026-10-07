import { OPT, PQ } from "../lib/data.js";
import { routeResult } from "../lib/route.js";
import Planes from "./Planes.jsx";
import { Gated } from "./unlock.jsx";

export default function Fy2026({ route, setRoute }) {
  const { P, touched } = route;
  const r = routeResult(P);
  const max = Math.max(...r.scores);
  const pick = (id, v) => {
    if (P[id] === v) return;
    setRoute({ P: { ...P, [id]: v }, touched: true });
  };
  return (
    <section className="ch" id="fy2026">
      <div className="chead">
        <div className="eyebrow">FY2026 options</div>
        <h2>Which route for your FY2026 report?</h2>
        <p className="lede">For a financial year starting in 2026, companies in scope choose one of three routes (Article 2 of the delegated act of 3 July 2026). Whichever you pick, the report must state which version you applied.</p>
      </div>
      <div className="opts3">
        {OPT.map((o, i) => (
          <div key={o.L} className={`o3 ${i === r.best ? "best" : ""}`}>
            {i === r.best && <span className="bestlbl">Best fit</span>}
            <span className="L">{o.L}</span>
            <h3>{o.t}</h3>
            <p>{o.d}</p>
            <div className="meter" role="img" aria-label={`Fit score ${r.scores[i]}`}>
              <i style={{ width: `${max ? (r.scores[i] / max) * 100 : 0}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="pick">
        <div className="eyebrow">Seven quick questions · {touched ? "your answers" : "example answers pre-filled"}</div>
        {PQ.map((q) => (
          <div className="pq" key={q.id}>
            <span className="q" id={`pq-${q.id}`}>{q.q}</span>
            <div className="seg" role="group" aria-labelledby={`pq-${q.id}`}>
              {q.o.map((o) => (
                <button type="button" key={o[0]} aria-pressed={P[q.id] === o[0]} onClick={() => pick(q.id, o[0])}>
                  {o[1]}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="pickres" aria-live="polite">
        <Planes set={["p1", "p2", "p3"]} />
        <div className="eyebrow" style={{ color: "var(--olive)" }}>Recommendation</div>
        <h3>{r.label}</h3>
        <Gated label="The reasons behind your route">
          <ul>
            {r.reasons.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </Gated>
        <p className="qhelp">This recommendation is our reading of your answers, not a legal requirement. Whichever route you choose, state clearly in the report which version you applied, and agree it with your auditor early.</p>
      </div>
    </section>
  );
}
