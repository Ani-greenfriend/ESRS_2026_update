import { useUnlock } from "./unlock.jsx";
import UnlockForm from "./UnlockForm.jsx";
import UnlockDone from "./UnlockDone.jsx";
import Icon from "./Icons.jsx";
import { PDF_NAME } from "../lib/pdf.js";

// "Want it all on one page?" (spec v2.3): four squares, a status list, the form; once unlocked, the
// "Take your results with you" box with one Download PDF button.
export default function UnlockSection({ snap, formProps, done }) {
  const { unlocked } = useUnlock();
  return (
    <section className="ch" id="onepager">
      <div className="op">
        <div className="op-text">
          <div className="eyebrow"><Icon name="doc" />Your action plan</div>
          <h2>Want it all on one page?</h2>
          <p className="lede">The full picture behind each answer, plus a one-page PDF for your CFO or board. Free, just your email.</p>
          <div className="optiles">
            <div><b>1</b><span>Scope reasons and next steps</span></div>
            <div><b>2</b><span>Datapoint breakdown</span></div>
            <div><b>3</b><span>All seven example cases</span></div>
            <div><b>4</b><span>One-page PDF with your roadmap</span></div>
          </div>
          <ul className="op-list" id="op-status">
            <li className={snap.scope ? "done" : undefined}>
              {snap.scope ? (<>Scope: <b>{snap.scope.badge}</b></>) : (<>Scope check not finished yet. <a href="#scope">Finish it</a></>)}
            </li>
            <li className="done">Datapoints: <b>{snap.est.old} → {snap.est.now}</b></li>
            <li className="done">Roadmap: <b>{snap.map.label}</b></li>
          </ul>
        </div>
        {unlocked ? <UnlockDone {...done} /> : <UnlockForm id="op" className="op-form" {...formProps} />}
      </div>
      {unlocked && (
        <div className="deckbox">
          <div>
            <h3>Take your results with you</h3>
            <p>One square page with your scope, route options, datapoints and 2027 roadmap. Forward it to your CFO or board.</p>
          </div>
          <div className="deckbtns">
            {done.pdfLink
              ? <a className="btn pri" href={done.pdfLink} download={PDF_NAME}>Download PDF</a>
              : <button type="button" className="btn pri" onClick={done.onDownload}>Download PDF</button>}
          </div>
          {done.pdfError && <p className="op-msg err" role="status">The PDF could not be created. Please try again.</p>}
        </div>
      )}
    </section>
  );
}
