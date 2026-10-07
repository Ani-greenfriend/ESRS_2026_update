-- pg_cron runs the daily clean-up job (spec Section 3). Free on the Supabase Free plan.
create extension if not exists pg_cron with schema pg_catalog;
