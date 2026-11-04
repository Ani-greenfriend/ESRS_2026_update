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

// "Your results, as one PDF" (spec v2.4): four tiles that match the PDF, the format line and the form (no status list, builder request 3 Nov 2026);
// after an unlock the "Take your results with you" box with one Download PDF button (CLAUDE.md v2.4, Export).
export default function UnlockSection({ snap, formProps, done, fromTop, onBack }) {
  const { unlocked } = useUnlock();
  return (
    <section className="ch" id="onepager">
      {/* Builder request (4 Nov 2026): after the cover's "Get your free PDF" jump, one arrow back up to the first section below the cover. */}
      {fromTop && (
        <a className="backup" href="#who" onClick={onBack}>
          <span aria-hidden="true">↑</span> Back to the start of the guide
        </a>
      )}
      <div className="op op-hero">
        <div className="op-text">
          <div className="eyebrow"><Icon name="doc" />Your PDF</div>
          <h2>Your results, as one PDF</h2>
          <p className="lede short">Work through the page above, enter your email address and download your free overview for 2027!</p>
        </div>
        {unlocked ? <UnlockDone {...done} /> : <UnlockForm id="op" className="op-form" {...formProps} />}
      </div>
      {/* Builder request (3 Nov 2026): the PDF contents sit below the card, small and folded. */}
      <details className="op-more">
        <summary>What is in your PDF</summary>
        <div className="optiles">
          {TILES.map(([t, d], i) => (
            <div key={t}><b>{i + 1}</b><span><strong>{t}</strong><small>{d}</small></span></div>
          ))}
        </div>
        <p className="optitle fmt">One page, A2 landscape, ready to print or forward to your CFO or board. The 2027 roadmap stays in the tool above. It includes a short disclaimer on liability, sources and AI use.</p>
      </details>
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
