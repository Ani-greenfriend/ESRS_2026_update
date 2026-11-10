import { useEffect, useRef } from "react";
import { useUnlock } from "./unlock.jsx";
import UnlockForm from "./UnlockForm.jsx";
import UnlockDone from "./UnlockDone.jsx";

// Dialog copy per locked area (builder request, 10 Nov 2026); null = the PDF.
const COPY = {
  cases: { eyebrow: "Examples", h: "See all seven examples", p: "Enter your email address to open examples 2 to 7. One sign-up opens everything on this page, including your PDF." },
  datapoints: { eyebrow: "Your number", h: "See your full datapoint number", p: "Enter your email address to see your number per topic and in total. One sign-up opens everything on this page, including your PDF." },
};

export default function UnlockDialog({ open, kind = null, onClose, formProps, done }) {
  const { unlocked } = useUnlock();
  const card = useRef(null);
  const emailRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => (emailRef.current || card.current?.querySelector("button"))?.focus(), 30);
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && card.current) {
        // Keep keyboard focus inside the dialog.
        const f = [...card.current.querySelectorAll("a[href],button:not([disabled]),input,select")];
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { clearTimeout(t); document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="gate-modal" role="dialog" aria-modal="true" aria-labelledby="gate-h" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="gate-card" ref={card}>
        <button type="button" className="gate-x" aria-label="Close" onClick={onClose}>×</button>
        <div className="eyebrow">{COPY[kind]?.eyebrow || "Your PDF"}</div>
        <h3 id="gate-h">{COPY[kind]?.h || "Get your results as one PDF"}</h3>
        {unlocked ? (
          <UnlockDone {...done} withButton />
        ) : (
          <>
            <p className="qhelp">{COPY[kind]?.p || "One page with your scope result, FY2026 route, datapoint number, ready to forward to your CFO or board. Free, just your email."}</p>
            <UnlockForm id="gate" className="op-form" emailRef={emailRef} noteFirst {...formProps} />
          </>
        )}
      </div>
    </div>
  );
}
