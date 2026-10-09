import Planes from "./Planes.jsx";
import { CONTACT_EMAIL } from "./About.jsx";
import { useUnlock } from "./unlock.jsx";

export default function Footer({ cta = true }) {
  const { openContact } = useUnlock();
  return (
    <footer className="wrap">
      {cta && (
        <div className="cta">
          <Planes />
          <h2>Want our help?</h2>
          <p>Not sure about your FY2026 route, or how to slim down your double materiality assessment under the revised ESRS? Book a free 20-minute call with Elena and Anika. Leave your email or contact us.</p>
          <div className="helpbtns">
            <button type="button" className="btn pri" onClick={(e) => openContact(e.currentTarget)}>Leave your email</button>
            <a className="btn" href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("ESRS 2026 check: we would like your help")}`}>Contact us</a>
            <a className="addr" href="https://www.greenfriend.org" target="_blank" rel="noopener noreferrer">greenfriend.org</a>
          </div>
        </div>
      )}
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
      </div>
    </footer>
  );
}
