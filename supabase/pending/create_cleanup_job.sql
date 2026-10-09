-- NOT APPLIED YET. Apply with apply_migration (name: create_cleanup_job) once the builder approves the
-- Supabase confirmation for the DELETE statement, then move this file to migrations/ with the recorded version.
-- Scheduled clean-up (spec Section 3, access matrix row 5). Database-only, no email, no external call.
-- (1) Rows older than 30 days without contact consent: email and company removed, anonymised_at set.
-- (2) Rows older than 24 months: deleted, whatever the consent.

-- Kept out of the API-exposed schema, and runnable by the job owner only.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create or replace function private.cleanup_unlocks()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  update public.unlocks
     set email = null,
         company = null,
         anonymised_at = now(),
         status = 'anonymised'
   where consent_contact = false
     and anonymised_at is null
     and created_at < now() - interval '30 days';

  delete from public.unlocks
   where created_at < now() - interval '24 months';
end;
$$;
revoke execute on function private.cleanup_unlocks() from public, anon, authenticated;

-- pg_cron runs in UTC. 03:00 Europe/Amsterdam is 01:00 UTC in summer and 02:00 UTC in winter,
-- so the job wakes at both and runs only in the hour that is 03:00 in Amsterdam.
select cron.schedule(
  'cleanup-unlocks-daily',
  '0 1,2 * * *',
  $job$select private.cleanup_unlocks() where extract(hour from now() at time zone 'Europe/Amsterdam') = 3$job$
);
