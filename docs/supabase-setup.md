# Supabase setup — ESRS 2026 Update Check

## 1. Header

| | |
|---|---|
| Project | ESRS 2026 update tool |
| Ref | jfalwveuccerzeffxftx |
| URL | https://jfalwveuccerzeffxftx.supabase.co |
| Region | EU, Frankfurt (eu-central-1) |
| Plan | Free (no backups, pauses after ~1 week idle; monthly CSV export of `unlocks` is the backup) |
| Postgres | 17 |
| Written against | docs/product-spec.md v1.1 · docs/access-matrix.md (short form, P1 public stays anonymous) |
| Last updated | 9 October 2026, session 3 (`unlocks.request_type` added) |

This file is the schema source of truth. It is updated at every save point that touches the database.

## 2. Tables

### `public.unlocks` — one row per email unlock (the lead)

| Column | Type | Rule |
|---|---|---|
| id | uuid PK | `gen_random_uuid()` |
| created_at | timestamptz | `now()` |
| email | text | lower-case only, ≤ 254; null only after anonymisation |
| company | text | ≤ 120 |
| industry | text | one of the nine fixed industries (spec Section 8) |
| consent_contact | boolean | default false |
| interests | text[] | subset of the five fixed services |
| consent_at | timestamptz | set only when consent_contact is true |
| notice_version | text | e.g. `2026-10-07` |
| scope_badge, scope_headline | text | null when the scope check was not completed |
| scope_answers | jsonb | question key → answer key |
| route | text | `A` / `B` / `C` |
| route_from_example | boolean | true until the visitor changes an answer |
| route_answers | jsonb | the seven FY2026 answers |
| topics | text[] | subset of E1…G1 |
| datapoints_old / datapoints_new / datapoints_unconditional | integer | ≥ 0 |
| utm_source, utm_campaign | text | ≤ 80 |
| superseded_by | uuid → unlocks.id | on delete set null; null while current |
| anonymised_at | timestamptz | set by the clean-up job |
| status | text | `current` → `superseded` → `anonymised` (default `current`) |
| request_type | text | `download` (unlock form, PDF) or `contact` ("Want our help?" box); default `download`; builder request 9 Oct 2026 |
| created_by, updated_by | uuid → profiles.id | empty (no login) |
| updated_at | timestamptz | kept current by trigger |

Constraints: `unlocks_email_until_anonymised` (email or anonymised_at), `unlocks_consent_at_only_with_consent`, `unlocks_contact_needs_consent` (a `contact` row always has consent_contact true).
Indexes: `unlocks_email_current_idx` (email where status = 'current'), `created_at`, `superseded_by`, `created_by`, `updated_by`.

### `public.profiles` — login-ready, for the later contacts dashboard

| Column | Type | Rule |
|---|---|---|
| id | uuid PK | own uuid |
| auth_user_id | uuid unique | empty until a login exists |
| email | text unique | lower-case, the seed key |
| full_name, function, role | text | |
| is_admin | boolean | default false |
| active | boolean | default true |
| created_at, created_by, updated_at, updated_by | | record columns (access rule 5) |

Seed: Anika Lerch, anikalerch@greenfriend.org, function "Founder, greenfriend", role `reader`, is_admin false.

## 3. Rules (RLS, grants) — mechanism and matrix line

| Table | Action | Role | Mechanism | Matrix line |
|---|---|---|---|---|
| unlocks | create | anon | `submit-unlock` Netlify Function with the secret key; no policy, no grant | row 1 |
| unlocks | read / export | anon | none: RLS on, no policy, no grant → permission denied | row 2 |
| unlocks | update / delete | anon | none: no policy, no grant | row 3 |
| unlocks | current → superseded | submit function | PATCH by `submit-unlock` after its insert | row 4 |
| unlocks | anonymise / delete | scheduled job | pg_cron → `private.cleanup_unlocks()` (**pending, see §9**) | row 5 |
| unlocks | read / export | platform owner | Supabase dashboard only | row 6 |
| every table | any | anon, authenticated | RLS enabled, no policy, `revoke all` | row 7 |

No policy of any kind exists, so no DELETE policy exists (access rule 4). `service_role` keeps Supabase's default grants; it is used only by `submit-unlock`.

**Refusal test record (7 Oct 2026, in-database as role `anon`):** select/insert/update/delete on `unlocks`, select/update on `profiles`, and execute on `rls_auto_enable()` all returned `42501 permission denied`; `private.cleanup_unlocks` is not reachable (schema not visible). The same test over HTTP (REST, RPC, GraphQL with the publishable key) is still to be run; this container's network blocks supabase.co.

