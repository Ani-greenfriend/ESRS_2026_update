import { Q } from "../lib/data.js";
import { answerLines, nextQuestion, totalSteps, verdict } from "../lib/scope.js";

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
    <section id="scope" className="coverquiz" aria-label="Check your scope">
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
                {/* Builder request (3 Nov 2026): the result shows in full here, with no lock and no buttons. */}
                <ul className="vlist">
                  {v.l.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
                <p className="vnext">Run through this one-pager and download your personalized PDF below.</p>
              </div>
              <Answers hist={hist} A={A} />
              <p className="qhelp">Indicative only. National transposition is due by 19 March 2027.</p>
            </>
          )}
          {A.hq === "non" && <p className="qhelp nonhint">Your three-question guide for non-EU groups is right below.</p>}
        </div>
      </div>
    </section>
  );
}
