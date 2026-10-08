import { useUnlock } from "./unlock.jsx";
import UnlockForm from "./UnlockForm.jsx";
import UnlockDone from "./UnlockDone.jsx";
import Icon from "./Icons.jsx";

export default function UnlockSection({ snap, formProps, done }) {
  const { unlocked } = useUnlock();
  return (
    <section className="ch" id="onepager">
      <div className="op">
        <div className="op-text">
          <div className="eyebrow"><Icon name="doc" />Your action plan</div>
          <h2>Want it all on one page?</h2>
          <p className="lede">Everything below, plus a one-page PDF for your CFO or board. Free, just your email.</p>
          <div className="optiles">
            <div><b>1</b><span>Scope result</span></div>
            <div><b>2</b><span>FY2026 route</span></div>
            <div><b>3</b><span>All requirements</span></div>
            <div><b>4</b><span>One-page PDF</span></div>
          </div>
          <ul className="op-list" id="op-status">
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
