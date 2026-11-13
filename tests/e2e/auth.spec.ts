import { randomUUID } from "node:crypto";

import { expect, test, type BrowserContext } from "@playwright/test";
import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Key flow 1 (CONVENTIONS.md): sign in → onboarding → home.
 *
 * Real sign-in goes through Google, which a test can't drive. Instead we
 * create a password user in LOCAL Supabase with the admin API and put its
 * session cookies straight into the browser. Everything after the OAuth
 * callback (proxy redirects, onboarding, header, sign-out) is the real thing.
 */

try {
  process.loadEnvFile(".env.local");
} catch {
  // CI provides env vars directly.
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";
const secretKey = process.env.SUPABASE_SECRET_KEY ?? "";
const isLocal = /^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?/.test(url);

// Never create users in a hosted project.
test.skip(!isLocal || !secretKey, "Needs local Supabase (pnpm db:start) and .env.local");

const admin: SupabaseClient = isLocal
  ? createClient(url, secretKey, { auth: { persistSession: false, autoRefreshToken: false } })
  : (null as unknown as SupabaseClient);

const createdUserIds: string[] = [];

test.afterAll(async () => {
  for (const id of createdUserIds) await admin.auth.admin.deleteUser(id);
});

async function createTestUser(fullName: string) {
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

/** Signs in with @supabase/ssr and copies its session cookies into the browser. */
async function signInAs(context: BrowserContext, user: { email: string; password: string }) {
  const jar = new Map<string, string>();
  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll: () => [...jar].map(([name, value]) => ({ name, value })),
      setAll: (cookies) => cookies.forEach(({ name, value }) => jar.set(name, value)),
    },
  });
  const { error } = await supabase.auth.signInWithPassword(user);
  if (error) throw error;

  await context.addCookies(
    [...jar].map(([name, value]) => ({ name, value, domain: "localhost", path: "/" })),
  );
}

function uniqueIgn() {
  return `e2e_${randomUUID().replaceAll("-", "").slice(0, 12)}`;
}

test("signed-out visitors see a sign-in link and can't open onboarding", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Sign in", exact: true })).toBeVisible();

  await page.goto("/onboarding");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("button", { name: "Continue with Google" })).toBeVisible();
});

test("new player is sent to onboarding, picks an IGN, lands home, signs out", async ({
  page,
  context,
}) => {
  const user = await createTestUser("Kiko Tester");
  await signInAs(context, user);

  // A signed-in player without a profile always ends up on onboarding.
  await page.goto("/");
  await expect(page).toHaveURL(/\/onboarding$/);
  await page.goto("/login");
  await expect(page).toHaveURL(/\/onboarding$/);

  const displayName = page.getByLabel("Display name");
  await expect(displayName).toHaveValue("Kiko Tester"); // suggested from Google name

  // Reserved IGNs are refused.
  const ign = page.getByLabel("IGN (in-game name)");
  await ign.fill("Admin");
  await page.getByRole("button", { name: "Start playing" }).click();
  await expect(page.getByText("That IGN is reserved. Try another.")).toBeVisible();
  await expect(displayName).toHaveValue("Kiko Tester"); // input kept after an error

  const myIgn = uniqueIgn();
  await ign.fill(myIgn);
  await page.getByRole("button", { name: "Start playing" }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { level: 1, name: "Polymaths" })).toBeVisible();
  await expect(page.getByText("No games started yet, Kiko Tester.")).toBeVisible();

  // Onboarding is done: it now bounces home.
  await page.goto("/onboarding");
  await expect(page).toHaveURL(/\/$/);

  // Avatar menu shows who you are, and signs you out.
  await page.getByRole("button", { name: "Account menu" }).click();
  await expect(page.getByText(`@${myIgn}`)).toBeVisible();
  await page.getByRole("menuitem", { name: "Sign out" }).click();
  await expect(page.getByRole("link", { name: "Sign in", exact: true })).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
});

test("an IGN that's taken (ignoring case) is refused", async ({ page, context }) => {
  const takenIgn = uniqueIgn();
  const first = await createTestUser("First Player");
  const { error } = await admin
    .from("profiles")
    .insert({ id: first.id, display_name: "First Player", ign: takenIgn });
  expect(error).toBeNull();

  const second = await createTestUser("Second Player");
  await signInAs(context, second);
  await page.goto("/onboarding");

  await page.getByLabel("IGN (in-game name)").fill(takenIgn.toUpperCase());
  await page.getByRole("button", { name: "Start playing" }).click();
  await expect(page.getByText("That IGN is taken. Try another.")).toBeVisible();
  await expect(page).toHaveURL(/\/onboarding$/);
});
