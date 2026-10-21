-- Spec v2.0+: the route questionnaire is gone; route, route_from_example and route_answers stay empty for new rows.
-- The A/B/C check stays (it passes for null). Existing rows keep their values.
alter table public.unlocks alter column route drop not null;
alter table public.unlocks alter column route_from_example drop not null;
alter table public.unlocks alter column route_answers drop not null;
