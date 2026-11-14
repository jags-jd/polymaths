# Two exceptions to the trackable-kind rules

**Date:** 2026-11-14
**Status:** Accepted (Jan)
**Amends:** `2026-11-12-trackable-kinds.md`

## Context
Two doc issues came up before phase 0.3:

1. Super Mario World was meant to be the first game because it "uses all three trackable kinds", but it has no `meter` trackables.
2. Super Mario World's Chocolate Secret has a single Dragon Coin (per the mockup; the per-level count is still being verified). Every other course shows Dragon Coins as `pips`, but `pips` require 2–30.

## Decision
1. **A game doesn't have to use all three kinds.** Super Mario World stays the first game, using `check` and `pips` only. The progress engine's `meter` maths is covered by unit tests with fixtures in phase 0.3; Yoshi's Crafted World brings the first real meters in phase 0.4.
2. **A `pips` trackable may have `count: 1`, but only with `singlePip: true`.** This keeps a lone collectible looking like the rest of its set. Storage and maths are unchanged: one row `<id>#1`, one unit. `count: 1` without the flag still fails `data:validate`.

## Consequences
- Still exactly three trackable kinds.
- The `singlePip` flag makes each exception deliberate and easy to find (`grep singlePip`).
- Whether Chocolate Secret really has one Dragon Coin is a research question (SMW open question 1), not a format question. If it turns out to have more, drop the flag.

## Alternatives considered
- **Make Chocolate Secret's coin a `check`:** correct by the rules, but it would look different from every other course's Dragon Coin row.
- **Lower the pips minimum to 1 for everything:** simpler, but loses the nudge that a lone thing is normally a `check`.
- **Add a meter to Super Mario World:** nothing in the game naturally fits one.
