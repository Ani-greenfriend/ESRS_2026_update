import { ChapterHead } from "./Icons.jsx";

// v2.1 guided stepper. v2.2: not in the menu or the main flow; shown under "Check your scope" when the first
// answer is "Outside the EU" or after "See the three questions" in "Who reports when".
const STEPS = [
  {
    tag: "Route 1 · EU subsidiary · from FY2027",
    q: "Do you have an EU subsidiary with over 1,000 employees and over €450M turnover?",
    help: "Look at the subsidiary on its own (consolidated) figures. An EU sub-group parent counts too.",
    yes: "That subsidiary reports like any EU company, from FY2027. Keep going: Route 2 can apply on top.",
    no: "Route 1 does not apply. Go to question 2.",
    more: ["The fine print", "It can be exempt if the non-EU parent voluntarily publishes a consolidated report under the full ESRS (or an equivalent standard) that covers it."],
  },
  {
    tag: "Route 2 · Article 40a · from FY2028",
    q: "Did your group earn over €450M in the EU, two years in a row?",
    help: "Add up the net turnover of everything your group sells in the EU.",
    yes: "Go to question 3.",
    no: "Article 40a does not apply. You are done here.",
  },
  {
    tag: "Route 2 · Article 40a · from FY2028",
    q: "Do you have an EU subsidiary or branch with over €200M turnover?",
    help: "There is no headcount criterion for this one.",
    yes: "That entity reports for the whole group, from FY2028 (published in 2029).",
    no: "Article 40a does not apply.",
    more: ["Good to know", "Dedicated standards for non-EU groups are expected from October 2027 at the earliest. Financial holding undertakings can opt out."],
  },
];

export default function NonEU({ hidden }) {
  return (
    <section className="ch" id="noneu" hidden={hidden}>
      <ChapterHead icon="globe" eyebrow="Non-EU groups" title="Outside the EU? Three questions" short="A non-EU group can be caught twice: via a large EU subsidiary (FY2027) and at group level, Article 40a (FY2028)." />
      <div className="guide">
        <p className="gintro">Answer in order. Stop as soon as one answer says it does not apply to you.</p>
        <ol className="gsteps">
          {STEPS.map((s, i) => (
            <li key={s.q} className="gstep">
              <span className="gno">{i + 1}</span>
              <div className="gbody">
                <div className="gtag">{s.tag}</div>
                <h3>{s.q}</h3>
                <p className="qhelp">{s.help}</p>
                <div className="gouts">
                  <div className="go yes"><b>Yes</b><span>{s.yes}</span></div>
                  <div className="go no"><b>No</b><span>{s.no}</span></div>
                </div>
                {s.more && (
                  <details className="hov"><summary>{s.more[0]}</summary><p>{s.more[1]}</p></details>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
      <p className="advice"><b>Our tip</b> Start with your EU subsidiary. Its deadline comes first (FY2027). Not sure where you stand? Run the scope check above.</p>
    </section>
  );
}
