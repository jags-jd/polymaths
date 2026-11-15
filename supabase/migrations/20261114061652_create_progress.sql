-- Progress: one row per completed unit (phase 0.3).
-- See docs/data-model.md, Part 2 ("progress") and "The three trackable kinds":
--   check → one row, value 1
--   pips  → one row per pip, item_id '<id>#<n>', value 1
--   meter → one row, value = reached number (row deleted at 0)
--
-- The database doesn't know the game data. The server actions in
-- lib/progress/ check every item_id, pip number and meter value against it
-- before writing; the constraints here only catch malformed rows.

create table public.progress (
  user_id uuid not null references public.profiles (id) on delete cascade,
  game_slug text not null
    constraint progress_game_slug_format check (game_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  item_id text not null
    constraint progress_item_id_format check (
      char_length(item_id) <= 200
      and item_id ~ '^[a-z0-9]+(-[a-z0-9]+)*(#[1-9][0-9]*)?$'
    ),
  value smallint not null
    constraint progress_value_range check (value between 1 and 999),
  updated_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

comment on table public.progress is
  'Who ticked what. item_id points into the game data in the repo. Public read, owner write.';

create index progress_user_game_idx on public.progress (user_id, game_slug);

create trigger progress_set_updated_at
  before update on public.progress
  for each row execute function public.set_updated_at();

-- Row Level Security: anyone can read, users write only their own rows.
alter table public.progress enable row level security;

create policy "Progress is readable by everyone"
  on public.progress for select
  to anon, authenticated
  using (true);

create policy "Users can add their own progress"
  on public.progress for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own progress"
  on public.progress for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own progress"
  on public.progress for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- Column-level privileges: rows are created with their key columns, and only
-- the value may change afterwards (a meter going from 14 to 15).
revoke insert, update, delete on public.progress from anon;
revoke insert, update on public.progress from authenticated;
grant insert (user_id, game_slug, item_id, value) on public.progress to authenticated;
grant update (value) on public.progress to authenticated;
