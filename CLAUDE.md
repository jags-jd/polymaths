# Polymaths — Project Context

> This file is read by Claude Code at the start of every session.
> Update it after every meaningful change. Don't trust memory — trust this file.

**Last updated:** 2026-11-12
**Owner:** Jan
**Status:** Docs and design mockups only — no code yet (see Current build state)

---

## What we're building

Polymaths is a completionist's checklist site for video games. A player signs in, picks a game, and ticks off everything there is to do in it: every exit, boss, collectible, costume and secret. Progress saves to their account, and every player has a public, customizable profile (in the spirit of Friendster and MySpace) that shows off what they've completed.

For every supported game, a player can:

- **See everything** there is to do, grouped the way the game groups it (worlds, chapters, areas)
- **Tick things off** — single items, sets of small items (5 Dragon Coins), or counters (finished with 14 of 20 hearts)
- **Watch progress fill up** — per item, per section, per game
- **Show it off** — pin achievements to their profile, follow friends, see what friends recently completed

v1.0 games: **Stellar Blade, Elden Ring, Yoshi's Crafted World, Super Mario World, Final Fantasy VII Remake Intergrade.**

---

## Why it matters

Completion lists already exist, but they're scattered across wikis, trophy guides and spreadsheets, they don't remember what you've done, and they're ugly. Polymaths should feel like the game's own pause-menu progress screen: satisfying to fill in, beautiful to look at, and worth showing to friends.

**The quality bar:** ticking something off should feel good. If a page doesn't make you want to finish the game, it isn't done.

---

## Tech stack — these are decided, don't suggest alternatives

| Layer          | Choice                                                    | Why                                                           |
| -------------- | --------------------------------------------------------- | ------------------------------------------------------------- |
| Frontend       | Next.js (App Router) + TypeScript (strict)                | Server components for fast public pages, server actions for writes |
| Styling        | Tailwind CSS + shadcn/ui                                  | shadcn gives accessible primitives; every game theme restyles them |
| Database       | Supabase (Postgres)                                       | Auth, Postgres and Row Level Security in one free service      |
| Auth           | Supabase Auth — Google + Discord OAuth                    | Discord is where gamers are; Google covers everyone else       |
| Validation     | Zod                                                       | Same schemas validate user input and game data files           |
| Unit tests     | Vitest                                                    | Fast; covers progress maths and data validation                |
| E2E tests      | Playwright                                                | A handful of key flows (see `CONVENTIONS.md`)                  |
| Hosting        | Vercel (Hobby)                                            | Free, preview deploy per PR                                    |
| Package manager| pnpm                                                      | Fast, strict                                                   |
| Error tracking | Sentry — **added in phase 1.0, not before**               | Not needed until other people use the site                     |

Look up current docs before writing setup code for Next.js, Supabase SSR auth, shadcn/ui, Tailwind or Playwright. Versions and file names change (for example, Next.js 16 renamed `middleware.ts` to `proxy.ts`). Don't rely on memory.

---

## Architectural principles

1. **Game content lives in the repo, user progress lives in Postgres.** Checklist data is typed TypeScript under `data/games/<slug>/`, validated by Zod at build time. The database never stores game content — only who ticked what. See `docs/decisions/2026-11-12-game-data-in-repo.md`.
2. **Item IDs are permanent.** Progress rows point at item IDs. Never rename or reuse an ID. Retire items with `retired: true`. A renamed ID silently wipes players' progress.
3. **Three kinds of trackable, no more.** `check` (one tick), `pips` (a small set of separate ticks), `meter` (a number from 0 to max). Every game must be expressed with these. See `docs/data-model.md`.
4. **One progress engine, many looks.** All games share the same data format, progress maths and save logic. What differs per game is the theme, the layout of each section, the icons, and — only when it earns it — a custom skin. See `docs/themes.md`.
5. **Optimistic and honest.** A tick shows instantly, then saves. If the save fails, undo the tick and say so. Never show progress that isn't saved.
6. **Public by default, safe by default.** Profiles and progress are public to read. Everything user-written (IGN, name, bio) is plain text, filtered, rate-limited, and never rendered as HTML.
7. **Accurate or absent.** Checklist items come from cited sources. If something can't be confirmed, leave it out and log it as an open question in `docs/games/<slug>.md`.

---

## What NOT to do

- **Do not write checklist items from memory.** Research, cite sources, flag single-source items. See `docs/adding-a-game.md`.
- **Do not rename or delete item IDs.** Retire them.
- **Do not invent a fourth trackable kind.** If a game seems to need one, stop and raise it.
- **Do not store game content in the database** or build an admin editor. Content changes go through PRs.
- **Do not render user text as HTML.** No `dangerouslySetInnerHTML` with user content, ever. Profile customization is structured options only.
- **Do not use the Supabase service-role key in anything that runs in the browser.** Server-only, and only where RLS genuinely can't express the rule.
- **Do not run destructive database commands against staging or production.** `db:reset` is local only.
- **Do not commit secrets.** `.env.local` is gitignored.
- **Do not add an image without logging its source** in the game's art manifest (see Art policy).
- **Do not build features outside the current phase.** Mention ideas in Open questions instead.
- **Do not build a custom UI library.** Use shadcn/ui primitives and theme them.

