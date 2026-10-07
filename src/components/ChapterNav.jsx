import { useEffect, useRef, useState } from "react";

export const CHAPTERS = [
  ["overview", "What changed"],
  ["datapoints", "Datapoints"],
  ["who", "Who reports when"],
  ["scope", "Check your scope"],
  ["noneu", "Non-EU groups"],
  ["cases", "Example cases"],
  ["fy2026", "FY2026 options"],
  ["onepager", "Get the PDF"],
  ["about", "Who we are"],
];

export default function ChapterNav() {
  const [active, setActive] = useState(null);
  const bar = useRef(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    CHAPTERS.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // Keep the active chapter visible in the sideways-scrolling menu on phones.
  useEffect(() => {
    const a = bar.current?.querySelector("a.on");
    if (a && bar.current.scrollWidth > bar.current.clientWidth) {
      bar.current.scrollTo({ left: a.offsetLeft - 20, behavior: "auto" });
    }
  }, [active]);

  return (
    <nav className="chapters" aria-label="Sections">
      <div className="wrap" ref={bar}>
        {CHAPTERS.map(([id, label]) => (
          <a key={id} href={`#${id}`} className={active === id ? "on" : undefined} aria-current={active === id ? "true" : undefined}>
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
