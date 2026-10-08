export const EMPTY_FORM = { email: "", consent: false };

export function ShortNotice() {
  return (
    <p className="op-note">
      Free. We use your email only to send your results. We contact you only if you tick the box.{" "}
      <a href="/privacy" target="_blank" rel="noopener">Privacy notice →</a>
    </p>
  );
}

// Email only plus one optional, unticked consent box (spec v1.7). Shared by the section and the dialog.
export default function UnlockForm({ id, form, setForm, onSubmit, busy, msg, className, emailRef, noteFirst }) {
  const message = <p className={`op-msg ${msg?.type || ""}`} id={`${id}-msg`} role="status">{msg?.text || ""}</p>;
  return (
    <form className={className} noValidate onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      <label htmlFor={`${id}-email`}>Work email</label>
      <input ref={emailRef} type="email" id={`${id}-email`} autoComplete="email" placeholder="name@company.com" required maxLength={254}
        value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
        aria-invalid={msg?.type === "err" && msg.field === "email" ? true : undefined} aria-describedby={`${id}-msg`} />
      <label className="chk consent">
        <input type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} />{" "}
        greenfriend may contact me about my results (optional)
      </label>
      <button type="submit" className="btn pri" disabled={busy}>{busy ? "One moment…" : "Get it free"}</button>
      {noteFirst ? (<>{message}<ShortNotice /></>) : (<><ShortNotice />{message}</>)}
    </form>
  );
}
