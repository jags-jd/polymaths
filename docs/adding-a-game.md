# Adding a Game

> Follow every step. A wrong checklist is worse than a short one.

## 1. Agree the scope with Jan

- Which edition / DLC? (e.g. "Intergrade includes INTERmission")
- Which theme? Publisher match from `themes.md`, else `default`. Any per-game accent?
- Does it need a custom skin? (Default answer: no.)
- What's the `slug` and `idPrefix`? (`super-mario-world`, `smw-`)

## 2. Research — with sources

- Start from the **trophy / achievement list**, then the most complete **wiki**, then a reputable **guide site**.
- For every list (levels, bosses, collectibles, quests…) record which sources it came from in `docs/games/<slug>.md`.
- **Two sources agree** → use it.
- **Only one source** → include it only if the source is strong (official, Super Mario Wiki, Fextralife-level), and list it under **Single-source items**.
- **Sources disagree** → pick one, and list the conflict under **Open questions**.
- **Can't confirm** → leave it out and list it under **Open questions**.
- Never write items from memory.

## 3. Model it

- Map the game's own structure to `sections` (worlds, chapters, areas) in game order.
- For each entry, choose trackables using the rules in `data-model.md`:
  - one thing → `check`
  - a few separate things in one place (≤30) → `pips`
  - a number you reach → `meter`
- Pick section layouts (`rows`, `cards`, `gallery`).
- Define `stats` for the summary tiles.
- Mark spoilers: late-game bosses, endings, post-game areas, story reveals.
- Write names and notes in our own words.

## 4. Write the files

- `data/games/<slug>/index.ts` — the `Game` object
- `data/games/<slug>/art.ts` — art manifest (can start empty; placeholders render automatically)
- Add the game to `data/games/registry.ts`
- Icons in `components/icons/<slug>/` if the game needs its own set (outline + filled)
- `docs/games/<slug>.md` — sources, counts per section, single-source items, open questions

## 5. Validate

- `pnpm data:validate` passes
- Unit test: totals per section match the counts in `docs/games/<slug>.md`
- Open the page locally: every section renders, ticking each trackable kind works, spoilers blur, search finds things, mobile width works

## 6. PR

- Branch `data/<slug>-initial`
- PR description: counts per section, sources, single-source items, open questions
- Jan reviews the data before merge — he knows the games

## Changing an existing game

- **Adding items:** new IDs, same rules.
- **Fixing a name or note:** fine, IDs don't change.
- **Removing an item:** `retired: true`, never delete.
- **Restructuring** (moving entries between sections): IDs stay the same; note it in the PR.
- Update `docs/games/<slug>.md` in the same PR.
