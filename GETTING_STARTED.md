# Getting Started

> First-session checklist for building Polymaths.

## Read first

Before anything else:

1. **`CLAUDE.md`** — what we're building, the stack, the rules
2. **`docs/spec.md`** — pages, behaviors and phases
3. **`docs/data-model.md`** — how game data and progress are shaped; this is the heart of the project
4. **`docs/themes.md`** and **`docs/design/`** — what every page should look like
5. **`docs/decisions/`** — why things are the way they are

## Pre-flight (before writing any code)

- [ ] Install **Node.js** (current LTS; at least 22.22.2) and enable **pnpm**: `corepack enable`
- [ ] Install **Docker Desktop** (or OrbStack on Mac) — needed for local Supabase
- [ ] Supabase CLI: nothing to install — it is a dev dependency (`pnpm exec supabase ...`)
- [ ] Install **Claude Code** and sign in
- [ ] Create a new GitHub repo: `polymaths` (private)
- [ ] Clone it locally
- [ ] Drop the contents of this docs folder into the repo root
- [ ] Initial commit: `git add . && git commit -m "chore: initial project context" && git push`
- [ ] Install user-level Claude Code skills if not already installed:
  - Grill Me
  - Brainstorming
  - Systematic Debugging
  - Code Review
  - Test-Driven Development
  - Verification Before Completion
  - Requesting Code Review
  - Skill Creator

## External accounts and credentials

All free. You'll need:

- [ ] **GitHub** — the repo
- [ ] **Supabase** — create two free projects: `polymaths-staging` and `polymaths-prod`
- [ ] **Vercel** — Hobby account, import the GitHub repo (do this after phase 0.1)
- [ ] **Google Cloud** — an OAuth client ID ("Web application") for Google sign-in
- [ ] **Discord Developer Portal** — an application with OAuth2 for Discord sign-in
- [ ] **Sentry** — not yet; added in phase 1.0

Some of these can wait. Phase 0.1 only needs GitHub and Docker. OAuth is needed for phase 0.2.

### OAuth redirect addresses

Each OAuth app (Google and Discord) needs the callback address of **every** Supabase you'll sign in through:

| Where      | Callback address                                      |
| ---------- | ----------------------------------------------------- |
| Local      | `http://127.0.0.1:54321/auth/v1/callback`             |
| Staging    | `https://<staging-project-ref>.supabase.co/auth/v1/callback` |
| Production | `https://<prod-project-ref>.supabase.co/auth/v1/callback`    |

Then, in each hosted Supabase project, turn on the Google and Discord providers and paste in the client ID and secret. Add the site URLs (`http://localhost:3000`, your Vercel preview pattern, your production URL) to each project's allowed redirect URLs. For local, Claude Code will wire the providers into `supabase/config.toml` using env vars.

### Setting up Google sign-in (phase 0.2)

The code is done; these steps are dashboard work only you can do.

1. **Google Cloud Console** → APIs & Services:
   - **OAuth consent screen** (Google Auth Platform → Branding / Audience): app name "Polymaths", user type **External**, publishing status **Testing**, and add your own Google account as a **test user**. Scopes: the defaults (`openid`, `email`, `profile`) are all we need.
   - **Credentials → Create credentials → OAuth client ID** → "Web application".
     - Authorized JavaScript origins: `http://localhost:3000`, `https://polymaths-zbmo.vercel.app`
     - Authorized redirect URIs: the three Supabase callback addresses in the table above.
