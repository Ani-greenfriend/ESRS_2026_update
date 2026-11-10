-- Builder request (10 Nov 2026): email unlocks for example cases 2-7 and the datapoint result.
-- 'unlock_cases' and 'unlock_datapoints' tell those sign-ups apart from a PDF 'download' and a 'contact' request.
alter table public.unlocks drop constraint unlocks_request_type_check;
alter table public.unlocks
  add constraint unlocks_request_type_check
  check (request_type in ('download', 'contact', 'unlock_cases', 'unlock_datapoints'));
-- Grants unchanged: anon and authenticated still have no access to public.unlocks.
