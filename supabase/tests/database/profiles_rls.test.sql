-- RLS tests for public.profiles. Run with: pnpm db:test
begin;
create extension if not exists pgtap with schema extensions;

select plan(10);

-- Two auth users to play with.
insert into auth.users (id, email)
values
  ('11111111-1111-1111-1111-111111111111', 'alice@example.test'),
  ('22222222-2222-2222-2222-222222222222', 'bob@example.test');

insert into public.profiles (id, display_name, ign)
values ('22222222-2222-2222-2222-222222222222', 'Bob', 'bob_plays');

-- Act as Alice.
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}', true);

select lives_ok(
  $$ insert into public.profiles (id, display_name, ign)
     values ('11111111-1111-1111-1111-111111111111', 'Alice', 'Alice_99') $$,
  'a user can create their own profile'
);

select throws_ok(
  $$ insert into public.profiles (id, display_name, ign)
     values ('22222222-2222-2222-2222-222222222222', 'Fake', 'fake_bob') $$,
  '42501',
  null,
  'a user cannot create a profile for someone else'
);

select is(
  (select count(*)::int from public.profiles),
  2,
  'a user can read every profile'
);

update public.profiles set bio = 'hacked' where id = '22222222-2222-2222-2222-222222222222';
select is(
  (select bio from public.profiles where id = '22222222-2222-2222-2222-222222222222'),
  '',
  'a user cannot update someone else''s profile'
);

delete from public.profiles where id = '22222222-2222-2222-2222-222222222222';
select is(
  (select count(*)::int from public.profiles where id = '22222222-2222-2222-2222-222222222222'),
  1,
  'a user cannot delete someone else''s profile'
);

select lives_ok(
  $$ update public.profiles set bio = 'Completionist.'
     where id = '11111111-1111-1111-1111-111111111111' $$,
  'a user can update their own profile'
);

select throws_ok(
  $$ update public.profiles set created_at = now() - interval '1 year'
     where id = '11111111-1111-1111-1111-111111111111' $$,
  '42501',
  null,
  'a user cannot change protected columns'
);

select throws_ok(
  $$ update public.profiles set ign = 'BOB_PLAYS'
     where id = '11111111-1111-1111-1111-111111111111' $$,
  '23505',
  null,
  'IGNs are unique ignoring case'
);

select throws_ok(
  $$ update public.profiles set ign = 'no spaces!'
     where id = '11111111-1111-1111-1111-111111111111' $$,
  '23514',
  null,
  'IGN format is enforced'
);

-- Signed-out visitors can read but not write.
set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);

select throws_ok(
  $$ insert into public.profiles (id, display_name, ign)
     values ('33333333-3333-3333-3333-333333333333', 'Anon', 'anon_user') $$,
  '42501',
  null,
  'signed-out visitors cannot create profiles'
);

select * from finish();
rollback;
