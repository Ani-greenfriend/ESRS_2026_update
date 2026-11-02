import { PDF_NAME } from "../lib/pdf.js";

// After an unlock (v2.4): a short confirmation and one Download PDF button, a plain link to the ready-built PDF (no pop-up blocker).
export default function UnlockDone({ fresh, onDownload, pdfError, pdfLink }) {
  return (
    <div className="op-done" role="status">
      <p className={`op-msg ${pdfError ? "err" : "ok"}`}>
        {pdfError ? "Your PDF could not be created automatically; use the button below." : fresh ? "Your PDF is ready." : "Your details on this page are open."}
      </p>
      <div className="helpbtns">
        {pdfLink
          ? <a className="btn pri" href={pdfLink} download={PDF_NAME}>Download PDF</a>
          : <button type="button" className="btn pri" onClick={onDownload}>Download PDF</button>}
      </div>
    </div>
  );
}
