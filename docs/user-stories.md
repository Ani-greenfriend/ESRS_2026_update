# User Stories — ESRS 2026 Update Check

**Written against:** product-spec.md v1.1 · supabase-setup.md as of not yet created — short run
**Date:** 7 October 2026
**Author:** Anika Lerch (greenfriend)
**Status:** Confirmed
**Population pattern:** P1, as in access-matrix.md
**Companion file:** access-matrix.md

> Each acceptance line is a screen test. Stories whose cell is `no` are refusal tests.

---

## The people

| Role | Named first holder | Layer | Opens |
|---|---|---|---|
| anon | the public visitor, no name | none | the tool, the unlock dialog, the privacy notice |
| platform owner | Anika Lerch (greenfriend.org account) | outside the app | Supabase and Netlify dashboards |

---

## Stories

- **As a visitor, I submit one unlock with my email, so that I see my action plan and download the one-page PDF.** `[unlocks · create · anon]`
  Acceptance: the form sends to `submit-unlock`; the function checks the fields; one row exists with status current. A submission with an invalid email or an oversized body is refused and nothing is stored.
- **As a visitor, I cannot read any unlock, mine included, so that nothing leaks.** `[unlocks · read · anon]` (= no)
  Acceptance: a direct read from the browser returns a permission error, not an empty list.
- **As a visitor, I cannot edit an unlock; if I submit again the old one is superseded.** `[unlocks · update · anon]` (= no)
  Acceptance: no edit screen exists; a second submission with the same email flips the first to superseded, done by the submit function, never by the visitor's own request.
- **As the platform owner, I read and export the leads in the Supabase dashboard, so that greenfriend can follow up with people who consented.** `[unlocks · read · platform owner]`
  Acceptance: Anika opens the table view, filters on `consent_contact`, and exports CSV.
- **As the clean-up job, I anonymise non-consenting leads after 30 days and delete all rows after 24 months, so that data is kept no longer than needed.** `[unlocks · change state / delete · scheduled job]`
  Acceptance: a test row older than 30 days without consent has no email or company; counts remain.

## Stories that are refusals (collected)

| # | Who | Tries | Result | Cell |
|---|---|---|---|---|
| 1 | visitor | read the unlocks table from the browser | permission error | unlocks · read · anon |
| 2 | visitor | update or delete an unlock | permission error | unlocks · update/delete · anon |
| 3 | visitor | submit an invalid email or an oversized body | refused, nothing stored | unlocks · create · anon |
| 4 | any URL, any table | read anything without a login | nothing returned | every table · read · anon |

## Later list (not this version)

- Contacts dashboard with a login (first reader Anika Lerch): its own full Access Architect run, adds roles, ownership and profiles.
