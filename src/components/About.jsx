import { useEffect, useRef } from "react";
import Icon from "./Icons.jsx";

// Spec v2.0+: five step cards side by side, a yellow label, one short sentence, details behind a + toggle.
const STEPS = [
  { no: 0, zero: true, svc: "This tool", h: "Know where you stand", p: "In scope? From when? Which FY2026 route?", d: ["Pre-screen your scope and FY2026 route (this tool, for free)", "Run a kick-off with your core team"], g: ["Scope and route: roadmap, timeline and resources", "A 20-minute call if you want a second opinion"] },
  { no: 1, svc: "Double materiality", h: "Find what really matters", p: "We find the topics that matter, in a way your auditor accepts.", d: ["Map your value chain from your own documents", "Shortlist impacts, risks and opportunities", "Score them with your experts", "Keep your auditor involved along the way"], g: ["A value chain map", "A signed-off list of material topics", "A live dashboard and an audit-ready method file"] },
  { no: 2, svc: "Strategy", h: "Turn topics into goals", p: "Each topic gets an objective, a starting point and a target.", d: ["Run a strategy workshop with your experts", "Check which projects you already have, and what is missing", "Estimate budget for the gaps"], g: ["A one-page strategy framework", "Objectives, KPIs and targets per topic", "Input for your yearly goals or OKRs"] },
  { no: 3, svc: "Governance", h: "Make clear who owns what", p: "Every topic gets an owner, and your board gets what it needs.", d: ["Agree with your teams who is responsible, accountable, consulted and informed for each topic and IRO", "Run team workshops on dependencies and day-to-day ways of working", "Help prepare quarterly board and committee updates, and review the papers", "Compare your set-up with peers: committees, board oversight, and who owns disclosures (CFO, sustainability, legal or investor relations)", "Train each team on what reporting means for them, for example ESRS for finance or greenwashing risks for marketing"], g: ["A one-page map of who owns what", "An ownership register for topics and IROs", "A board sustainability information pack", "A peer benchmark with the pros and cons of each ownership model", "Training made for each team"] },
  { no: 4, svc: "Reporting", h: "Report what you did", p: "Your report shows progress and evidence, not just promises.", d: ["Check your reporting process and data", "List the gaps per disclosure", "Test key figures for assurance", "Check your sustainability claims for greenwashing risk"], g: ["A gap list with owners and priorities", "A map of what goes in which report", "An evidence file for your auditor"] },
];

const PEOPLE = [
  { photo: "/assets/anika.jpg", first: "Anika", chips: ["Just Eat Takeaway · 23 countries", "Co-founded Caribou", "Custom AI tools"], name: "Anika Lerch, MSc", role: "Founder, greenfriend · Strategy, governance and CSRD", li: "https://www.linkedin.com/in/anikalerch/", b: ["Built the global sustainability function at Just Eat Takeaway across 23 countries, including its first Responsible Business Strategy and governance set-up", "Advises energy, automotive, FMCG and industrial companies from double materiality to implementation roadmap, with board-ready and audit-ready deliverables", "Co-founded Caribou, a B2B CSRD software start-up", "Builds custom AI tools that automate IRO scoring, data synthesis and audit trails"] },
  { photo: "/assets/elena.jpg", first: "Elena", chips: ["Ex-Sage · Senior Director", "Award-winning ESG disclosures", "Climate Competitiveness Index"], name: "Elena Zayakova, MSc", role: "Founder, CoreWorks Consultancy · Strategy, reporting and governance", li: "https://www.linkedin.com/in/elenavlzayakova/", b: ["Former Senior Director of Sustainability at Sage", "Led award-winning ESG disclosures in Europe and the Middle East, building reporting teams and processes from scratch", "Works with finance, legal, audit and risk teams across CSRD, ISSB, TCFD, CDP, GRI and the EU Taxonomy", "Co-author of the first Climate Competitiveness Index (2010) with UNEP"] },
];

const List = ({ items }) => (
  <ul>
    {items.map((x) => (
      <li key={x}>{x}</li>
    ))}
  </ul>
);

const DIFF = [
  ["You work with us, not a junior team", "We do all the work ourselves. The people you meet are the people who deliver."],
  ["Inside experience, consulting and tech", "We have led sustainability inside large companies, advised many others, and build our own tools. So our solutions work in practice and save manual work."],
  ["Strategy first, box-ticking last", "We go beyond compliance and help you build a strategy that creates real value for your business and the people who depend on it."],
];

const Cols = ({ s }) => (
  <>
    <div className="col"><div className="lbl">What we do</div><List items={s.d} /></div>
    <div className="col"><div className="lbl">You get</div><List items={s.g} /></div>
  </>
);

export default function About() {
  const root = useRef(null);
  // Hover opens, click toggles (on devices that can hover).
  useEffect(() => {
    if (!matchMedia("(hover: hover)").matches) return;
    const ds = [...root.current.querySelectorAll(".hov")];
    const on = (e) => (e.currentTarget.open = true), off = (e) => (e.currentTarget.open = false);
    ds.forEach((d) => { d.addEventListener("mouseenter", on); d.addEventListener("mouseleave", off); });
    return () => ds.forEach((d) => { d.removeEventListener("mouseenter", on); d.removeEventListener("mouseleave", off); });
  }, []);

  return (
    <section className="about" id="about" style={{ scrollMarginTop: 60 }} ref={root}>
      <div className="wrap">
        <div className="rhelp top">
          <div><b>Want our help?</b><span>We run this plan with you, start to published report. Book a free 20-minute call with Elena and Anika.</span></div>
          <a className="pb pri" href="https://greenfriend.org" target="_blank" rel="noopener noreferrer">Book a free call</a>
        </div>
        <div className="pitch">
          <div className="chead" style={{ display: "grid", gap: 10 }}>
            <div className="eyebrow"><Icon name="heart" />Hi, we are Anika and Elena</div>
            <h2>We help companies report what they actually do</h2>
            <p className="lede">From double materiality to a plan your teams actually use.</p>
          </div>
          <blockquote>No 100-page manual that nobody reads. Lean frameworks your teams can work with.</blockquote>
        </div>

        <div className="diff">
          <h3>How we work differently</h3>
          <ol>
            {DIFF.map(([t, p]) => (
              <li key={t}><details className="hov"><summary>{t}</summary><p>{p}</p></details></li>
            ))}
          </ol>
        </div>

        <div className="people">
          {PEOPLE.map((p) => (
            <div className="person" key={p.name}>
              <img className="avatar" src={p.photo} width="64" height="64" alt={`Portrait of ${p.name.replace(/, MSc$/, "")}`} />
              <div>
                <h3>{p.name}</h3>
                <div className="role">{p.role}</div>
                <div className="chips2">{p.chips.map((c) => <span key={c}>{c}</span>)}</div>
                <details className="hov"><summary>More about {p.first}</summary><List items={p.b} /></details>
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
            <div className={`step${s.zero ? " zero" : ""}`} key={s.no}>
              <span className="no">{s.no}</span>
              <div>
                <h3>{s.h}</h3>
                <span className="svc">{s.svc}</span>
                <p className="plain">{s.p}</p>
                <details className="more">
                  <summary title="What we do and what you get"><span className="vh">What we do and what you get</span></summary>
                  <div className="cols"><Cols s={s} /></div>
                </details>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
