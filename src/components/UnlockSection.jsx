import { useUnlock } from "./unlock.jsx";
import UnlockForm from "./UnlockForm.jsx";
import UnlockDone from "./UnlockDone.jsx";

export default function UnlockSection({ snap, formProps, done }) {
  const { unlocked } = useUnlock();
  return (
    <section className="ch" id="onepager">
      <div className="op">
        <div className="op-text">
          <div className="eyebrow">Your action plan</div>
          <h2>Unlock your full action plan</h2>
          <p className="lede">See every detail of your result and get it as a one-page PDF for your CFO, auditor or board. One email unlocks everything.</p>
          <ul className="op-list op-what">
            <li className="done">Your full scope result and next steps</li>
            <li className="done">The reasons behind your FY2026 route</li>
            <li className="done">Every disclosure requirement for your material topics, with datapoint counts and phase-ins</li>
            <li className="done">All seven example group cases</li>
            <li className="done">Your one-page PDF</li>
          </ul>
          <ul className="op-list">
            <li className={snap.scope ? "done" : undefined}>
              {snap.scope ? (<>Scope: <b>{snap.scope.badge}</b></>) : (<>Scope check not finished yet. <a href="#scope">Finish it</a></>)}
            </li>
            <li className={snap.route.fromExample ? undefined : "done"}>
              FY2026 route: <b>{snap.route.label}</b>
              {snap.route.fromExample && (<> (example answers, <a href="#fy2026">adjust</a>)</>)}
            </li>
            <li className="done">Datapoints: <b>{snap.est.old} → {snap.est.now}</b></li>
          </ul>
        </div>
        {unlocked ? <UnlockDone {...done} /> : <UnlockForm id="op" className="op-form" {...formProps} />}
      </div>
    </section>
  );
}
