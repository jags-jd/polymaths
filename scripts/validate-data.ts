/**
 * pnpm data:validate — validates every game in data/games/.
 *
 * Phase 0.1 placeholder: the Game schema arrives in phase 0.3. Until then this
 * only checks that the registry loads, so the pre-commit hook has something
 * real to run. Phase 0.3 replaces this with the full checks listed in
 * docs/data-model.md (Zod parse, ID uniqueness and prefixes, art manifests,
 * pip/meter bounds, no empty sections or entries).
 */
import { games } from "../data/games/registry";

if (!Array.isArray(games)) {
  console.error("data:validate: data/games/registry.ts must export an array named `games`.");
  process.exit(1);
}

if (games.length > 0) {
  console.error(
    "data:validate: games are registered but the schema checks are not written yet (phase 0.3).",
  );
  process.exit(1);
}

console.log("data:validate: 0 games registered — nothing to validate yet (schema arrives in phase 0.3).");
