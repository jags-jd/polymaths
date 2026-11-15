# Whole-game goals tick themselves

**Date:** 2026-11-15
**Status:** Accepted (Jan)
**Amends:** `2026-11-12-trackable-kinds.md` (no new kind)

## Context
Super Mario World's whole-game goals ("Find all 96 exits", "Press all four switches", "Clear the Special Zone") were plain `check`s a player ticked by hand. That let a player tick "Find all 96 exits" with 3 exits done, and left the goal unticked after all 96 were done. Jan asked for goals to tick automatically when their conditions are met.

## Decision
A goal's `check` may carry an **`auto` condition**: `{ match, section?, unit }`. `match` uses the same filters as stats (`trackableKind`, `icon`, `entryKind`, `idSuffix`), and `section` limits it to one section. The goal is done when every matched, non-retired section trackable is complete. `unit` names what the chip counts ("52/96 exits").

- Automatic goals are **worked out from progress, never saved**. `setCheck` refuses them, and any stray saved row is ignored (`isGoalDone`, `goalProgress` in `lib/games/progress.ts`).
- They still count toward the game's total, so finishing everything fills them in.
- Only `goals` may use `auto` (schema), `section` must exist (schema), and the condition must match at least one trackable (`data:validate`).
- A goal without `auto` stays a manual check.

## Consequences
- Still exactly three trackable kinds. An automatic goal is a `check` whose value is derived.
- Anything that shows a game's progress (the checklist now; profiles and the feed later) must use `gameProgress` / `isGoalDone`, never read a goal's row directly.
- Activity events for goals (phase 0.6) can't come from a goal's own tick. They'd have to be raised when the tick that completes the condition is saved.
- Goal IDs are unchanged, so nothing is renamed.

## Alternatives considered
- **Save the goal row from the server when the condition becomes true:** it would need writes on un-tick too, and could drift from the real state.
- **Drop goals from the total:** simpler, but finishing every item would no longer read as 100% with the goals filled in.
- **A fourth "derived" kind:** not needed. The flag on `check` is enough, and CLAUDE.md forbids a fourth kind.
