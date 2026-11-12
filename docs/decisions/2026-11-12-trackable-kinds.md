# Three trackable kinds: check, pips, meter

**Date:** 2026-11-12
**Status:** Accepted

## Context
The mockups needed single ticks (exits, bosses), small sets tapped individually (5 Dragon Coins, 7 hidden flowers), and counters you set to a number (finished with 14 of 20 hearts; 20 Red Coins were too fiddly to tick individually).

## Decision
Every trackable is exactly one of:
- `check` — one row, value 1
- `pips` (2–30) — one row per pip, `item_id = <id>#<n>`
- `meter` (max 2–999) — one row, `value = n`, complete at max

A pip counts as one unit toward percentages; a meter counts as one unit, done only at max.

## Consequences
- One progress engine and one set of UI components covers all five games.
- Adding a fourth kind requires a new ADR.
- Pip-per-row keeps queries simple and lets the activity feed and search reason about individual pips if needed.

## Alternatives considered
- **Bitmask for pips:** fewer rows, but opaque and harder to query.
- **Everything as checks:** 20 Red Coins × 43 courses was confirmed too fiddly in the mockups.
