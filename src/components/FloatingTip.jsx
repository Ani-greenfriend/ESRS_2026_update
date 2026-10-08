import { useEffect, useRef } from "react";

// One floating tooltip for every element with data-ftip. It works inside scrolling areas
// and on hover, keyboard focus and tap (spec Section 8, voice and layout rules).
export default function FloatingTip() {
  const tip = useRef(null);
  useEffect(() => {
    const t = tip.current;
    let cur = null;
    const show = (el) => {
      cur = el;
      t.textContent = el.dataset.ftip;
      t.style.display = "block";
      const r = el.getBoundingClientRect(), w = t.offsetWidth;
      const x = Math.min(Math.max(8, r.left + r.width / 2 - w / 2), innerWidth - w - 8);
      let y = r.top - t.offsetHeight - 8;
      if (y < 8) y = r.bottom + 8;
      t.style.left = `${x}px`;
      t.style.top = `${y}px`;
    };
    const hide = () => { cur = null; t.style.display = "none"; };
    const find = (e) => (e.target instanceof Element ? e.target.closest("[data-ftip]") : null);
    const over = (e) => { const el = find(e); if (el) show(el); else if (cur) hide(); };
    const focus = (e) => { const el = find(e); if (el) show(el); };
    const click = (e) => { const el = find(e); if (el && cur !== el) show(el); else hide(); };
    document.addEventListener("mouseover", over);
    document.addEventListener("focusin", focus);
    document.addEventListener("focusout", hide);
    document.addEventListener("click", click);
    addEventListener("scroll", hide, { passive: true });
    return () => {
      document.removeEventListener("mouseover", over);
      document.removeEventListener("focusin", focus);
      document.removeEventListener("focusout", hide);
      document.removeEventListener("click", click);
      removeEventListener("scroll", hide);
    };
  }, []);
  return <div id="ftip" role="tooltip" ref={tip} />;
}
