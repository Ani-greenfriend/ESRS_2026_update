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
import { EXAMPLE_ANSWERS, routeResult } from "./lib/route.js";
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
  const [route, setRoute] = useState({ P: EXAMPLE_ANSWERS, touched: false });
  const [topics, setTopics] = useState(DEFAULT_TOPICS);
  const [form, setForm] = useState(EMPTY_FORM);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [fresh, setFresh] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const [pdfLink, setPdfLink] = useState(null);
  const [gateOpen, setGateOpen] = useState(false);
  const [gateMode, setGateMode] = useState("unlock");
  const [contactSent, setContactSent] = useState(false);
  const opener = useRef(null);
  const utm = useMemo(readUtm, []);

  // Everything the PDF and the stored row are built from, in one snapshot.
  const snap = useMemo(() => {
    const v = verdict(scope.A);
    const r = routeResult(route.P);
    const e = estimate(topics);
    return {
      scope: v ? { badge: v.b, head: v.h, list: v.l, answers: answerLines(scope.hist, scope.A) } : null,
      route: { ...r, fromExample: !route.touched },
      est: { ...e, codes: e.topics, topics: e.topics.map((c) => `${c} ${TOPIC_NAME[c]}`) },
    };
  }, [scope, route, topics]);

  const openGate = useCallback((el, mode = "unlock") => {
    opener.current = el || document.activeElement;
    setMsg(null);
    setGateMode(mode);
    setGateOpen(true);
  }, []);
  const openContact = useCallback((el) => openGate(el, "contact"), [openGate]);
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

  // mode "contact": the "Want our help?" box. The same unlock row is stored; contact needs the consent box.
  const onSubmit = async (mode = "unlock") => {
    const email = form.email.trim();
    if (!isValidEmail(email)) {
      setMsg({ type: "err", field: "email", text: "Enter a valid email address, for example name@company.com." });
      return;
    }
    if (mode === "contact" && !form.consent) {
      setMsg({ type: "err", text: "Tick the box so we may contact you." });
      return;
    }
    setBusy(true);
    setMsg(null);
    const payload = {
      email,
      // v1 asks for email and consent only; company, industry and interests stay empty.
      consent_contact: form.consent,
      request_type: mode === "contact" ? "contact" : "download",
      notice_version: NOTICE_VERSION,
      scope_badge: snap.scope?.badge ?? null,
      scope_headline: snap.scope?.head ?? null,
      scope_answers: scope.A,
      route: snap.route.letter,
      route_from_example: snap.route.fromExample,
      route_answers: route.P,
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
    if (mode === "contact") {
      setContactSent(true);
      return;
    }
    setFresh(true);
    await download(snap);
  };

  const formProps = { form, setForm, onSubmit, busy, msg };
  const done = { fresh, pdfError, pdfLink, onDownload: () => download() };

  return (
    <UnlockContext.Provider value={{ unlocked, openGate, openContact }}>
      <Cover />
      <ChapterNav />
      <main className="wrap">
        <FastStrip />
        {/* Large to small: what changed → do I need to report → how do I report 2026 → what do I report */}
        <WhatChanged />
        <WhoReports />
        <ScopeCheck scope={scope} setScope={setScope} />
        <NonEU />
        <Cases />
        <Fy2026 route={route} setRoute={setRoute} />
        <Datapoints topics={topics} setTopics={setTopics} />
        <UnlockSection snap={snap} formProps={formProps} done={done} />
      </main>
      <About />
      <Footer />
      <FloatingTip />
      <UnlockDialog open={gateOpen} mode={gateMode} onClose={closeGate} formProps={formProps} done={done} contactSent={contactSent} />
    </UnlockContext.Provider>
  );
}
