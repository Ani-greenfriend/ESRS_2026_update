// Datapoint estimator (spec Section 9.3).
import { STAT, TOPICS } from "./data.js";

export const DEFAULT_TOPICS = TOPICS.filter((t) => t[2]).map((t) => t[0]);

export function estimate(selected) {
  const sel = TOPICS.map((t) => t[0]).filter((c) => selected.includes(c));
  const sum = (i) => STAT["ESRS 2"][i] + sel.reduce((a, c) => a + STAT[c][i], 0);
  const old = sum(0), now = sum(1), unc = sum(2);
  return { topics: sel, old, now, unc, pct: Math.round((1 - now / old) * 100) };
}
