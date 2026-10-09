import { G } from "../lib/data.js";
import { ChapterHead } from "./Icons.jsx";

const YEARS = ["FY2024", "FY2025", "FY2026", "FY2027", "FY2028"];
const KEY = [
  ["c-rep", "Reports (existing ESRS / options)", "Reports under the existing (2023) ESRS or one of the FY2026 options."],
  ["c-new", "Reports under revised ESRS", "Reports under the revised ESRS (mandatory from FY2027)."],
  ["c-opt", "Member State may exempt", "Member States may exempt these companies for FY2025 and FY2026."],
  ["c-40a", "Article 40a group report", "Group-level report by a non-EU parent under Article 40a."],
  ["c-out", "Out of mandatory scope", "Not subject to mandatory reporting in that year."],
];

export default function WhoReports() {
  return (
    <section className="ch" id="who">
      <ChapterHead icon="calendar" eyebrow="Who reports when" title="Do you have to report? Two quick tests" short="Short answer: EU companies report from FY2027 if they pass both tests. Non-EU groups follow from FY2028." />
      <div className="thr">
        <div className="thrcard">
          <div className="eyebrow" style={{ color: "var(--olive)" }}>EU companies, groups and EU-listed issuers</div>
          <div className="gate"><span className="g">&gt; 1,000 employees</span><span className="andop">AND</span><span className="g">&gt; €450M net turnover</span></div>
          <p className="qhelp">Over €450M net turnover and over 1,000 employees on average. First report: FY2027, published 2028.</p>
          <p className="mean"><b>For you</b> Over both lines? You report from FY2027. Parents: use group figures.</p>
          <p className="was">Before: 250 employees and €50M turnover (any two of three criteria).</p>
        </div>
        <div className="thrcard">
          <div className="eyebrow" style={{ color: "var(--info)" }}>Non-EU groups (Article 40a)</div>
          <div className="gate"><span className="g">&gt; €450M EU turnover, 2 years</span><span className="andop">AND</span><span className="g">EU subsidiary or branch &gt; €200M</span></div>
          <p className="qhelp">No headcount test. First report on FY2028, published in 2029.</p>
          <p className="mean"><b>For you</b> Over both lines? Your EU entity reports for the group from FY2028.</p>
          <p className="was">Before: €150M EU turnover and a €40M branch or large subsidiary.</p>
        </div>
      </div>
      <div className="gantt">
        <table>
          <thead>
            <tr><th>Who</th>{YEARS.map((y) => <th key={y}>{y}</th>)}</tr>
          </thead>
          <tbody>
            {G.map((r) => (
              <tr key={r[0]}>
                <td className="who"><b>{r[0]}</b><span>{r[1]}</span></td>
                {r[2].map((c, j) => (
                  <td key={j}>
                    <div className={`cell c-${c}`} tabIndex={0} data-ftip={`${r[0]}, ${YEARS[j]}: ${r[4][j]}`}>{r[3][j] || ""}</div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="gkey">
          {KEY.map(([c, label, tip]) => (
            <span key={c} tabIndex={0} data-ftip={tip}><i className={c} />{label}</span>
          ))}
        </div>
      </div>
      <p className="tip"><b>Good to know</b> Years shown are the financial year reported on. Check national law for the FY2025–2026 exemption (transposition by 19 March 2027).</p>
    </section>
  );
}
