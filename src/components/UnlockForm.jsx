export const EMPTY_FORM = { email: "", consent: false };

export function ShortNotice() {
  return (
    <p className="op-note">
      Free. We use your email to send your results and to contact you about them.{" "}
      <a href="/privacy" target="_blank" rel="noopener">Privacy notice →</a>
    </p>
  );
}

// Email plus one required box: privacy notice read and contact agreed (builder decision 9 Nov 2026). Shared by the section and the dialog.
export default function UnlockForm({ id, form, setForm, onSubmit, busy, msg, className, emailRef, noteFirst, submitLabel = "Get my PDF" }) {
  const message = <p className={`op-msg ${msg?.type || ""}`} id={`${id}-msg`} role="status">{msg?.text || ""}</p>;
  return (
    <form className={className} noValidate onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      <label htmlFor={`${id}-email`}>Work email</label>
      <input ref={emailRef} type="email" id={`${id}-email`} autoComplete="email" placeholder="name@company.com" required maxLength={254}
        value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
        aria-invalid={msg?.type === "err" && msg.field === "email" ? true : undefined} aria-describedby={`${id}-msg`} />
      <label className="chk pnote">
        <input type="checkbox" required checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })}
          aria-invalid={msg?.type === "err" && msg.field === "consent" ? true : undefined} />{" "}
        <span>I have read the <a href="/privacy" target="_blank" rel="noopener">privacy notice</a> and greenfriend may contact me about my results.</span>
      </label>
      <button type="submit" className="btn pri" disabled={busy}>{busy ? "One moment…" : submitLabel}</button>
      {noteFirst ? (<>{message}<ShortNotice /></>) : (<><ShortNotice />{message}</>)}
    </form>
  );
}
