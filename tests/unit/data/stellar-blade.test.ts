import { describe, expect, it } from "vitest";

import game from "@/data/games/stellar-blade/index";
import legacy from "@/docs/games/stellar-blade.legacy.json";
import { autoGoalValue, EMPTY_PROGRESS, gameProgress, gameStats, isGoalDone, sectionProgress, toProgressMap } from "@/lib/games/progress";
import { gameSchema, type Check, type Entry, type Game, type Trackable } from "@/lib/games/schema";

/**
 * The counts in docs/games/stellar-blade.md ("Counts"). If the data changes,
 * update the doc in the same PR — docs/adding-a-game.md.
 */

const SECTIONS = [
  // [section id, units]
  ["sb-main-missions", 15],
  ["sb-bosses", 21],
  ["sb-endings", 3],
  ["sb-side-stories", 4],
  ["sb-side-quests", 35],
  ["sb-requests", 35],
  ["sb-collectibles", 15], // 6 checks + 9 camp meters
  ["sb-cans", 49],
  ["sb-fish", 25],
  ["sb-nano-suits", 115], // 37 base + 34 New Game+ + 44 from updates
  ["sb-upgrades", 6],
  ["sb-combat", 8],
  ["sb-completion", 3],
  ["sb-extra-bosses", 2],
] as const;

const goal = (id: string) => ((game as Game).goals ?? []).flatMap((e) => e.trackables).find((t) => t.id === id) as Check;
const allEntries = (): Entry[] => game.sections.flatMap((s) => [...s.entries, ...(s.extras ?? []).flatMap((g) => g.entries)]);
const allTrackables = (): Trackable[] => [...allEntries(), ...((game as Game).goals ?? [])].flatMap((e) => e.trackables);

describe("Stellar Blade data", () => {
  it("passes the schema", () => {
    expect(gameSchema.safeParse(game).success).toBe(true);
  });

  it("keeps every legacy ID as a trackable", () => {
    const ids = new Set(allTrackables().map((t) => t.id));
    const missing = legacy.categories.flatMap((c) => c.items.map((i) => i.id)).filter((id) => !ids.has(id));
    expect(missing).toEqual([]);
  });

  it.each(SECTIONS)("%s has %i units", (id, units) => {
    const section = game.sections.find((s) => s.id === id)!;
    expect(sectionProgress(section, EMPTY_PROGRESS).total).toBe(units);
  });

  it("has the sections in order and the whole-game totals from the doc", () => {
    expect(game.sections.map((s) => s.id)).toEqual(SECTIONS.map(([id]) => id));
    const totals = Object.fromEntries(gameStats(game, EMPTY_PROGRESS).map((s) => [s.label, s.total]));
    expect(totals).toEqual({ Missions: 15, Bosses: 21, "Side quests": 35, Requests: 30, Cans: 49, "Nano Suits": 115 });
    // 336 section units + 4 goals
    expect(gameProgress(game, EMPTY_PROGRESS).total).toBe(340);
  });

  it("has 89 camps in nine area meters", () => {
    const camps = allTrackables().filter((t) => t.kind === "meter");
    expect(camps).toHaveLength(9);
    expect(camps.reduce((n, t) => n + (t.kind === "meter" ? t.max : 0), 0)).toBe(89);
    expect(autoGoalValue(game, goal("sb-collect-all-camps").auto!, EMPTY_PROGRESS).total).toBe(9);
  });

  it("works out the 'every…' goals from the entries", () => {
    expect(autoGoalValue(game, goal("sb-side-all-side-quests").auto!, EMPTY_PROGRESS).total).toBe(35);
    expect(autoGoalValue(game, goal("sb-side-all-bulletin-requests").auto!, EMPTY_PROGRESS).total).toBe(30);
    expect(autoGoalValue(game, goal("sb-collect-all-cans").auto!, EMPTY_PROGRESS).total).toBe(49);

    const cans = allEntries()
      .filter((e) => e.kind === "can")
      .map((e) => ({ item_id: e.trackables[0]!.id, value: 1 }));
    expect(isGoalDone(game, goal("sb-collect-all-cans"), toProgressMap(cans))).toBe(true);
    expect(isGoalDone(game, goal("sb-collect-all-cans"), toProgressMap(cans.slice(1)))).toBe(false);
  });

  it("blurs the late story but not the early bosses", () => {
    const spoiler = (id: string) => allEntries().find((e) => e.trackables.some((t) => t.id === id))!.spoiler === true;
    expect(spoiler("sb-boss-abaddon")).toBe(false);
    expect(spoiler("sb-boss-tachy")).toBe(true);
    expect(spoiler("sb-mission-eve-protocol")).toBe(true);
    expect(spoiler("sb-ending-making-new-memories")).toBe(true);
  });
});
