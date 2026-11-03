import { useUnlock } from "./unlock.jsx";
import UnlockForm from "./UnlockForm.jsx";
import UnlockDone from "./UnlockDone.jsx";
import Icon from "./Icons.jsx";
import { PDF_NAME } from "../lib/pdf.js";

const TILES = [
  ["Scope", "Your answers, whether and from when you report, and what it means for you."],
  ["FY2026 route options", "Routes A, B and C and when each one fits."],
  ["Datapoints", "Your number, current ESRS against the revised ESRS, per topic you selected."],
  ["Dates to plan around", "The timeline from Omnibus I to FY2027, in one line."],
];

// "Your results, as one PDF" (spec v2.4): four tiles that match the PDF, the format line, a live status list and the form;
// after an unlock the "Take your results with you" box with one Download PDF button (CLAUDE.md v2.4, Export).
export default function UnlockSection({ snap, formProps, done }) {
  const { unlocked } = useUnlock();
  const e = snap.est;
  return (
    <section className="ch" id="onepager">
      <div className="op">
        <div className="op-text">
          <div className="eyebrow"><Icon name="doc" />Your PDF</div>
          <h2>Your results, as one PDF</h2>
          <p className="lede">Work through the checker and the guide above, then take everything away on one page. Free, just your email.</p>
          <p className="optitle"><b>What is in your PDF</b></p>
          <div className="optiles">
            {TILES.map(([t, d], i) => (
              <div key={t}><b>{i + 1}</b><span><strong>{t}</strong><small>{d}</small></span></div>
            ))}
          </div>
          <p className="optitle fmt">One page, A2 landscape, ready to print or forward to your CFO or board. The 2027 roadmap stays in the tool above. It includes a short disclaimer on liability, sources and AI use.</p>
          <ul className="op-list" id="op-status">
            <li className={snap.scope ? "done" : undefined}>
              {snap.scope
                ? <>Scope: <b>{snap.scope.badge}</b>. Your answers go into the PDF.</>
                : <>Scope check not finished: your PDF will show a general guide. <a href="#scope">Finish it</a></>}
            </li>
            <li className={e.state === "own" ? "done" : undefined}>
              {e.state === "own"
                ? <>Datapoints: <b>{e.old} → {e.now}</b> for {e.codes.length} topic{e.codes.length === 1 ? "" : "s"}</>
                : <>Topics not selected: your PDF will show the full range, 57 to 292. <a href="#datapoints">Select your topics</a></>}
            </li>
          </ul>
        </div>
        {unlocked ? <UnlockDone {...done} /> : <UnlockForm id="op" className="op-form" {...formProps} />}
      </div>
      {unlocked && (
        <div className="deckbox">
          <div>
            <h3>Take your results with you</h3>
            <p>One page, A2 landscape, with your scope, route options, datapoints and the dates to plan around. Forward it to your CFO or board.</p>
          </div>
          <div className="deckbtns">
            {done.pdfLink
              ? <a className="btn pri" href={done.pdfLink} download={PDF_NAME}>Download PDF</a>
              : <button type="button" className="btn pri" onClick={done.onDownload}>Download PDF</button>}
          </div>
        </div>
      )}
    </section>
  );
}
