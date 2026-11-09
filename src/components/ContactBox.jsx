import { useState } from "react";
import { isValidEmail } from "../lib/constants.js";

// Builder requests (3 Nov 2026): an email field for a contact request (stored as request_type "contact", consent required).
// Used under the example cases (box) and after "Find your row" (blue band).
export default function ContactBox({ id, onContact, title, text, band = false }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [sent, setSent] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    const v = email.trim();
    if (!isValidEmail(v)) return setMsg({ type: "err", text: "Enter a valid email address, for example name@company.com." });
    if (!consent) return setMsg({ type: "err", text: "Tick the box so we may contact you." });
    setBusy(true);
    setMsg(null);
    const res = await onContact(v);
    setBusy(false);
    if (res.ok) setSent(true);
    else setMsg({ type: "err", text: res.message });
  };
  return (
    <div className={band ? "casecta ccband" : "casecta"}>
      <div className="cc-text">
        <b>{title}</b>
        <span>{text}</span>
      </div>
      {sent ? (
        <p className="op-msg ok" role="status">Thanks. We will be in touch soon.</p>
      ) : (
        <form className="cc-form" noValidate onSubmit={submit}>
          <label htmlFor={`${id}-email`} className="sr-only">Work email</label>
          <div className="cc-row">
            <input type="email" id={`${id}-email`} autoComplete="email" placeholder="name@company.com" maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} aria-describedby={`${id}-msg`} />
            <button type="submit" className="btn pri" disabled={busy}>{busy ? "One moment…" : "Send"}</button>
          </div>
          <label className="chk consent"><input type="checkbox" checked={consent} onChange={(e) => { setConsent(e.target.checked); setMsg(null); }} /> greenfriend may contact me</label>
          <p className={`op-msg ${msg?.type || ""}`} id={`${id}-msg`} role="status">{msg?.text || ""}</p>
          <p className="op-note">We use your email only to answer your question. <a href="/privacy" target="_blank" rel="noopener">Privacy notice →</a></p>
        </form>
      )}
    </div>
  );
}
