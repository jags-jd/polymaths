# Social: one-way follows, Top 8, public activity

**Date:** 2026-11-12
**Status:** Accepted

## Context
v1 needs friends' activity on the home page and a Friendster-style profile, without building friend requests and moderation.

## Decision
- One-way follows (no requests), with follower/following counts and lists.
- Top 8: any player, chosen and ordered by the profile owner.
- Activity events written only when an entry, section or game becomes complete; removed if un-ticked within 10 minutes.
- Everything public in v1; no private profiles.

## Consequences
- Simple tables (`follows`, `top_friends`, `activity`) with public-read RLS.
- Rate limits on follows needed to prevent spam.
- Privacy controls are a later decision.

## Alternatives considered
- **Mutual friends with requests:** closer to Friendster but more UI, states and notifications.
