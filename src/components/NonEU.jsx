export default function NonEU() {
  return (
    <section className="ch" id="noneu">
      <div className="chead">
        <div className="eyebrow">Non-EU groups</div>
        <h2>International groups: two separate routes into scope</h2>
        <p className="lede">A US, UK, Swiss or Asian group can be caught twice: once through a large EU subsidiary from FY2027, and once at group level under Article 40a from FY2028. These are separate tests.</p>
      </div>
      <div className="twoways">
        <div className="way eu">
          <div className="eyebrow" style={{ color: "var(--olive)" }}>Route 1 · from FY2027</div>
          <h3>A large EU subsidiary</h3>
          <p className="qhelp">Any EU subsidiary, or EU sub-group parent, that exceeds 1,000 employees and €450M turnover on its own (consolidated) figures reports like any EU company. It can be exempt if the non-EU parent voluntarily publishes a consolidated report under the full ESRS (or an equivalent standard) that covers it.</p>
        </div>
        <div className="way">
          <div className="eyebrow" style={{ color: "var(--info)" }}>Route 2 · from FY2028</div>
          <h3>Article 40a group report</h3>
          <p className="qhelp">The non-EU ultimate parent is caught when the group makes more than €450M in the EU in each of the last two years and has an EU subsidiary or branch above €200M. The EU subsidiary or branch publishes a report covering the whole group.</p>
        </div>
      </div>
      <div className="flow">
        <div className="fstep"><span className="n">1</span><b>Add up EU turnover</b><p className="qhelp">Group net turnover generated in the EU, for each of the last two consecutive financial years. Above €450M both years?</p></div>
        <div className="fstep"><span className="n">2</span><b>Find the anchor entity</b><p className="qhelp">An EU subsidiary or EU branch with more than €200M net turnover. If there is none, Article 40a does not apply.</p></div>
        <div className="fstep"><span className="n">3</span><b>Plan the report</b><p className="qhelp">First report covers FY2028. Dedicated standards for non-EU groups are expected from October 2027 at the earliest. Financial holding undertakings can opt out.</p></div>
      </div>
    </section>
  );
}
