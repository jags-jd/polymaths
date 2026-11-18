import { describe, expect, it } from "vitest";

import { autoGoalValue, gameProgress, goalProgress, isGoalDone, toProgressMap } from "@/lib/games/progress";
import { gameSchema, type AutoGoal, type Check, type Game } from "@/lib/games/schema";
import { validateRegistry } from "@/lib/games/validate";
import { clone, fixtureArt, fixtureGame } from "@/tests/unit/fixtures/games";

/**
 * Whole-game goals that tick themselves —
 * docs/decisions/2026-11-15-automatic-goals.md.
 */

const map = (entries: Record<string, number>) => toProgressMap(Object.entries(entries).map(([item_id, value]) => ({ item_id, value })));

/** The fixture with its one goal ("Find every exit") made automatic. */
function withAutoGoal(auto: AutoGoal): Game {
  const game = clone(fixtureGame) as Game;
  (game.goals![0].trackables[0] as Check).auto = auto;
  return game;
}

const allExits: AutoGoal = { match: { idSuffix: "-exit" }, unit: "exits" };
const goalCheck = (game: Game) => game.goals![0].trackables[0] as Check;

const messages = (game: unknown) => {
  const result = gameSchema.safeParse(game);
  return result.success ? [] : result.error.issues.map((i) => i.message);
};

describe("automatic goals: schema", () => {
  it("accepts an automatic goal", () => {
    expect(messages(withAutoGoal(allExits))).toEqual([]);
    expect(messages(withAutoGoal({ ...allExits, section: "fq-caves" }))).toEqual([]);
  });

  it("needs at least one match filter", () => {
    expect(messages(withAutoGoal({ match: {}, unit: "things" }))).toContain("An automatic goal needs at least one match filter");
  });

  it("accepts several filter sets, each needing a filter", () => {
    expect(messages(withAutoGoal({ match: [{ idSuffix: "-exit" }, { trackableKind: "pips" }], unit: "things" }))).toEqual([]);
    expect(messages(withAutoGoal({ match: [{ idSuffix: "-exit" }, {}], unit: "things" }))).toContain("An automatic goal needs at least one match filter");
    expect(messages(withAutoGoal({ match: [], unit: "things" })).length).toBeGreaterThan(0);
  });

  it("rejects a section that doesn't exist", () => {
    expect(messages(withAutoGoal({ ...allExits, section: "fq-nowhere" }))).toContain('No section "fq-nowhere"');
  });

  it("is for goals only, not section trackables", () => {
    const game = clone(fixtureGame) as Game;
    (game.sections[0].entries[0].trackables[0] as Check).auto = allExits;
    expect(messages(game)).toContain("Only whole-game goals can tick automatically");
  });

  it("validation reports a condition that matches nothing", () => {
    const game = withAutoGoal({ match: { icon: "nothing-has-this" }, unit: "things" });
    expect(validateRegistry([{ game, art: fixtureArt }], () => true)).toEqual([
      'fixture-quest: goal "fq-goal-all-exits-done" ticks automatically but its condition matches nothing',
    ]);
  });
});

describe("automatic goals: progress", () => {
  const game = withAutoGoal(allExits);
  // Live exits: meadow-1, boss, cave-1 (retired course and retired secret exit excluded).
  const allThree = { "fq-meadow-1-exit": 1, "fq-meadow-boss-exit": 1, "fq-cave-1-exit": 1 };

  it("counts matched trackables", () => {
    expect(autoGoalValue(game, allExits, map({}))).toEqual({ done: 0, total: 3 });
    expect(autoGoalValue(game, allExits, map({ "fq-meadow-1-exit": 1 }))).toEqual({ done: 1, total: 3 });
  });

  it("matches any of several filter sets, counting each trackable once", () => {
    // Exits (3) + pips (meadow coins, cave single pip); "-exit" and pips never overlap here.
    const either: AutoGoal = { match: [{ idSuffix: "-exit" }, { trackableKind: "pips" }, { idSuffix: "-exit" }], unit: "things" };
    expect(autoGoalValue(game, either, map({ "fq-meadow-1-exit": 1, "fq-cave-1-coins#1": 1 }))).toEqual({ done: 2, total: 5 });
  });

  it("can count units instead of completed trackables", () => {
    const coins: AutoGoal = { match: { trackableKind: "pips" }, count: "units", unit: "coins" };
    // Meadow coins 5 + cave single pip 1 = 6 units.
    expect(autoGoalValue(game, coins, map({ "fq-meadow-1-coins#2": 1, "fq-meadow-1-coins#4": 1 }))).toEqual({ done: 2, total: 6 });
  });

  it("can be limited to one section", () => {
    expect(autoGoalValue(game, { ...allExits, section: "fq-caves" }, map({ "fq-cave-1-exit": 1 }))).toEqual({ done: 1, total: 1 });
  });

  it("is done when its condition is met, and only then", () => {
    expect(isGoalDone(game, goalCheck(game), map({ "fq-meadow-1-exit": 1 }))).toBe(false);
    expect(isGoalDone(game, goalCheck(game), map(allThree))).toBe(true);
  });

  it("ignores a saved row for the goal itself", () => {
    const stray = map({ "fq-goal-all-exits-done": 1 });
    expect(isGoalDone(game, goalCheck(game), stray)).toBe(false);
    expect(goalProgress(game, game.goals![0], stray)).toEqual({ done: 0, total: 1, percent: 0 });
  });

  it("still counts toward the game total", () => {
    expect(gameProgress(game, map({})).total).toBe(14);
    expect(gameProgress(game, map(allThree)).done).toBe(4); // 3 exits + the goal
  });

  it("manual goals still read their saved row", () => {
    expect(isGoalDone(fixtureGame, goalCheck(fixtureGame as Game), map({ "fq-goal-all-exits-done": 1 }))).toBe(true);
  });
});
