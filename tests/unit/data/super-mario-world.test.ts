import { describe, expect, it } from "vitest";

import game from "@/data/games/super-mario-world/index";
import { EMPTY_PROGRESS, gameProgress, gameStats, sectionProgress, statValue } from "@/lib/games/progress";
import { gameSchema } from "@/lib/games/schema";

/**
 * The counts in docs/games/super-mario-world.md ("Counts"). If the data
 * changes, update the doc in the same PR — docs/adding-a-game.md.
 */

const WORLDS = [
  // [section id, exits, Dragon Coins, 3-Up Moons]
  ["smw-yoshis-island", 6, 20, 1],
  ["smw-donut-plains", 15, 31, 1],
  ["smw-vanilla-dome", 14, 41, 1],
  ["smw-twin-bridges", 7, 25, 1],
  ["smw-forest-of-illusion", 14, 30, 1],
  ["smw-chocolate-island", 11, 28, 1],
  ["smw-valley-of-bowser", 11, 26, 1],
  ["smw-star-world", 10, 5, 0],
  ["smw-special-zone", 8, 44, 0],
] as const;

const stat = (label: string) => game.stats.find((s) => s.label === label)!;

describe("Super Mario World data", () => {
  it("passes the schema", () => {
    expect(gameSchema.safeParse(game).success).toBe(true);
  });

  it("has the nine worlds in game order", () => {
    expect(game.sections.map((s) => s.id)).toEqual(WORLDS.map(([id]) => id));
  });

  it.each(WORLDS)("%s: %i exits, %i Dragon Coins, %i moons", (id, exits, coins, moons) => {
    const section = game.sections.find((s) => s.id === id)!;
    expect(statValue(game, stat("Exits"), EMPTY_PROGRESS, section).total).toBe(exits);
    expect(statValue(game, stat("Dragon Coins"), EMPTY_PROGRESS, section).total).toBe(coins);
    expect(statValue(game, stat("3-Up Moons"), EMPTY_PROGRESS, section).total).toBe(moons);
  });

  it("has the whole-game totals from the doc", () => {
    const totals = Object.fromEntries(gameStats(game, EMPTY_PROGRESS).map((s) => [s.label, s.total]));
    expect(totals).toEqual({
      Exits: 96,
      "Dragon Coins": 250,
      "Coin sets": 49,
      "3-Up Moons": 7,
      Koopalings: 7,
      Worlds: 9,
    });
    // 96 exits + 2 Bowser doors + 250 coins + 7 moons + 3 goals
    expect(gameProgress(game, EMPTY_PROGRESS).total).toBe(358);
  });

  it("has 24 secret exits and 2 Bowser doors that aren't exits", () => {
    const trackables = game.sections.flatMap((s) => s.entries.flatMap((e) => e.trackables));
    const ids = trackables.map((t) => t.id);
    // By icon, not ID: Chocolate Secret's normal exit is `smw-chocolate-secret-exit`.
    expect(trackables.filter((t) => t.icon === "key")).toHaveLength(24);
    expect(ids.filter((id) => id.includes("-door"))).toEqual(["smw-bowsers-castle-front-door", "smw-bowsers-castle-back-door"]);
  });

  it("uses a single pip only for Chocolate Secret", () => {
    const single = game.sections.flatMap((s) =>
      s.entries.flatMap((e) => e.trackables.filter((t) => t.kind === "pips" && "singlePip" in t && t.singlePip).map((t) => t.id)),
    );
    expect(single).toEqual(["smw-chocolate-secret-dragon-coins"]);
  });

  it("section totals add up to the game total", () => {
    const sections = game.sections.reduce((sum, s) => sum + sectionProgress(s, EMPTY_PROGRESS).total, 0);
    expect(sections + game.goals.length).toBe(gameProgress(game, EMPTY_PROGRESS).total);
  });
});
