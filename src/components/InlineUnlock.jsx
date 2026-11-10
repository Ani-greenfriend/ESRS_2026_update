import { useState } from "react";
import { isValidEmail } from "../lib/constants.js";
import { useUnlock } from "./unlock.jsx";

// Builder request (10 Nov 2026): a small email form beside the blurred content instead of a pop-up.
// Stored as request_type unlock_<kind>; one sign-up opens everything on the page for this visit.
export default function InlineUnlock({ kind, text }) {
  const { unlockInline } = useUnlock();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const id = `ul-${kind}`;
  const submit = async (e) => {
    e.preventDefault();
    const v = email.trim();
    if (!isValidEmail(v)) return setMsg("Enter a valid email address, for example name@company.com.");
    if (!consent) return setMsg("Tick the box to continue.");
    setBusy(true);
    setMsg(null);
    const res = await unlockInline(kind, v);
    setBusy(false);
    if (!res.ok) setMsg(res.message);
  };
  return (
    <form className="gatecard" noValidate onSubmit={submit}>
      <label htmlFor={`${id}-email`} className="gc-h">{text}</label>
      <div className="cc-row">
        <input type="email" id={`${id}-email`} autoComplete="email" placeholder="name@company.com" maxLength={254} value={email} onChange={(e) => { setEmail(e.target.value); setMsg(null); }} aria-describedby={`${id}-msg`} />
        <button type="submit" className="btn pri" disabled={busy}>{busy ? "One moment…" : "Unlock"}</button>
      </div>
      <label className="chk consent">
        <input type="checkbox" checked={consent} onChange={(e) => { setConsent(e.target.checked); setMsg(null); }} />{" "}
        <span>I have read the <a href="/privacy" target="_blank" rel="noopener">privacy notice</a> and greenfriend may contact me.</span>
      </label>
      <p className="op-msg err" id={`${id}-msg`} role="status">{msg || ""}</p>
    </form>
  );
}
