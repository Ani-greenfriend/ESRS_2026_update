// Spec v2.2/v2.3: no CTA box (the "Want our help?" band tops "Who we are"); the "General information" note with the AI disclosure closes the page.
export default function Footer() {
  return (
    <footer className="wrap">
      <div className="fine">
        <p><a href="/privacy">Privacy notice</a></p>
        <p>This tool gives an indicative reading of Directive (EU) 2026/470 (Omnibus I) and the revised ESRS (Delegated Regulation (EU) 2026/1563). It is not legal advice. National transposition is due by 19 March 2027 and may differ by Member State, especially for the FY2025–2026 exemption. Confirm your position with your auditor or legal adviser.</p>
        <p>Data: EFRAG Secretariat, 2026 Draft List of ESRS Datapoints (28 Aug 2026), non-authoritative supporting material; final version expected end of 2026.</p>
        <p className="links">
          Sources:{" "}
          <a href="https://finance.ec.europa.eu/news/commission-adopts-revised-sustainability-reporting-standards-reduce-administrative-burdens-eu-2026-07-03_en" target="_blank" rel="noopener noreferrer">European Commission, 3 July 2026</a> ·{" "}
          <a href="https://eur-lex.europa.eu/eli/dir/2026/470/oj" target="_blank" rel="noopener noreferrer">Directive (EU) 2026/470</a> ·{" "}
          <a href="https://www.efrag.org/en/news-and-calendar/news/efrag-secretariat-releases-2026-draft-list-of-datapoints-for-revised-esrs" target="_blank" rel="noopener noreferrer">EFRAG 2026 Draft List of Datapoints</a> ·{" "}
          <a href="https://sustainablefutures.linklaters.com/post/102o1ou/eu-csrd-revised-esrs-and-voluntary-reporting-standard-are-published-in-the-offic" target="_blank" rel="noopener noreferrer">Linklaters, 21 Sept 2026</a>
        </p>
        <p>Independent tool by greenfriend. Not affiliated with EFRAG or the European Commission.</p>
        <p className="copynote"><b>General information</b> greenfriend holds no rights to the ESRS or to EFRAG's materials. So we only explain what the rules mean, how the standards are structured and how many datapoints they contain, in our own words. We do not copy standard text, datapoint wording or EFRAG's list. For the exact wording, use the official texts: the Delegated Regulation on EUR-Lex and EFRAG's publications. Our sources are EU legal texts, the European Commission, EFRAG, and the Big 4 and leading law firms for interpretation. We use AI as a support tool to draft and check this content; we review it, and the responsibility for it stays with us. This page is general information, not legal or audit advice.</p>
      </div>
    </footer>
  );
}
