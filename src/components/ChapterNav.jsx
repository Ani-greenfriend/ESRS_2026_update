import { useEffect, useRef, useState } from "react";

// Spec v2.2 order; Non-EU groups is not in the menu (it opens under "Check your scope").
export const CHAPTERS = [
  ["overview", "What changed"],
  ["who", "Who reports when"],
  ["scope", "Check your scope"],
  ["datapoints", "Datapoints"],
  ["cases", "Example cases"],
  ["fy2026", "Your 2026 route"],
  ["roadmap", "Your 2027 roadmap"],
  ["onepager", "Get the PDF"],
  ["about", "Who we are"],
];

// The active chapter follows the scroll position; "Who we are" is active at the bottom; none on the cover.
export default function ChapterNav() {
  const [active, setActive] = useState(null);
  const [present, setPresent] = useState(CHAPTERS);
  const bar = useRef(null);

  useEffect(() => {
    let tick = false;
    const spy = () => {
      tick = false;
      const y = innerHeight * 0.3;
      let cur = null;
      CHAPTERS.forEach(([id]) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= y) cur = id;
      });
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) cur = CHAPTERS[CHAPTERS.length - 1][0];
      setActive(cur);
    };
    const onScroll = () => { if (!tick) { tick = true; requestAnimationFrame(spy); } };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", spy);
    spy();
    // Link only to chapters that are on the page (no dead links while a chapter is not built yet).
    setPresent(CHAPTERS.filter(([id]) => document.getElementById(id)));
    // From 1180 px the menu is a fixed left sidebar; the page content moves to its right.
    document.body.classList.add("withnav");
    return () => { removeEventListener("scroll", onScroll); removeEventListener("resize", spy); document.body.classList.remove("withnav"); };
  }, []);

  // Keep the active link in view on phones.
  useEffect(() => {
    const w = bar.current, a = w?.querySelector("a.on");
    if (a) w.scrollTo({ left: a.offsetLeft - w.offsetLeft - 24, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [active]);

  const links = present.map(([id, label]) => (
    <a key={id} href={`#${id}`} className={active === id ? "on" : undefined} aria-current={active === id ? "true" : undefined}>
      {label}
    </a>
  ));

  return (
    <nav className="chapters" aria-label="Sections">
      <div className="wrap" ref={bar}>
        {links}
      </div>
    </nav>
  );
}
