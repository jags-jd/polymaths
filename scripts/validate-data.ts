/**
 * pnpm data:validate — validates every game in data/games/registry.ts.
 *
 * Zod-parses each game and art manifest, then checks IDs are unique across all
 * games, prefixes and slugs don't clash, every entry image is in the manifest,
 * and every manifest file exists in public/games/<slug>/. Runs in pre-commit.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";

import { registry } from "../data/games/registry";
import { validateRegistry } from "../lib/games/validate";

const publicDir = join(__dirname, "..", "public");
const problems = validateRegistry(registry, (path) => existsSync(join(publicDir, path)));

if (problems.length > 0) {
  console.error(`data:validate: ${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log(`data:validate: ${registry.length} game(s) valid.`);
