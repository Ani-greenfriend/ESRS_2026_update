import Icon from "./Icons.jsx";

export default function FastStrip() {
  return (
    <section className="fast" aria-label="The 30-second version">
      <div className="fast-h">The 30-second version</div>
      <div className="fast-g">
        <div><span className="ico"><Icon name="grid" size={22} /></span><b>Up to 323</b><span>datapoints if every topic is material. Yours will be fewer. It was 1,052.</span></div>
        <div><span className="ico"><Icon name="people2" size={22} /><Icon name="euro" size={22} /></span><b>1,000 + €450M</b><span>employees and turnover. EU companies must exceed both.</span></div>
        <div><span className="ico"><Icon name="calendar" size={22} /></span><b>From FY2027</b><span>Mandatory for financial years starting on or after 1 January 2027. For FY2026 you choose.</span></div>
      </div>
    </section>
  );
}
