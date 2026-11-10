import { createContext, useContext } from "react";
import InlineUnlock from "./InlineUnlock.jsx";

export const UnlockContext = createContext({ unlocked: false, openGate: () => {}, unlockInline: async () => ({ ok: false }) });
export const useUnlock = () => useContext(UnlockContext);

export function UnlockButton({ kind = null, children = "Get your free PDF" }) {
  const { openGate } = useUnlock();
  return (
    <button type="button" className="unlock" onClick={(e) => openGate(e.currentTarget, kind)}>
      {children}
    </button>
  );
}

// Blurs locked content behind an unlock bar until the visitor unlocks.
export function Gated({ label, kind = null, children }) {
  const { unlocked } = useUnlock();
  if (unlocked) return children;
  return (
    <div className={kind ? "gated inline" : "gated"}>
      <div className="blur" aria-hidden="true" inert="">
        {children}
      </div>
      {kind ? (
        <InlineUnlock kind={kind} text={label} />
      ) : (
        <div className="lockbar">
          <span>{label}</span>
          <UnlockButton />
        </div>
      )}
    </div>
  );
}

export function LockIcon() {
  return (
    <svg className="lockico" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <rect x="3" y="7" width="10" height="8" rx="1.5" fill="currentColor" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
