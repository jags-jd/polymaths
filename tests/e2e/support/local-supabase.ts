import { randomUUID } from "node:crypto";

import type { BrowserContext } from "@playwright/test";
import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * E2E helpers for LOCAL Supabase only.
 *
 * Real sign-in goes through Google, which a test can't drive. Instead we
 * create a password user with the admin API and put its session cookies
 * straight into the browser. Everything after the OAuth callback is real.
 */

try {
  process.loadEnvFile(".env.local");
} catch {
  // CI provides env vars directly.
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";
const secretKey = process.env.SUPABASE_SECRET_KEY ?? "";

/** Specs skip themselves unless this is true. Never create users in a hosted project. */
export const canUseLocalSupabase = /^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?/.test(url) && Boolean(secretKey);
export const SKIP_REASON = "Needs local Supabase (pnpm db:start) and .env.local";

export const admin: SupabaseClient = canUseLocalSupabase
  ? createClient(url, secretKey, { auth: { persistSession: false, autoRefreshToken: false } })
  : (null as unknown as SupabaseClient);

const createdUserIds: string[] = [];

/** Call from `test.afterAll`. Deleting the user cascades to profile and progress. */
export async function deleteTestUsers() {
  for (const id of createdUserIds.splice(0)) await admin.auth.admin.deleteUser(id);
}

export type TestUser = { id: string; email: string; password: string };

export async function createTestUser(fullName: string): Promise<TestUser> {
  const email = `e2e-${randomUUID()}@example.test`;
  const password = `pw-${randomUUID()}`;
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });
  if (error || !data.user) throw error ?? new Error("createUser failed");
  createdUserIds.push(data.user.id);
  return { id: data.user.id, email, password };
}

/** A user who has finished onboarding. */
export async function createOnboardedUser(fullName: string): Promise<TestUser & { ign: string }> {
  const user = await createTestUser(fullName);
  const ign = uniqueIgn();
  const { error } = await admin.from("profiles").insert({ id: user.id, display_name: fullName, ign });
  if (error) throw error;
  return { ...user, ign };
}

/** Signs in with @supabase/ssr and copies its session cookies into the browser. */
export async function signInAs(context: BrowserContext, user: { email: string; password: string }) {
  const jar = new Map<string, string>();
  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll: () => [...jar].map(([name, value]) => ({ name, value })),
      setAll: (cookies) => cookies.forEach(({ name, value }) => jar.set(name, value)),
    },
  });
  const { error } = await supabase.auth.signInWithPassword(user);
  if (error) throw error;

  await context.addCookies([...jar].map(([name, value]) => ({ name, value, domain: "localhost", path: "/" })));
}

export function uniqueIgn() {
  return `e2e_${randomUUID().replaceAll("-", "").slice(0, 12)}`;
}
