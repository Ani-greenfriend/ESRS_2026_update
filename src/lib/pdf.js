// One A2 landscape page (594 x 420 mm) built in the browser (spec Section 3, v2.4). Reference: buildPdf() and gradURL() in the prototype.
import { RULES_DATE } from "./constants.js";
import { DATES, OPT, STAT, TOPICS } from "./data.js";

// Helvetica's encoding cannot draw these; replace them with plain equivalents.
export function pdfText(s) {
  return String(s)
    .replace(/→/g, "->")
    .replace(/−/g, "-")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/°/g, " deg")
    .replace(/…/g, "...")
    .replace(/[^\x00-\xff€–—•]/g, "");
}

// The header and footer gradient (#121745 > #252b8c > #3a3fd1, 135 degrees), drawn on a canvas.
function gradURL(w, h) {
  const c = document.createElement("canvas");
  c.width = 1400;
  c.height = Math.round((1400 * h) / w);
  const g = c.getContext("2d"), gr = g.createLinearGradient(0, 0, c.width, c.height);
  gr.addColorStop(0, "#121745");
  gr.addColorStop(0.62, "#252b8c");
  gr.addColorStop(1, "#3a3fd1");
  g.fillStyle = gr;
  g.fillRect(0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", 0.92);
}

const INK = [17, 26, 61], INDIGO = [58, 63, 209], CORAL = [232, 80, 63], MUTED = [86, 96, 137], SOFT = [230, 232, 255], YELLOW = [255, 226, 122], LINE = [221, 227, 243];
const FINE = [96, 104, 138];
// Designed on a 420 x 297 grid and scaled up by K to A2 landscape, so every size below is in grid units.
const K = 594 / 420, W = 420, S = 297, M = 14, CW = W - 2 * M;
const GENERAL_SCOPE = [
  "More than 1,000 employees AND more than EUR 450M net turnover (group figures for a parent): from FY2027.",
  "Below either threshold: likely out, but customers and investors may still ask for data.",
  "Non-EU group: more than EUR 450M EU turnover two years in a row plus an EU entity above EUR 200M: from FY2028.",
  "Reported for FY2024? Check your national rules for FY2025 and FY2026.",
];
const DISCLAIMER = [
  ["A GENERAL STARTING POINT", "This PDF is built automatically from your answers and gives general information only. It is not legal advice. Every company is different, so come to us with your specific situation and we take the time to look into it with you. greenfriend accepts no liability for the information or for decisions taken on the basis of it. Please also confirm your position with your auditor or legal adviser."],
  ["SOURCES AND COPYRIGHT", "Based on Directive (EU) 2026/470 and the revised ESRS (Delegated Regulation (EU) 2026/1563). greenfriend does not own, and claims no copyright in, the ESRS, EFRAG materials or the legal texts. We describe their content in our own words. For the exact wording, please see the official texts."],
  ["CREATED WITH AI", "This document was created with the help of AI and reviewed by greenfriend. AI can make mistakes, so please check anything you rely on against the original sources."],
];
// Short labels for the "YOUR ANSWERS" table.
const answerLabel = (q) =>
  /ultimate parent/i.test(q) ? "Group parent based"
  : /securities listed/i.test(q) ? "Listed in the EU"
  : /generated in the EU/i.test(q) ? "EU turnover, 2 years"
  : /branch with net turnover/i.test(q) ? "EU entity above EUR 200M"
  : /EU sub-group/i.test(q) ? "Large EU subsidiary"
  : /Which entity/i.test(q) ? "Entity checked"
  : /financial holding/i.test(q) ? "Financial holding company"
  : /employees/i.test(q) ? "Average employees"
  : /turnover/i.test(q) ? "Net turnover"
  : /already publish/i.test(q) ? "Reported for FY2024"
  : q.replace(/\?$/, "");

function draw(jsPDF, snap) {
  const d0 = new jsPDF({ unit: "mm", format: [594, 420], orientation: "landscape" });
  // Grid-unit wrapper around jsPDF: positions, sizes and font sizes are multiplied by K.
  const d = {
    setFillColor: (...c) => d0.setFillColor(...c), setDrawColor: (...c) => d0.setDrawColor(...c), setTextColor: (...c) => d0.setTextColor(...c),
    setFont: (a, b) => d0.setFont(a, b), setFontSize: (s) => d0.setFontSize(s * K), setLineWidth: (w) => d0.setLineWidth(w * K),
    getTextWidth: (t) => d0.getTextWidth(t) / K, splitTextToSize: (t, w) => d0.splitTextToSize(t, w * K),
    text: (t, x, y, o) => d0.text(t, x * K, y * K, o), line: (a, b, c, e) => d0.line(a * K, b * K, c * K, e * K),
    rect: (x, y, w, h, s) => d0.rect(x * K, y * K, w * K, h * K, s),
    roundedRect: (x, y, w, h, rx, ry, s) => d0.roundedRect(x * K, y * K, w * K, h * K, rx * K, ry * K, s),
    circle: (x, y, r, s) => d0.circle(x * K, y * K, r * K, s),
    addImage: (u, f, x, y, w, h) => d0.addImage(u, f, x * K, y * K, w * K, h * K),
  };
  const T = (t, x, y, sz, bold, col, o) => { d.setFont("helvetica", bold ? "bold" : "normal"); d.setFontSize(sz); d.setTextColor(...col); d.text(pdfText(t), x, y, o); };
  const wrap = (t, x, y, w, sz, bold, col, lh) => { d.setFont("helvetica", bold ? "bold" : "normal"); d.setFontSize(sz); d.setTextColor(...col); const ls = d.splitTextToSize(pdfText(t), w); d.text(ls, x, y); return y + ls.length * (lh || sz * 0.42); };
  const bul = (arr, x, y, w, sz) => { arr.forEach((t) => { d.setFillColor(...INDIGO); d.circle(x + 1, y - 1, 0.6, "F"); y = wrap(t, x + 3.4, y, w - 3.4, sz, false, INK) + 1; }); return y; };
  // Section heading: numbered indigo disc, sans-serif bold title, optional "General guidance" tag.
  const tag = (n, h, gen, x, y) => {
    d.setFillColor(...INDIGO); d.circle(x + 3.3, y - 1.9, 3.3, "F");
    T(n, x + 3.3, y - 0.7, 8.5, true, [255, 255, 255], { align: "center" });
    T(h, x + 9.6, y, 15, true, INK);
    if (gen) { d.setFont("helvetica", "bold"); d.setFontSize(15); const tw = d.getTextWidth(h); T("General guidance, not based on your answers", x + 9.6 + tw + 3, y, 6.8, false, MUTED); }
  };
  const s1 = snap.scope, e = snap.est, own = e.state === "own";

  d.setFillColor(236, 238, 255); d.rect(0, 0, W, S, "F");

  // Header band
  d.addImage(gradURL(W, 32), "JPEG", 0, 0, W, 32);
  d.setFillColor(...YELLOW); d.circle(M + 1.6, 11, 1.6, "F");
  T("greenfriend.", M + 6, 12.4, 13, true, [244, 246, 255]);
  T("ESRS UPDATE 2026", W - M, 11.5, 8.5, true, YELLOW, { align: "right" });
  T("Your ESRS 2026 Update Check", M, 24, 27, true, [255, 255, 255]);
  const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  T(`Prepared ${date}  ·  Status of rules: ${RULES_DATE}`, W - M, 23, 8.5, false, [201, 206, 255], { align: "right" });

  // Row 1: scope, route options, datapoints
  let y0 = 52;
  const X2 = M + 120, X3 = M + 278, RH = s1 ? 120 : 110;
  tag("1", "Scope", !s1, M, y0);
  tag("2", "FY2026 route options", false, X2, y0);
  tag("3", "Datapoints", !own, X3, y0);
  y0 += 5;

  // 1 Scope
  d.setFillColor(255, 255, 255); d.setDrawColor(...LINE); d.setLineWidth(0.25); d.roundedRect(M, y0, 112, RH, 3, 3, "FD");
  {
    const bt = pdfText((s1 ? s1.badge : "General guide").toUpperCase());
    d.setFont("helvetica", "bold"); d.setFontSize(6.6);
    const bw = d.getTextWidth(bt);
    d.setFillColor(253, 227, 220); d.roundedRect(M + 5, y0 + 3, bw + 6, 5.2, 2.6, 2.6, "F");
    T(bt, M + 8, y0 + 6.6, 6.6, true, CORAL);
  }
  let yy = wrap(s1 ? s1.head : "Who has to report, and from when", M + 5, y0 + 14.5, 102, 11.5, true, INK, 4.6) + 1.5;
  if (s1) {
    yy += 3;
    T("YOUR ANSWERS", M + 5, yy, 6.4, true, CORAL);
    s1.answers.forEach(([q, a], k) => {
      const ry = yy + 6.5 + k * 6.6;
      d.setDrawColor(...LINE); d.setLineWidth(0.2); d.line(M + 5, ry + 1.7, M + 107, ry + 1.7);
      T(answerLabel(q), M + 5, ry, 7.6, false, MUTED);
      // The answer that decides the wave is highlighted.
      if (/wave/i.test(a)) { d.setFont("helvetica", "bold"); d.setFontSize(8.2); d.setFillColor(...YELLOW); d.roundedRect(M + 52 - 1.2, ry - 3.4, d.getTextWidth(pdfText(a)) + 2.4, 4.4, 1.2, 1.2, "F"); }
      T(a, M + 52, ry, 8.2, true, INK);
    });
    yy += 6.5 + s1.answers.length * 6.6 + 5;
    T("WHAT IT MEANS", M + 5, yy, 6.4, true, CORAL);
    yy += 3.5;
  }
  bul(s1 ? s1.list : GENERAL_SCOPE, M + 5, yy + 1, 102, 8.6);

  // 2 Route cards
  OPT.forEach((o, k) => {
    const pt = (RH + 3) / 3, cy = y0 + k * pt, ch = pt - 3;
    // Accent bar: a coloured card behind the white card, showing as a strip on top.
    d.setFillColor(...INDIGO); d.roundedRect(X2, cy, 150, ch, 2.5, 2.5, "F");
    d.setFillColor(255, 255, 255); d.setDrawColor(...LINE); d.setLineWidth(0.25); d.roundedRect(X2, cy + 1.3, 150, ch - 1.3, 2.5, 2.5, "FD");
    d.setFillColor(255, 255, 255); d.rect(X2 + 0.3, cy + 1.3, 149.4, 2, "F");
    T(o.L, X2 + 9, cy + 15, 26, true, INDIGO, { align: "center" });
    T(o.t, X2 + 19, cy + 11, 13, true, INK);
    T(o.std, X2 + 19, cy + 16.5, 8, true, INDIGO);
    wrap(o.d, X2 + 19, cy + 22.5, 50, 7.8, false, MUTED, 3.4);
    T("EFFORT NOW", X2 + 126, cy + 7.8, 5.6, true, MUTED, { align: "right" });
    [1, 2, 3].forEach((n) => { d.setFillColor(...(n <= o.eff ? CORAL : SOFT)); d.circle(X2 + 129 + n * 3.6, cy + 7, 1.2, "F"); });
    const fx = X2 + 72;
    d.setFillColor(...YELLOW); d.roundedRect(fx, cy + 12, 10, 4, 2, 2, "F");
    T("FITS IF", fx + 5, cy + 14.8, 5.8, true, [42, 36, 0], { align: "center" });
    wrap(o.bi, fx, cy + 21, 74, 8.4, false, INK, 3.7);
  });

  // 3 Datapoints
  d.setFillColor(255, 255, 255); d.setDrawColor(...LINE); d.setLineWidth(0.25); d.roundedRect(X3, y0, 114, RH, 3, 3, "FD");
  const bx = X3 + 6, bw = 102;
  if (own) {
    const { old: o, now: n, unc: u } = e;
    wrap(`From ${o} to ${n} mandatory datapoints, ${e.pct}% fewer`, bx, y0 + 9, bw, 10.5, true, INK, 4.4);
    [["Current ESRS (2023)", o, [214, 200, 168]], ["Revised ESRS", n, INDIGO], ["Of these, apply without conditions", u, CORAL]].forEach(([l, v, c], k) => {
      const by = y0 + 23 + k * 9;
      T(l, bx, by, 7.2, false, INK);
      d.setFillColor(...SOFT); d.roundedRect(bx + 50, by - 2.4, 40, 2.8, 1.4, 1.4, "F");
      d.setFillColor(...c); d.roundedRect(bx + 50, by - 2.4, Math.max(2, (40 * v) / o), 2.8, 1.4, 1.4, "F");
      T(String(v), bx + bw, by, 8, true, INK, { align: "right" });
    });
    const rows = [["ESRS 2 (always)", STAT["ESRS 2"][0], STAT["ESRS 2"][1]], ...e.topics.map((t, i) => [t, STAT[e.codes[i]][0], STAT[e.codes[i]][1]])];
    // Two columns of 49.5 with a 3-unit gap when more than five rows, so the columns do not touch.
    const half = Math.ceil(rows.length / 2), two = rows.length > 5, cw = two ? 49.5 : bw, gap = 3, ty = y0 + 56;
    (two ? [0, 1] : [0]).forEach((c) => {
      const cx = bx + c * (cw + gap);
      T("PER TOPIC", cx, ty, 5.8, true, CORAL);
      T("2023", cx + cw - 16, ty, 5.8, true, MUTED, { align: "right" });
      T("REVISED", cx + cw - 1, ty, 5.8, true, MUTED, { align: "right" });
    });
    rows.forEach((r, k) => {
      const c = two && k >= half ? 1 : 0, i = two && k >= half ? k - half : k, cx = bx + c * (cw + gap), cy = ty + 6.5 + i * 6.4;
      d.setDrawColor(...LINE); d.setLineWidth(0.2); d.line(cx, cy + 1.4, cx + cw - 1, cy + 1.4);
      T(r[0].length > 24 ? `${r[0].slice(0, 23)}.` : r[0], cx, cy, 6.8, false, INK);
      T(String(r[1]), cx + cw - 16, cy, 6.8, false, MUTED, { align: "right" });
      T(String(r[2]), cx + cw - 1, cy, 6.8, true, INK, { align: "right" });
    });
    wrap(`Plus 31 general datapoints that apply to everyone: your total is ${n + 31}. Counts from EFRAG's 2026 Draft List.`, bx, y0 + RH - 12, bw, 7, false, MUTED, 3);
  } else {
    const lo = STAT["ESRS 2"][1], mx = lo + TOPICS.reduce((a, t) => a + STAT[t[0]][1], 0);
    wrap(`From ${lo} up to ${mx} mandatory datapoints`, bx, y0 + 9, bw, 10.5, true, INK, 4.4);
    wrap("ESRS 2 always applies. Each material topic adds its own datapoints, so your number depends on which topics your double materiality assessment confirms. Per topic (revised ESRS):", bx, y0 + 15, bw, 7, false, MUTED, 2.9);
    const rt = [["ESRS 2 (always)", lo], ...TOPICS.map((t) => [`${t[0]} ${t[1]}`, STAT[t[0]][1]])], half = Math.ceil(rt.length / 2);
    rt.forEach((r, k) => { const cx = bx + (k < half ? 0 : 54), cy = y0 + 29.5 + (k % half) * 4.5; T(r[0], cx, cy, 7, false, INK); T(String(r[1]), cx + 46, cy, 7, true, INK, { align: "right" }); });
    wrap(`Plus 31 general datapoints that apply to everyone: ${lo + 31} to ${mx + 31} in total. Counts from EFRAG's 2026 Draft List.`, bx, y0 + 58, bw, 6.8, false, MUTED, 2.8);
  }

  // Row 2: dates strip (the same dates as the tool)
  let y2 = y0 + RH + 20;
  tag("4", "Dates to plan around", false, M, y2);
  y2 += 5;
  d.setFillColor(255, 255, 255); d.setDrawColor(...LINE); d.setLineWidth(0.25); d.roundedRect(M, y2, CW, 36, 3, 3, "FD");
  {
    const cwd = CW / DATES.length, ly = y2 + 18;
    d.setDrawColor(...LINE); d.setLineWidth(0.7); d.line(M + cwd / 2, ly, M + CW - cwd / 2, ly);
    DATES.forEach((x, k) => {
      const cx = M + cwd * (k + 0.5), now = /now/.test(x.c), past = !now && !/future/.test(x.c);
      if (now) { d.setFillColor(...INDIGO); d.setDrawColor(...SOFT); d.setLineWidth(1.2); d.circle(cx, ly, 2.4, "FD"); }
      else { d.setFillColor(...(past ? [170, 176, 205] : INDIGO)); d.circle(cx, ly, 1.7, "F"); }
      T(x.d, cx, y2 + 11.5, 11.5, true, past ? MUTED : INK, { align: "center" });
      T(x.t, cx, y2 + 29, 8.8, now, now ? INK : MUTED, { align: "center" });
    });
  }

  // Disclaimer in three muted columns, then the gradient CTA band at the very bottom
  const fy = S - 45;
  const dw = (CW - 16) / 3;
  DISCLAIMER.forEach(([h, t], k) => { const cx = M + k * (dw + 8); T(h, cx, fy + 9, 6, true, FINE); wrap(t, cx, fy + 13, dw, 7.2, false, FINE, 3.2); });
  d.addImage(gradURL(W, 15), "JPEG", 0, S - 15, W, 15);
  T("Report what you do.", M, S - 5.8, 13, true, [255, 255, 255]);
  T("Want a second opinion? Book a free 20-minute call at greenfriend.org", W - M, S - 6, 9, false, [230, 232, 255], { align: "right" });
  return d0;
}

export async function buildPdf(snap) {
  const { jsPDF } = await import("jspdf");
  return draw(jsPDF, snap);
}

export const PDF_NAME = "greenfriend-esrs-2026-update-check.pdf";

// A blob URL of the current PDF, for the Download PDF link.
export async function pdfUrl(snap) {
  const d = await buildPdf(snap);
  return URL.createObjectURL(d.output("blob"));
}

export async function downloadPdf(snap) {
  const d = await buildPdf(snap);
  d.save(PDF_NAME);
}
