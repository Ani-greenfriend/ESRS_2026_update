import { useState } from "react";
import { CASES } from "../lib/data.js";
import { ChapterHead } from "./Icons.jsx";
import { Gated } from "./unlock.jsx";

function Node({ n }) {
  return (
    <div className={`node ${n.cls} ${n.non ? "nonEU" : ""}`}>
      <span className="nm">{n.nm}</span>
      <span className="fig num">{n.fig}</span>
      <span className="st">{n.st}</span>
    </div>
  );
}

export default function Cases() {
  const [cur, setCur] = useState(0);
  const c = CASES[cur];
  const why = (
    <ul className="vlist">
      {c.w.map((x) => (
        <li key={x}>{x}</li>
      ))}
    </ul>
  );
  const caseView = (
        <div className="case">
          <div className="org">
            {c.p.non && <span className="eulabel">Outside the EU</span>}
            <Node n={c.p} />
            {c.k.length > 0 && (
              <>
                <div className="stem" />
                {c.p.non && <span className="eulabel">In the EU</span>}
                <div className="kids">
                  {c.k.map((n) => (
                    <Node key={n.nm} n={n} />
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="why">
            <div className="eyebrow">Why</div>
            {why}
          </div>
        </div>
  );
  return (
    <section className="ch" id="cases">
      <ChapterHead icon="people" eyebrow="Who is in scope · examples" title="Examples: parent, subsidiary or neither?" short="Seven made-up groups. Find the one that looks like yours and see what it means for you." />
      <div className="cases-tabs" role="group" aria-label="Example cases">
        {CASES.map((x, i) => (
          <button type="button" key={x.t} aria-pressed={i === cur} onClick={() => setCur(i)}>
            {x.t}
          </button>
        ))}
      </div>
      {/* Builder request (10 Nov 2026): the first example is open; examples 2 to 7 open with an email (stored as unlock_cases). */}
      {cur === 0 ? caseView : <Gated kind="cases" label="Enter your email address to unlock the other examples.">{caseView}</Gated>}
    </section>
  );
}