---

## Art policy (personal phase)

Polymaths is currently a personal project used only by Jan. **While it stays private, official game art is allowed** — boss portraits, sprites, item icons, cover art — wherever it makes the page more beautiful.

Rules, so going public later is safe:

1. Every image lives in `public/games/<slug>/` and has an entry in `data/games/<slug>/art.ts` with `source` (URL), `owner` (e.g. "Nintendo") and `license` (`"official-unlicensed"`, `"licensed"`, `"original"`).
2. Where an image is missing, show the themed placeholder tile (initials + "Image"), never a broken image.
3. Original pixel-art icons (our own SVGs) are `"original"` and stay forever.
4. **Before going public** (phase 1.0 checklist), every `"official-unlicensed"` image is replaced with original art or licensed. A test fails the build in production mode if any remain.

See `docs/decisions/2026-11-12-art-policy.md`.

---

## File structure (target)

```
/app                          # Next.js App Router
  /(public)
    /page.tsx                 # home: logged-out landing + search; logged-in: my games + friends feed
    /games/[slug]             # game checklist page
    /u/[ign]                  # public profile
    /u/[ign]/followers
    /u/[ign]/following
  /(auth)
    /login                    # Google + Discord buttons
    /auth/callback            # OAuth callback
    /onboarding               # display name + IGN (first login only)
  /(account)
    /settings/profile         # profile, theme, showcase, top 8
/components
  /ui                         # shadcn primitives (themed, never forked)
  /checklist                  # sections, entries, trackables, progress ring/bars
  /checklist/skins            # custom per-game skins (e.g. smw-save-file)
  /icons/pixel                # PixelIcon renderer + shared pixel maps
  /icons/<slug>               # per-game icon sets (outline + filled)
  /profile                    # profile page pieces
  /feed                       # activity feed
/data
  /games/<slug>/
    index.ts                  # the Game object (see docs/data-model.md)
    art.ts                    # art manifest
  /games/registry.ts          # list of supported games
/lib
  /supabase                   # browser, server and service clients
  /games                      # schema.ts (Zod), load.ts, progress.ts (maths), ids.ts
  /progress                   # server actions: tick, set meter, pin
  /activity                   # writing + reading activity events
  /social                     # follows, top 8
  /safety                     # reserved IGNs, profanity filter, rate limits
  /themes                     # theme tokens per theme + per-game overrides
/supabase
  /migrations                 # versioned SQL
  /seed.sql                   # local dev seed (fake users, follows, progress)
  /config.toml
/public/games/<slug>/         # game art (see Art policy)
/docs
  /spec.md                    # product spec: pages, behaviors, phases
  /data-model.md              # game data format + database schema
  /themes.md                  # themes, skins, icons, sizing
  /adding-a-game.md           # step-by-step for a new game
  /games/<slug>.md            # per game: sources, structure, open questions
  /design/                    # exported mockups (HTML + screenshots) — the visual reference
  /decisions/                 # ADRs: YYYY-MM-DD-short-name.md
/tests
  /unit
  /e2e
```

---

## Key commands

These scripts are created in phase 0.1. Keep this list in sync with `package.json`.

```bash
# Dev
pnpm dev                       # Next.js dev server
pnpm db:start                  # local Supabase (requires Docker Desktop or OrbStack)
pnpm db:stop
pnpm db:reset                  # reset LOCAL db and re-seed — local only, never remote

# Migrations
pnpm db:migration:new <name>   # create a migration
pnpm db:push:staging           # apply migrations to staging
pnpm db:push:prod              # apply migrations to production (after staging is verified)
pnpm db:types                  # regenerate lib/supabase/database.types.ts

# Game data
pnpm data:validate             # Zod-validate every data/games/* file, check ID uniqueness and art manifests

# Testing
pnpm test                      # Vitest unit tests
pnpm test:watch
pnpm test:e2e                  # Playwright (needs local Supabase running)

# Build
pnpm lint
pnpm typecheck
pnpm build
```

---

## Environments

| Env        | App                                | Database                                   |
| ---------- | ---------------------------------- | ------------------------------------------ |
| Local      | `pnpm dev`                         | Local Supabase in Docker (`pnpm db:start`) |
| Staging    | Vercel preview deploy for every PR | Supabase project `polymaths-staging` (free) |
| Production | Vercel production deploy from `main` | Supabase project `polymaths-prod` (free)  |

Free-tier facts to remember:

- Supabase's free plan allows two free projects per organization (500 MB database each). Free projects **pause after about a week of low activity**; data is kept. If staging is paused, unpause it from the Supabase dashboard.
- Vercel's Hobby plan is for **personal, non-commercial use**. If Polymaths ever earns money (ads, donations with perks, subscriptions), move to Vercel Pro first.

