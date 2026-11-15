import { describe, expect, it } from "vitest";

import { getTrackable, resolveItem } from "@/lib/games/load";
import { fixtureGame } from "@/tests/unit/fixtures/games";

describe("getTrackable", () => {
  it("finds trackables in entries, extras and goals", () => {
    expect(getTrackable(fixtureGame, "fq-meadow-1-exit")?.section?.id).toBe("fq-meadow");
    expect(getTrackable(fixtureGame, "fq-hat-red-owned")?.section?.id).toBe("fq-meadow");
    const goal = getTrackable(fixtureGame, "fq-goal-all-exits-done");
    expect(goal?.entry.id).toBe("fq-goal-all-exits");
    expect(goal?.section).toBeNull();
  });

  it("refuses unknown and retired trackables", () => {
    expect(getTrackable(fixtureGame, "fq-nope")).toBeNull();
    expect(getTrackable(fixtureGame, "fq-cave-1-secret-exit")).toBeNull(); // retired trackable
    expect(getTrackable(fixtureGame, "fq-meadow-old-exit")).toBeNull(); // in a retired entry
    expect(getTrackable(fixtureGame, "fq-meadow-1")).toBeNull(); // an entry, not a trackable
  });
});

describe("resolveItem", () => {
  it("resolves checks and meters without a pip", () => {
    expect(resolveItem(fixtureGame, "fq-meadow-1-exit")?.pip).toBeNull();
    expect(resolveItem(fixtureGame, "fq-meadow-1-hearts")?.trackable.kind).toBe("meter");
    expect(resolveItem(fixtureGame, "fq-meadow-1-exit#1")).toBeNull();
    expect(resolveItem(fixtureGame, "fq-meadow-1-hearts#1")).toBeNull();
  });

  it("resolves pips only with an in-range pip number", () => {
    expect(resolveItem(fixtureGame, "fq-meadow-1-coins#1")?.pip).toBe(1);
    expect(resolveItem(fixtureGame, "fq-meadow-1-coins#5")?.pip).toBe(5);
    expect(resolveItem(fixtureGame, "fq-meadow-1-coins#6")).toBeNull();
    expect(resolveItem(fixtureGame, "fq-meadow-1-coins")).toBeNull();
    expect(resolveItem(fixtureGame, "fq-cave-1-coins#1")?.pip).toBe(1);
    expect(resolveItem(fixtureGame, "fq-cave-1-coins#2")).toBeNull();
  });

  it("refuses malformed, unknown and retired items", () => {
    expect(resolveItem(fixtureGame, "fq-meadow-1-coins#x")).toBeNull();
    expect(resolveItem(fixtureGame, "other-thing")).toBeNull();
    expect(resolveItem(fixtureGame, "fq-cave-1-secret-exit")).toBeNull();
  });
});
