# Data Model

> Two halves: **game data** (typed files in the repo) and **user data** (Postgres).
> They meet in one place: the progress table stores item IDs that point into the game data.

---

## Part 1 — Game data

### Where it lives

```
data/games/registry.ts          # ordered list of supported games
data/games/<slug>/index.ts      # export default game: Game
data/games/<slug>/art.ts        # export default art: ArtManifest
lib/games/schema.ts             # Zod schemas for everything below
```

`pnpm data:validate` parses every game with the Zod schema and also checks:

- every ID is unique across **all** games
- every ID starts with the game's `idPrefix`
- every `image` key exists in the art manifest, and every manifest file exists in `public/games/<slug>/`
- `pips.count` is between 2 and 30 (or exactly 1 when the trackable sets `singlePip: true`; see Exceptions below); `meter.max` is between 2 and 999
- no section or entry is empty

### The shape

```ts
type Game = {
  slug: string                  // 'super-mario-world' — used in URLs
  title: string                 // 'Super Mario World'
  idPrefix: string              // 'smw-'
  publisher: string             // 'Nintendo'
  platforms: string[]           // ['SNES']
  theme: ThemeName              // 'default' | 'nintendo' | 'souls' | 'square'  (see themes.md)
  accent?: string               // per-game override of the theme accent, e.g. Yoshi green
  skin?: SkinName               // optional custom skin, e.g. 'smw-save-file'
  sections: Section[]           // worlds, chapters, areas — in game order
  goals?: Entry[]               // whole-game goals shown at the bottom
  stats: StatDef[]              // the summary tiles at the top (see below)
}

type Section = {
  id: string                    // 'smw-donut-plains'
  title: string                 // 'Donut Plains'
  label?: string                // 'World 2', 'Chapter 9', 'DLC'
  layout: 'rows' | 'cards' | 'gallery'
  spoiler?: boolean             // whole section blurred until revealed (e.g. post-game worlds)
  entries: Entry[]
  extras?: EntryGroup[]         // section-level groups, e.g. a world's 10 costumes
}

type EntryGroup = {
  id: string                    // 'ycw-sunshine-station-costumes'
  title: string                 // 'Costumes'
  layout: 'gallery' | 'chips'
  entries: Entry[]
}

type Entry = {
  id: string                    // 'smw-donut-plains-1'
  name: string                  // 'Donut Plains 1'
  kind: string                  // free label per game: 'course', 'castle', 'boss', 'costume', 'chapter'...
  note?: string                 // short how-to, in our own words
  spoiler?: boolean
  retired?: boolean
  image?: string                // key into the art manifest
  icon?: string                 // icon set key for the entry itself (galleries)
  trackables: Trackable[]       // what can be ticked on this entry
}

type TrackableBase = {
  id: string
  label: string                 // 'Secret exit', 'Dragon Coins', 'Hearts at the goal'
  icon: string                  // icon key in the game's icon set
  group?: string                // optional visual group: 'Front side', 'Craft requests', 'Flip Side'
  spoiler?: boolean
  retired?: boolean
}

type Trackable =
  | (TrackableBase & { kind: 'check' })
  | (TrackableBase & { kind: 'pips';  count: number; singlePip?: true })   // 2–30; 1 only with singlePip
  | (TrackableBase & { kind: 'meter'; max: number })     // 2–999

type StatDef = {
  label: string                 // 'Exits', 'Dragon Coins', '3-Up Moons'
  match: { trackableKind?: Trackable['kind']; icon?: string; entryKind?: string; idSuffix?: string }
  count: 'units' | 'completed'  // count every unit (each pip) or only completed trackables
}
```

### The three trackable kinds

Everything in every game is one of these. **Do not add a fourth** without an ADR.

| Kind | Use for | UI | Stored as | Counts toward % as |
| ---- | ------- | -- | --------- | ------------------ |
| `check` | One thing, done or not: an exit, a boss, a costume, a side quest | One icon or chip that fills in | One row, `value = 1` | 1 unit |
| `pips` | A small set of separate things in one place, 2–30: 5 Dragon Coins, 7 hidden Smiley Flowers | One icon per pip, each tapped on its own | One row **per pip**, `item_id = <id>#<n>`, `value = 1` | 1 unit per pip |
| `meter` | One number you reach: finished with 14 of 20 hearts, 14 of 20 Red Coins | A bar of icons; tapping the Nth fills 1..N; tapping the last filled one again removes one | One row, `value = n` (0 = no row) | 1 unit, done only at `max` |

