// After an unlock (v2.4): a short confirmation; the one Download PDF button sits in the "Take your results with you" box
// below. In the dialog (no box there) the button shows here.
import { PDF_NAME } from "../lib/pdf.js";

export default function UnlockDone({ fresh, onDownload, pdfError, pdfLink, withButton = false }) {
  return (
    <div className="op-done" role="status">
      <p className={`op-msg ${pdfError ? "err" : "ok"}`}>
        {pdfError ? "Your PDF could not be created automatically; use the Download PDF button." : fresh ? "Your PDF is ready." : "Your details on this page are open."}
      </p>
      {withButton && (
        <div className="helpbtns">
          {pdfLink
            ? <a className="btn pri" href={pdfLink} download={PDF_NAME}>Download PDF</a>
            : <button type="button" className="btn pri" onClick={onDownload}>Download PDF</button>}
        </div>
      )}
    </div>
  );
}
