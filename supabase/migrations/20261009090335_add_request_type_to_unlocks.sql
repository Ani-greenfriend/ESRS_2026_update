-- Builder request (9 Oct 2026): tell a PDF unlock apart from a direct contact request.
-- 'download' = unlock form ("Get it free", PDF downloads); 'contact' = "Want our help?" box ("Leave your email").
-- Existing rows were all PDF unlocks, so the default 'download' is correct for them.
alter table public.unlocks
  add column request_type text not null default 'download'
  check (request_type in ('download', 'contact'));

-- A contact request is only stored with contact consent (the form requires the box).
alter table public.unlocks
  add constraint unlocks_contact_needs_consent check (request_type <> 'contact' or consent_contact);

-- Grants unchanged: anon and authenticated still have no access to public.unlocks.
