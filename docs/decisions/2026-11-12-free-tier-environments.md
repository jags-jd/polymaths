# Free-tier environments: local, staging, production

**Date:** 2026-11-12
**Status:** Accepted

## Context
Side project, no budget. Need safe testing before production.

## Decision
- Local: Supabase in Docker.
- Staging: free Supabase project `polymaths-staging`, used by Vercel preview deploys (one per PR).
- Production: free Supabase project `polymaths-prod`, used by Vercel production deploys from `main`.
- Vercel Hobby plan.

## Consequences
- Supabase free projects pause after about a week of low activity; unpause from the dashboard.
- Supabase's free plan allows two free projects per organization — both are used.
- Vercel Hobby is personal, non-commercial only; any monetization means upgrading first.
- Destructive commands are local only.

## Alternatives considered
- **Local + production only:** previews would hit production data.
- **Paid plans:** unnecessary for now.
