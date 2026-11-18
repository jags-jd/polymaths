import { expect, test } from "@playwright/test";

import { canUseLocalSupabase, createOnboardedUser, deleteTestUsers, signInAs, SKIP_REASON } from "./support/local-supabase";

test.afterAll(deleteTestUsers);

async function noHorizontalScroll(page: import("@playwright/test").Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBe(0);
}

test("visitors see every game and can open one", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Polymaths" })).toBeVisible();

  const games = page.getByRole("region", { name: "Games" });
  const smw = games.getByRole("link", { name: /Super Mario World/ });
  await expect(smw).toContainText("Not started");
  await noHorizontalScroll(page);

  await smw.click();
  await expect(page).toHaveURL(/\/games\/super-mario-world$/);
  await expect(page.getByRole("heading", { level: 1, name: "Super Mario World" })).toBeVisible();
});

test("a player's started games show under My games with their progress", async ({ page, context }) => {
  test.skip(!canUseLocalSupabase, SKIP_REASON);
  const user = await createOnboardedUser("Home Tester");
  await signInAs(context, user);

  // Nothing ticked yet: Super Mario World is under All games.
  await page.goto("/");
  await expect(page.getByText("Nothing ticked yet, Home Tester. Pick a game below to start.")).toBeVisible();
  await page.getByRole("region", { name: "All games" }).getByRole("link", { name: /Super Mario World/ }).click();

  const exit = page.getByRole("button", { name: "Yoshi's Island 1: Normal exit" });
  await exit.click();
  await expect(exit).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("1 of 358 done. 357 to go.")).toBeVisible();

  await page.goto("/");
  const card = page.getByRole("region", { name: "My games" }).getByRole("link", { name: /Super Mario World/ });
  await expect(card).toContainText("1 of 358 done");
  await expect(page.getByRole("region", { name: "All games" })).toHaveCount(0);
  await noHorizontalScroll(page);

  await card.click();
  await expect(page).toHaveURL(/\/games\/super-mario-world$/);
  await expect(exit).toHaveAttribute("aria-pressed", "true");
});
