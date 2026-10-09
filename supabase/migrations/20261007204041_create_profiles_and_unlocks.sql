-- ESRS 2026 Update Check: tables, RLS and grants.
-- Rules from docs/access-matrix.md (short form, P1 public stays anonymous):
-- RLS on every table from creation; anon (and authenticated, no login exists) get no policy and no grant.
-- The submit-unlock Netlify Function writes with the secret key (service_role) and is the rule for its path.

-- Shared trigger function: keeps updated_at current on every update.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
revoke execute on function public.set_updated_at() from public, anon, authenticated;

-- profiles: login-ready, for the later contacts dashboard (Tool B). No Auth configured yet.
create table public.profiles (
  id           uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  email        text not null unique check (email = lower(email) and char_length(email) <= 254),
  full_name    text,
  "function"   text,
  role         text,
  is_admin     boolean not null default false,
  active       boolean not null default true,
  created_at   timestamptz not null default now(),
  created_by   uuid references public.profiles(id) on delete set null,
  updated_at   timestamptz not null default now(),
  updated_by   uuid references public.profiles(id) on delete set null
);
alter table public.profiles enable row level security;
revoke all on table public.profiles from anon, authenticated;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Access rule 2: no user can change their own role, is_admin or active through the app.
-- Requests from a logged-in user carry auth.uid(); dashboard and secret-key edits do not.
create or replace function public.profiles_guard_privileges()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if auth.uid() is not null
     and (new.role is distinct from old.role
          or new.is_admin is distinct from old.is_admin
          or new.active is distinct from old.active) then
    raise exception 'role, is_admin and active are set by the platform owner only'
      using errcode = '42501';
  end if;
  return new;
end;
$$;
revoke execute on function public.profiles_guard_privileges() from public, anon, authenticated;

create trigger profiles_guard_privileges
  before update on public.profiles
  for each row execute function public.profiles_guard_privileges();

insert into public.profiles (email, full_name, "function", role)
values ('anikalerch@greenfriend.org', 'Anika Lerch', 'Founder, greenfriend', 'reader');

-- unlocks: one row per email unlock (the lead).
create table public.unlocks (
  id                       uuid primary key default gen_random_uuid(),
  created_at               timestamptz not null default now(),
  email                    text check (email = lower(email) and char_length(email) <= 254),
  company                  text check (char_length(company) <= 120),
  industry                 text check (industry in ('Energy and utilities', 'Automotive', 'FMCG and food',
                             'Industrial and manufacturing', 'Chemicals', 'Financial services', 'Retail', 'Tech', 'Other')),
  consent_contact          boolean not null default false,
  interests                text[] not null default '{}'
                             check (interests <@ array['DMA and strategy development', 'Governance', 'Reporting and assurance',
                               'Custom tool and dashboard builds', 'FY2026']::text[]),
  consent_at               timestamptz,
  notice_version           text not null,
  scope_badge              text,
  scope_headline           text,
  scope_answers            jsonb not null default '{}'::jsonb,
  route                    text not null check (route in ('A', 'B', 'C')),
  route_from_example       boolean not null,
  route_answers            jsonb not null,
  topics                   text[] not null default '{}'
                             check (topics <@ array['E1','E2','E3','E4','E5','S1','S2','S3','S4','G1']::text[]),
  datapoints_old           integer not null check (datapoints_old >= 0),
  datapoints_new           integer not null check (datapoints_new >= 0),
  datapoints_unconditional integer not null check (datapoints_unconditional >= 0),
  utm_source               text check (char_length(utm_source) <= 80),
  utm_campaign             text check (char_length(utm_campaign) <= 80),
  superseded_by            uuid references public.unlocks(id) on delete set null,
  anonymised_at            timestamptz,
  status                   text not null default 'current' check (status in ('current', 'superseded', 'anonymised')),
  created_by               uuid references public.profiles(id) on delete set null,
  updated_by               uuid references public.profiles(id) on delete set null,
  updated_at               timestamptz not null default now(),
  -- an email is required until the row is anonymised; consent_at only with consent
  constraint unlocks_email_until_anonymised check (email is not null or anonymised_at is not null),
  constraint unlocks_consent_at_only_with_consent check (consent_at is null or consent_contact)
);
alter table public.unlocks enable row level security;
revoke all on table public.unlocks from anon, authenticated;

create trigger unlocks_set_updated_at
  before update on public.unlocks
  for each row execute function public.set_updated_at();

-- Supersede lookup (submit function) and the clean-up job.
create index unlocks_email_current_idx on public.unlocks (email) where status = 'current';
create index unlocks_created_at_idx on public.unlocks (created_at);
create index unlocks_superseded_by_idx on public.unlocks (superseded_by);
create index unlocks_created_by_idx on public.unlocks (created_by);
create index unlocks_updated_by_idx on public.unlocks (updated_by);
create index profiles_created_by_idx on public.profiles (created_by);
create index profiles_updated_by_idx on public.profiles (updated_by);

-- No policy exists on either table: default deny for anon and authenticated (access matrix rows 2, 3, 7).
-- No DELETE policy anywhere (access rule 4).
