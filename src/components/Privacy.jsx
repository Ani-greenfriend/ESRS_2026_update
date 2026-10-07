import Planes from "./Planes.jsx";
import Footer from "./Footer.jsx";
import { NOTICE_VERSION } from "../lib/constants.js";

export default function Privacy() {
  return (
    <>
      <div className="cover">
        <Planes />
        <header className="wrap top">
          <div className="brand">greenfriend.</div>
          <h1>Privacy notice</h1>
          <p className="lede">For the Revised ESRS Check at check.greenfriend.org.</p>
          <a className="back" href="/">← Back to the check</a>
        </header>
      </div>
      <main className="wrap">
        <section className="privacy">
          <dl>
            <div><dt>Who is responsible</dt><dd>greenfriend, Amsterdam, the Netherlands (KVK 91346169). Contact for all privacy questions: <a href="mailto:anikalerch@greenfriend.org">anikalerch@greenfriend.org</a>.</dd></div>
            <div><dt>What we collect</dt><dd>Your work email, and optionally your company name and industry, your answers in this tool and the results calculated from them, the services you ticked, and where your visit came from (a campaign tag in the link, if any).</dd></div>
            <div><dt>Why and on what basis</dt><dd>To give you your results and record your request (legitimate interest); to contact you about your results and the services you ticked, only if you ticked the box (consent).</dd></div>
            <div><dt>How long</dt><dd>If you did not consent to contact, your email and company name are deleted after 30 days and only anonymous results stay. All data is deleted after 24 months.</dd></div>
            <div><dt>Who else processes it</dt><dd>Supabase (database, EU region Frankfurt), Netlify (hosting). Fonts are served from this site, and no analytics or tracking cookies are used. Your unlock is remembered in your own browser only.</dd></div>
            <div><dt>Your rights</dt><dd>Access, correction, deletion, objection, restriction, data portability and withdrawing consent at any time, by emailing <a href="mailto:anikalerch@greenfriend.org">anikalerch@greenfriend.org</a>. You can complain to the Dutch Data Protection Authority (Autoriteit Persoonsgegevens).</dd></div>
          </dl>
          <p className="qhelp">Notice version: {NOTICE_VERSION}.</p>
          <p><a href="/">← Back to the check</a></p>
        </section>
      </main>
      <Footer cta={false} />
    </>
  );
}
