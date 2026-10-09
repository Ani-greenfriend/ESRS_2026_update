// One-page A4 PDF built in the browser (spec Section 3). Reference: buildPdf() in the prototype.
import { RULES_DATE } from "./constants.js";

// Helvetica's encoding cannot draw these; replace them with plain equivalents.
export function pdfText(s) {
  return String(s)
    .replace(/→/g, "->")
    .replace(/[−–—]/g, "-")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/°/g, " deg")
    .replace(/…/g, "...")
    .replace(/[^\x00-\xff€•]/g, "");
}

const INK = [23, 48, 46], TEAL = [23, 99, 92], CORAL = [226, 85, 63], MUTED = [86, 107, 103], SOFT = [214, 235, 229], YELLOW = [255, 224, 102];
const W = 210, H = 297, M = 16, CW = W - 2 * M, FOOT = 30;

function draw(jsPDF, snap, k) {
  const d = new jsPDF({ unit: "mm", format: "a4" });
  let y = 0;
  const fs = (n) => n * k;

  // Header band
  d.setFillColor(...INK); d.rect(0, 0, W, 34, "F");
  d.setFillColor(...YELLOW); d.circle(M + 1.5, 11, 1.5, "F");
  d.setTextColor(238, 243, 240); d.setFont("helvetica", "bold"); d.setFontSize(9);
  d.text("GREENFRIEND", M + 5, 12);
  d.setFontSize(17); d.text("Your revised ESRS one-pager", M, 23);
  d.setFont("helvetica", "normal"); d.setFontSize(8.5);
  const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const sub = [snap.company, `Prepared ${date}`, `Status of rules: ${RULES_DATE}`].filter(Boolean).join("  ·  ");
  d.text(d.splitTextToSize(pdfText(sub), CW)[0], M, 29.5);
  y = 44;

  const head = (t) => { d.setFont("helvetica", "bold"); d.setFontSize(8); d.setTextColor(...CORAL); d.text(t.toUpperCase(), M, y); y += 5.5 * k; };
  const para = (t, size = 9.5, color = INK, bold = false, indent = 0) => {
    d.setFont("helvetica", bold ? "bold" : "normal"); d.setFontSize(fs(size)); d.setTextColor(...color);
    const ls = d.splitTextToSize(pdfText(t), CW - indent);
    d.text(ls, M + indent, y);
    y += ls.length * fs(size) * 0.42 + 1.2 * k;
  };
  const bullets = (arr, size = 9) => arr.forEach((t) => { d.setFillColor(...TEAL); d.circle(M + 1.2, y - 1.2, 0.7, "F"); para(t, size, INK, false, 4); });

  // 1 Scope
  head("1  Are you in scope?");
  const s = snap.scope;
  if (s) {
    d.setFillColor(...SOFT);
    d.setFont("helvetica", "bold"); d.setFontSize(fs(12));
    const ls = d.splitTextToSize(pdfText(s.head), CW - 8);
    const bh = ls.length * 5 * k + 11 * k;
    d.roundedRect(M, y - 4, CW, bh, 2, 2, "F");
    d.setFontSize(8); d.setTextColor(...TEAL); d.text(pdfText(s.badge.toUpperCase()), M + 4, y + 1);
    d.setFontSize(fs(12)); d.setTextColor(...INK); d.text(ls, M + 4, y + 7 * k);
    y += bh + 2;
    bullets(s.list);
    d.setFontSize(fs(7.5)); d.setTextColor(...MUTED); d.setFont("helvetica", "normal");
    const al = d.splitTextToSize(pdfText("Your answers: " + s.answers.map((a) => a[0] + " " + a[1]).join("  |  ")), CW);
    d.text(al, M, y + 1);
    y += al.length * 3.3 * k + 5 * k;
  } else {
    para("The scope check was not completed. Run it in the tool to add your result.", 9, MUTED);
    y += 3 * k;
  }

  // 2 Route
  head("2  Your FY2026 route");
  const r = snap.route;
  para(r.label, 12, INK, true);
  para(r.desc, 9, MUTED);
  bullets(r.reasons);
  if (r.fromExample) para("Based on the example answers in the tool. Adjust them for your own situation.", 7.5, MUTED);
  para("Whichever route you take, state in the report which version of the standards you applied (Article 2, delegated act of 3 July 2026).", 7.5, MUTED);
  y += 3 * k;

  // 3 Datapoints
  head("3  Your datapoints");
  const e = snap.est;
  d.setFont("helvetica", "bold"); d.setFontSize(22); d.setTextColor(...INK); d.text(String(e.old), M, y + 6);
  d.setTextColor(...MUTED); d.setFontSize(14); d.text("->", M + 20, y + 5);
  d.setTextColor(...TEAL); d.setFontSize(22); d.text(String(e.now), M + 31, y + 6);
  d.setFillColor(...YELLOW); d.roundedRect(M + 52, y - 0.5, 28, 9, 1.5, 1.5, "F");
  d.setTextColor(42, 36, 0); d.setFontSize(11); d.text("-" + e.pct + "%", M + 56, y + 5.8);
  y += 13;
  para(`Mandatory datapoints for ESRS 2 plus ${e.topics.length ? e.topics.join(", ") : "no topical standards"}. ${e.unc} apply without conditions. Counts from EFRAG's 2026 Draft List of Datapoints, excluding the general datapoints repeated per policy, action, target and metric.`, 8.5, MUTED);
  y += 3 * k;

  // 4 Dates
  head("4  Dates to plan around");
  bullets([
    "10 Nov 2026: revised ESRS enter into force",
    "19 Mar 2027: deadline for Member States to transpose Omnibus I (check national rules for FY2025-2026)",
    "FY2027: revised ESRS mandatory for everyone in scope (report in 2028)",
    "FY2028: non-EU groups under Article 40a (report in 2029)",
  ], 8.5);

  // Footer band
  const fy = H - FOOT;
  d.setFillColor(...INK); d.rect(0, fy, W, FOOT, "F");
  d.setTextColor(238, 243, 240); d.setFont("helvetica", "bold"); d.setFontSize(11); d.text("Report what you do.", M, fy + 9);
  d.setFont("helvetica", "normal"); d.setFontSize(8.5);
  d.text("Want a second opinion? Book a free 20-minute call at greenfriend.org", M, fy + 15);
  d.setFontSize(6.5); d.setTextColor(180, 200, 195);
  d.text(d.splitTextToSize("Indicative reading of Directive (EU) 2026/470 and the revised ESRS (Delegated Regulation (EU) 2026/1563). Not legal advice. Confirm your position with your auditor or legal adviser.", CW), M, fy + 21);

  return { d, bottom: y };
}

// Builds the PDF, shrinking body text slightly if needed so it always stays on one page.
export async function buildPdf(snap) {
  const { jsPDF } = await import("jspdf");
  let out;
  for (const k of [1, 0.93, 0.86, 0.8]) {
    out = draw(jsPDF, snap, k);
    if (out.bottom <= H - FOOT - 3) break;
  }
  return out.d;
}

export async function downloadPdf(snap) {
  const d = await buildPdf(snap);
  d.save("greenfriend-revised-esrs-one-pager.pdf");
}