Rules of thumb:

- **Would a player find them one by one, in any order, and want to know which?** → `pips`.
- **Would a player just want to say "I got 14"?** → `meter`. (Red Coins became a meter because tracking 20 individual coins was too fiddly.)
- **More than 30 separate things?** Split into entries, or use a `meter`.

#### Exceptions

Agreed with Jan; see `docs/decisions/2026-11-14-trackable-exceptions.md`.

- **A single pip (`count: 1`) is allowed only with `singlePip: true`.** Use it when a game shows a set everywhere else and one place has just one of them, so that place should look the same as the others. Super Mario World's Chocolate Secret Dragon Coin is the case this was made for. It's stored and counted like any pip (`<id>#1`, 1 unit). Without the flag, `count: 1` fails validation; a lone thing is normally a `check`.
- **A game doesn't have to use all three kinds.** Super Mario World uses only `check` and `pips`. The engine's `meter` handling is still fully unit-tested in phase 0.3 with test fixtures; the first real meters are Yoshi's Crafted World's (phase 0.4).

### IDs

- Lowercase, `-` separated, prefixed with the game's `idPrefix`.
- Built from what the thing **is**, not where it sits in a list: `smw-donut-plains-1-secret-exit`, `ycw-pirate-pier-craft-pirate-ship`, `ff7r-ch9-quest-a-dynamite-body`.
- Pip rows append `#<n>` (1-based): `smw-yoshis-island-1-dragon-coins#3`.
- **Permanent.** Never rename, never reuse. Retire with `retired: true`; retired items are hidden and excluded from percentages, but their progress rows are kept.

### Example (Super Mario World, one entry)

```ts
{
  id: 'smw-donut-plains-1',
  name: 'Donut Plains 1',
  kind: 'course',
  trackables: [
    { id: 'smw-donut-plains-1-exit',         kind: 'check', label: 'Normal exit', icon: 'exit' },
    { id: 'smw-donut-plains-1-secret-exit',  kind: 'check', label: 'Secret exit', icon: 'key' },
    { id: 'smw-donut-plains-1-dragon-coins', kind: 'pips',  label: 'Dragon Coins', icon: 'dragon-coin', count: 5 },
  ],
}
```

### Example (Yoshi's Crafted World, one course)

```ts
{
  id: 'ycw-pirate-pier',
  name: 'Pirate Pier',
  kind: 'course',
  trackables: [
    { id: 'ycw-pirate-pier-clear',       kind: 'check', label: 'Cleared',          icon: 'tick' },
    { id: 'ycw-pirate-pier-coins',       kind: 'check', label: '100 Coins',        icon: 'tick' },
    { id: 'ycw-pirate-pier-flowers',     kind: 'pips',  label: 'Smiley Flowers',   icon: 'flower', count: 6 },
    { id: 'ycw-pirate-pier-red-coins',   kind: 'meter', label: 'Red Coins',        icon: 'red-coin', max: 20 },
    { id: 'ycw-pirate-pier-hearts',      kind: 'meter', label: 'Hearts at the goal', icon: 'heart', max: 20 },
    { id: 'ycw-pirate-pier-craft-flightless-goonie', kind: 'check', label: 'Flightless Goonie', icon: 'craft' },
    // ...more crafts
    { id: 'ycw-pirate-pier-pups',        kind: 'check', label: '3 Poochy Pups',    icon: 'tick' },
    { id: 'ycw-pirate-pier-pups-timed',  kind: 'check', label: 'Pups within the time limit', icon: 'tick' },
  ],
}
```

Trackables are grouped visually (front side / crafts / Flip Side) by their optional `group`; the renderer groups consecutive trackables with the same `group` under a small heading.

### Progress maths (`lib/games/progress.ts`)

Pure functions, fully unit tested:

- `units(trackable)` → 1 for check, `count` for pips, 1 for meter
- `doneUnits(trackable, rows)` → check: row exists; pips: number of pip rows; meter: 1 if `value >= max`
- `entryProgress`, `sectionProgress`, `gameProgress` → `{ done, total, percent }`, ignoring retired items
- `isComplete(x)` → `done === total`
- Percentages round down, so 100% only shows when truly complete.

