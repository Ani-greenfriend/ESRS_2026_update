import { INDUSTRIES, INTERESTS } from "../lib/constants.js";

export const EMPTY_FORM = { email: "", company: "", industry: "", consent: false, interests: [] };

export function ShortNotice() {
  return (
    <p className="op-notice">
      We use your email to send you your results and to record your request (legitimate interest). We only contact you if you tick the box above (consent, which you can withdraw at any time). Without consent, your email and company are deleted after 30 days; all data is deleted after 24 months.{" "}
      <a href="/privacy" target="_blank" rel="noopener">Full privacy notice →</a>
    </p>
  );
}

// The same form is used in the unlock section and the unlock dialog; its values are shared.
export default function UnlockForm({ id, form, setForm, onSubmit, busy, msg, className, emailRef }) {
  const set = (k, v) => setForm({ ...form, [k]: v });
  const toggleInterest = (x) => {
    const on = !form.interests.includes(x);
    const interests = on ? [...form.interests, x] : form.interests.filter((i) => i !== x);
    // Ticking any service of interest also ticks the contact box.
    setForm({ ...form, interests, consent: on ? true : form.consent });
  };
  return (
    <form className={className} noValidate onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      <label htmlFor={`${id}-email`}>Work email</label>
      <input ref={emailRef} type="email" id={`${id}-email`} autoComplete="email" placeholder="name@company.com" required maxLength={254}
        value={form.email} onChange={(e) => set("email", e.target.value)} aria-invalid={msg?.type === "err" && msg.field === "email" ? true : undefined} aria-describedby={`${id}-msg`} />
      <div className="op-row">
        <div>
          <label htmlFor={`${id}-company`}>Company <span>(optional)</span></label>
          <input type="text" id={`${id}-company`} autoComplete="organization" maxLength={120} value={form.company} onChange={(e) => set("company", e.target.value)} />
        </div>
        <div>
          <label htmlFor={`${id}-industry`}>Industry <span>(optional)</span></label>
          <select id={`${id}-industry`} value={form.industry} onChange={(e) => set("industry", e.target.value)}>
            <option value="">Choose…</option>
            {INDUSTRIES.map((x) => (
              <option key={x} value={x}>{x}</option>
            ))}
          </select>
        </div>
      </div>
      <label className="op-check">
        <input type="checkbox" checked={form.consent} onChange={(e) => set("consent", e.target.checked)} />
        <span>I'd like greenfriend to contact me about my results</span>
      </label>
      <fieldset className="op-fieldset">
        <legend>Interested in <span>(optional)</span></legend>
        <div className="op-interests">
          {INTERESTS.map((x) => (
            <label key={x} className="op-check">
              <input type="checkbox" checked={form.interests.includes(x)} onChange={() => toggleInterest(x)} />
              <span>{x}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <button type="submit" className="btn pri" disabled={busy}>{busy ? "Unlocking…" : "Unlock my action plan"}</button>
      <p className={`op-msg ${msg?.type || ""}`} id={`${id}-msg`} role="status">{msg?.text || ""}</p>
      <ShortNotice />
    </form>
  );
}
