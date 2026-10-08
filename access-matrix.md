# Access Matrix — ESRS 2026 Update Check

**Written against:** product-spec.md v1.9 · supabase-setup.md as of not yet created — short run
**Population pattern:** P1 public, stays anonymous
**Date:** 7 October 2026
**Author:** Anika Lerch (greenfriend)
**Status:** Confirmed
**Companion file:** user-stories.md

> The source of truth for who may do what. The Project Governor lifts Section 7 into CLAUDE.md. Claude Code builds the policies and the submit function from this file. Nobody logs in yet, so this short form is final until a login is added (contacts dashboard, a separate tool on the same database; first reader Anika Lerch). The full run then extends it with the role columns beside `anon`.
>
> Every cell names a real table and one of the seven actions. Export never exceeds read.

---

## 1. The matrix

Legend: `yes` = all rows · `no` = refused, in the database, not only in the screen.

### unlocks

| Action | anon (no login) |
|---|---|
| create | yes, through the `submit-unlock` Netlify Function only |
| read | no |
| update | no |
| change state | no (the only transition, current → superseded, is done by the submit function, never by the visitor) |
| delete | no |
| export | no |
| maintain lists | — |

No anon policy and no anon table grant exists on any table. The browser holds no Supabase access to `unlocks`; the publishable key may exist in the env contract but reaches nothing.

The two scheduled transitions (anonymise rows without consent after 30 days; delete rows after 24 months) are done by the pg_cron clean-up job inside the database, not by any visitor or screen.

---

## 2. Ownership

Not yet — nobody logs in. `unlocks.created_by` exists and stays empty.

## 3. The people

| Role | Named first holder | Layer | Screens |
|---|---|---|---|
| anon | the public visitor, no name | none | the whole tool |
| platform owner | Anika Lerch (anikalerch@greenfriend.org) | outside the app | Supabase and Netlify dashboards; reads and exports leads there |

No app admin exists yet. Admin and role columns arrive with the full run.

## 4. Exceptions

Not yet — nobody logs in.

## 5. Schema delta

Not yet. The Governor seeds the login-ready columns from day one: `created_by` (nullable, empty), `status`, `created_at`, `updated_by`, `updated_at`, and a `profiles` table (login target named in spec). The full run is then a migration, not a rebuild.

---

## 6. Policy plan

| # | Table | Action | Role | Rule in words | Mechanism | Screen test |
|---|---|---|---|---|---|---|
| 1 | unlocks | create | anon | one insert per request, made by the `submit-unlock` function with the secret key after the body size is checked and every field is validated against the allowed values | function | a visitor enters a valid email; one row exists; an invalid email or an oversized body is refused and no row is written |
| 2 | unlocks | read | anon | no policy, no grant | none (default deny) | a direct read from the browser returns a permission error, not an empty list |
| 3 | unlocks | update / delete | anon | no policy, no grant | none (default deny) | no edit or delete works from the browser |
| 4 | unlocks | change state → superseded | submit function | the function inserts the new row and sets `superseded_by` on the earlier current row for the same email (case-insensitive); nothing else on the old row changes | function | a second unlock with the same email flips the first to superseded; consent comes from the newest row |
| 5 | unlocks | anonymise / delete | scheduled job | daily pg_cron job blanks email and company on rows with `consent_contact = false` older than 30 days, sets `anonymised_at`; deletes rows older than 24 months | scheduled job (pg_cron) | a test row with no consent older than 30 days loses email and company; counts remain |
| 6 | unlocks | read / export | platform owner | read and CSV export in the Supabase dashboard only | none (dashboard) | Anika sees the leads in the table view and exports CSV |
| 7 | every table | any | anon | nothing: no policy and no table grant; the public form writes through `submit-unlock` only | none (default deny; the function is the write path) | a logged-out visitor reads nothing through the API; the form still submits |

Default deny applies to every table. The function is the rule for its path: the secret key bypasses RLS, so `submit-unlock` validates every field and does nothing but the one insert and the supersede flip. There is no rate limit and, in this version, no bot check (Cloudflare Turnstile is deferred): the 16 KB limit and strict validation are the only controls, and the handover says so honestly.

**The gate.** Before deploy, Claude Code attempts every `no` through the API (REST and RPC) as a logged-out visitor and pastes the result into PROGRESS.md under "Refusal test record". No saved script, no test-credential file. Any later change to a rule re-runs it.

---

## 7. Hard rules for CLAUDE.md (the Governor lifts these verbatim)

1. The refusal happens in the database, or in a server function that holds the secret key and checks every request itself; never only in the screen. A hidden button is not a rule. RLS is enabled on every table and never disabled to make something work. `anon` has no policy and no table grant on any table; a public form writes only through the submit function. A function that holds the secret key bypasses RLS, so for its path the function is the rule.
2. No user can change their own `role`, `is_admin` or `active` through the app; a trigger refuses it. Those are set from the Supabase dashboard by the platform owner. (Applies once a login exists.)
3. A row in its final state is frozen. Nothing in this build edits a stored unlock; a newer unlock supersedes the old one.
4. Nothing is deleted through the app. No `DELETE` policy exists on any table. Deletion happens only through the scheduled clean-up job (24 months) or by the platform owner in the Supabase dashboard on a GDPR request. Copies already exported are outside the tool.
5. Every record table carries `created_by`, `created_at`, `updated_by`, `updated_at`.

---

## 8. Handover paragraph (for the handover package, plain language)

ESRS 2026 Update Check has one kind of user: the anonymous public visitor. A visitor can submit one unlock (their email and results) and nothing else; they cannot read, change or delete anything, their own submission included. A second unlock with the same email supersedes the first. Anika Lerch holds the Supabase and Netlify accounts and reads the leads in the Supabase dashboard. A daily clean-up job removes email and company from leads who did not consent to contact after 30 days and deletes everything after 24 months. The rules are enforced in the database itself, so they hold whatever screen or tool reaches the data. When a contacts dashboard with a login is added, it gets its own full access run.
