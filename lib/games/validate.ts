import type { z } from "zod";

import { artManifestSchema, collectIds, gameSchema, type Entry, type Game } from "@/lib/games/schema";

/**
 * Checks behind `pnpm data:validate` — see docs/data-model.md ("Where it lives").
 * Pure apart from `fileExists`, so it's unit-testable without touching disk.
 */

export type RegistryInput = readonly { game: unknown; art: unknown }[];

/** Returns a list of human-readable problems; empty means valid. */
export function validateRegistry(registry: RegistryInput, fileExists: (publicPath: string) => boolean): string[] {
  const problems: string[] = [];
  const slugs = new Set<string>();
  const prefixes = new Set<string>();
  const idOwner = new Map<string, string>();

  registry.forEach((raw, i) => {
    const gameResult = gameSchema.safeParse(raw.game);
    const label = gameResult.success ? gameResult.data.slug : `registry[${i}]`;
    if (!gameResult.success) {
      problems.push(...formatIssues(label, gameResult.error));
      return;
    }
    const game = gameResult.data;

    if (slugs.has(game.slug)) problems.push(`${label}: slug "${game.slug}" is used by another game`);
    slugs.add(game.slug);
    if (prefixes.has(game.idPrefix)) problems.push(`${label}: idPrefix "${game.idPrefix}" is used by another game`);
    prefixes.add(game.idPrefix);

    for (const { id } of collectIds(game)) {
      const owner = idOwner.get(id);
      if (owner && owner !== game.slug) problems.push(`${label}: ID "${id}" is also used by ${owner}`);
      idOwner.set(id, game.slug);
    }

    const artResult = artManifestSchema.safeParse(raw.art);
    if (!artResult.success) {
      problems.push(...formatIssues(`${label} art`, artResult.error));
      return;
    }
    const art = artResult.data;
    for (const entry of allEntries(game)) {
      if (entry.image && !(entry.image in art)) {
        problems.push(`${label}: entry "${entry.id}" uses image "${entry.image}", which isn't in art.ts`);
      }
    }
    for (const [key, item] of Object.entries(art)) {
      const path = `games/${game.slug}/${item.file}`;
      if (!fileExists(path)) problems.push(`${label} art: "${key}" points to public/${path}, which doesn't exist`);
    }
  });

  return problems;
}

function allEntries(game: Game): Entry[] {
  return [
    ...game.sections.flatMap((s) => [...s.entries, ...(s.extras ?? []).flatMap((g) => g.entries)]),
    ...(game.goals ?? []),
  ];
}

function formatIssues(label: string, error: z.ZodError): string[] {
  return error.issues.map((issue) => `${label}: ${issue.path.join(".") || "(root)"}: ${issue.message}`);
}
