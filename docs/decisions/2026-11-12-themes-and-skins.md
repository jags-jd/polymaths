# Publisher themes, per-game accents, optional custom skins

**Date:** 2026-11-12
**Status:** Accepted

## Context
Mockups showed each game should feel like its own world (Nintendo red-and-white, FromSoftware gothic, Midgar industrial, a Super Mario World save-file screen), but building every game as a bespoke page doesn't scale.

## Decision
- Base **themes** by publisher (`default`, `nintendo`, `souls`, `square`) as CSS-variable token sets.
- Optional **per-game accent** override (e.g. Yoshi green).
- Optional **custom skin** that replaces section/entry renderers for one game, used only when clearly worth it (first: `smw-save-file`). Skins still use the shared progress engine and trackable components.

## Consequences
- New games mostly need data + icons, not new UI.
- Every theme must pass the contrast test.
- Skins are the exception; each new one needs Jan's OK.

## Alternatives considered
- **Fully custom page per game:** most beautiful, most work, most bugs.
- **One look for everything:** loses the point of the project.
