# Product Spec

> What every page does and how it behaves. Visual details live in `themes.md` and `docs/design/`.

---

## Users and accounts

- **Sign in** with Google or Discord on `/login`. No passwords, no email sign-up.
- **Onboarding** (`/onboarding`) on first sign-in: display name and IGN (in-game name).
  - IGN: 3–20 characters, letters, numbers and underscores; unique ignoring case; not reserved; not offensive.
  - A signed-in user without a profile is always redirected here.
- **IGN changes** are allowed from settings, max once per 30 days (old profile URLs stop working).
- **Sign out** from the avatar menu.

## Pages

### Home — `/`

**Signed out:** short pitch, game search, and the grid of supported games.

**Signed in:**

1. **My games** — games you've started, as cards with the game's theme color, % complete and a progress bar. Sorted by most recently updated.
2. **Friends' activity** — recent completions by people you follow ("**Kiko** cleared **Donut Plains** in Super Mario World · 2h ago"). 30 most recent; spoilers blurred.
3. **Game search** — filters supported games by title.

### Game checklist — `/games/[slug]`

Public to view. Signed-out visitors see the checklist with nothing ticked; tapping anything asks them to sign in.

- **Header card:** title, overall % (ring or bar per theme), "X of Y done. Z to go.", and stat tiles defined by the game (`stats` in the data).
- **Jump to section:** a row of section tabs showing each section's progress, with a mark when complete.
- **Search in game:** finds entries and trackables by name; results jump to and highlight the entry. Spoiler entries match only if revealed or complete.
- **Reveal all spoilers:** a per-game switch, remembered per user (localStorage is fine for v1).
- **Sections** in game order, each with title, label, progress, and a "complete" badge that **does not change the layout when it appears** (reserve its space).
- **Entries** rendered by the section's layout (`rows`, `cards`, `gallery`) or the game's skin.
- **Ticking:**
  - `check`: tap toggles.
  - `pips`: tap a pip toggles that pip.
  - `meter`: tap the Nth icon sets the value to N; tapping the current value again lowers it by one.
  - Every tick is optimistic; failures roll back with a toast.
- **Spoilers:** spoiler entries are blurred (name and image) until tapped, revealed, or complete.

### Profile — `/u/[ign]`

Public. Shows, in an order the owner chooses:

- **Header:** avatar, display name, IGN, bio, follower and following counts (linking to the lists), a Follow button (signed-in, not yourself).
- **Showcase:** up to 12 pinned completed entries or sections, with icons/art.
- **Per-game progress:** each started game with % and a link to that player's checklist view (read-only for visitors).
- **Top 8:** up to 8 chosen players, Friendster-style, with avatars and IGNs.
- **Recent activity:** the player's 20 most recent completions.

Followers / following lists: `/u/[ign]/followers`, `/u/[ign]/following`.

### Settings — `/settings/profile`

- Display name, IGN, bio
- **Profile theme** (all structured options, validated with Zod, never raw CSS/HTML):
  - `preset`: one of 6 presets (to be designed in phase 0.5)
  - `accentColor`: hex, checked for contrast against the preset
  - `background`: one of a fixed list of patterns
  - `font`: one of a fixed list of display fonts
  - `sectionOrder`: order of showcase, games, top 8, activity, bio
- **Showcase:** pick from completed items, drag to reorder (max 12)
- **Top 8:** search players, add, reorder (max 8)

## Safety

- **Reserved IGNs:** `admin`, `administrator`, `polymaths`, `support`, `help`, `mod`, `moderator`, `staff`, `system`, `root`, `api`, `settings`, `login`, `u`, `games` and similar. List in `lib/safety/reserved-igns.ts`.
- **Profanity filter** on IGN, display name and bio (package chosen in phase 0.7).
- **Rate limits** on follows, profile updates and progress writes (see data-model).
- All user text rendered as plain text.

## Phases

See the table in `CLAUDE.md`. Each phase ends with: tests passing, PR preview checked on a phone-sized screen and desktop, `CLAUDE.md` build state updated.

## Out of scope for v1

- Games other than the five listed
- Comments, testimonials, messaging
- Image uploads (avatars come from Google/Discord)
- Private profiles or hidden activity
- Admin screens for game data
- Reporting profiles
- A mobile app
- Monetization of any kind (see Vercel Hobby terms in CLAUDE.md)
