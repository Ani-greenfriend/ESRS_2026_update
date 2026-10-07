// FY2026 route scoring (spec Section 9.2, table PQ in the prototype).
import { OPT, PQ, REASON } from "./data.js";

export const EXAMPLE_ANSWERS = { proc: "ok", effort: "mid", dma: "heavy", vc: "gaps", ma: "no", ready: "part", comp: "high" };

export function routeScores(P) {
  const s = [0, 0, 0];
  PQ.forEach((q) => {
    const o = q.o.find((x) => x[0] === P[q.id]);
    if (o) o[2].forEach((v, i) => (s[i] += v));
  });
  return s;
}

// Highest total wins; indexOf returns the first maximum, so ties go to the earlier route (A, B, C).
export function bestRouteIndex(scores) {
  return scores.indexOf(Math.max(...scores));
}

export function routeReasons(P) {
  return PQ.map((q) => REASON[q.id][P[q.id]]).filter(Boolean);
}

export function routeResult(P) {
  const scores = routeScores(P);
  const best = bestRouteIndex(scores);
  const o = OPT[best];
  return { scores, best, letter: o.L, name: o.t, label: `Route ${o.L}: ${o.t}`, desc: o.d, reasons: routeReasons(P) };
}
