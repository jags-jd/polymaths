import { expect, test, type Page } from "@playwright/test";

import { admin, canUseLocalSupabase, createOnboardedUser, deleteTestUsers, signInAs, SKIP_REASON } from "./support/local-supabase";

/**
 * The shared checklist layouts, on Yoshi's Crafted World (phase 0.4): meters
 * (key flow 2 for the third trackable kind), pips and checks, spoilers with
 * reveal-all, and in-game search.
 */

test.skip(!canUseLocalSupabase, SKIP_REASON);
test.afterAll(deleteTestUsers);

const PAGE = "/games/yoshis-crafted-world";
const button = (page: Page, name: string) => page.getByRole("button", { name, exact: true });

async function noHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBe(0);
}

async function rows(userId: string) {
  const { data } = await admin.from("progress").select("item_id, value").eq("user_id", userId).order("item_id");
  return data;
}

test("meters: tap the number you reached; tap it again to go down one", async ({ page, context }) => {
  const user = await createOnboardedUser("Meter Tester");
  await signInAs(context, user);
  await page.goto(PAGE);

  const twelve = button(page, "Rail-Yard Run: Red Coins 12 of 20");
  const thirteen = button(page, "Rail-Yard Run: Red Coins 13 of 20");
  await twelve.click();
  await expect(twelve).toHaveAttribute("aria-pressed", "true");
  await expect(thirteen).toHaveAttribute("aria-pressed", "false");
  await expect.poll(() => rows(user.id)).toEqual([{ item_id: "ycw-rail-yard-run-red-coins", value: 12 }]);

  await twelve.click();
  await expect(twelve).toHaveAttribute("aria-pressed", "false");
  await expect(button(page, "Rail-Yard Run: Red Coins 11 of 20")).toHaveAttribute("aria-pressed", "true");
  await expect.poll(() => rows(user.id)).toEqual([{ item_id: "ycw-rail-yard-run-red-coins", value: 11 }]);

  // A full meter counts as done; a pip and a check save as their own rows.
  await button(page, "Rail-Yard Run: Hearts at the goal 20 of 20").click();
  await button(page, "Rail-Yard Run: Hidden Smiley Flowers 3 of 5").click();
  await button(page, "Rail-Yard Run: Cleared").click();
  await expect(page.getByText("3 of 958 done. 955 to go.")).toBeVisible();

  await page.reload();
  await expect(button(page, "Rail-Yard Run: Red Coins 11 of 20")).toHaveAttribute("aria-pressed", "true");
  await expect(button(page, "Rail-Yard Run: Red Coins 12 of 20")).toHaveAttribute("aria-pressed", "false");
  await expect(button(page, "Rail-Yard Run: Hearts at the goal 20 of 20")).toHaveAttribute("aria-pressed", "true");
  await expect(button(page, "Rail-Yard Run: Hidden Smiley Flowers 3 of 5")).toHaveAttribute("aria-pressed", "true");
  await expect.poll(() => rows(user.id)).toEqual([
    { item_id: "ycw-rail-yard-run-cleared", value: 1 },
    { item_id: "ycw-rail-yard-run-flowers#3", value: 1 },
    { item_id: "ycw-rail-yard-run-hearts", value: 20 },
    { item_id: "ycw-rail-yard-run-red-coins", value: 11 },
  ]);
  await noHorizontalScroll(page);
});

test("course cards have two sides: the course on the front, extras on the back", async ({ page, context }) => {
  const user = await createOnboardedUser("Card Flipper");
  await signInAs(context, user);
  await page.goto(PAGE);
  const card = page.locator("#ycw-rail-yard-run");
  const front = card.getByRole("tab", { name: /Front/ });
  const back = card.getByRole("tab", { name: /Back/ });

  await expect(front).toHaveAttribute("aria-selected", "true");
  await expect(button(page, "Rail-Yard Run: Red Coins 1 of 20")).toBeVisible();
  await expect(button(page, "Rail-Yard Run: Found Sprout")).toHaveCount(0);

  await back.click();
  await expect(button(page, "Rail-Yard Run: Red Coins 1 of 20")).toHaveCount(0);
  await button(page, "Rail-Yard Run: Found Sprout").click();
  await expect(back).toContainText("1/");
  await expect(front).toContainText("0/");
  await expect.poll(() => rows(user.id)).toEqual([{ item_id: "ycw-rail-yard-run-sprout", value: 1 }]);

  // Bosses have no extras, so they stay one-sided.
  await expect(page.locator("#ycw-the-tin-can-condor").getByRole("tab")).toHaveCount(0);
  await noHorizontalScroll(page);
});

test("spoilers stay hidden until revealed; reveal-all is remembered", async ({ page }) => {
  await page.goto(PAGE);
  const shadowville = page.locator("#ycw-shadowville");
  await expect(shadowville.getByText("Be Afraid of the Dark")).toHaveCount(0);
  await expect(shadowville.getByRole("button", { name: "Hidden spoiler. Reveal it" })).toHaveCount(14); // 4 levels + 10 costumes

  // Reveal one.
  await page.locator("#ycw-be-afraid-of-the-dark").click();
  await expect(page.getByRole("heading", { name: "Be Afraid of the Dark" })).toBeVisible();
  await expect(shadowville.getByText("Skulking Around")).toHaveCount(0);

  // Reveal all, then reload: still revealed.
  await page.getByRole("switch", { name: "Reveal all spoilers" }).click();
  await expect(page.getByRole("heading", { name: "Skulking Around" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Gears: Owned" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Kamek Kerfuffle" })).toBeVisible();
  await expect(page.getByRole("switch", { name: "Reveal all spoilers" })).toBeChecked();

  // And off again.
  await page.getByRole("switch", { name: "Reveal all spoilers" }).click();
  await expect(page.getByRole("heading", { name: "Kamek Kerfuffle" })).toHaveCount(0);
  await noHorizontalScroll(page);
});

test("search finds courses and crafts, jumps to them, and never shows hidden spoilers", async ({ page }) => {
  await page.goto(PAGE);
  const search = page.getByRole("searchbox", { name: "Search this checklist" });
  const results = page.getByRole("list", { name: "Search results" });

  await search.fill("milk bottle");
  // The craft request (Rail-Yard Run) and the costume.
  await expect(results.getByRole("button")).toHaveCount(2);
  await expect(results.getByRole("button").first()).toContainText("Milk Bottle");

  // The craft lives on the back of Rail-Yard Run's card: the jump turns it over.
  const railYard = page.locator("#ycw-rail-yard-run");
  await expect(railYard.getByRole("tab", { name: /Front/ })).toHaveAttribute("aria-selected", "true");
  await results.getByRole("button", { name: /Rail-Yard Run/ }).click();
  await expect(railYard.getByRole("tab", { name: /Back/ })).toHaveAttribute("aria-selected", "true");
  await expect(button(page, "Rail-Yard Run: Milk Bottle ×5")).toBeVisible();

  await search.fill("whistlestop");
  await results.getByRole("button", { name: /Whistlestop Rails/ }).click();
  await expect(search).toHaveValue("");
  await expect(page.locator("#ycw-whistlestop-rails")).toBeInViewport();

  // Hidden spoilers don't match, by name or by craft label.
  await search.fill("skulking");
  await expect(page.getByText("Nothing matches “skulking”.")).toBeVisible();
  await search.fill("happy gear");
  await expect(page.getByText("Nothing matches “happy gear”.")).toBeVisible();
});
