import { MN, MONTHS, SV, fyShift, mapMode, mapSteps, monthAt, svOf } from "../lib/roadmap.js";
import { ChapterHead } from "./Icons.jsx";

// Your 2027 roadmap (spec v2.2/v2.3): free, built from the scope answers, the ticked topics and the year-end month.
function Timeline({ rows, shift }) {
  const cells = [];
  // Year labels across the top, then one letter per month.
  let st = 1;
  for (let c = 2; c <= 18; c++) {
    if (c === 18 || monthAt(c, shift).y !== monthAt(st, shift).y) {
      cells.push(<div key={`y${st}`} className="ty" style={{ gridColumn: `${st}/${c}` }}>{monthAt(st, shift).y}</div>);
      st = c;
    }
  }
  for (let c = 1; c <= 17; c++) {
    const m = monthAt(c, shift);
    cells.push(<div key={`m${c}`} className="tm" aria-label={`${MONTHS[m.m]} ${m.y}`}>{MN[m.m][0]}</div>);
  }
  rows.forEach((x, i) => {
    const r = i + 3;
    // The auditor label starts after the first run of check-in diamonds, so it stays clear of them (as in the PDF).
    let pad;
    if (x.arrow) {
      const ks = x.ck.map((k) => k[0]);
      let c = Math.min(...ks);
      while (ks.includes(c + 1)) c++;
      pad = `calc(${c - x.a + 1} * 100% / ${x.b - x.a} + 6px)`;
    }
    const bar = (a, b, k) => (
      <div key={`b${i}${k}`} className={`tb${x.fin ? " fin" : ""}${x.arrow ? " aud" : ""}`} tabIndex={0} style={{ gridColumn: `${a}/${b}`, gridRow: r, paddingLeft: k === "a" ? pad : undefined }} data-ftip={`${x.t}, ${x.when}: ${x.d}`}>
        <span>{x.s}</span>
      </div>
    );
    cells.push(bar(x.a, x.b, "a"));
    const sv = svOf(x.t);
    if (sv >= 0)
      cells.push(
        <div key={`s${i}`} className="sv" tabIndex={0} style={{ gridColumn: `${x.a}/${x.b}`, gridRow: r }} data-ftip={`Our step ${SV[sv][0]}. ${SV[sv][2]}`}>
          <span>{SV[sv][0]} {SV[sv][1]}</span>
        </div>
      );
    if (x.a2) cells.push(bar(x.a2, x.b2, "b"));
    (x.ck || []).forEach((c) =>
      cells.push(<div key={`c${i}-${c[0]}`} className="ck" tabIndex={0} style={{ gridColumn: `${c[0]}/${c[0] + 1}`, gridRow: r }} data-ftip={`Check-in: ${c[1]}`} aria-label={`Check-in: ${c[1]}`} />)
    );
  });
  return (
    <>
      <div className="tl" style={{ "--rows": rows.length }}>{cells}</div>
      <div className="tkey">
        <span><i />Your sustainability work</span>
        <span><i className="fin" />Annual financial reporting</span>
        <span><i className="aud" />Auditor track, diamonds are check-ins</span>
        <span><i className="dot" />Dotted line: where greenfriend supports you, by our step 0 to 4</span>
      </div>
    </>
  );
}

export default function Roadmap({ A, topics, fyEnd, setFyEnd }) {
  const mode = mapMode(A);
  const shift = fyShift(fyEnd);
  const rows = mapSteps(A, topics, fyEnd);
  return (
    <section className="ch" id="roadmap">
      <ChapterHead icon="calendar" eyebrow="Your roadmap" title="Your roadmap for 2027" short="Built from your answers above. Plan it around your annual financial reporting, because the sustainability statement is published with it." />
      <p className="rbasis">
        {mode.k === "open"
          ? <>Run the <a href="#scope">scope check</a> to tailor this plan. Until then it shows both options.</>
          : <>Scope result: <b>{mode.badge}</b>. {mode.basis}</>}
      </p>
      <div className="fyin">
        <label htmlFor="fyend">Financial year ends in</label>
        <select id="fyend" value={fyEnd} onChange={(e) => setFyEnd(e.target.value)}>
          <option value="">Select month</option>
          {MONTHS.map((m, i) => <option key={m} value={String(i + 1)}>{m}</option>)}
        </select>
        <span id="fyline" aria-live="polite">
          {shift ? `Timeline moved by ${shift} month${shift > 1 ? "s" : ""}. Your first financial year under the revised ESRS starts on 1 ${MONTHS[shift]} 2027.` : ""}
        </span>
      </div>
      <details className="fyalt">
        <summary><b>Year-end not 31 December?</b> <span>The plan shifts with your year-end.</span></summary>
        <p>Enter your year-end month above and the whole timeline moves by the same number of months, because the report is published with your annual report. With a 30 June year-end, for example, everything moves six months later. The revised ESRS apply from the first financial year that starts on or after 1 January 2027, so a 30 June year-end starts that year on 1 July 2027 and reports around the end of 2028. Ask finance for your year-end and annual report date.</p>
      </details>
      <div className="rmapwrap"><div className="rmap"><Timeline rows={rows} shift={shift} /></div></div>
      <p className="tip"><b>Good to know</b> Hover a bar for what to do. This is our planning guide, not a legal requirement, and the dates follow the year-end you enter (default December). Ask finance for your annual report date, then work backwards (our rule of thumb: data cut-off about 3 weeks after year-end, draft by end of February, audit committee and auditor in March, board approval 1 to 2 weeks before publication).</p>
    </section>
  );
}
