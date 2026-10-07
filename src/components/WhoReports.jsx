import { G } from "../lib/data.js";

export default function WhoReports() {
  return (
    <section className="ch" id="who">
      <div className="chead">
        <div className="eyebrow">Who reports when</div>
        <h2>Two tests decide almost everything</h2>
        <p className="lede">Omnibus I replaced the old waves with one size test from FY2027. Both limbs must be exceeded.</p>
      </div>
      <div className="thr">
        <div className="thrcard">
          <div className="eyebrow" style={{ color: "var(--olive)" }}>EU companies, groups and EU-listed issuers</div>
          <div className="gate"><span className="g">&gt; 1,000 employees</span><span className="op">AND</span><span className="g">&gt; €450M net turnover</span></div>
          <p className="qhelp">Tested on the balance sheet date: net turnover above €450M and on average more than 1,000 employees during the financial year. A parent tests consolidated group figures. First report on FY2027, published in 2028.</p>
          <p className="was">Before: 250 employees and €50M turnover (any two of three criteria).</p>
        </div>
        <div className="thrcard">
          <div className="eyebrow" style={{ color: "var(--info)" }}>Non-EU groups (Article 40a)</div>
          <div className="gate"><span className="g">&gt; €450M EU turnover, 2 years</span><span className="op">AND</span><span className="g">EU subsidiary or branch &gt; €200M</span></div>
          <p className="qhelp">No headcount test. First report on FY2028, published in 2029, through the EU subsidiary or branch.</p>
          <p className="was">Before: €150M EU turnover and a €40M branch or large subsidiary.</p>
        </div>
      </div>
      <div className="gantt">
        <table>
          <thead>
            <tr><th>Who</th><th>FY2024</th><th>FY2025</th><th>FY2026</th><th>FY2027</th><th>FY2028</th></tr>
          </thead>
          <tbody>
            {G.map((r) => (
              <tr key={r[0]}>
                <td className="who"><b>{r[0]}</b><span>{r[1]}</span></td>
                {r[2].map((c, j) => (
                  <td key={j}><div className={`cell c-${c}`}>{r[3][j] || ""}</div></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="gkey">
          <span><i className="c-rep" />Reports (existing ESRS / options)</span>
          <span><i className="c-new" />Reports under revised ESRS</span>
          <span><i className="c-opt" />Member State may exempt</span>
          <span><i className="c-40a" />Article 40a group report</span>
          <span><i className="c-out" />Out of mandatory scope</span>
        </div>
      </div>
      <p className="qhelp">The year shown is the financial year covered. The report is published the following year. Member States must transpose Omnibus I by 19 March 2027, so check national law for the FY2025–2026 exemption.</p>
    </section>
  );
}
