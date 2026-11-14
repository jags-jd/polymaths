-- RLS tests for public.progress. Run with: pnpm db:test
begin;
create extension if not exists pgtap with schema extensions;

select plan(13);

insert into auth.users (id, email)
values
  ('11111111-1111-1111-1111-111111111111', 'alice@example.test'),
  ('22222222-2222-2222-2222-222222222222', 'bob@example.test');

insert into public.profiles (id, display_name, ign)
values
  ('11111111-1111-1111-1111-111111111111', 'Alice', 'alice_plays'),
  ('22222222-2222-2222-2222-222222222222', 'Bob', 'bob_plays');

insert into public.progress (user_id, game_slug, item_id, value)
values ('22222222-2222-2222-2222-222222222222', 'super-mario-world', 'smw-yoshis-island-1-exit', 1);

-- Only count the test users' rows: a local db may hold real progress too.
create temp table test_users (id uuid) on commit drop;
insert into test_users values
  ('11111111-1111-1111-1111-111111111111'), ('22222222-2222-2222-2222-222222222222');
grant select on test_users to anon, authenticated;

-- Visitors (signed out) can read progress but not write it.
set local role anon;
select is(
  (select count(*)::int from public.progress where user_id in (select id from test_users)),
  1,
  'a visitor can read progress'
);
select throws_ok(
  $$ insert into public.progress (user_id, game_slug, item_id, value)
     values ('22222222-2222-2222-2222-222222222222', 'super-mario-world', 'smw-x', 1) $$,
  '42501',
  null,
  'a visitor cannot write progress'
);
reset role;

-- Act as Alice.
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}', true);

select lives_ok(
  $$ insert into public.progress (user_id, game_slug, item_id, value) values
     ('11111111-1111-1111-1111-111111111111', 'super-mario-world', 'smw-yoshis-island-1-exit', 1),
     ('11111111-1111-1111-1111-111111111111', 'super-mario-world', 'smw-yoshis-island-1-dragon-coins#3', 1),
     ('11111111-1111-1111-1111-111111111111', 'yoshis-crafted-world', 'ycw-pirate-pier-red-coins', 14) $$,
  'a user can tick checks, pips and meters for themselves'
);

select throws_ok(
  $$ insert into public.progress (user_id, game_slug, item_id, value)
     values ('22222222-2222-2222-2222-222222222222', 'super-mario-world', 'smw-yoshis-island-2-exit', 1) $$,
  '42501',
  null,
  'a user cannot add progress for someone else'
);

select is(
  (select count(*)::int from public.progress where user_id in (select id from test_users)),
  4,
  'a user can read everyone''s progress'
);

select lives_ok(
  $$ update public.progress set value = 15
     where user_id = '11111111-1111-1111-1111-111111111111' and item_id = 'ycw-pirate-pier-red-coins' $$,
  'a user can change their own meter value'
);

update public.progress set value = 5
  where user_id = '22222222-2222-2222-2222-222222222222';
select is(
  (select value::int from public.progress where user_id = '22222222-2222-2222-2222-222222222222'),
  1,
  'a user cannot change someone else''s progress'
);

delete from public.progress where user_id = '22222222-2222-2222-2222-222222222222';
select is(
  (select count(*)::int from public.progress where user_id = '22222222-2222-2222-2222-222222222222'),
  1,
  'a user cannot delete someone else''s progress'
);

select throws_ok(
  $$ update public.progress set item_id = 'smw-other-exit'
     where user_id = '11111111-1111-1111-1111-111111111111' and item_id = 'smw-yoshis-island-1-exit' $$,
  '42501',
  null,
  'a user cannot change a row''s item_id (only its value)'
);

select lives_ok(
  $$ delete from public.progress
     where user_id = '11111111-1111-1111-1111-111111111111' and item_id = 'smw-yoshis-island-1-exit' $$,
  'a user can un-tick their own progress'
);

select throws_ok(
  $$ insert into public.progress (user_id, game_slug, item_id, value)
     values ('11111111-1111-1111-1111-111111111111', 'super-mario-world', 'smw-x#0', 1) $$,
  '23514',
  null,
  'pip numbers start at 1'
);

select throws_ok(
  $$ insert into public.progress (user_id, game_slug, item_id, value)
     values ('11111111-1111-1111-1111-111111111111', 'super-mario-world', 'smw-y-exit', 0) $$,
  '23514',
  null,
  'a zero value is stored as no row'
);

select throws_ok(
  $$ insert into public.progress (user_id, game_slug, item_id, value)
     values ('11111111-1111-1111-1111-111111111111', 'Super Mario World', 'smw-z-exit', 1) $$,
  '23514',
  null,
  'game slugs must be well formed'
);

select * from finish();
rollback;
