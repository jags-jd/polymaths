import { expect, test } from "@playwright/test";

import {
  admin,
  canUseLocalSupabase,
  createTestUser,
  deleteTestUsers,
  signInAs,
  SKIP_REASON,
  uniqueIgn,
} from "./support/local-supabase";

/**
 * Key flow 1 (CONVENTIONS.md): sign in → onboarding → home.
 * Sign-in uses a local password user; see support/local-supabase.ts.
 */

test.skip(!canUseLocalSupabase, SKIP_REASON);
test.afterAll(deleteTestUsers);

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
