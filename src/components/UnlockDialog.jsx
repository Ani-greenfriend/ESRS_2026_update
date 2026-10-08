import { useEffect, useRef } from "react";
import { useUnlock } from "./unlock.jsx";
import UnlockForm from "./UnlockForm.jsx";
import UnlockDone from "./UnlockDone.jsx";

export default function UnlockDialog({ open, onClose, formProps, done }) {
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
        <div className="eyebrow">Your action plan</div>
        <h3 id="gate-h">Unlock your full action plan</h3>
        {unlocked ? (
          <UnlockDone {...done} />
        ) : (
          <>
            <p className="qhelp">Your full result, every disclosure requirement for your topics and a one-page PDF. Free, just your email.</p>
            <UnlockForm id="gate" className="op-form" emailRef={emailRef} noteFirst {...formProps} />
          </>
        )}
      </div>
    </div>
  );
}
