alter table public.practitioners
  add column if not exists professional_category text,
  add column if not exists specialty text,
  add column if not exists registration_authority text,
  add column if not exists registration_number text,
  add column if not exists masked_registration_number text,
  add column if not exists verification_status text not null default 'pending',
  add column if not exists verified_at timestamptz,
  add column if not exists verification_expires_at timestamptz,
  add column if not exists public_listing_consent boolean not null default false,
  add column if not exists consented_at timestamptz,
  add column if not exists consent_version text,
  add column if not exists region text,
  add column if not exists district text,
  add column if not exists availability text not null default 'offline',
  add column if not exists show_public_phone boolean not null default false,
  add column if not exists is_active boolean not null default false,
  add column if not exists updated_at timestamptz not null default now();

alter table public.practitioners
  drop constraint if exists practitioners_verification_status_check,
  add constraint practitioners_verification_status_check check (verification_status in ('pending','verified','rejected','expired')),
  drop constraint if exists practitioners_availability_check,
  add constraint practitioners_availability_check check (availability in ('available','busy','offline')),
  drop constraint if exists practitioners_public_listing_integrity_check,
  add constraint practitioners_public_listing_integrity_check check (
    public_listing_consent = false or consented_at is not null
  ),
  drop constraint if exists practitioners_verification_integrity_check,
  add constraint practitioners_verification_integrity_check check (
    verification_status <> 'verified' or verified_at is not null
  );

update public.practitioners
set professional_category = coalesce(nullif(professional_category, ''), role),
    availability = case when is_available then 'available' else 'offline' end,
    updated_at = now()
where professional_category is null or professional_category = '';

create index if not exists practitioners_public_directory_idx
  on public.practitioners (verification_status, public_listing_consent, is_active, region, professional_category);

comment on column public.practitioners.registration_number is 'Private full professional registration number; never return from the public directory endpoint.';
comment on column public.practitioners.public_listing_consent is 'Explicit consent only. A submitted profile does not imply consent.';
