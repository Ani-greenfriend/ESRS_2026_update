-- public.rls_auto_enable() is Supabase's built-in event-trigger function (event trigger ensure_rls)
-- that switches RLS on for new tables. It was executable by anon and authenticated via
-- /rest/v1/rpc/rls_auto_enable. Hard rule: no RPC is callable by anon. Event triggers are fired
-- by the system, so revoking EXECUTE from the API roles does not stop the trigger.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
