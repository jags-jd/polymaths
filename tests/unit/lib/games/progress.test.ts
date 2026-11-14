import { describe, expect, it } from "vitest";

import {
  doneUnits,
  entryProgress,
  gameProgress,
  gameStats,
  isComplete,
  isPipDone,
  meterValue,
  sectionProgress,
  toProgressMap,
  trackableProgress,
  units,
  type ProgressMap,
} from "@/lib/games/progress";
import type { Trackable } from "@/lib/games/schema";
import { fixtureGame } from "@/tests/unit/fixtures/games";

const check: Trackable = { id: "fq-x-exit", kind: "check", label: "Exit", icon: "exit" };
const pips: Trackable = { id: "fq-x-coins", kind: "pips", label: "Coins", icon: "coin", count: 5 };
const single: Trackable = { id: "fq-x-coin", kind: "pips", label: "Coin", icon: "coin", count: 1, singlePip: true };
const meter: Trackable = { id: "fq-x-hearts", kind: "meter", label: "Hearts", icon: "heart", max: 20 };

const map = (entries: Record<string, number>): ProgressMap => new Map(Object.entries(entries));

const [meadow, caves] = fixtureGame.sections;
const [meadow1, retiredCourse, boss] = meadow.entries;

describe("units", () => {
  it("counts 1 for a check, count for pips, 1 for a meter", () => {
    expect(units(check)).toBe(1);
    expect(units(pips)).toBe(5);
    expect(units(single)).toBe(1);
    expect(units(meter)).toBe(1);
  });
});

describe("doneUnits", () => {
  it("check: done when its row exists", () => {
    expect(doneUnits(check, map({}))).toBe(0);
    expect(doneUnits(check, map({ "fq-x-exit": 1 }))).toBe(1);
  });

  it("pips: counts each ticked pip row", () => {
    expect(doneUnits(pips, map({}))).toBe(0);
    expect(doneUnits(pips, map({ "fq-x-coins#1": 1, "fq-x-coins#4": 1 }))).toBe(2);
  });

  it("pips: ignores pip rows out of range and a bare row without #n", () => {
    expect(doneUnits(pips, map({ "fq-x-coins#6": 1, "fq-x-coins#0": 1, "fq-x-coins": 1 }))).toBe(0);
  });

  it("single pip: stored as #1, one unit", () => {
    expect(doneUnits(single, map({ "fq-x-coin#1": 1 }))).toBe(1);
    expect(isPipDone(single, 1, map({ "fq-x-coin#1": 1 }))).toBe(true);
  });

  it("meter: done only at max", () => {
    expect(doneUnits(meter, map({}))).toBe(0);
    expect(doneUnits(meter, map({ "fq-x-hearts": 19 }))).toBe(0);
    expect(doneUnits(meter, map({ "fq-x-hearts": 20 }))).toBe(1);
  });
});

describe("meterValue", () => {
  it("defaults to 0 and clamps to 0..max", () => {
    if (meter.kind !== "meter") throw new Error("fixture");
    expect(meterValue(meter, map({}))).toBe(0);
    expect(meterValue(meter, map({ "fq-x-hearts": 14 }))).toBe(14);
    expect(meterValue(meter, map({ "fq-x-hearts": 99 }))).toBe(20);
    expect(meterValue(meter, map({ "fq-x-hearts": -3 }))).toBe(0);
    expect(doneUnits(meter, map({ "fq-x-hearts": 99 }))).toBe(1);
  });
});

describe("trackableProgress", () => {
  it("retired trackables count for nothing, even with rows", () => {
    expect(trackableProgress({ ...check, retired: true }, map({ "fq-x-exit": 1 }))).toEqual({ done: 0, total: 0, percent: 0 });
  });
});

