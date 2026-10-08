import { OPT, PQ } from "../lib/data.js";
import { routeResult } from "../lib/route.js";
import Planes from "./Planes.jsx";
import { Gated } from "./unlock.jsx";
import { ChapterHead } from "./Icons.jsx";

// Highest possible score: the best option of every question (bar scale "Matches your answers").
const MAX_SCORE = PQ.reduce((a, q) => a + Math.max(...q.o.map((o) => Math.max(...o[2]))), 0);
const EFFORT = ["", "low", "medium", "high"];

function RouteCard({ o, best, score }) {
  return (
    <div className={`o3 ${best ? "best" : ""}`}>
      {best && <span className="bestlbl">Looks best for you</span>}
      <span className="src" tabIndex={0} data-ftip={`Source: Delegated Regulation (EU) 2026/1563, ${o.src}`} aria-label={`Source: Delegated Regulation (EU) 2026/1563, ${o.src}`}>i</span>
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
      <p className="mean"><b>Best if</b> {o.bi}</p>
      {o.more && (
        <details className="o3more">
          <summary>The eight shortcuts</summary>
          <p>{o.more.replace(/^The eight shortcuts, with their ESRS 1 paragraph: /, "")}</p>
        </details>
      )}
      <div className="fit">
        <small>Matches your answers</small>
        <div className="meter" role="img" aria-label={`Fit ${score} of ${MAX_SCORE}`}>
          <i style={{ width: `${(score / MAX_SCORE) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}

export default function Fy2026({ route, setRoute }) {
  const { P } = route;
  const r = routeResult(P);
  const pick = (id, v) => {
    if (P[id] === v) return;
    setRoute({ P: { ...P, [id]: v }, touched: true });
  };
  return (
    <section className="ch" id="fy2026">
      <ChapterHead icon="signpost" eyebrow="Your 2026 report" title="Which route should you take for your 2026 report?" short="You pick one of three routes for your 2026 reporting year, and say in the report which one you used." />
      <div className="opts3">
        {OPT.map((o, i) => <RouteCard key={o.L} o={o} best={i === r.best} score={r.scores[i]} />)}
      </div>
      <div className="pick">
        <div className="eyebrow">Seven quick questions · example answers pre-filled</div>
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
