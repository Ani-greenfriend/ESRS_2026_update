import { useState } from "react";
import { CHUNKS, DATES, REFS } from "../lib/data.js";
import { ChapterHead } from "./Icons.jsx";

function Chunk({ c, src }) {
  const [open, setOpen] = useState(false);
  return (
    <button type="button" className="chunk" aria-expanded={open} onClick={() => setOpen(!open)}>
      <span className="src" data-ftip={`Source: ${src}`} aria-hidden="true">i</span>
      <span className="k num">{c.k}</span>
      <span className="t">{c.t}</span>
      <span className="s">{c.s}</span>
      <span className="more">{open ? "Hide detail" : "Show detail"}</span>
      {open && (
        <span className="detail">
          <ul>
            {c.d.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <span className="srcl" style={{ display: "block" }}><b>Source</b> {src}</span>
        </span>
      )}
    </button>
  );
}

export default function WhatChanged() {
  return (
    <section className="ch" id="overview">
      <ChapterHead icon="check" eyebrow="What changed" title="Six things changed, the short version" short="Smaller scope, far fewer datapoints, a lighter assessment. Tap a card to peek inside." />
      <div className="chunks">
        {CHUNKS.map((c, i) => (
          <Chunk key={c.t} c={c} src={REFS[i]} />
        ))}
      </div>
      <h3 style={{ marginTop: 10 }}>Key dates</h3>
      <div className="dates">
        <div className="dates-in">
          <div className="dline" />
          <div className="dpts">
            {DATES.map((x) => (
              <div key={x.d} className={`dpt ${x.c}`}>
                <i className="dot" />
                <b className="num">{x.d}</b>
                <span>{x.t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
