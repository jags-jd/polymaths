# Art policy: official art allowed while personal, logged for later

**Date:** 2026-11-12
**Status:** Accepted

## Context
Polymaths is currently used only by Jan. Official game art (boss portraits, sprites, covers) makes pages far more beautiful, but would be a copyright problem on a public site.

## Decision
While the site is personal, official art is allowed. Every image is logged in `data/games/<slug>/art.ts` with its source URL, owner and license status. Original pixel icons we draw are marked `original`. Before going public (phase 1.0), every `official-unlicensed` image must be replaced or licensed; a production-mode check fails the build otherwise.

## Consequences
- Pages can look their best now.
- Going public later is a known, bounded task rather than an audit.
- Placeholders must always work, so removing an image never breaks a page.

## Alternatives considered
- **Original art only from day one:** safest, but much more work for a site only Jan sees.
