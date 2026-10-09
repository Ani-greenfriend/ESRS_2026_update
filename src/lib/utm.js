import { UTM_MAX } from "./constants.js";

// Campaign tags from the page URL, read once on load. Nothing else about the visit is collected.
export function readUtm() {
  try {
    const p = new URLSearchParams(window.location.search);
    const v = (k) => (p.get(k) || "").trim().slice(0, UTM_MAX) || null;
    return { utm_source: v("utm_source"), utm_campaign: v("utm_campaign") };
  } catch {
    return { utm_source: null, utm_campaign: null };
  }
}
