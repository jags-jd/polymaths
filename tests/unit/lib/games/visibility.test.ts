import { describe, expect, it } from "vitest";

import { toProgressMap } from "@/lib/games/progress";
import type { Game } from "@/lib/games/schema";
import { isEntryHidden, isSpoiler, searchGame } from "@/lib/games/visibility";
import { clone, fixtureGame } from "@/tests/unit/fixtures/games";

const game = fixtureGame as Game;
const meadow = game.sections[0]!;
const caves = game.sections[1]!; // spoiler: true
const cave1 = caves.entries[0]!;
const none: (entryId: string) => boolean = () => false;
const map = (entries: Record<string, number>) => toProgressMap(Object.entries(entries).map(([item_id, value]) => ({ item_id, value })));

describe("isSpoiler / isEntryHidden", () => {
  it("inherits the section's spoiler flag", () => {
    expect(isSpoiler(caves, cave1)).toBe(true);
    expect(isSpoiler(meadow, meadow.entries[0]!)).toBe(false);
    expect(isSpoiler(null, { ...cave1, spoiler: true })).toBe(true);
  });

  it("hides a spoiler until revealed or complete", () => {
    expect(isEntryHidden(caves, cave1, map({}), none)).toBe(true);
    expect(isEntryHidden(caves, cave1, map({}), (id) => id === cave1.id)).toBe(false);
    // Cave 1: exit + single pip + gems meter (max 3); the retired secret exit doesn't count.
    const done = map({ "fq-cave-1-exit": 1, "fq-cave-1-coins#1": 1, "fq-cave-1-gems": 3 });
    expect(isEntryHidden(caves, cave1, done, none)).toBe(false);
    // Partly done is still hidden.
    expect(isEntryHidden(caves, cave1, map({ "fq-cave-1-exit": 1 }), none)).toBe(true);
  });

  it("never hides an entry that isn't a spoiler", () => {
    expect(isEntryHidden(meadow, meadow.entries[0]!, map({}), none)).toBe(false);
  });
});

describe("searchGame", () => {
  const names = (q: string, revealed = none) => searchGame(game, q, map({}), revealed).map((r) => [r.entry.id, r.matched]);

  it("needs at least two characters", () => {
    expect(names("m")).toEqual([]);
    expect(names("me")).not.toEqual([]);
  });

  it("matches entry names first, then trackable labels, ignoring case and accents", () => {
    expect(names("MEADOW")).toEqual([
      ["fq-meadow-1", null],
      ["fq-meadow-boss", null],
    ]);
    expect(names("hearts")).toEqual([["fq-meadow-1", "Hearts"]]);
    expect(searchGame(game, "méadow 1", map({}), none).map((r) => r.entry.id)).toEqual(["fq-meadow-1"]);
  });

  it("finds extras and goals, skips retired entries", () => {
    expect(names("hat")).toEqual([
      ["fq-hat-red", null],
      ["fq-hat-blue", null],
    ]);
    expect(names("every exit")).toEqual([["fq-goal-all-exits", null]]);
    expect(names("old course")).toEqual([]);
  });

  it("doesn't match hidden spoilers, by name or by label", () => {
    expect(names("cave")).toEqual([]);
    expect(names("gems")).toEqual([]);
    expect(names("cave", (id) => id === "fq-cave-1")).toEqual([["fq-cave-1", null]]);
  });

  it("stops at the result limit", () => {
    const big = clone(game);
    big.sections[0]!.entries = Array.from({ length: 30 }, (_, i) => ({
      id: `fq-many-${i}`,
      name: `Many ${i}`,
      kind: "course",
      trackables: [{ id: `fq-many-${i}-exit`, kind: "check" as const, label: "Exit", icon: "exit" }],
    }));
    expect(searchGame(big, "many", map({}), none)).toHaveLength(12);
  });
});
