# Game data lives in the repo, not the database

**Date:** 2026-11-12
**Status:** Accepted

## Context
Checklists are large (Yoshi's Crafted World alone has 800+ tickable units), deeply structured (worlds → courses → collectibles), and change rarely. We need them versioned, reviewable and validated. There's one editor (Jan, with Claude).

## Decision
Each game is a typed TypeScript file at `data/games/<slug>/index.ts`, validated by a Zod schema (`lib/games/schema.ts`) at build time and in the pre-commit hook. The database stores only user progress keyed by item ID.

## Consequences
- Content changes go through PRs with review and history.
- Type safety and validation for free; no admin UI to build.
- Item IDs are the contract between code and database and must never change (see `docs/data-model.md`).
- Every content change needs a deploy.

## Alternatives considered
- **Database + admin screen:** editable without deploys, but a lot to build, harder to review, and easy to corrupt IDs.
- **JSON files:** no types, worse editor support; TypeScript with Zod is strictly better here.
