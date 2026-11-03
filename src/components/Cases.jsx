import { useState } from "react";
import { CASES } from "../lib/data.js";
import { isValidEmail } from "../lib/constants.js";
import { ChapterHead } from "./Icons.jsx";

function Node({ n }) {
  return (
    <div className={`node ${n.cls} ${n.non ? "nonEU" : ""}`}>
      <span className="nm">{n.nm}</span>
      <span className="fig num">{n.fig}</span>
      <span className="st">{n.st}</span>
    </div>
  );
}

// Builder request (3 Nov 2026): all seven cases are open; under them a short explanation and an email field for a contact request.
function ContactBox({ onContact }) {
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
    <div className="casecta">
      <div className="cc-text">
        <b>Not sure what applies to you?</b>
        <span>Every group is set up differently. Leave your email address here and we will get back to you on whether you report as a parent, subsidiary or neither, and from which year.</span>
      </div>
      {sent ? (
        <p className="op-msg ok" role="status">Thanks. We will be in touch soon.</p>
      ) : (
        <form className="cc-form" noValidate onSubmit={submit}>
          <label htmlFor="cc-email" className="sr-only">Work email</label>
          <div className="cc-row">
            <input type="email" id="cc-email" autoComplete="email" placeholder="name@company.com" maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} aria-describedby="cc-msg" />
            <button type="submit" className="btn pri" disabled={busy}>{busy ? "One moment…" : "Send"}</button>
          </div>
          <label className="chk consent"><input type="checkbox" checked={consent} onChange={(e) => { setConsent(e.target.checked); setMsg(null); }} /> greenfriend may contact me about my results</label>
          <p className={`op-msg ${msg?.type || ""}`} id="cc-msg" role="status">{msg?.text || ""}</p>
          <p className="op-note">We use your email only to answer your question. <a href="/privacy" target="_blank" rel="noopener">Privacy notice →</a></p>
        </form>
      )}
    </div>
  );
}

export default function Cases({ onContact }) {
  const [cur, setCur] = useState(0);
  const c = CASES[cur];
  const why = (
    <ul className="vlist">
      {c.w.map((x) => (
        <li key={x}>{x}</li>
      ))}
    </ul>
  );
  return (
    <section className="ch" id="cases">
      <ChapterHead icon="people" eyebrow="Who is in scope · examples" title="Parent, subsidiary, or neither?" short="Seven made-up groups. Find the one that looks like yours and see what it means for you." />
      <div className="cases-tabs" role="group" aria-label="Example cases">
        {CASES.map((x, i) => (
          <button type="button" key={x.t} aria-pressed={i === cur} onClick={() => setCur(i)}>
            {x.t}
          </button>
        ))}
      </div>
      <div className="case">
        <div className="org">
          {c.p.non && <span className="eulabel">Outside the EU</span>}
          <Node n={c.p} />
          {c.k.length > 0 && (
            <>
              <div className="stem" />
              {c.p.non && <span className="eulabel">In the EU</span>}
              <div className="kids">
                {c.k.map((n) => (
                  <Node key={n.nm} n={n} />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="why">
          <div className="eyebrow">Why</div>
          {why}
        </div>
      </div>
      <ContactBox onContact={onContact} />
    </section>
  );
}
