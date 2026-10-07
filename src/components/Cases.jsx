import { useState } from "react";
import { CASES } from "../lib/data.js";
import { Gated, LockIcon, useUnlock } from "./unlock.jsx";

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
  const { unlocked } = useUnlock();
  const [cur, setCur] = useState(0);
  const c = CASES[cur];
  const why = (
    <ul className="vlist">
      {c.w.map((x) => (
        <li key={x}>{x}</li>
      ))}
    </ul>
  );
  return (
    <section className="ch" id="cases">
      <div className="chead">
        <div className="eyebrow">Example cases</div>
        <h2>Parent, subsidiary, or neither?</h2>
        <p className="lede">Seven fictional groups and how the rules land on each entity.</p>
      </div>
      <div className="cases-tabs" role="group" aria-label="Example cases">
        {CASES.map((x, i) => (
          <button type="button" key={x.t} aria-pressed={i === cur} onClick={() => setCur(i)}>
            {x.t}
            {!unlocked && i >= 2 && (<><LockIcon /><span className="sr-only"> (locked)</span></>)}
          </button>
        ))}
      </div>
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
          {cur < 2 ? why : <Gated label="Unlock all seven cases">{why}</Gated>}
        </div>
      </div>
    </section>
  );
}
