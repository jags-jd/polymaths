/**
 * Apply migrations to a hosted Supabase project.
 *
 *   pnpm db:push:staging   → polymaths-staging
 *   pnpm db:push:prod      → polymaths-prod (only after staging is verified)
 *
 * Reads from .env.local (gitignored):
 *   SUPABASE_STAGING_DB_URL / SUPABASE_PROD_DB_URL
 *     Session pooler connection string, password included. Needed on IPv4-only
 *     networks, because the direct database host is IPv6-only.
 *   SUPABASE_STAGING_PROJECT_REF / SUPABASE_PROD_PROJECT_REF
 *     Used when no DB URL is set (direct connection; needs IPv6).
 *
 * Always shows a dry run first and asks you to type the target's name.
 */
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
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

const prefix = target === "staging" ? "SUPABASE_STAGING" : "SUPABASE_PROD";
const dbUrl = process.env[`${prefix}_DB_URL`];
const ref = process.env[`${prefix}_PROJECT_REF`];
const remote = dbUrl || ref;
if (!remote) {
  console.error(`Missing ${prefix}_DB_URL (or ${prefix}_PROJECT_REF). Add it to .env.local (see .env.example).`);
  process.exit(1);
}

/** Never print the password. */
function describe(value: string): string {
  return value.replace(/^(postgres(?:ql)?:\/\/[^:/]+:)[^@]*@/, "$1****@");
}

// Run the CLI's Node entry directly (no shell), so special characters in the
// connection string reach it untouched on Windows too.
const requireFromRoot = createRequire(path.join(process.cwd(), "package.json"));
const cliEntry = path.join(path.dirname(requireFromRoot.resolve("supabase/package.json")), "dist", "supabase.js");

function supabase(args: string[]): number {
  const result = spawnSync(process.execPath, [cliEntry, ...args], { stdio: "inherit" });
  return result.status ?? 1;
}

// Wrapped in a function: tsx runs this file as CommonJS, which has no top-level await.
async function main(remoteTarget: string): Promise<number> {
  console.log(`\nDry run: migrations that would be applied to ${target} (${describe(remoteTarget)})\n`);
  if (supabase(["db", "push", `--remote=${remoteTarget}`, "--dry-run"]) !== 0) {
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

  return supabase(["db", "push", `--remote=${remoteTarget}`, "--yes"]);
}

main(remote).then((code) => process.exit(code));
