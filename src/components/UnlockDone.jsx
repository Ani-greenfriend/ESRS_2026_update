import { PDF_NAME } from "../lib/pdf.js";

// After an unlock: say what happened and offer the PDF as plain links, so it can be opened
// in a new tab (no pop-up blocker) or saved again, whatever the browser did with the automatic download.
export default function UnlockDone({ fresh, onDownload, pdfError, pdfLink }) {
  return (
    <div className="op-done" role="status">
      <p className="op-msg ok">
        {fresh
          ? (pdfError ? "Unlocked. Your one-pager could not be created automatically; use the button below." : "Unlocked. Your one-pager is downloading.")
          : "Your action plan is unlocked."}
      </p>
      {fresh && !pdfError && <p className="op-note">Saved to your downloads folder. You can also open it here.</p>}
      <div className="helpbtns">
        {pdfLink ? (
          <>
            <a className="btn pri" href={pdfLink} target="_blank" rel="noopener">Open your one-pager (PDF)</a>
            <a className="btn" href={pdfLink} download={PDF_NAME}>{fresh ? "Download again" : "Download"}</a>
          </>
        ) : (
          <button type="button" className="btn pri" onClick={onDownload}>{fresh ? "Download again" : "Download your one-pager"}</button>
        )}
      </div>
    </div>
  );
}