## 4. Triggers

| Trigger | Table | Function | Purpose |
|---|---|---|---|
| unlocks_set_updated_at | unlocks | `public.set_updated_at()` | keep updated_at current |
| profiles_set_updated_at | profiles | `public.set_updated_at()` | keep updated_at current |
| profiles_guard_privileges | profiles | `public.profiles_guard_privileges()` | access rule 2: a logged-in user (auth.uid() not null) cannot change role, is_admin or active |
| ensure_rls (event trigger, Supabase built-in) | all new tables | `public.rls_auto_enable()` | switches RLS on for new tables |

## 5. Functions

| Function | Security | Callable by | Notes |
|---|---|---|---|
| public.set_updated_at() | INVOKER, `search_path = ''` | triggers only (execute revoked from public, anon, authenticated) | |
| public.profiles_guard_privileges() | INVOKER, `search_path = ''` | triggers only (execute revoked) | |
| public.rls_auto_enable() | DEFINER (Supabase built-in) | event trigger only (execute revoked from public, anon, authenticated in migration 20261007205047) | |
| private.cleanup_unlocks() | INVOKER, `search_path = ''` | pg_cron job owner only | **pending, see §9** |

No RPC is callable by anon.

## 6. Buckets

None. No file storage.

## 7. Auth

Not configured. No login exists; no screen reads a table.

## 8. Environment variable names (Netlify; values never in code)

| Name | Read by | Public / secret |
|---|---|---|
| VITE_SUPABASE_URL | `submit-unlock` only (never browser code; Vite only exposes `PUBLIC_` variables) | public |
| VITE_SUPABASE_ANON_KEY | not used | public (publishable key `sb_publishable_…`) |
| SUPABASE_SERVICE_ROLE_KEY | `submit-unlock` only | **secret** (`sb_secret_…`) |
| SUPABASE_DATABASE_URL | not used | **secret** |

The builder entered these by hand in Netlify (not through the extension). To verify on the first live build: names exactly as above, and values starting with `sb_`. The project also still has a legacy `anon` JWT key (eyJ…), enabled; if a variable holds an `eyJ…` value, replace it with the `sb_` key.

## 9. Notes and flags

- **Clean-up job deferred by the builder (8 Oct 2026), to be resolved later (PROGRESS.md Backlog).** `supabase/pending/create_cleanup_job.sql` (schema `private`, `private.cleanup_unlocks()`, pg_cron job `cleanup-unlocks-daily` at `0 1,2 * * *` UTC, which runs only in the hour that is 03:00 Europe/Amsterdam). The Supabase tool asks the builder to confirm migrations that contain a DELETE; the builder chose to skip it in session 1. pg_cron itself is enabled. Until it is applied, no anonymisation or 24-month deletion happens.
- Anonymisation counts 30 days from `created_at`. A consent withdrawal (consent_contact set to false by hand) on a row older than 30 days is anonymised at the next run.
- Supabase's advisor reports "RLS enabled, no policy" (INFO) on both tables. That is intended: default deny.
- New tables get default grants to anon and authenticated from Supabase; every future migration must `revoke all … from anon, authenticated` right after `create table`.
- Spec v1.7+: the form sends only email, consent and results. `company`, `industry` and `interests` stay in the table, empty (company and industry null, interests `{}`), for a later version.
- `request_type` separates the two kinds of lead: filter on `request_type = 'contact'` for people who asked for help, `download` for PDF unlocks. A contact request also unlocks the page; it is one row like any unlock, so the supersede rule applies across both kinds (the newest row for an email is the current one).
- Free plan: no backups. Monthly CSV export of `unlocks` by the builder; restore a paused project in the dashboard.

## 10. Change log

| Migration file | What it did |
|---|---|
| 20261007204041_create_profiles_and_unlocks.sql | `set_updated_at()`, `profiles` (+ guard trigger, seed), `unlocks`, RLS on, grants revoked, indexes |
| 20261007204238_enable_pg_cron.sql | enables pg_cron |
| 20261007205047_revoke_rls_auto_enable_from_api_roles.sql | revokes execute on the built-in `rls_auto_enable()` from public, anon, authenticated |
| 20261009090335_add_request_type_to_unlocks.sql | adds `unlocks.request_type` (download / contact, default download) and the contact-needs-consent check |
| pending/create_cleanup_job.sql | **not applied** — clean-up function and daily job |
