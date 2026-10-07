// Fixed lists and versions shared by the browser and the submit-unlock function.
// Pure module: no browser or Node APIs.

export const NOTICE_VERSION = "2026-10-07";
export const RULES_DATE = "7 Oct 2026";

export const INDUSTRIES = [
  "Energy and utilities",
  "Automotive",
  "FMCG and food",
  "Industrial and manufacturing",
  "Chemicals",
  "Financial services",
  "Retail",
  "Tech",
  "Other",
];

export const INTERESTS = [
  "DMA and strategy development",
  "Governance",
  "Reporting and assurance",
  "Custom tool and dashboard builds",
  "FY2026",
];

export const EMAIL_MAX = 254;
export const COMPANY_MAX = 120;
export const UTM_MAX = 80;

// Standard format with a TLD of at least two letters (spec Section 9).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

export function isValidEmail(value) {
  if (typeof value !== "string") return false;
  const v = value.trim();
  return v.length > 0 && v.length <= EMAIL_MAX && EMAIL_RE.test(v);
}
