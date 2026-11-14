import { expect, test } from "@playwright/test";

import { admin, canUseLocalSupabase, createOnboardedUser, deleteTestUsers, signInAs, SKIP_REASON } from "./support/local-supabase";

/**
 * Key flow 2 (CONVENTIONS.md): tick things → refresh → still ticked.
 * Super Mario World has checks and pips only; meters get their E2E with
 * Yoshi's Crafted World in phase 0.4 (their maths and action are unit-tested).
 */

test.skip(!canUseLocalSupabase, SKIP_REASON);
test.afterAll(deleteTestUsers);

const PAGE = "/games/super-mario-world";
const EXIT = "Yoshi's Island 1: Normal exit";
const COIN_3 = "Yoshi's Island 1: Dragon Coins 3 of 5";
const SECRET = "Donut Plains 1: Secret exit";

async function noHorizontalScroll(page: import("@playwright/test").Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBe(0);
}

test("visitors see the whole checklist and are asked to sign in when they tap", async ({ page }) => {
  await page.goto(PAGE);
  await expect(page.getByRole("heading", { level: 1, name: "Super Mario World" })).toBeVisible();
  await expect(page.getByText("0 of 358 done. 358 to go.")).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Special Zone" })).toBeVisible();

  const exit = page.getByRole("button", { name: EXIT });
  await exit.click();
  await expect(page.getByText("Sign in to tick things off")).toBeVisible();
  await expect(exit).toHaveAttribute("aria-pressed", "false");
  await noHorizontalScroll(page);
});

test("a player's ticks save, survive a reload, and can be undone", async ({ page, context }) => {
  const user = await createOnboardedUser("Tick Tester");
  await signInAs(context, user);
  await page.goto(PAGE);

  const exit = page.getByRole("button", { name: EXIT });
  const coin = page.getByRole("button", { name: COIN_3 });
  const secret = page.getByRole("button", { name: SECRET });

  await exit.click();
  await coin.click();
  await secret.click();
  for (const button of [exit, coin, secret]) await expect(button).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("3 of 358 done. 355 to go.")).toBeVisible();

  // Saved to the database as one row per unit (pip rows get #n).
  await expect
    .poll(async () => {
      const { data } = await admin.from("progress").select("item_id, value").eq("user_id", user.id).order("item_id");
      return data;
    })
    .toEqual([
      { item_id: "smw-donut-plains-1-secret-exit", value: 1 },
      { item_id: "smw-yoshis-island-1-dragon-coins#3", value: 1 },
      { item_id: "smw-yoshis-island-1-exit", value: 1 },
    ]);

  await page.reload();
  for (const button of [exit, coin, secret]) await expect(button).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("3 of 358 done. 355 to go.")).toBeVisible();

  // Un-tick the coin.
  await coin.click();
  await expect(coin).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByText("2 of 358 done. 356 to go.")).toBeVisible();
  await page.reload();
  await expect(coin).toHaveAttribute("aria-pressed", "false");
  await expect(exit).toHaveAttribute("aria-pressed", "true");
  await noHorizontalScroll(page);
});

test("a failed save is undone and the player is told", async ({ page, context }) => {
  const user = await createOnboardedUser("Offline Tester");
  await signInAs(context, user);
  await page.goto(PAGE);
  const exit = page.getByRole("button", { name: EXIT });
  await expect(exit).toHaveAttribute("aria-pressed", "false");

  // Server actions POST to the page URL; drop them.
  await page.route(`**${PAGE}`, (route) => (route.request().method() === "POST" ? route.abort() : route.continue()));
  await exit.click();

  await expect(page.getByText("That didn't save, so we undid it. Please try again.")).toBeVisible();
  await expect(exit).toHaveAttribute("aria-pressed", "false");
  const { data } = await admin.from("progress").select("item_id").eq("user_id", user.id);
  expect(data).toEqual([]);
});
