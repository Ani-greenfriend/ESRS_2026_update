import { Q } from "../lib/data.js";
import { answerLines, nextQuestion, totalSteps, verdict } from "../lib/scope.js";
import { Gated } from "./unlock.jsx";
import { ChapterHead } from "./Icons.jsx";

function Answers({ hist, A }) {
  return (
    <div className="answers">
      {answerLines(hist, A).map(([q, a]) => (
        <span key={q}>{q} <b>{a}</b></span>
      ))}
    </div>
  );
}

export default function ScopeCheck({ scope, setScope }) {
  const { A, hist } = scope;
  const k = nextQuestion(A);
  const answer = (key, v) => setScope({ A: { ...A, [key]: v }, hist: [...hist, key] });
  const back = () => {
    const h = hist.slice(0, -1);
    const a = { ...A };
    delete a[hist[hist.length - 1]];
    setScope({ A: a, hist: h });
  };
  const reset = () => setScope({ A: {}, hist: [] });

  let qbox;
  if (!k) {
    qbox = (
      <>
        <div className="qstep">Done</div>
        <div className="qprog"><i style={{ width: "100%" }} /></div>
        <p className="qtext">Your reading is on the right.</p>
        <div className="qnav">
          <button type="button" className="btn" onClick={back}>Back</button>
          <button type="button" className="btn" onClick={reset}>Start again</button>
        </div>
      </>
    );
  } else {
    const q = Q[k];
    const n = hist.length + 1;
    const of = Math.max(n, totalSteps(A));
    qbox = (
      <>
        <div className="qstep num">Question {n} of {of}</div>
        <div className="qprog"><i style={{ width: `${((n - 1) / of) * 100}%` }} /></div>
        <p className="qtext">{q.q}</p>
        {q.h && <p className="qhelp">{q.h}</p>}
        <div className="opts">
          {q.o.map((o) => (
            <button type="button" key={o[0]} className="opt" onClick={() => answer(k, o[0])}>
              <b>{o[1]}</b>
              {o[2] && <span>{o[2]}</span>}
            </button>
          ))}
        </div>
        {hist.length > 0 && (
          <div className="qnav">
            <button type="button" className="btn" onClick={back}>Back</button>
            <button type="button" className="btn" onClick={reset}>Start again</button>
          </div>
        )}
      </>
    );
  }

  const v = verdict(A);
  return (
    <section className="ch" id="scope">
      <ChapterHead icon="target" eyebrow="Check your scope" title="Are you in? Let us check" short="Up to six questions. Parents: use group figures." />
      <div className="quiz">
        <div className="qbox" aria-live="polite">{qbox}</div>
        <div className="rbox">
          {!v ? (
            <>
              <div className="eyebrow">Your reading</div>
              <p className="qhelp">Answer the questions to see whether you report, from which year, and what to do next.</p>
              <Answers hist={hist} A={A} />
            </>
          ) : (
            <>
              <div className="verdict">
                <span className={`vbadge ${v.c}`}>{v.b}</span>
                <h3>{v.h}</h3>
                <Gated label="Why, and your next steps">
                  <ul className="vlist">
                    {v.l.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </Gated>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {v.fy && <a href="#fy2026" className="btn pri" style={{ textDecoration: "none" }}>Pick your FY2026 route</a>}
                  <a href="#onepager" className="btn pdfbtn" style={{ textDecoration: "none" }}>Get this as a PDF</a>
                </div>
              </div>
              <Answers hist={hist} A={A} />
              <p className="qhelp">Indicative only. National transposition is due by 19 March 2027.</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
