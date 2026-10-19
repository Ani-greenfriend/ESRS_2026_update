import { G } from "../lib/data.js";
import Icon, { ChapterHead } from "./Icons.jsx";

const YEARS = ["FY2024", "FY2025", "FY2026", "FY2027", "FY2028"];
const KEY = [
  ["c-rep", "Reports (pre-Omnibus ESRS / options)", "Reports under the pre-Omnibus (2023) ESRS or one of the FY2026 options."],
  ["c-new", "Reports under revised ESRS", "Reports under the revised ESRS (mandatory from FY2027)."],
  ["c-opt", "Member State may exempt", "Member States may exempt these companies for FY2025 and FY2026."],
  ["c-40a", "Article 40a group report", "Group-level report by a non-EU parent under Article 40a."],
  ["c-out", "Out of mandatory scope", "Not subject to mandatory reporting in that year."],
];

export default function WhoReports({ onNonEU }) {
  return (
    <section className="ch" id="who">
      <ChapterHead icon="calendar" eyebrow="Who reports when" title="Do you have to report? Two quick criteria" short="Short answer: meet both criteria and you report under the revised ESRS from FY2027 (non-EU groups from FY2028)." />
      {/* v2.0 decision flow: criteria card → arrow → three outcomes; non-EU groups in one line with a link to the three questions */}
      <div className="tree">
        <div className="tq">
          <div className="tqh">
            <span className="eyebrow" style={{ color: "var(--olive)" }}>1 · EU company or EU group: do you meet both criteria?</span>
            <span className="src" tabIndex={0} data-ftip="Old test: 250 employees and €50M turnover (any two of three criteria). Parent companies use consolidated group figures." aria-label="More info">i</span>
          </div>
          <div className="gate"><span className="g">&gt; 1,000 employees</span><span className="andop">AND</span><span className="g">&gt; €450M net turnover</span></div>
        </div>
        <div className="tarrow" aria-hidden="true"><Icon name="arrowDown" size={22} /></div>
        <div className="tout3">
          <div className="to a"><small>2 · Yes, and you report today</small><b>Keep reporting</b><span>Switch to the revised ESRS in <em>FY2027</em></span></div>
          <div className="to b"><small>2 · Yes, but you are new</small><b>Start reporting</b><span>Your first report is <em>FY2027</em></span></div>
          <div className="to c"><small>No, below a line</small><b>Not mandatory</b><span>Out from FY2027. FY2025–26 depends on your country.</span></div>
        </div>
        <div className="tnon tnone">
          <span className="eyebrow" style={{ color: "var(--info)" }}>Group based outside the EU?</span>
          <span>Non-EU groups report through a large EU subsidiary (FY2027) or at group level under Article 40a (FY2028).</span>
          <a href="#noneu" className="nonlink" onClick={onNonEU}>See the three questions</a>
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
      <details className="numnote">
        <summary>What are wave 1 and wave 2?</summary>
        <ul>
          <li><b>Wave 1</b> is only the companies that were already under the old NFRD (Non-Financial Reporting Directive): public-interest entities (listed companies, banks, insurers) with more than 500 employees. They report under the CSRD since FY2024 (first report published in 2025). A company that is not listed, such as a large private or family-owned group, was never wave 1, however large.</li>
          <li><b>Wave 2</b> is all other large EU companies. Their start was FY2025, later postponed by two years to FY2027.</li>
          <li><b>Omnibus I (Directive (EU) 2026/470)</b> changed wave 2 in two ways: only companies with more than 1,000 employees and more than €450M turnover stay in, and their first report covers FY2027 (published 2028).</li>
          <li><b>So</b> a company with more than 1,000 employees and €450M that was not wave 1 does not report on FY2026. It starts with FY2027.</li>
        </ul>
      </details>
      <p className="tip"><b>Good to know</b> Years shown are the financial year reported on. Wave 1 means EU companies that already reported for FY2024. Member States must transpose Omnibus I by 19 March 2027, so check national law for the FY2025–2026 exemption. <a href="https://eur-lex.europa.eu/legal-content/EN/NIM/?uri=CELEX:32026L0470" target="_blank" rel="noopener">National transposition measures ↗</a></p>
    </section>
  );
}
