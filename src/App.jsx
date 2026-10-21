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
import FastStrip from "./components/FastStrip.jsx";
import FloatingTip from "./components/FloatingTip.jsx";
import { EMPTY_FORM } from "./components/UnlockForm.jsx";
import { UnlockContext } from "./components/unlock.jsx";
import { TOPICS } from "./lib/data.js";
import { answerLines, verdict } from "./lib/scope.js";
import { mapMode, mapSteps, fyShift } from "./lib/roadmap.js";
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
  const [fyEnd, setFyEnd] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [fresh, setFresh] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const [pdfLink, setPdfLink] = useState(null);
  const [gateOpen, setGateOpen] = useState(false);
  // Non-EU groups: hidden until the first scope answer is "Outside the EU" or the visitor taps "See the three questions".
  const [nonPinned, setNonPinned] = useState(false);
  const showNonEU = scope.A.hq === "non" || nonPinned;
  const openNonEU = useCallback((e) => {
    e.preventDefault();
    setNonPinned(true);
    setTimeout(() => document.getElementById("noneu")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
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
      map: { label: mapMode(scope.A).label, steps: mapSteps(scope.A, topics, fyEnd), shift: fyShift(fyEnd) },
    };
  }, [scope, topics, topicsTouched, fyEnd]);

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

  const onSubmit = async () => {
    const email = form.email.trim();
    if (!isValidEmail(email)) {
      setMsg({ type: "err", field: "email", text: "Enter a valid email address, for example name@company.com." });
      return;
    }
    setBusy(true);
    setMsg(null);
    const payload = {
      email,
      // v1 asks for email and consent only; company, industry and interests stay empty.
      consent_contact: form.consent,
      request_type: "download",
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
    };
    const res = await submitUnlock(payload);
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

  const formProps = { form, setForm, onSubmit, busy, msg };
  const done = { fresh, pdfError, pdfLink, onDownload: () => download() };

  return (
    <UnlockContext.Provider value={{ unlocked, openGate }}>
      <Cover />
      <ChapterNav />
      <main className="wrap">
        <FastStrip />
        {/* Spec v2.2 chapter order */}
        <WhatChanged />
        <WhoReports onNonEU={openNonEU} />
        <ScopeCheck scope={scope} setScope={setScope} />
        <NonEU hidden={!showNonEU} />
        <Datapoints topics={topics} setTopics={setTopics} />
        <Cases />
        <Fy2026 />
        <Roadmap A={scope.A} topics={topics} fyEnd={fyEnd} setFyEnd={setFyEnd} />
        <UnlockSection snap={snap} formProps={formProps} done={done} />
      </main>
      <About />
      <Footer />
      <FloatingTip />
      <UnlockDialog open={gateOpen} onClose={closeGate} formProps={formProps} done={done} />
    </UnlockContext.Provider>
  );
}
