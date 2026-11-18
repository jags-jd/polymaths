import { describe, expect, it } from "vitest";

import game from "@/data/games/yoshis-crafted-world/index";
import { autoGoalValue, EMPTY_PROGRESS, gameProgress, gameStats, isGoalDone, statValue, toProgressMap } from "@/lib/games/progress";
import { gameSchema, type Check, type Game, type Trackable } from "@/lib/games/schema";

/**
 * The counts in docs/games/yoshis-crafted-world.md ("Counts"). If the data
 * changes, update the doc in the same PR — docs/adding-a-game.md.
 */

const WORLDS = [
  // [section id, courses, boss levels, hidden flowers, craft requests]
  ["ycw-sunshine-station", 1, 0, 5, 4],
  ["ycw-yarrctopus-docks", 2, 0, 11, 7],
  ["ycw-go-go-land", 2, 0, 10, 4],
  ["ycw-big-paper-peak", 3, 1, 21, 10],
  ["ycw-origami-gardens", 2, 0, 11, 6],
  ["ycw-dino-desert", 2, 0, 12, 6],
  ["ycw-pastel-pathway", 3, 0, 19, 9],
  ["ycw-sky-high-heights", 3, 0, 15, 7],
  ["ycw-cardstock-carnival", 3, 0, 16, 8],
  ["ycw-acorn-forest", 2, 1, 15, 6],
  ["ycw-chilly-hot-isles", 2, 1, 12, 6],
  ["ycw-ninjarama", 3, 0, 17, 9],
  ["ycw-rumble-jungle", 3, 1, 16, 10],
  ["ycw-outer-orbit", 3, 0, 19, 9],
  ["ycw-cheery-valley", 3, 0, 15, 7],
  ["ycw-shadowville", 3, 1, 17, 10],
  ["ycw-hidden-hills", 3, 1, 16, 3],
] as const;

const stat = (label: string) => game.stats.find((s) => s.label === label)!;
const goal = (id: string) => ((game as Game).goals ?? []).flatMap((e) => e.trackables).find((t) => t.id === id) as Check;
const allTrackables = (): Trackable[] =>
  game.sections.flatMap((s) => [...s.entries, ...(s.extras ?? []).flatMap((g) => g.entries)].flatMap((e) => e.trackables));

describe("Yoshi's Crafted World data", () => {
  it("passes the schema", () => {
    expect(gameSchema.safeParse(game).success).toBe(true);
  });

  it("has the 17 worlds in the mockup's order", () => {
    expect(game.sections.map((s) => s.id)).toEqual(WORLDS.map(([id]) => id));
  });

  it.each(WORLDS)("%s: %i courses, %i bosses, %i hidden flowers, %i crafts, 10 costumes", (id, courses, bosses, hidden, crafts) => {
    const section = game.sections.find((s) => s.id === id)!;
    expect(statValue(game, stat("Courses"), EMPTY_PROGRESS, section).total).toBe(courses);
    expect(statValue(game, stat("Bosses"), EMPTY_PROGRESS, section).total).toBe(bosses);
    expect(statValue(game, stat("Hidden flowers"), EMPTY_PROGRESS, section).total).toBe(hidden);
    expect(statValue(game, stat("Crafts"), EMPTY_PROGRESS, section).total).toBe(crafts);
    expect(statValue(game, stat("Costumes"), EMPTY_PROGRESS, section).total).toBe(10);
  });

  it("has the whole-game totals from the doc", () => {
    const totals = Object.fromEntries(gameStats(game, EMPTY_PROGRESS).map((s) => [s.label, s.total]));
    expect(totals).toEqual({ Courses: 43, Bosses: 6, "Hidden flowers": 247, Crafts: 121, Costumes: 170, Worlds: 17 });
    // 693 Smiley Flowers + 49 levels cleared + 43 Sprouts + 170 costumes + 3 goals
    expect(gameProgress(game, EMPTY_PROGRESS).total).toBe(958);
  });

  it("counts every Smiley Flower in the game (693) for the Sundream Stone", () => {
    expect(autoGoalValue(game, goal("ycw-goal-sundream-stone-done").auto!, EMPTY_PROGRESS)).toEqual({ done: 0, total: 693 });
    expect(autoGoalValue(game, goal("ycw-goal-kamek-done").auto!, EMPTY_PROGRESS).total).toBe(49);
    expect(autoGoalValue(game, goal("ycw-goal-blockafeller-done").auto!, EMPTY_PROGRESS).total).toBe(43);
  });

  it("ticks the Kamek costume when every level is cleared", () => {
    const rows = allTrackables()
      .filter((t) => t.id.endsWith("-cleared"))
      .map((t) => ({ item_id: t.id, value: 1 }));
    expect(rows).toHaveLength(49);
    const kamek = goal("ycw-goal-kamek-done");
    expect(isGoalDone(game, kamek, toProgressMap(rows))).toBe(true);
    expect(isGoalDone(game, kamek, toProgressMap(rows.slice(1)))).toBe(false);
  });

  it("uses meters only for Red Coins and Hearts (max 20), on all 43 courses", () => {
    const meters = allTrackables().filter((t) => t.kind === "meter");
    expect(meters).toHaveLength(86);
    expect(new Set(meters.map((t) => (t.kind === "meter" ? `${t.icon}:${t.max}` : "")))).toEqual(new Set(["red-coin:20", "heart:20"]));
  });

  it("has a Flip Side on the 40 main courses but not in Hidden Hills", () => {
    const pups = allTrackables().filter((t) => t.icon === "pup");
    expect(pups).toHaveLength(40);
    const hiddenHills = game.sections.find((s) => s.id === "ycw-hidden-hills")!;
    expect(hiddenHills.entries.flatMap((e) => e.trackables).some((t) => t.icon === "pup")).toBe(false);
  });

  it("puts the Flip Side, flip-side crafts and Sprouts on the back of the card", () => {
    const all = allTrackables();
    const back = all.filter((t) => t.side === "back");
    // 40 pups + 40 time limits + 43 Sprouts + 58 flip-side crafts.
    expect(back).toHaveLength(181);
    expect(all.filter((t) => ["pup", "stopwatch", "sprout"].includes(t.icon)).every((t) => t.side === "back")).toBe(true);
    const crafts = all.filter((t) => t.group === "Craft requests");
    expect(crafts.filter((t) => t.side === "back")).toHaveLength(58);
    expect(crafts.filter((t) => t.side !== "back")).toHaveLength(63);
    // Spot checks from the source (Rail-Yard Run; the shared crafts are on the front everywhere).
    const side = (id: string) => all.find((t) => t.id === id)!.side ?? "front";
    expect(side("ycw-rail-yard-run-craft-cow")).toBe("front");
    expect(side("ycw-rail-yard-run-craft-paper-airplane")).toBe("back");
    expect(side("ycw-big-paper-peak-craft-caramel-billboard")).toBe("front");
    // The course itself is always on the front.
    expect(all.filter((t) => ["tick", "coins", "flower", "red-coin", "heart"].includes(t.icon)).some((t) => t.side === "back")).toBe(false);
  });

  it("blurs the final world, Hidden Hills and the costume named after the final boss", () => {
    expect(game.sections.filter((s) => "spoiler" in s && s.spoiler).map((s) => s.id)).toEqual(["ycw-shadowville", "ycw-hidden-hills"]);
    const costumes = game.sections.flatMap((s) => (s.extras ?? []).flatMap((g) => g.entries));
    expect(costumes.filter((e) => "spoiler" in e && e.spoiler).map((e) => e.id)).toEqual(["ycw-costume-the-great-king-bowser"]);
  });
});
