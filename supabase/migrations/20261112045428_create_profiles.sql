-- Profiles: one row per player, created during onboarding (phase 0.2).
-- See docs/data-model.md, Part 2.

create extension if not exists citext with schema extensions;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null
    constraint profiles_display_name_length check (char_length(display_name) between 1 and 40),
  -- Unique ignoring case (citext). Reserved names and profanity are checked
  -- in the server action (lib/safety), not here.
  ign extensions.citext not null
    constraint profiles_ign_key unique
    constraint profiles_ign_format check (ign::text ~ '^[A-Za-z0-9_]{3,20}$'),
  bio text not null default ''
    constraint profiles_bio_length check (char_length(bio) <= 300),
  avatar_url text,
  -- Profile customization; shape validated by Zod in the app.
  theme jsonb not null default '{}'::jsonb
    constraint profiles_theme_is_object check (jsonb_typeof(theme) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Public player profiles. Public read, owner write.';

-- Keep updated_at current on every update.
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Row Level Security: anyone can read, users write only their own row.
alter table public.profiles enable row level security;

create policy "Profiles are readable by everyone"
  on public.profiles for select
  to anon, authenticated
  using (true);

create policy "Users can create their own profile"
  on public.profiles for insert
  to authenticated
  with check ((select auth.uid()) = id);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- No delete policy: deleting the auth user cascades to the profile.

-- Column-level privileges: users may only change their editable fields,
-- never id or timestamps.
revoke insert, update, delete on public.profiles from anon;
revoke update on public.profiles from authenticated;
grant update (display_name, ign, bio, avatar_url, theme) on public.profiles to authenticated;
