import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Cover from "./components/Cover.jsx";
import ChapterNav from "./components/ChapterNav.jsx";
import WhatChanged from "./components/WhatChanged.jsx";
import Datapoints from "./components/Datapoints.jsx";
import WhoReports from "./components/WhoReports.jsx";
import ScopeCheck from "./components/ScopeCheck.jsx";
import NonEU from "./components/NonEU.jsx";
import Cases from "./components/Cases.jsx";
import Fy2026 from "./components/Fy2026.jsx";
import Roadmap from "./components/Roadmap.jsx";
import UnlockSection from "./components/UnlockSection.jsx";
import UnlockDialog from "./components/UnlockDialog.jsx";
import About from "./components/About.jsx";
import Footer from "./components/Footer.jsx";
import FloatingTip from "./components/FloatingTip.jsx";
import { EMPTY_FORM } from "./components/UnlockForm.jsx";
import { UnlockContext } from "./components/unlock.jsx";
import { TOPICS } from "./lib/data.js";
import { answerLines, verdict } from "./lib/scope.js";
import { DEFAULT_TOPICS, estimate } from "./lib/estimator.js";
import { isValidEmail, NOTICE_VERSION } from "./lib/constants.js";
import { readUnlocked, writeUnlocked } from "./lib/storage.js";
import { readUtm } from "./lib/utm.js";
import { submitUnlock } from "./lib/submit.js";
import { downloadPdf, pdfUrl } from "./lib/pdf.js";

const TOPIC_NAME = Object.fromEntries(TOPICS.map((t) => [t[0], t[1]]));

export default function App() {
  const [unlocked, setUnlocked] = useState(readUnlocked);
  const [scope, setScope] = useState({ A: {}, hist: [] });
  const [topics, setTopicsRaw] = useState(DEFAULT_TOPICS);
  // The PDF tells an untouched default selection (an example) apart from the visitor's own (spec v2.3, estState()).
  const [topicsTouched, setTopicsTouched] = useState(false);
  const setTopics = useCallback((t) => { setTopicsRaw(t); setTopicsTouched(true); }, []);
  const [form, setForm] = useState(EMPTY_FORM);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [fresh, setFresh] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const [pdfLink, setPdfLink] = useState(null);
  const [gateOpen, setGateOpen] = useState(false);
  // Non-EU groups ("Outside the EU? Two ways in") is always shown under "Who reports when" (builder request, 3 Nov 2026).
  const toNonEU = useCallback((e) => {
    e.preventDefault();
    document.getElementById("noneu")?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }, []);
  const opener = useRef(null);
  const utm = useMemo(readUtm, []);

  // Everything the PDF and the stored row are built from, in one snapshot.
  const snap = useMemo(() => {
    const v = verdict(scope.A);
    const e = estimate(topics);
    // "example": defaults never changed · "own": the visitor's ticks · "none": nothing ticked (ESRS 2 alone).
    const state = !topicsTouched ? "example" : e.topics.length ? "own" : "none";
    return {
      scope: v ? { badge: v.b, head: v.h, list: v.l, answers: answerLines(scope.hist, scope.A) } : null,
      est: { ...e, state, codes: e.topics, topics: e.topics.map((c) => `${c} ${TOPIC_NAME[c]}`) },
    };
  }, [scope, topics, topicsTouched]);

  const openGate = useCallback((el) => {
    opener.current = el || document.activeElement;
    setMsg(null);
    setGateOpen(true);
  }, []);
  const closeGate = useCallback(() => {
    setGateOpen(false);
    setTimeout(() => opener.current?.focus?.(), 0);
  }, []);

  // Once unlocked, keep a ready-built PDF for the "Open" and "Download" links (rebuilt when answers change).
  useEffect(() => {
    if (!unlocked) return;
    let url = null, live = true;
    const t = setTimeout(() => {
      pdfUrl(snap).then((u) => { url = u; if (live) setPdfLink(u); else URL.revokeObjectURL(u); }).catch(() => setPdfError(true));
    }, 150);
    return () => { live = false; clearTimeout(t); if (url) setTimeout(() => URL.revokeObjectURL(url), 60000); };
  }, [unlocked, snap]);

  const download = async (s = snap) => {
    try {
      await downloadPdf(s);
      setPdfError(false);
    } catch {
      setPdfError(true);
    }
  };

  // One stored row per request; "contact" comes from the box under the example cases and always carries consent.
  const payloadFor = (email, consent, requestType) => ({
      email,
      // v1 asks for email and consent only; company, industry and interests stay empty.
      consent_contact: consent,
      request_type: requestType,
      notice_version: NOTICE_VERSION,
      scope_badge: snap.scope?.badge ?? null,
      scope_headline: snap.scope?.head ?? null,
      scope_answers: scope.A,
      topics: snap.est.codes,
      datapoints_old: snap.est.old,
      datapoints_new: snap.est.now,
      datapoints_unconditional: snap.est.unc,
      utm_source: utm.utm_source,
      utm_campaign: utm.utm_campaign,
  });

  const onSubmit = async () => {
    const email = form.email.trim();
    if (!isValidEmail(email)) {
      setMsg({ type: "err", field: "email", text: "Enter a valid email address, for example name@company.com." });
      return;
    }
    setBusy(true);
    setMsg(null);
    const res = await submitUnlock(payloadFor(email, form.consent, "download"));
    setBusy(false);
    if (!res.ok) {
      setMsg({ type: "err", text: res.message });
      return;
    }
    writeUnlocked();
    setUnlocked(true);
    setFresh(true);
    await download(snap);
  };

  // "Not sure what applies to you?": stores a contact lead and opens the page; no PDF download.
  const sendContact = async (email) => {
    const res = await submitUnlock(payloadFor(email, true, "contact"));
    if (res.ok) { writeUnlocked(); setUnlocked(true); }
    return res;
  };

  const formProps = { form, setForm, onSubmit, busy, msg };
  const done = { fresh, pdfError, pdfLink, onDownload: () => download() };

  return (
    <UnlockContext.Provider value={{ unlocked, openGate }}>
      <Cover>
        <ScopeCheck scope={scope} setScope={setScope} />
      </Cover>
      <ChapterNav />
      <main className="wrap">
        {/* Spec v2.4 chapter order */}
        <WhoReports onNonEU={toNonEU} />
        <NonEU />
        <Cases onContact={sendContact} />
        <WhatChanged />
        <Fy2026 />
        <Datapoints topics={topics} setTopics={setTopics} />
        <Roadmap />
        <UnlockSection snap={snap} formProps={formProps} done={done} />
      </main>
      <About />
      <Footer />
      <FloatingTip />
      <UnlockDialog open={gateOpen} onClose={closeGate} formProps={formProps} done={done} />
    </UnlockContext.Provider>
  );
}
