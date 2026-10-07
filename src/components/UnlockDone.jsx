export default function UnlockDone({ fresh, onDownload, pdfError }) {
  return (
    <div className="op-done" role="status">
      <p className="op-msg ok">
        {fresh ? (pdfError ? "Unlocked. Your one-pager could not be created automatically; use the button below." : "Unlocked. Your one-pager is downloading.") : "Your action plan is unlocked."}
      </p>
      <button type="button" className="btn pri" onClick={onDownload}>{fresh ? "Download again" : "Download your one-pager"}</button>
    </div>
  );
}
