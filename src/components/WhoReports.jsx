import { G } from "../lib/data.js";
import { ChapterHead } from "./Icons.jsx";
import ContactBox from "./ContactBox.jsx";

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

export default function WhoReports() {
  return (
    <section className="ch" id="who">
      <ChapterHead icon="calendar" eyebrow="Who is in scope" title="Who reports when" short="Check the new legal thresholds that changed in 2026 (CSRD Omnibus I / 2026 revision)." />
      {/* "In the EU": the two thresholds (builder request, 3 Nov 2026); "Outside the EU? Two ways in" follows */}
      <div className="thrstrip eupanel">
        <div className="ts-l">
          <h3 className="ts-h">In the EU</h3>
          <div className="gate"><span className="g">&gt; 1,000 employees</span><span className="andop">AND</span><span className="g">&gt; €450M net turnover</span></div>
        </div>
        <p className="ts-r">
          Meet both and you report under the revised ESRS: keep going if you report today, first report <b>FY2027</b> if you are new. Parents use group figures.{" "}
          <span className="src" tabIndex={0} data-ftip="Former criteria (any two of three): more than 250 employees, more than €50M net turnover, more than €25M total balance sheet assets. Parent companies use consolidated group figures." aria-label="More info">i</span>
        </p>
      </div>
    </section>
  );
}


// Builder request (3 Nov 2026): "Find your row" sits below "Outside the EU? Two ways in", before the example cases.
export function FindYourRow({ onContact }) {
  return (
    <section className="ch" id="rows" aria-labelledby="rows-h">
      <h3 className="gtitle sec-h" id="rows-h">Find your row</h3>
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
      {/* Builder request (3 Nov 2026): the "not legal advice" note sits right above the contact band. */}
      <p className="disclaim">* This is not legal advice. Start with your EU subsidiary, its deadline comes first (FY2027). If you are still unsure, check with your auditor or legal adviser, or leave your email address below for our advice.</p>
      {/* Builder requests (3 Nov 2026): the band closes the EU / non-EU / thresholds part; an email field instead of "Email us". */}
      <ContactBox id="rows" band onContact={onContact} title="Not sure on which level you report?"
        text="We can help you find out whether you report as a parent, subsidiary or neither, and from which year." />
    </section>
  );
}
