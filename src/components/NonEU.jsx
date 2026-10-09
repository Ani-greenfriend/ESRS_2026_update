import Icon, { ChapterHead } from "./Icons.jsx";

export default function NonEU() {
  return (
    <section className="ch" id="noneu">
      <ChapterHead icon="globe" eyebrow="Non-EU groups" title="Outside the EU? Two ways in" short="A non-EU group can be caught twice: via a large EU subsidiary (FY2027) and at group level, Article 40a (FY2028)." />
      <div className="twoways">
        <div className="way eu">
          <div className="eyebrow" style={{ color: "var(--olive)" }}><Icon name="building" size={22} />Route 1 · from FY2027</div>
          <h3>A large EU subsidiary</h3>
          <p className="mean"><b>For you</b> If your EU subsidiary has over 1,000 employees and over €450M turnover, it reports like any EU company.</p>
          <details className="hov"><summary>The fine print</summary><p>This applies to any EU subsidiary, or EU sub-group parent, on its own (consolidated) figures. It can be exempt if the non-EU parent voluntarily publishes a consolidated report under the full ESRS (or an equivalent standard) that covers it.</p></details>
        </div>
        <div className="way">
          <div className="eyebrow" style={{ color: "var(--info)" }}><Icon name="doc" size={22} />Route 2 · from FY2028</div>
          <h3>Article 40a group report</h3>
          <p className="mean"><b>For you</b> If your group earns over €450M in the EU and you have an EU entity over €200M, that entity reports for the whole group.</p>
          <details className="hov"><summary>The fine print</summary><p>The €450M must be exceeded in two consecutive years, and the entity is an EU subsidiary or branch. There is no headcount test.</p></details>
        </div>
      </div>
      <div className="flow">
        <div className="fstep"><span className="ico"><Icon name="euro" size={22} /></span><b>1. Add up your EU turnover</b><p className="qhelp">Over €450M, two years in a row?</p></div>
        <div className="fstep"><span className="ico"><Icon name="anchor" size={22} /></span><b>2. Find your anchor entity</b><p className="qhelp">An EU subsidiary or branch over €200M? If not, Article 40a does not apply.</p></div>
        <div className="fstep">
          <span className="ico"><Icon name="calendar" size={22} /></span><b>3. Plan your first report</b><p className="qhelp">It covers FY2028.</p>
          <details className="hov"><summary>Good to know</summary><p>Dedicated standards for non-EU groups are expected from October 2027 at the earliest. Financial holding undertakings can opt out.</p></details>
        </div>
      </div>
      <p className="advice"><b>Our tip</b> Start with your EU subsidiary. Its deadline comes first (FY2027). Not sure where you stand? Run the scope check above.</p>
    </section>
  );
}