2. **Local:** put the client ID and secret in `.env.local` as `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID` and `SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET`, then restart Supabase (`pnpm db:stop && pnpm db:start`).
3. **Each hosted Supabase project** (staging and prod) → Authentication:
   - **Sign In / Providers → Google:** enable, paste the client ID and secret.
   - **Sign In / Providers → Email:** turn **off** (no email sign-up; spec).
   - **URL Configuration:**
     - prod — Site URL `https://polymaths-zbmo.vercel.app`; Redirect URLs `https://polymaths-zbmo.vercel.app/auth/callback`
     - staging — Site URL `http://localhost:3000`; Redirect URLs `https://polymaths-zbmo-*.vercel.app/auth/callback` (every preview) and `http://localhost:3000/auth/callback`
     - Check the preview pattern against a real preview URL; Vercel preview hosts look like `polymaths-zbmo-<hash>-<team>.vercel.app`. If a sign-in lands on the Site URL instead of `/auth/callback`, the redirect URL didn't match.
4. Sign in on `http://localhost:3000/login`, then on a PR preview, then (after merging) on production.

While the consent screen is in **Testing**, only listed test users can sign in. That suits the personal phase; publishing the app is a phase 1.0 task.

**Never paste secrets into a chat.** Put them in `.env.local` or the Supabase/Vercel dashboards yourself.

## First Claude Code session

Start the session with:

```
Read CLAUDE.md, CONVENTIONS.md, docs/spec.md, docs/data-model.md, docs/themes.md and docs/decisions/ in full, and look at the screenshots in docs/design/.

Then summarise back to me: what we're building, the stack, the three trackable kinds and how progress is stored, how themes and skins work, the art policy, and what phase 0.1 includes. Don't write any code yet — I want to confirm you've understood the project.
```

This first prompt deliberately asks Claude to _demonstrate understanding_ before doing anything. If Claude gets the trackable kinds, the ID rules or the art policy wrong, stop and re-read the docs together.

## After confirmation, scaffold (phase 0.1)

Second prompt:

```
Good. Scaffold the empty project per CLAUDE.md and CONVENTIONS.md. Look up current docs for each tool first.

- pnpm create next-app with TypeScript (strict), Tailwind, App Router
- Install and initialise shadcn/ui
- Supabase JS + SSR clients in lib/supabase/ (browser, server, service)
- supabase init; local Supabase starts with pnpm db:start
- First migration: profiles table only, with RLS (see docs/data-model.md)
- Vitest with one example test; Playwright with one example spec
- Husky + lint-staged pre-commit: lint → typecheck → unit tests → data:validate
- File structure per CLAUDE.md (empty folders get a .gitkeep)
- package.json scripts matching "Key commands" in CLAUDE.md
- .env.example with every variable, no values

Don't write any feature code yet. Just the scaffold. Show me the plan before you start.
```

Then: connect the repo to Vercel, set the Preview environment variables to the staging Supabase project and Production to the production project, and check a preview deploy loads.

## First feature (phase 0.2)

**Sign-in + onboarding.**

- Google and Discord sign-in on `/login` (Google done; Discord deferred until its credentials exist)
- First login → `/onboarding` for display name + IGN (validated, unique ignoring case, reserved names blocked)
- Signed-in users without a profile are always sent to `/onboarding`
- Signed-in landing page with an empty "no games started yet" state
- Deploy to a PR preview, sign in there, verify

Then phase 0.3: the data format and Super Mario World end to end. Super Mario World goes first because it uses all three trackable kinds and the most custom skin — if the engine handles it, the other games are easy.

## Ongoing rituals

After every meaningful session:

1. Update `CLAUDE.md` Current build state (status, next, in flight, blocked)
2. If you made an architectural decision, write an ADR in `docs/decisions/`
3. If you discovered a gotcha, add it to `CLAUDE.md` Known gotchas
4. If you touched a game's data, update `docs/games/<slug>.md` (sources, open questions)
5. Run lint, typecheck, tests and `data:validate` before committing
6. Commit with a conventional commit message
7. Push, open a PR, check the preview, merge

## When in doubt

- Re-read `docs/data-model.md` — most questions are answered there
- Look at `docs/design/` before inventing UI
- Ask Jan before changing IDs, the trackable kinds, or anything in production

The single most important principle: **one progress engine, many looks.** Every game should feel completely its own, but under the hood they all tick, save and count the same way.