describe("entry, section and game progress", () => {
  it("entry: sums its trackables", () => {
    expect(entryProgress(meadow1, map({}))).toEqual({ done: 0, total: 7, percent: 0 });
    expect(
      entryProgress(meadow1, map({ "fq-meadow-1-exit": 1, "fq-meadow-1-coins#2": 1, "fq-meadow-1-hearts": 20 })),
    ).toEqual({ done: 3, total: 7, percent: 42 });
  });

  it("retired entries count for nothing, even with rows", () => {
    expect(entryProgress(retiredCourse, map({ "fq-meadow-old-exit": 1 }))).toEqual({ done: 0, total: 0, percent: 0 });
  });

  it("section: entries plus extras, retired excluded", () => {
    expect(sectionProgress(meadow, map({ "fq-meadow-old-exit": 1, "fq-hat-red-owned": 1 }))).toEqual({
      done: 1,
      total: 10,
      percent: 10,
    });
  });

  it("section: a retired trackable inside a live entry is excluded", () => {
    expect(sectionProgress(caves, map({ "fq-cave-1-secret-exit": 1 }))).toEqual({ done: 0, total: 3, percent: 0 });
  });

  it("game: all sections plus goals", () => {
    expect(gameProgress(fixtureGame, map({}))).toEqual({ done: 0, total: 14, percent: 0 });
  });

  it("percent rounds down, so 100% only when truly complete", () => {
    // 13 of 14 = 92.86% → 92
    const almost = completeRows();
    almost.delete("fq-goal-all-exits-done");
    expect(gameProgress(fixtureGame, almost)).toEqual({ done: 13, total: 14, percent: 92 });
    expect(gameProgress(fixtureGame, completeRows())).toEqual({ done: 14, total: 14, percent: 100 });
  });

  it("isComplete needs everything done, and something to do", () => {
    expect(isComplete({ done: 3, total: 3, percent: 100 })).toBe(true);
    expect(isComplete({ done: 2, total: 3, percent: 66 })).toBe(false);
    expect(isComplete({ done: 0, total: 0, percent: 0 })).toBe(false);
    expect(isComplete(entryProgress(boss, map({ "fq-meadow-boss-exit": 1 })))).toBe(true);
  });
});

describe("toProgressMap", () => {
  it("keys rows by item_id", () => {
    const m = toProgressMap([
      { item_id: "fq-meadow-1-exit", value: 1 },
      { item_id: "fq-meadow-1-hearts", value: 14 },
    ]);
    expect(m.get("fq-meadow-1-hearts")).toBe(14);
    expect(m.size).toBe(2);
  });
});

describe("gameStats", () => {
  const byLabel = (progress: ProgressMap) => Object.fromEntries(gameStats(fixtureGame, progress).map((s) => [s.label, [s.done, s.total]]));

  it("totals with nothing done", () => {
    expect(byLabel(map({}))).toEqual({
      Exits: [0, 3], // meadow-1, boss, cave-1 (retired course + retired secret exit excluded; goals not counted)
      Coins: [0, 6],
      "Coin sets": [0, 2],
      Bosses: [0, 1],
      Hearts: [0, 1],
      Worlds: [0, 2],
    });
  });

  it("counts units vs completed trackables", () => {
    const stats = byLabel(map({ "fq-meadow-1-coins#1": 1, "fq-meadow-1-coins#2": 1, "fq-cave-1-coins#1": 1, "fq-meadow-1-hearts": 5 }));
    expect(stats.Coins).toEqual([3, 6]);
    expect(stats["Coin sets"]).toEqual([1, 2]); // only the single-pip set is complete
    expect(stats.Hearts).toEqual([0, 1]);
  });

  it("counts completed sections", () => {
    const rows = new Map(completeRows());
    rows.delete("fq-meadow-1-exit");
    expect(byLabel(rows).Worlds).toEqual([1, 2]);
    expect(byLabel(completeRows()).Worlds).toEqual([2, 2]);
  });
});

/** Rows that complete every live item in the fixture. */
function completeRows(): Map<string, number> {
  return new Map<string, number>([
    ["fq-meadow-1-exit", 1],
    ...[1, 2, 3, 4, 5].map((n) => [`fq-meadow-1-coins#${n}`, 1] as [string, number]),
    ["fq-meadow-1-hearts", 20],
    ["fq-meadow-boss-exit", 1],
    ["fq-hat-red-owned", 1],
    ["fq-hat-blue-owned", 1],
    ["fq-cave-1-exit", 1],
    ["fq-cave-1-coins#1", 1],
    ["fq-cave-1-gems", 3],
    ["fq-goal-all-exits-done", 1],
  ]);
}