Destructive operations (`db:reset`, dropping tables, truncating) are **local only**.

---

## Working with Claude Code on this project

**At the start of every session:**

1. Read this file
2. Read `docs/spec.md` if working on a new feature
3. Read `docs/data-model.md` before touching game data, progress or the database
4. Read `docs/themes.md` and look at `docs/design/` before touching any game page UI
5. Read `docs/games/<slug>.md` before touching a specific game

**Before writing code:**

- Use **Grill Me** if requirements are unclear
- Use **Brainstorming** for genuinely open design questions
- Propose a plan before any change that touches more than a few files
- Ask before adding a new dependency
- Reference the spec and the mockups — don't guess

**Before committing:**

- Run lint, typecheck, unit tests, `data:validate` (the pre-commit hook does this)
- Use **Code Review** for non-trivial changes
- Use **Verification Before Completion** — open the page and check it, don't assume
- Update this file if anything significant changed

**When debugging:**

- Use **Systematic Debugging** — no random edits until the root cause is confirmed

**When adding or changing game data:**

- Follow `docs/adding-a-game.md` exactly. Cite sources. Flag single-source items. Never rename IDs.

**When something feels wrong:**

- Stop and ask Jan. Especially: anything that would change or remove item IDs, anything that touches production data, and any game structure that doesn't fit the three trackable kinds.

---

## Current build state

_Update this section after every meaningful session._

**Status:** Pre-code. Project docs written. Design mockups for all five games exist in `docs/design/`.

**Done so far (outside the repo):**

- Mockups: Stellar Blade, Elden Ring, Yoshi's Crafted World, Super Mario World (save-file skin), FF7 Remake Intergrade
- Research for all five games, with sources and open questions in `docs/games/`
- An early Stellar Blade data file in the old flat format: `docs/games/stellar-blade.legacy.json` (to be converted in phase 0.4)

**Next session goal:** phase 0.1 — scaffold (see `GETTING_STARTED.md`).

**In flight:** Nothing.

**Blocked on:** Nothing. Google and Discord OAuth credentials are needed before phase 0.2 sign-in works.

---

## Known gotchas

_Add to this list as we discover them._

- **Next.js 16:** `middleware.ts` is now `proxy.ts`, and the exported function is `proxy`. Check current docs.
- **Supabase free projects pause** after about a week of low activity. A failing staging preview may just mean the project is paused.
- **Supabase service-role key bypasses RLS.** Use the user-scoped server client for anything a user triggers.
- **Discord OAuth may not return an email** if the user hasn't verified one. Never depend on email; key everything on the Supabase user ID.
- **Pixel icons must render crisply:** `shape-rendering="crispEdges"`, integer viewBox, no CSS smoothing. See `docs/themes.md`.
- **Pixel fonts (Press Start 2P) are wide.** Use them for short headings and numbers only; names and body text use Pixelify Sans or the theme's body font.
- **Spoilers:** a spoiler entry must stay blurred in every view — checklist, search results, profile showcase, activity feed — until the viewer reveals it or has completed it.

---

## Build phasing (current target)

| Phase | Goal |
| ----- | ---- |
| **0.1** | Scaffold: Next.js, Tailwind, shadcn/ui, Supabase (local + clients), Vitest, Playwright, Husky, file structure, first migration |
| **0.2** | Sign-in (Google + Discord), onboarding (display name + IGN), reserved IGNs |
| **0.3** | Game data format + Zod schema + progress engine; **Super Mario World** end to end (all trackable kinds, save-file skin, saving, optimistic UI) |
| **0.4** | The other four games: Stellar Blade, Elden Ring, Yoshi's Crafted World, FF7 Remake Intergrade; in-game search, jump-to-section, reveal-all-spoilers |
| **0.5** | Public profiles: per-game progress, showcase (up to 12 pins), profile themes |
| **0.6** | Social: one-way follows, follower/following lists and counts, Top 8, activity events, logged-in home with friends feed |
| **0.7** | Safety: profanity filter, rate limits; Playwright E2E for the key flows; accessibility pass |
| **1.0** | Polish; Sentry; art check (replace or license all official art) — **only if going public** |

---

## Open questions to resolve

1. **Profanity filter** — which package? Decide in phase 0.7 (ask Jan before adding).
2. **Top 8** — must a Top 8 friend be someone you follow? (Current assumption: no, any player.)
3. **Activity privacy** — should players be able to hide their activity from the feed? (Current assumption: no, everything is public.)
4. **Game requests** — do we want a way to request a game? (Out of scope for v1.)
5. **Per-game open questions** — see each `docs/games/<slug>.md`.

---

## Project hygiene

- Keep this file under ~500 lines. If it grows beyond that, extract to `/docs`.
- Decisions go in `docs/decisions/YYYY-MM-DD-short-name.md`
- One markdown file per game under `docs/games/`
- When in doubt, prefer simpler over cleverer
