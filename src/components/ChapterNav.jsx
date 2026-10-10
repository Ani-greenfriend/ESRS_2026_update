import { useEffect, useRef, useState } from "react";

export const CHAPTERS = [
  ["overview", "What changed"],
  ["who", "Who reports when"],
  ["scope", "Check your scope"],
  ["noneu", "Non-EU groups"],
  ["cases", "Example cases"],
  ["fy2026", "Your 2026 route"],
  ["datapoints", "Datapoints"],
  ["onepager", "Get the PDF"],
  ["about", "Who we are"],
];

// The active chapter follows the scroll position; "Who we are" is active at the bottom; none on the cover.
export default function ChapterNav() {
  const [active, setActive] = useState(null);
  const [pastCover, setPastCover] = useState(false);
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
      const cover = document.querySelector(".cover");
      setPastCover(!cover || cover.getBoundingClientRect().bottom < 80);
    };
    const onScroll = () => { if (!tick) { tick = true; requestAnimationFrame(spy); } };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", spy);
    spy();
    return () => { removeEventListener("scroll", onScroll); removeEventListener("resize", spy); };
  }, []);

  // Keep the active link in view on phones.
  useEffect(() => {
    const w = bar.current, a = w?.querySelector("a.on");
    if (a) w.scrollTo({ left: a.offsetLeft - w.offsetLeft - 24, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [active]);

  const links = CHAPTERS.map(([id, label]) => (
    <a key={id} href={`#${id}`} className={active === id ? "on" : undefined} aria-current={active === id ? "true" : undefined}>
      {label}
    </a>
  ));

  return (
    <>
    {/* Large screens only: the same chapters as a slim menu in the empty left margin (CSS switches it on). */}
    <nav className={`sidenav${pastCover ? " show" : ""}`} aria-label="Sections">
      <div className="sidenav-h">On this page</div>
      {links}
    </nav>
    <nav className="chapters" aria-label="Sections">
      <div className="wrap" ref={bar}>
        {links}
      </div>
    </nav>
    </>
  );
}
