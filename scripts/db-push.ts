/**
 * Apply migrations to a hosted Supabase project.
 *
 *   pnpm db:push:staging   → polymaths-staging
 *   pnpm db:push:prod      → polymaths-prod (only after staging is verified)
 *
 * Reads the project refs from .env.local:
 *   SUPABASE_STAGING_PROJECT_REF, SUPABASE_PROD_PROJECT_REF
 * The database password is asked for by the Supabase CLI (or read from
 * SUPABASE_DB_PASSWORD in your shell). Never put it in a committed file.
 *
 * Always shows a dry run first and asks for confirmation.
 */
import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline/promises";

const target = process.argv[2];
if (target !== "staging" && target !== "prod") {
  console.error("Usage: tsx scripts/db-push.ts <staging|prod>");
  process.exit(1);
}

try {
  process.loadEnvFile(".env.local");
} catch {
  // No .env.local: fall back to the shell environment.
}

const refVar = target === "staging" ? "SUPABASE_STAGING_PROJECT_REF" : "SUPABASE_PROD_PROJECT_REF";
const ref = process.env[refVar];
if (!ref) {
  console.error(`Missing ${refVar}. Add it to .env.local (see .env.example).`);
  process.exit(1);
}

function supabase(args: string[]): number {
  const result = spawnSync("pnpm", ["exec", "supabase", ...args], {
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  return result.status ?? 1;
}

// Wrapped in a function: tsx runs this file as CommonJS, which has no top-level await.
async function main(projectRef: string): Promise<number> {
  console.log(`\nDry run: migrations that would be applied to ${target} (${projectRef})\n`);
  if (supabase(["db", "push", `--remote=${projectRef}`, "--dry-run"]) !== 0) {
    return 1;
  }

  const confirmWord = target === "prod" ? "production" : "staging";
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(`\nType "${confirmWord}" to apply these migrations: `);
  rl.close();

  if (answer.trim() !== confirmWord) {
    console.log("Cancelled. Nothing was applied.");
    return 1;
  }

  return supabase(["db", "push", `--remote=${projectRef}`, "--yes"]);
}

main(ref).then((code) => process.exit(code));
