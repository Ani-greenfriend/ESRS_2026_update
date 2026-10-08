const STEPS = [
  { no: 0, zero: true, h: "Know where you stand", p: "Are you in scope, from when, and which route fits FY2026?", d: ["Check your scope and timeline", "Compare the three FY2026 routes"], g: ["This tool, for free", "A 20-minute call if you want a second opinion"] },
  { no: 1, tag: "Double materiality assessment", h: "Find what really matters", p: "We work out which sustainability topics matter for your business, quickly and in a way your auditor accepts.", d: ["Map your value chain from your own documents", "Shortlist impacts, risks and opportunities", "Score them with your experts", "Keep your auditor involved along the way"], g: ["A value chain map", "A signed-off list of material topics", "A live dashboard and an audit-ready method file"] },
  { no: 2, tag: "Strategy", h: "Turn topics into goals", p: "Each material topic gets a clear objective, a starting point and a target your teams can work towards.", d: ["Run a strategy workshop with your experts", "Check which projects you already have, and what is missing", "Estimate budget for the gaps"], g: ["A one-page strategy framework", "Objectives, KPIs and targets per topic", "Input for your yearly goals or OKRs"] },
  { no: 3, tag: "Governance", h: "Make clear who owns what", p: "We close the accountability gap. Every material topic gets an owner in the business, and your board gets the information it needs.", d: ["Agree with your teams who is responsible, accountable, consulted and informed for each topic and IRO", "Run team workshops on dependencies and day-to-day ways of working", "Help prepare quarterly board and committee updates, and review the papers", "Compare your set-up with peers: committees, board oversight, and who owns disclosures (CFO, sustainability, legal or investor relations)", "Train each team on what reporting means for them, for example ESRS for finance or greenwashing risks for marketing"], g: ["A one-page map of who owns what", "An ownership register for topics and IROs", "A board sustainability information pack", "A peer benchmark with the pros and cons of each ownership model", "Training made for each team"] },
  { no: 4, tag: "Reporting", h: "Report what you did", p: "Your report shows progress and evidence, not only plans and promises.", d: ["Check your reporting process and data", "List the gaps per disclosure", "Test key figures for assurance", "Check your sustainability claims for greenwashing risk"], g: ["A gap list with owners and priorities", "A map of what goes in which report", "An evidence file for your auditor"] },
];

const PEOPLE = [
  { initials: "A", name: "Anika Lerch, MSc", role: "Founder, greenfriend · Strategy, governance and CSRD", li: "https://www.linkedin.com/in/anikalerch/", b: ["Built the global sustainability function at Just Eat Takeaway across 23 countries, including its first Responsible Business Strategy and governance set-up", "Advises energy, automotive, FMCG and industrial companies from double materiality to implementation roadmap, with board-ready and audit-ready deliverables", "Co-founded Caribou, a B2B CSRD software start-up", "Builds custom AI tools that automate IRO scoring, data synthesis and audit trails"] },
  { initials: "E", name: "Elena Zayakova, MSc", role: "Founder, CoreWorks Consultancy · Strategy, reporting and governance", li: "https://www.linkedin.com/in/elenavlzayakova/", b: ["Former Senior Director of Sustainability at Sage, a FTSE 100 tech company", "Led award-winning ESG disclosures in Europe and the Middle East, building reporting teams and processes from scratch", "Works with finance, legal, audit and risk teams across CSRD, ISSB, TCFD, CDP, GRI and the EU Taxonomy", "Co-author of the first Climate Competitiveness Index (2010) with UNEP"] },
];

const List = ({ items }) => (
  <ul>
    {items.map((x) => (
      <li key={x}>{x}</li>
    ))}
  </ul>
);

export default function About() {
  return (
    <section className="about" id="about" style={{ scrollMarginTop: 60 }}>
      <div className="wrap">
        <div className="pitch">
          <div className="chead" style={{ display: "grid", gap: 10 }}>
            <div className="eyebrow">Who we are</div>
            <h2>We help companies report what they actually do</h2>
            <p className="lede">We help you turn your double materiality assessment into a plan your company actually uses: clear owners, roadmaps for each team, and a report that shows real progress. Our own AI tools speed up the work along the way.</p>
          </div>
          <blockquote>Most consultancies hand over a 100-page manual that nobody uses. We build lean frameworks your teams can work with.</blockquote>
        </div>

        <div className="diff">
          <h3>How we work differently</h3>
          <ol>
            <li><b>You work with us, not a junior team.</b> Elena and Anika do all the work themselves. The people you meet are the people who deliver.</li>
            <li><b>Inside experience, consulting and tech in one team.</b> We have led sustainability inside large companies, advised many others, and build our own tools. So our solutions work in practice and save manual work.</li>
            <li><b>Strategy first, box-ticking last.</b> We go beyond compliance and help you build a strategy that creates real value for your business and the people who depend on it.</li>
          </ol>
        </div>

        <div className="people">
          {PEOPLE.map((p) => (
            <div className="person" key={p.name}>
              <div className="avatar" aria-hidden="true">{p.initials}</div>
              <div>
                <h3>{p.name}</h3>
                <div className="role">{p.role}</div>
                <List items={p.b} />
                <a href={p.li} target="_blank" rel="noopener noreferrer">LinkedIn profile</a>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          <h3 style={{ fontSize: "1.4rem" }}>How we help, step by step</h3>
          <p className="qhelp">Each step builds on the one before. You can start at any of them.</p>
        </div>
        <div className="steps">
          {STEPS.map((s) => (
            <div className={`step ${s.zero ? "zero" : ""}`} key={s.no}>
              <span className="no">{s.no}</span>
              <div>{s.tag && <span className="step-tag">{s.tag}</span>}<h3>{s.h}</h3><p className="plain">{s.p}</p></div>
              <div className="col"><div className="lbl">What we do</div><List items={s.d} /></div>
              <div className="col"><div className="lbl">You get</div><List items={s.g} /></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
