// Posts an unlock to the submit-unlock Netlify Function, the only write path to the database.
const ENDPOINT = "/.netlify/functions/submit-unlock";

export const ERRORS = {
  invalid_email: "Enter a valid email address, for example name@company.com.",
  invalid: "Something in the form could not be accepted. Check your entries and try again.",
  too_large: "Your request was too large. Please reload the page and try again.",
  server: "The server is unavailable right now. Nothing was saved; please try again in a minute.",
  network: "We could not reach the server. Check your connection and try again.",
};

export async function submitUnlock(payload) {
  let res;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 15000);
    res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
    clearTimeout(t);
  } catch {
    return { ok: false, message: ERRORS.network };
  }
  let body = {};
  try {
    body = await res.json();
  } catch {
    /* non-JSON error page */
  }
  if (res.ok && body.ok) return { ok: true };
  if (res.status === 413) return { ok: false, message: ERRORS.too_large };
  if (res.status === 400) return { ok: false, message: ERRORS[body.error] || ERRORS.invalid };
  return { ok: false, message: ERRORS.server };
}
