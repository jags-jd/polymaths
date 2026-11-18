# Themes, Skins and Icons

> Every game page uses the same components. What changes is the **theme** (tokens), optional **per-game accent**, the **section layouts**, the **icon set**, and — rarely — a **custom skin**.
> The mockups in `docs/design/` are the reference. Match them.

---

## How it fits together

```
Game.theme   → base tokens (colors, fonts, radius, header style)
Game.accent  → overrides the accent (and header color where the theme says so)
Section.layout → rows | cards | gallery
Game.skin    → optional: replaces the section + entry renderers entirely (e.g. smw-save-file)
icons        → components/icons/<slug>/, each with an outline and a filled state
```

Themes are CSS variables defined as TypeScript constants in `lib/themes/tokens.ts` (theme → game `accent` → per-game overrides in `GAME_TOKENS` → skin, via `gameTokens`; every registered game's final tokens are contrast-tested). A game page renders `<ThemeStyle game={game} />`, a plain `<style>` that sets them on `:root` while the page is mounted, so the site header (outside the page, in the root layout) follows the theme too; elsewhere the header and body fall back to the default look (`.site-header` in `app/globals.css`). Components only use the variables (`bg-(--surface)`, `text-(--text)`), never raw hex. Skins add their own prefixed tokens (`--smw-frame`, …) in `SKIN_TOKENS`. Theme fonts load through `next/font` in `app/layout.tsx` with `preload: false` (Nunito 400–900 and Press Start 2P so far; the others arrive with their first game in 0.4).

### Token list (every theme defines all of these)

**Site header** (`components/layout/SiteHeader.tsx`, same on every page): a minimal 48px bar, the checkmark mark + "Polymaths" wordmark (`--font-display`, else the site heading font) on the left, and the avatar (ringed, initials in the header colors) or a "Sign in" pill on the right. Content is 1040px wide to line up with a game page. Colors come from `--header-bg` / `--header-text` / `--header-stripe` (Jan chose "minimal", 2026-11-17).

`--bg`, `--surface`, `--surface-2`, `--border`, `--text`, `--muted`, `--accent`, `--on-accent` (text on accent), `--done-bg`, `--done-border`, `--header-bg`, `--header-text`, `--header-stripe`, `--radius-card`, `--radius-control`, `--font-body`, `--font-display`, `--display-case` (`none` or `uppercase`), `--shadow-card`.

Contrast: `--text` on `--bg`/`--surface`, `--muted` on `--surface`, and `--on-accent` on `--accent` must all be at least 4.5:1. A unit test checks every theme.

---

## The themes

### `default` — used by Stellar Blade (and any game without a better fit)

| Token | Value |
| ----- | ----- |
| bg / surface / border | `#0F1117` / `#181B24` / `#2A2F3D` |
| text / muted | `#ECEEF4` / `#A3A9B8` |
| accent / on-accent | `#7CE0C3` / `#0F1117` |
| fonts | Inter (body), Space Grotesk 700 (display) |
| shape | cards 14–20px radius, pill buttons |
| header | dark bar, accent logo |

Signature: progress ring, category chips, gallery cards with "Image" slots for bosses and suits.

### `nintendo` — Nintendo games

| Token | Value |
| ----- | ----- |
| bg / surface / border | `#F4F4F6` / `#FFFFFF` / `#E3E4E8` |
| text / muted | `#1F2329` / `#5F6470` |
| accent / on-accent | `#E60012` / `#FFFFFF` |
| header | solid accent-colored bar, white text, white pill search |
| fonts | Nunito 800–900 (display and body) |
| shape | cards 20–24px radius with a soft `0 2px 0` bottom shadow, pill buttons |
| ticked chip | fills accent, white text; icon chips (flowers, coins, hearts) stay light with the icon filled |

**Per-game accents:**

- **Yoshi's Crafted World:** layout `cards` (the mockup; Jan, 2026-11-18). Accent `#1F7F2D`; header green with faint white egg-spot dots and a 6px red (`#E5202E`) bottom stripe; page `#F2F6EC`, borders `#DCE6D2`, text `#1C2619`, muted `#4D5A47`, done cards `#EEF7E9`. Hearts and Red Coins stay red.
- **Super Mario World:** header red `#D3202A` with a 6px blue (`#1E4FBF`) stripe; uses the `smw-save-file` skin below.

### `souls` — FromSoftware games (Elden Ring; future Dark Souls, Bloodborne, Sekiro)

| Token | Value |
| ----- | ----- |
| bg / surface / border | `#0B0A08` / `#15130F` / `#3A3326` |
| text / muted | `#E8E1CF` / `#A99F89` |
| accent / on-accent | `#C9A25A` / `#0B0A08` |
| fonts | EB Garamond 17px (body), Cinzel 700 uppercase (display) |
| shape | square corners (2–3px), thin bronze borders, no shadows |
| extras | small gold ornament line (two rules, a diamond, two dots) under the game title |

### `square` — Square Enix games (FF7 Remake Intergrade)

| Token | Value |
| ----- | ----- |
| bg / surface / border | `#0B0F13` / `#121A22` / `#253242` |
| text / muted | `#E6EEF5` / `#93A4B5` |
| accent / on-accent | `#4FE0B0` (mako green) / `#06120E` |
| fonts | Inter (body), Rajdhani 700 uppercase (display) |
| shape | 6–8px radius, sharp chips |
| header | dark with a faint mako grid pattern and an accent bottom border |

Icons: vinyl disc (music discs), red materia orb (summons), sword (weapons), dress (bridal outfits), card (Battle Intel, flyers, Fort Condor).

---

## Section layouts

| Layout | Use for | Notes |
| ------ | ------- | ----- |
| `rows` | Levels with several trackables each (SMW's skin) | Name left; trackable icons in aligned columns. Shared version arrives with Stellar Blade; until then `rows` and `gallery` sections render as cards |
| `cards` | Entries with grouped trackables (a chapter with quests, discs, weapons) | Full-width card per entry, groups with small headings |
| `gallery` | Things you collect and want to see (bosses, costumes, legendary items) | Grid of square/portrait tiles with art or placeholder, "Defeated"/"Owned" badge |


### Shared layouts (`components/checklist/layout/`, phase 0.4)

Every game without a skin renders `<ChecklistPage>`: `SummaryCard` (progress ring, "Game checklist", title, "X of Y done", stat tiles, in-game search, a "Reveal all spoilers" switch when the game has spoilers), `SectionNav` (jump-to-section links with %; one swipeable line on phones), one `SectionBlock` per section, then `GoalsSection`.

- **`cards`** (Yoshi's Crafted World): `EntryCard` shows kind, name, "x / y found" and a % pill, then the trackables in data order. Consecutive checks share a chip row (`CheckChip`, filled with the accent when done); pips are icon buttons (`PipRow`); meters are `max` steps you tap like a health bar (`MeterRow`). Pips and meter steps share a 10-column grid (28–32px targets, 22px icons), so a 20-step meter is two rows of 10 and flowers line up with coins. An entry with both ungrouped and grouped trackables is a **two-sided card** (`CardSides`, shadcn `tabs`): the course (ungrouped) on the front, the grouped extras on the back. The tabs show each side's count and a tick when that side is done; both faces stay rendered in one grid cell, so the card is as tall as its taller side and never resizes; turning rotates them 180° in 3D (`motion-safe:` only) and the face turned away becomes `invisible` and `inert` half-way through, so only one side is ever seen, and a search hit on the back turns the card over. Entries with only one kind (bosses) stay one-sided. A `group` ("Craft requests", "Flip Side") sits in a tinted sub-panel (`--surface-2`; `--surface` at 70% on a finished card). Ticking is a transition, never a load animation: a filled icon grows from 90% to full size, chips and icons shrink slightly while pressed (all `motion-safe:`), and a card at 100% fades to the done colours with a soft glow.
- **Extras:** `gallery` groups are square tiles (`GalleryGroup`: placeholder initials until art exists, a tick badge when owned); `chips` groups are a chip per entry.
- **Spoilers:** a hidden entry is a single "Spoiler · tap to reveal" button (cards) or an eye tile (gallery); nothing in it is named, not even in aria-labels. One rule in `lib/games/visibility.ts`; reveal state and the per-game switch (`localStorage` key `pm-reveal-<slug>`) live in `ChecklistUiProvider`.
- **Search:** `SearchBox` filters entry names and trackable labels (`searchGame`), never hidden spoilers; picking a result scrolls to the entry and highlights it.
- Icons: `TrackableIcon.tsx` maps icon keys to our own art (Yoshi's flower, red coin, heart) or lucide line icons for chips; unknown keys fall back to a tick.

## Custom skins

A skin replaces the section and entry renderers for one game. Allowed only when it's clearly worth it, and it must still use the shared progress engine and trackable components.

### `smw-save-file` — Super Mario World

Inspired by a save-file / course-list screen.

- Page `#FFF1BF` with a faint dot pattern.
- Each world (and the summary and Whole game cards) is a **panel**: a `#F8C030` title bar over a `#FFFBEA` body, 3px `#6B4700` border, 16px radius, `0 4px 0 #6B4700` shadow. The body runs to the border on the left, right and bottom (no gold around it, Jan 2026-11-17); a 3px brown line separates it from the title bar.
- **One font:** everything on the page is **Press Start 2P** (Jan, 2026-11-15), sized small (10–12px for names and text) because it's wide. It has one weight, so no bold.
- **Title bars:** world name with a 2px white text-shadow, and the score on the right. No chevrons or arrows.
- **Rows:** rounded (10px) bars, alternating `#FBE3F0` / `#FAD27A`, ~4px apart, no labels.
- **Proportions:** every pixel icon is drawn at the same scale, `--smw-px` screen pixels per art pixel: **2** from `sm`, **1.5** on phones. So a 16-pixel exit is 32px and a 12×16 Dragon Coin is 24×32px on desktop. Rows are 48px (40px on phones). Names column ~330px, then exits, then coins (as wide as the world's biggest set), then moon, all column-aligned.
- **Phones:** icons sit on one line under the name; world tabs are one swipeable line; no horizontal page scroll.
- **Summary panel:** striped red progress bar and a two-column score list (one column on phones).
- The "World complete" badge **reserves its space** so nothing moves when it appears (just the star on phones). A tab gets a star when its world is complete.
- **Whole game:** goals tick themselves (`auto`, see `data-model.md`), so they are flat cards, not buttons, each showing its progress ("52/96 exits").

---

## Icons

### Pixel icons

All game icons we draw are **original pixel art**, rendered by one component:

```tsx
<PixelIcon map={DRAGON_COIN} palette={palette} state="filled" | "outline" size={46} label="Dragon Coin 3" />
```

- `map` is an array of equal-length strings, one character per pixel (e.g. `#` outline, `o` base, `h` highlight, `s` shade).
- The component merges horizontal runs into `<rect>`s, uses an integer `viewBox`, and sets `shape-rendering="crispEdges"`.
- **Outline state:** only the outline pixels (and a faint hint of inner detail) in `#8C7A4A`-family brown, or the theme's muted color on dark themes.
- **Filled state:** full palette with a dark navy (`#1B1F4A`) outline on light themes.
- Size with CSS (`width: clamp(...)`, `height: auto`) so icons scale on phones.

### Super Mario World set (from the mockup)

Maps live in `components/icons/super-mario-world/pixel-maps.ts` (license `original`); `PixelIcon` is in `components/icons/pixel/`.

| Icon | Used for | Filled look |
| ---- | -------- | ----------- |
| `exit` | Normal exits | Red rounded tile, bevel highlight/shade, white pixel **M** with dark-red drop shadow |
| `key` | Secret exits | Gold key with round bow, keyhole, two teeth |
| `switch-yellow`, `switch-green`, `switch-red`, `switch-blue` | Switch Palaces | Dome with white **!** on a striped gold base, in the palace's color (yellow, green, red-pink, periwinkle blue) |
| `castle` | Castles and fortresses | Purple rounded tile with white pixel castle (crenellations, windows, door) |
| `dragon-coin` | Dragon Coins | Tall gold oval, highlight left, orange shade right, embossed ring, raised centre bar |
| `moon` | 3-Up Moons | Smiling yellow crescent with dark outline and pale highlight |
| `bowser-door` | Bowser's Front/Back Door | Arched wooden door with a gold knob in a grey stone frame (new for Polymaths, 2026-11-14) |

### Yoshi's Crafted World set

Daisy (Smiley Flowers, outlined → white petals + yellow centre), red coin (outlined → red with shine), heart (outlined → red with highlight), egg (decoration). Currently smooth vector icons; may move to pixel style later.

### Other games

Stellar Blade, Elden Ring and FF7 use image tiles for bosses/costumes (official art allowed in the personal phase — see CLAUDE.md Art policy) and simple vector icons for chips.

---

## Sizing and spacing rules

- Touch targets: aim for 44px; the SMW skin uses narrower coin buttons (~26–46px wide, ≥52px tall) by design to keep coins tight.
- Icon height ≈ 1.5× the row's text cap height.
- Badges that appear on completion never change layout (reserve space with `visibility: hidden`).
- Everything works at 390px wide.
