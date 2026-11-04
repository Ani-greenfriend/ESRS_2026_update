// Spec v2.4 cover: gradient band, brand line, H1, one line, and the scope check as the main focus of the page.
export default function Cover({ children, onJump }) {
  return (
    <div className="cover">
      <header className="wrap top">
        <div className="brand">greenfriend.</div>
        <h1>Do you have to report?</h1>
        <p className="lede">Free scope check in one minute. Read the guide below, then take your results away as one PDF. Parents: use group figures.</p>
        {children}
        {/* Builder request (4 Nov 2026): a way straight down to the PDF, with a hint to work through the page first. */}
        <div className="cover-cta">
          <a className="cta" href="#onepager" onClick={onJump}>Get your free PDF ↓</a>
          <span>Tip: work through the page first. Your scope answers and datapoint topics go into your PDF.</span>
        </div>
      </header>
    </div>
  );
}
