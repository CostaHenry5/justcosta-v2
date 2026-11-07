-- FastMED Phase 0: anonymous usage counts.
-- Holds categories and counts only: no message text, names, phone numbers, IP addresses or device ids.
create table if not exists public.fastmed_usage_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  channel text not null default 'web' check (channel in ('web', 'whatsapp', 'sms')),
  language text not null check (language in ('en', 'sw')),
  is_health_related boolean not null default false,
  triage text check (triage in ('emergency', 'urgent', 'soon', 'self_care')),
  red_flags text[] not null default '{}',
  used_check_in boolean not null default false,
  redactions smallint not null default 0 check (redactions >= 0),
  first_message boolean not null default false
);

create index if not exists fastmed_usage_events_created_at_idx
  on public.fastmed_usage_events (created_at desc);

-- Only the server (service key) can read or write. No public access.
alter table public.fastmed_usage_events enable row level security;

comment on table public.fastmed_usage_events is
  'Anonymous FastMED usage counts. Never store message text or anything that identifies a person.';
