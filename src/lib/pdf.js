// One square page (280 x 280 mm) built in the browser (spec Section 3, v2.3). Reference: buildPdf() and gradURL() in the prototype.
import { RULES_DATE } from "./constants.js";
import { OPT, STAT, TOPICS } from "./data.js";
import { MN, monthAt } from "./roadmap.js";

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

const INK = [17, 26, 61], INDIGO = [58, 63, 209], CORAL = [232, 80, 63], MUTED = [86, 96, 137], SOFT = [230, 232, 255], YELLOW = [255, 226, 122], AUD = [12, 143, 143], LINE = [221, 227, 243];
const S = 280, W = S, M = 14, CW = W - 2 * M;
const GENERAL_SCOPE = [
  "More than 1,000 employees AND more than EUR 450M net turnover (group figures for a parent): from FY2027.",
  "Below either threshold: likely out, but customers and investors may still ask for data.",
  "Non-EU group: more than EUR 450M EU turnover two years in a row plus an EU entity above EUR 200M: from FY2028.",
  "Reported for FY2024? Check your national rules for FY2025 and FY2026.",
];

function draw(jsPDF, snap) {
  const d = new jsPDF({ unit: "mm", format: [S, S] });
  d.setFillColor(245, 247, 253);
  d.rect(0, 0, W, S, "F");
  const T = (t, x, y, sz, bold, col, o) => { d.setFont("helvetica", bold ? "bold" : "normal"); d.setFontSize(sz); d.setTextColor(...col); d.text(pdfText(t), x, y, o); };
  const wrap = (t, x, y, w, sz, bold, col, lh) => { d.setFont("helvetica", bold ? "bold" : "normal"); d.setFontSize(sz); d.setTextColor(...col); const ls = d.splitTextToSize(pdfText(t), w); d.text(ls, x, y); return y + ls.length * (lh || sz * 0.42); };
  const bul = (arr, x, y, w, sz, col) => { arr.forEach((t) => { d.setFillColor(...INDIGO); d.circle(x + 1, y - 1, 0.6, "F"); y = wrap(t, x + 3.4, y, w - 3.4, sz, false, col || INK) + 1; }); return y; };
  const tag = (t, gen, x, y) => {
    T(t.toUpperCase(), x, y, 7.5, true, CORAL);
    if (gen) { const tw = d.getTextWidth(t.toUpperCase()); T("General guidance, not based on your answers", x + tw + 3, y, 6.8, false, MUTED); }
  };
  const s1 = snap.scope, e = snap.est, est = e.state, fs = snap.map.shift;
  const yearEnd = fs ? MN[(fs + 11) % 12] : "December";

  // Header
  d.addImage(gradURL(W, 40), "JPEG", 0, 0, W, 40);
  d.setFillColor(...YELLOW); d.circle(M + 1.6, 13, 1.6, "F");
  T("greenfriend.", M + 6, 14.2, 12, true, [244, 246, 255]);
  T("ESRS UPDATE 2026", W - M, 13.5, 8.5, true, YELLOW, { align: "right" });
  T("Your revised ESRS check", M, 27, 24, true, [255, 255, 255]);
  const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  T(`Prepared ${date}  ·  Status of rules: ${RULES_DATE}`, M, 34.5, 8, false, [201, 206, 255]);

  // Inputs strip
  const topicsLine = est === "own" ? `${e.codes.length} selected` : est === "none" ? "None selected: ESRS 2 only" : "Not selected: all topics shown";
  const items = [["Scope check", s1 ? "Completed" : "Not completed: general guide below"], ["Topics", topicsLine], ["Financial year-end", yearEnd]];
  d.setFillColor(...SOFT); d.roundedRect(M, 45, CW, 11, 2, 2, "F");
  const bw = CW / 3;
  items.forEach((it, k) => { T(it[0].toUpperCase(), M + 4 + k * bw, 49.2, 6.3, true, MUTED); T(it[1], M + 4 + k * bw, 53.4, 8.3, true, INK); });

  // Row 1: scope + route options
  let y0 = 62;
  tag("1  Scope", !s1, M, y0);
  tag("2  FY2026 route options", false, M + 108, y0);
  y0 += 3;
  d.setFillColor(...SOFT); d.roundedRect(M, y0, 102, 59, 3, 3, "F");
  T(s1 ? s1.badge : "General guide", M + 5, y0 + 7, 7.5, true, INDIGO);
  const yy = wrap(s1 ? s1.head : "Who has to report, and from when", M + 5, y0 + 13, 92, 11, true, INK, 4.6) + 1.5;
  bul(s1 ? s1.list : GENERAL_SCOPE, M + 5, yy + 1, 92, 7.8);
  const rc = [CORAL, INDIGO, AUD];
  OPT.forEach((o, k) => {
    const cy = y0 + k * 20.3;
    d.setFillColor(255, 255, 255); d.setDrawColor(...LINE); d.setLineWidth(0.25); d.roundedRect(M + 108, cy, 134, 18.4, 2.5, 2.5, "FD");
    T(`ROUTE ${o.L}`, M + 112, cy + 5, 6.8, true, rc[k]);
    T(o.t, M + 112, cy + 10.2, 10, true, INK);
    wrap(`Fits if: ${o.bi}`, M + 112, cy + 14.2, 126, 7.2, false, MUTED, 3);
  });

  // Row 2: datapoints + dates
  let y2 = y0 + 59 + 5;
  tag("3  Datapoints", est === "example", M, y2);
  tag("4  Dates to plan around", false, M + 150, y2);
  y2 += 3;
  d.setFillColor(255, 255, 255); d.setDrawColor(...LINE);
  d.roundedRect(M, y2, 142, 40, 3, 3, "FD");
  d.roundedRect(M + 148, y2, 94, 40, 3, 3, "FD");
  if (est === "example") {
    const mx = STAT["ESRS 2"][1] + TOPICS.reduce((a, t) => a + STAT[t[0]][1], 0);
    const bt = `${STAT["ESRS 2"][1]} to ${mx}`;
    d.setFont("helvetica", "bold"); d.setFontSize(17);
    const bw2 = d.getTextWidth(bt);
    T(bt, M + 6, y2 + 11, 17, true, INDIGO);
    T("mandatory datapoints", M + 6 + bw2 + 3, y2 + 11, 9, true, INK);
    wrap("ESRS 2 always applies, each material topic adds its own (decided in your double materiality assessment):", M + 6, y2 + 15.5, 130, 7.4, false, MUTED, 3);
    const rt = [["ESRS 2", STAT["ESRS 2"][1]], ...TOPICS.map((t) => [`${t[0]} ${t[1]}`, STAT[t[0]][1]])], half = Math.ceil(rt.length / 2);
    rt.forEach((r, k) => { const cx = M + 6 + (k < half ? 0 : 68), cy = y2 + 21.5 + (k % half) * 3.2; T(r[0], cx, cy, 7.2, false, INK); T(String(r[1]), cx + 58, cy, 7.2, true, INK, { align: "right" }); });
  } else {
    T(String(e.old), M + 6, y2 + 14, 22, true, MUTED);
    const ow = d.getTextWidth(String(e.old));
    d.setDrawColor(...MUTED); d.setLineWidth(0.7); d.line(M + 6, y2 + 10.5, M + 6 + ow, y2 + 10.5);
    T("->", M + 6 + ow + 4, y2 + 13, 13, false, MUTED);
    T(String(e.now), M + 6 + ow + 17, y2 + 14, 22, true, INDIGO);
    if (est === "own") {
      d.setFont("helvetica", "bold"); d.setFontSize(22);
      const px = M + 6 + ow + 17 + d.getTextWidth(String(e.now)) + 5;
      d.setFillColor(...YELLOW); d.roundedRect(px, y2 + 6, 24, 9, 4.5, 4.5, "F");
      T(`-${e.pct}%`, px + 12, y2 + 12.2, 11, true, [42, 36, 0], { align: "center" });
    }
    const basis = est === "own" ? `ESRS 2 plus ${e.codes.join(", ")}` : "ESRS 2 alone (no topic ticked)";
    wrap(`${basis}. ${e.unc} apply without conditions. Mandatory datapoints, counts from EFRAG's 2026 Draft List, excluding the general datapoints.`, M + 6, y2 + 21, 130, 7.6, false, MUTED, 3.2);
  }
  bul(["10 Nov 2026: revised ESRS enter into force", "19 Mar 2027: Member State deadline to transpose Omnibus I", "FY2027: revised ESRS mandatory for everyone in scope (report in 2028)", "FY2028: non-EU groups under Article 40a (report in 2029)"], M + 153, y2 + 8, 86, 7.6);

  // Row 3: roadmap
  let y3 = y2 + 40 + 5;
  tag("5  Your 2027 roadmap", !s1, M, y3);
  const rows = snap.map.steps, gx = M, cw = CW / 17, rh = Math.min(4.2, 52 / rows.length);
  y3 += 4;
  let st0 = 1;
  for (let c = 2; c <= 18; c++) {
    if (c === 18 || monthAt(c, fs).y !== monthAt(st0, fs).y) { T(String(monthAt(st0, fs).y), gx + (st0 - 1) * cw + 1, y3 + 2.5, 7.5, true, INDIGO); st0 = c; }
  }
  y3 += 4.5;
  for (let c = 1; c <= 17; c++) T(MN[monthAt(c, fs).m][0], gx + (c - 1) * cw + cw / 2, y3 + 2, 6, false, MUTED, { align: "center" });
  y3 += 3.5;
  const gy = y3;
  d.setDrawColor(...LINE); d.setLineWidth(0.15);
  for (let c = 0; c <= 17; c++) d.line(gx + c * cw, gy, gx + c * cw, gy + rows.length * rh);
  const bar = (a, b, ry, label, col, txt, off) => {
    d.setFillColor(...col); d.roundedRect(gx + (a - 1) * cw, ry + 0.5, (b - a) * cw, rh - 1, 1.4, 1.4, "F");
    T(label, gx + (a - 1) * cw + 2 + off, ry + rh / 2 + 1, 6.4, true, txt);
  };
  rows.forEach((x, i) => {
    const ry = gy + i * rh, col = x.arrow ? AUD : x.fin ? [255, 214, 204] : INDIGO, txt = x.fin ? [111, 28, 16] : [255, 255, 255];
    // The auditor label starts after the first run of check-in diamonds, so it stays clear of them.
    let off = 0;
    if (x.arrow) { const ks = x.ck.map((k) => k[0]); let c = Math.min(...ks); while (ks.includes(c + 1)) c++; off = (c - x.a + 1) * cw; }
    bar(x.a, x.b, ry, x.s, col, txt, off);
    if (x.a2) bar(x.a2, x.b2, ry, x.s, col, txt, 0);
    (x.ck || []).forEach((c) => {
      const cx = gx + (c[0] - 1) * cw + cw / 2, cy = ry + rh / 2;
      d.setFillColor(...YELLOW); d.setDrawColor(...INK); d.setLineWidth(0.25);
      d.lines([[1.2, 1.2], [-1.2, 1.2], [-1.2, -1.2], [1.2, -1.2]], cx, cy - 1.2, [1, 1], "FD", true);
    });
  });
  const ly = gy + rows.length * rh + 3.6;
  T(`Plan: ${snap.map.label}${fs ? `  |  year-end ${yearEnd}` : ""}  |  Blue: your work   Teal arrow: auditor track, diamonds are check-ins   Light coral: annual financial reporting   |  Planning guide, not a legal requirement`, M, ly, 6.4, false, MUTED);

  // Footer
  const fy = S - 28;
  d.addImage(gradURL(W, 28), "JPEG", 0, fy, W, 28);
  T("Report what you do.", M, fy + 8, 12, true, [255, 255, 255]);
  T("Want a second opinion? Book a free 20-minute call at greenfriend.org", M, fy + 13.5, 8.3, false, [230, 232, 255]);
  d.setFont("helvetica", "normal"); d.setFontSize(6); d.setTextColor(201, 206, 255);
  d.text(d.splitTextToSize("Automated view generated from the inputs you entered. Indicative reading of Directive (EU) 2026/470 and the revised ESRS (Delegated Regulation (EU) 2026/1563), provided without warranty and not legal advice. greenfriend is not responsible for this output or for how it is used. Prepared with AI support and reviewed by greenfriend. Confirm your position with your auditor or legal adviser.", CW), M, fy + 18.2);
  return d;
}

export async function buildPdf(snap) {
  const { jsPDF } = await import("jspdf");
  return draw(jsPDF, snap);
}

export const PDF_NAME = "greenfriend-revised-esrs-check.pdf";

// A blob URL of the current one-pager, for the download links.
export async function pdfUrl(snap) {
  const d = await buildPdf(snap);
  return URL.createObjectURL(d.output("blob"));
}

export async function downloadPdf(snap) {
  const d = await buildPdf(snap);
  d.save(PDF_NAME);
}