---

## Part 2 — Database (Supabase Postgres, `public` schema)

All tables have RLS on. Default policy pattern: **anyone can read, owners can write their own rows.**

### `profiles`

| Column | Type | Notes |
| ------ | ---- | ----- |
| `id` | uuid PK | references `auth.users(id)` on delete cascade |
| `display_name` | text | 1–40 chars, profanity-filtered |
| `ign` | citext unique | 3–20 chars, `^[A-Za-z0-9_]+$`, not reserved, profanity-filtered; used in `/u/[ign]` |
| `bio` | text | 0–300 chars, plain text, profanity-filtered |
| `avatar_url` | text | from the OAuth provider; no uploads in v1 |
| `theme` | jsonb | profile customization, validated by Zod (see spec) |
| `created_at`, `updated_at` | timestamptz | |

### `progress`

One row per completed unit (see trackable kinds).

| Column | Type | Notes |
| ------ | ---- | ----- |
| `user_id` | uuid | references `profiles(id)` on delete cascade |
| `game_slug` | text | for per-game queries |
| `item_id` | text | trackable ID, or `<id>#<n>` for a pip |
| `value` | smallint | 1 for checks and pips; reached number for meters (row deleted at 0) |
| `updated_at` | timestamptz | |

Primary key `(user_id, item_id)`. Index `(user_id, game_slug)`.

The server action validates that `item_id` exists in the game data (and pip number ≤ count, meter value ≤ max) before writing. The database doesn't know the game data, so this check must never be skipped.

### `activity`

Written by the server action when something becomes complete. Feeds the home feed and profile "recent activity".

| Column | Type | Notes |
| ------ | ---- | ----- |
| `id` | bigint identity PK | |
| `user_id` | uuid | |
| `game_slug` | text | |
| `target_id` | text | the entry, section or game ID that was completed |
| `target_type` | text | `'entry' \| 'section' \| 'game'` |
| `created_at` | timestamptz | |

Rules:

- Write an event when an **entry** becomes complete, a **section** becomes complete, or the **game** reaches 100%. Not for every pip.
- If the player un-ticks within 10 minutes, delete the matching event (no feed spam from mis-taps).
- Spoiler targets are shown blurred to viewers who haven't completed or revealed them.

### `showcase`

| Column | Type | Notes |
| ------ | ---- | ----- |
| `user_id` | uuid | |
| `target_id` | text | an entry or section ID |
| `position` | smallint | 1–12 |

PK `(user_id, target_id)`, unique `(user_id, position)`. A target can only be pinned if it's complete (checked in the server action).

### `follows`

| Column | Type | Notes |
| ------ | ---- | ----- |
| `follower_id` | uuid | |
| `followee_id` | uuid | |
| `created_at` | timestamptz | |

PK `(follower_id, followee_id)`, check `follower_id <> followee_id`. One-way, no requests.

### `top_friends`

| Column | Type | Notes |
| ------ | ---- | ----- |
| `user_id` | uuid | |
| `friend_id` | uuid | any player (see open questions in CLAUDE.md) |
| `position` | smallint | 1–8 |

PK `(user_id, friend_id)`, unique `(user_id, position)`.

### `rate_limit_events`

| Column | Type | Notes |
| ------ | ---- | ----- |
| `user_id` | uuid | |
| `action` | text | `'follow'`, `'profile_update'`, `'progress'` |
| `created_at` | timestamptz | |

Checked by a `security definer` SQL function `check_rate_limit(action, max, window)` called from server actions. Old rows are pruned by the same function. Starting limits (tune later): follows 30/min, profile updates 10/min, progress 120/min.

### RLS summary

| Table | Select | Insert / update / delete |
| ----- | ------ | ------------------------ |
| `profiles` | everyone | own row (`id = auth.uid()`) |
| `progress` | everyone | own rows |
| `activity` | everyone | own rows |
| `showcase` | everyone | own rows |
| `follows` | everyone | rows where `follower_id = auth.uid()` |
| `top_friends` | everyone | own rows |
| `rate_limit_events` | own rows | via function only |

### Seed data (`supabase/seed.sql`)

Local only: 5 fake players with profiles, some follows, a Top 8, and partial progress in each game, so every page has something to show.
