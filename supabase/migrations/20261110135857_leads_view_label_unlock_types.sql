-- Builder request (10 Nov 2026): the leads view names the two new unlock sign-ups instead of counting them as PDF downloads.
-- Full definition of public.leads (security_invoker, no grants to anon/authenticated), so this file alone can rebuild the view.
-- The view was first created on 9 Nov 2026 (migrations 20261109100554_create_leads_view and
-- 20261109132741_leads_view_add_group_year_topics, applied outside this repository; their files are not committed).
create or replace view public.leads with (security_invoker = true) as
select (created_at)::date as datum,
  email,
  company as firma,
  industry as branche,
  case request_type
    when 'contact' then 'Contact me'
    when 'unlock_cases' then 'Beispiele freigeschaltet'
    when 'unlock_datapoints' then 'Datenpunkte freigeschaltet'
    else 'PDF Download'
  end as anlass,
  case when consent_contact then 'ja' else 'nein' end as darf_kontaktiert_werden,
  interests as interessen,
  scope_headline as ergebnis_check,
  utm_source as quelle,
  created_at,
  case scope_badge
    when 'In scope' then 'Pflicht'
    when 'In scope from FY2027' then 'Pflicht'
    when 'Partly in scope' then 'Pflicht'
    when 'In scope (Art. 40a)' then 'Pflicht'
    when 'Out of scope' then 'Freiwillig (z. B. VSME)'
    else 'Pruefen (Ausnahme moeglich)'
  end as gruppe,
  case scope_badge
    when 'In scope' then 'FY2026, ab FY2027 neue ESRS'
    when 'In scope from FY2027' then 'FY2027'
    when 'Partly in scope' then 'FY2027 (EU-Einheit)'
    when 'In scope (Art. 40a)' then
      case when scope_headline ilike '%Two obligations%' then 'FY2027 (Tochter) und FY2028 (Konzern)' else 'FY2028 (Konzern)' end
    else '-'
  end as berichtsjahr,
  array_to_string(topics, ', ') as gewaehlte_themen,
  datapoints_new as datapoints,
  route as route_fy2026,
  scope_badge as ergebnis
from public.unlocks
where status = 'current'
order by created_at desc;
revoke all on public.leads from anon, authenticated;
