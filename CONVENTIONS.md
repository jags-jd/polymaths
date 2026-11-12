# Build Conventions

> How code, game data, commits, migrations and tests should look on this project.
> If something here conflicts with a habit, this file wins. If something here seems wrong, raise it — don't quietly diverge.

---

## Code style

- **TypeScript everywhere.** No `.js` files except config.
- **Strict TypeScript.** `strict: true`. No `any` unless deliberate and commented.
- **No barrel files.** Import directly from source files.
- **Server vs client components — be explicit.** Server components by default; `"use client"` only for interaction (ticking, toggles, forms).
- **Writes go through server actions** that check the session first, validate input with Zod, then write with the user-scoped Supabase client.
- **Optimistic UI for ticks.** Update instantly, save, roll back and show an error toast if the save fails.
- **Keep components small.** If a component passes ~150 lines, split it.
- **No user text as HTML.** Never `dangerouslySetInnerHTML` with anything a user wrote.

## File naming

- Components: `PascalCase.tsx`
- Utilities: `kebab-case.ts`
- Tests: same name as the file under test, with `.test.ts` / `.test.tsx`; E2E specs in `tests/e2e/*.spec.ts`
- Routes: Next.js conventions
- Game data: `data/games/<slug>/index.ts`, `data/games/<slug>/art.ts`
- Game icons: `components/icons/<slug>/<Name>Icon.tsx`

## Game data

- **Follow `docs/data-model.md` and `docs/adding-a-game.md`.** No exceptions.
- **IDs:** lowercase, words separated by `-`, prefixed by the game's `idPrefix` (`smw-`, `ycw-`, `er-`, `sb-`, `ff7r-`). IDs describe the thing, not its position (`smw-donut-plains-1-secret-exit`, not `smw-w2-l1-e2`).
- **IDs are permanent.** Never rename, never reuse. Retire with `retired: true`.
- **Titles and notes in our own words.** Don't copy wiki text.
- **Every game has a `docs/games/<slug>.md`** with sources and open questions, updated in the same PR as the data.
- **`pnpm data:validate` must pass** (it runs in the pre-commit hook).

## Styling and UI

- **Tailwind for layout; theme tokens for color, type and shape.** No hard-coded hex colors in components — use the theme's CSS variables (see `docs/themes.md`).
- **shadcn/ui primitives are themed, never forked.** If a primitive can't be themed enough, raise it.
- **Match the mockups** in `docs/design/`. Sizes, spacing and icon proportions there are deliberate.
- **Accessibility:** text contrast at least 4.5:1; every icon button has an `aria-label` and `aria-pressed`; real `<button>`/`<a>`/`<input>` elements; keyboard reachable; visible focus.
- **Mobile first.** Every page works at 390px wide with no horizontal scroll.

## Database

- **Always use migrations.** No manual schema changes in the Supabase dashboard.
- **One migration per logical change.**
- **Migration filenames:** `YYYYMMDDHHMMSS_short_description.sql` (the Supabase CLI generates these).
- **Test migrations locally first.** Apply, run the app, run tests, then push to staging, then production.
- **Regenerate types** (`pnpm db:types`) after every migration and commit them with it.

## RLS policies

- **Every table has RLS enabled.**
- **Public read, owner write** is the default pattern (see `docs/data-model.md`).
- **Use `auth.uid()`**, not `current_user`.
- **Test policies as you write them.** A test that tries to write another user's row must fail.
- **Service-role key bypasses RLS.** Server-only, and only where RLS genuinely can't express the rule. Never in client code.

## Testing

- **Vitest** for unit tests. Must cover:
  - Progress maths (`lib/games/progress.ts`): checks, pips, meters, section and game percentages, retired items excluded
  - Game data validation (schema, ID uniqueness across all games, prefixes)
  - Safety helpers (reserved IGNs, profanity filter, rate limits)
- **Playwright** for a handful of key flows:
  1. Sign in (test user) → onboarding → home
  2. Tick a check, a pip and a meter → refresh → still ticked
  3. Follow a player → appears in following list and feed
  4. Edit profile theme and showcase → public profile shows it
- **Tests run on every commit** via the Husky pre-commit hook (unit tests; E2E runs before opening a PR).
- **Failing tests block commits.** No `--no-verify`.

## Commits

- **Conventional Commits format:** `type(scope): description`
- Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `style`, `perf`
- Scopes: `auth`, `onboarding`, `checklist`, `data`, `profile`, `social`, `feed`, `safety`, `db`, `theme`, `deps`, or a game slug (`smw`, `ycw`, `er`, `sb`, `ff7r`)
- Examples:
  - `feat(checklist): add meter trackable with tap-to-set`
  - `feat(smw): add Dragon Coin pixel icons`
  - `fix(data): correct Forest of Illusion exit count`
  - `chore(deps): bump @supabase/supabase-js`

## Branching

- `main` — deploys to production
- Feature branches: `feature/short-description`
- Fix branches: `fix/short-description`
- Game data branches: `data/<slug>-short-description`
- **Never commit directly to main.** Always PR, even solo. The PR preview (staging) must be checked before merging.

## Pull requests

PR description answers:

- What does this change?
- Why?
- How was it tested? (unit, E2E, which pages opened on the preview)
- Any risks or follow-ups? (especially: any ID changes, any migration)

## Secrets

- **Never commit secrets.** `.env.local` is gitignored; `.env.example` lists every variable with no values.
- Local: `.env.local`
- Staging/production: Vercel environment variables (Preview → staging Supabase, Production → production Supabase)
- OAuth client secrets live in the Supabase dashboard (per project) and in `supabase/config.toml` via env vars for local.

## Logging

- **Structured logging.** `logger.info({ event: 'progress.saved', game: 'smw', itemId })`, not `console.log("saved")`.
- **Never log tokens, emails or other personal data.**
- **Errors go to Sentry** once it's added (phase 1.0). Until then, Vercel logs.

## Don't diverge quietly

If you find a genuinely better way to do something, raise it and write an ADR in `docs/decisions/`. Don't quietly do it differently in one place.
