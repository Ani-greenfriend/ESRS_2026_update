// Spec v2.0 cover: plain gradient band, brand line, H1, one line, one button. Nothing else.
export default function Cover() {
  return (
    <div className="cover">
      <header className="wrap top">
        <div className="brand">greenfriend.</div>
        <h1>ESRS update 2026 in 5 min</h1>
        <p className="lede">What changed, who reports when, and which route to take for 2026.</p>
        <a className="cta" href="#scope">Check your company</a>
      </header>
    </div>
  );
}
