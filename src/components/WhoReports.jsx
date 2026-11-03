import { G } from "../lib/data.js";
import { ChapterHead } from "./Icons.jsx";

const YEARS = ["FY2024", "FY2025", "FY2026", "FY2027", "FY2028"];
const KEY = [
  ["c-rep", "Reports (pre-Omnibus ESRS / options)", "Reports under the pre-Omnibus (2023) ESRS or one of the FY2026 options."],
  ["c-new", "Reports under revised ESRS", "Reports under the revised ESRS (mandatory from FY2027)."],
  ["c-opt", "Member State may exempt", "Member States may exempt these companies for FY2025 and FY2026."],
  ["c-40a", "Article 40a group report", "Group-level report by a non-EU parent under Article 40a."],
  ["c-out", "Out of mandatory scope", "Not subject to mandatory reporting in that year."],
];

// v2.4: the group as a small pill, the description as a bold line (prototype whoHtml()).
// Builder request (3 Nov 2026): the badge says whether the row is listed (wave 1 = listed companies, banks and insurers).
const WHO = {
  "EU wave 1, still above both thresholds": ["EU wave 1 · listed", "Still above both thresholds"],
  "EU wave 1, now below a threshold": ["EU wave 1 · listed", "Now below a threshold"],
  "Large EU company, not wave 1": ["Large EU company · not listed", "Not wave 1"],
  "Large EU company below new thresholds": ["Large EU company · listed or not", "Below the new thresholds"],
  "Listed EU SME": ["Listed EU SME", "Smaller listed company"],
  "Non-EU group (Art. 40a)": ["Non-EU group", "Article 40a"],
};
function Who({ n }) {
  let k, t;
  if (WHO[n]) [k, t] = WHO[n];
  else {
    const i = n.indexOf(", ");
    k = n.slice(0, i);
    t = n[i + 2].toUpperCase() + n.slice(i + 3);
  }
  return <><em className="wk">{k}</em><b>{t}</b></>;
}

// "Out|Voluntary standard optional": a main label and a small second line (builder request, 3 Nov 2026).
function Label({ t }) {
  if (!t.includes("|")) return t;
  const [main, sub] = t.split("|");
  return <><span>{main}</span><small>{sub}</small></>;
}

export default function WhoReports({ onNonEU }) {
  return (
    <section className="ch" id="who">
      <ChapterHead icon="calendar" eyebrow="Who is in scope" title="Who reports when" short="Check the new legal thresholds that changed in 2026." />
      {/* v2.4: the thresholds as one strip and non-EU groups in one line; "Find your row" follows the non-EU block */}
      <div className="thrstrip">
        <div className="ts-l">
          <span className="eyebrow" style={{ color: "var(--olive)" }}>The two thresholds behind the check</span>
          <div className="gate"><span className="g">&gt; 1,000 employees</span><span className="andop">AND</span><span className="g">&gt; €450M net turnover</span></div>
        </div>
        <p className="ts-r">
          Meet both and you report under the revised ESRS: keep going if you report today, first report <b>FY2027</b> if you are new. Parents use group figures.{" "}
          <span className="src" tabIndex={0} data-ftip="Old test: 250 employees and €50M turnover (any two of three criteria). Parent companies use consolidated group figures." aria-label="More info">i</span>
        </p>
      </div>
      {/* Builder request (3 Nov 2026): one short line; the link jumps to "Outside the EU? Two ways in" right below. */}
      <p className="nonline"><b>If you are outside the EU,</b> <a href="#noneu" className="nonlink" onClick={onNonEU}>keep reading below</a>.</p>
    </section>
  );
}


// Builder request (3 Nov 2026): "Find your row" sits below "Outside the EU? Two ways in", before the example cases.
export function FindYourRow() {
  return (
    <section className="ch" id="rows" aria-labelledby="rows-h">
      <h3 className="gtitle" id="rows-h">Find your row</h3>
      <div className="gantt">
        <table>
          <thead>
            <tr><th>Who</th>{YEARS.map((y) => <th key={y}>{y}</th>)}</tr>
          </thead>
          <tbody>
            {G.map((r) => (
              <tr key={r[0]}>
                <td className="who"><Who n={r[0]} /><span>{r[1]}</span></td>
                {r[2].map((c, j) => (
                  <td key={j}>
                    <div className={`cell c-${c}${r[3][j].includes("|") ? " outv" : ""}`} tabIndex={0} data-ftip={`${r[0]}, ${YEARS[j]}: ${r[4][j]}`}><Label t={r[3][j]} /></div>
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
      <details className="numnote">
        <summary>What are wave 1 and wave 2?</summary>
        <ul>
          <li><b>Wave 1</b> is only the companies that were already under the old NFRD (Non-Financial Reporting Directive): public-interest entities (listed companies, banks, insurers) with more than 500 employees. They report under the CSRD since FY2024 (first report published in 2025). A company that is not listed, such as a large private or family-owned group, was never wave 1, however large.</li>
          <li><b>Wave 2</b> is all other large EU companies. Their start was FY2025, later postponed by two years to FY2027.</li>
          <li><b>Omnibus I (Directive (EU) 2026/470)</b> changed wave 2 in two ways: only companies with more than 1,000 employees and more than €450M turnover stay in, and their first report covers FY2027 (published 2028).</li>
          <li><b>So</b> a company with more than 1,000 employees and €450M that was not wave 1 does not report on FY2026. It starts with FY2027.</li>
        </ul>
      </details>
      <p className="tip"><b>Good to know</b> Years shown are the financial year reported on. Wave 1 means EU companies that already reported for FY2024. Member States must transpose Omnibus I by 19 March 2027, so check national law for the FY2025–2026 exemption. Each country's measures are listed on EUR-Lex, on the page of Directive (EU) 2026/470 under "National transposition".</p>
    </section>
  );
}
