import { useState } from "react";
import { CHUNKS, DATES } from "../lib/data.js";

function Chunk({ c }) {
  const [open, setOpen] = useState(false);
  return (
    <button type="button" className="chunk" aria-expanded={open} onClick={() => setOpen(!open)}>
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
        </span>
      )}
    </button>
  );
}

export default function WhatChanged() {
  return (
    <section className="ch" id="overview">
      <div className="chead">
        <div className="eyebrow">What changed</div>
        <h2>Six changes that matter</h2>
        <p className="lede">Tap a card for the detail.</p>
      </div>
      <div className="chunks">
        {CHUNKS.map((c) => (
          <Chunk key={c.t} c={c} />
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
