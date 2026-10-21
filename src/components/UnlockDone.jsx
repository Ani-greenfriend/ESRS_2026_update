import { PDF_NAME } from "../lib/pdf.js";

// After an unlock: say what happened and offer "Download again" as a plain link (no pop-up blocker).
export default function UnlockDone({ fresh, onDownload, pdfError, pdfLink }) {
  return (
    <div className="op-done" role="status">
      <p className="op-msg ok">
        {fresh
          ? (pdfError ? "Unlocked. Your one-pager could not be created automatically; use the button below." : "Unlocked. Your one-pager is downloading.")
          : "Your action plan is unlocked."}
      </p>
      <div className="helpbtns">
        {pdfLink
          ? <a className="btn" href={pdfLink} download={PDF_NAME}>{fresh ? "Download again" : "Download"}</a>
          : <button type="button" className="btn" onClick={onDownload}>{fresh ? "Download again" : "Download your one-pager"}</button>}
      </div>
    </div>
  );
}
