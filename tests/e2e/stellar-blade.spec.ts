import { expect, test, type Page } from "@playwright/test";

import { admin, canUseLocalSupabase, createOnboardedUser, deleteTestUsers, signInAs, SKIP_REASON } from "./support/local-supabase";

/**
 * The shared `rows` and `gallery` section layouts and `Entry.group`
 * sub-headings, on Stellar Blade (phase 0.4 step 3).
 */

test.skip(!canUseLocalSupabase, SKIP_REASON);
test.afterAll(deleteTestUsers);

const PAGE = "/games/stellar-blade";
const button = (page: Page, name: string) => page.getByRole("button", { name, exact: true });

async function noHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBe(0);
}

async function rows(userId: string) {
  const { data } = await admin.from("progress").select("item_id, value").eq("user_id", userId).order("item_id");
  return data;
}

test("row tiles, gallery tiles and camp meters save and survive a reload", async ({ page, context }) => {
  const user = await createOnboardedUser("Blade Tester");
  await signInAs(context, user);
  await page.goto(PAGE);
  await expect(page.getByText("0 of 340 done. 340 to go.")).toBeVisible();

  // Side quests sit under their hub's sub-heading.
  const quests = page.locator("#sb-side-quests");
  await expect(quests.getByRole("heading", { level: 3, name: /Wasteland/ })).toBeVisible();

  await button(page, "The Scavenger's Story: Completed").click();
  await button(page, "Abaddon: Defeated").click();
  await button(page, "Eidos 7: Camps activated 3 of 14").click();
  await expect(button(page, "The Scavenger's Story: Completed")).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("2 of 340 done. 338 to go.")).toBeVisible();
  // Wait for the saves to land before reloading (a reload cancels saves in flight).
  await expect.poll(() => rows(user.id)).toEqual([
    { item_id: "sb-boss-abaddon", value: 1 },
    { item_id: "sb-camps-eidos-7", value: 3 },
    { item_id: "sb-quest-the-scavengers-story", value: 1 },
  ]);

  await page.reload();
  await expect(button(page, "The Scavenger's Story: Completed")).toHaveAttribute("aria-pressed", "true");
  await expect(button(page, "Abaddon: Defeated")).toHaveAttribute("aria-pressed", "true");
  await expect(button(page, "Eidos 7: Camps activated 3 of 14")).toHaveAttribute("aria-pressed", "true");

  // Untick a row.
  await button(page, "The Scavenger's Story: Completed").click();
  await expect(button(page, "The Scavenger's Story: Completed")).toHaveAttribute("aria-pressed", "false");
  await expect.poll(() => rows(user.id)).toEqual([
    { item_id: "sb-boss-abaddon", value: 1 },
    { item_id: "sb-camps-eidos-7", value: 3 },
  ]);
  await noHorizontalScroll(page);
});

test("spoiler rows and tiles never name what they hide until revealed", async ({ page }) => {
  await page.goto(PAGE);
  const missions = page.locator("#sb-main-missions");
  await expect(missions.getByText("EVE Protocol")).toHaveCount(0);
  await expect(missions.getByRole("button", { name: "Hidden spoiler. Reveal it" })).toHaveCount(7);
  await expect(page.locator("#sb-bosses").getByText("Providence")).toHaveCount(0);

  await page.locator("#sb-eve-protocol").click();
  await expect(button(page, "EVE Protocol: Completed")).toBeVisible();
  await expect(missions.getByText("Burning Xion")).toHaveCount(0);
  await noHorizontalScroll(page);
});

test("search finds a can and jumps to it", async ({ page }) => {
  await page.goto(PAGE);
  const search = page.getByRole("searchbox", { name: "Search this checklist" });
  const results = page.getByRole("list", { name: "Search results" });
  await search.fill("moonwell");
  await results.getByRole("button", { name: /Moonwell/ }).click();
  await expect(page.locator("#sb-moonwell")).toBeInViewport();

  // Hidden spoilers don't match.
  await search.fill("providence");
  await expect(page.getByText("Nothing matches “providence”.")).toBeVisible();
});
