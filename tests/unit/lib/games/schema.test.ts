import { describe, expect, it } from "vitest";

import { artItemSchema, gameSchema, pipsSchema, statDefSchema, trackableSchema } from "@/lib/games/schema";
import { clone, fixtureGame } from "@/tests/unit/fixtures/games";

const messages = (result: { success: boolean; error?: { issues: { message: string }[] } }) =>
  result.success ? [] : result.error!.issues.map((i) => i.message);

const pips = (extra: Record<string, unknown>) =>
  pipsSchema.safeParse({ id: "fq-a-coins", kind: "pips", label: "Coins", icon: "coin", ...extra });

describe("gameSchema", () => {
  it("accepts the fixture game", () => {
    expect(messages(gameSchema.safeParse(fixtureGame))).toEqual([]);
  });

  it("rejects IDs without the game's prefix", () => {
    const game = clone(fixtureGame);
    game.sections[0].entries[0].trackables[0].id = "meadow-1-exit";
    expect(messages(gameSchema.safeParse(game))).toContain('ID "meadow-1-exit" must start with "fq-"');
  });

  it("rejects duplicate IDs anywhere in the game", () => {
    const game = clone(fixtureGame);
    game.goals[0].trackables[0].id = "fq-meadow-1-exit";
    expect(messages(gameSchema.safeParse(game))).toContain('Duplicate ID "fq-meadow-1-exit"');
  });

  it("rejects badly formed IDs", () => {
    for (const bad of ["fq-Meadow", "fq-meadow_1", "fq-meadow--1", "fq-meadow-1#2", "fq-meadow-"]) {
      const game = clone(fixtureGame);
      game.sections[0].id = bad;
      expect(gameSchema.safeParse(game).success, bad).toBe(false);
    }
  });

  it("rejects empty sections, entries and groups", () => {
    const noEntries = clone(fixtureGame);
    (noEntries.sections[0] as { entries: unknown[] }).entries = [];
    expect(messages(gameSchema.safeParse(noEntries))).toContain("A section needs at least one entry");

    const noTrackables = clone(fixtureGame);
    (noTrackables.sections[0].entries[0] as { trackables: unknown[] }).trackables = [];
    expect(messages(gameSchema.safeParse(noTrackables))).toContain("An entry needs at least one trackable");

    const noGroupEntries = clone(fixtureGame);
    (noGroupEntries.sections[0].extras![0] as { entries: unknown[] }).entries = [];
    expect(messages(gameSchema.safeParse(noGroupEntries))).toContain("A group needs at least one entry");
  });

  it("rejects unknown fields (catches typos like `spolier`)", () => {
    const game = clone(fixtureGame) as unknown as { sections: Record<string, unknown>[] };
    game.sections[0].spolier = true;
    expect(gameSchema.safeParse(game).success).toBe(false);
  });

  it("rejects unknown themes and skins, and bad accents", () => {
    expect(gameSchema.safeParse({ ...fixtureGame, theme: "pastel" }).success).toBe(false);
    expect(gameSchema.safeParse({ ...fixtureGame, skin: "made-up" }).success).toBe(false);
    expect(gameSchema.safeParse({ ...fixtureGame, accent: "green" }).success).toBe(false);
    expect(gameSchema.safeParse({ ...fixtureGame, accent: "#1F7F2D" }).success).toBe(true);
  });

  it("requires the prefix to end with a dash", () => {
    expect(gameSchema.safeParse({ ...fixtureGame, idPrefix: "fq" }).success).toBe(false);
  });
});

describe("trackable kinds", () => {
  it("only knows check, pips and meter", () => {
    expect(trackableSchema.safeParse({ id: "fq-a", kind: "counter", label: "A", icon: "a" }).success).toBe(false);
  });

  it("pips: 2–30", () => {
    expect(pips({ count: 2 }).success).toBe(true);
    expect(pips({ count: 30 }).success).toBe(true);
    expect(messages(pips({ count: 31 }))).toEqual(["Pips count must be 2–30"]);
    expect(messages(pips({ count: 0 }))).toEqual(["Pips count must be 2–30"]);
    expect(pips({ count: 2.5 }).success).toBe(false);
  });

  it("pips: count 1 only with singlePip: true", () => {
    expect(messages(pips({ count: 1 }))).toEqual(["A single pip needs `singlePip: true` (a lone thing is normally a `check`)"]);
    expect(pips({ count: 1, singlePip: true }).success).toBe(true);
    expect(messages(pips({ count: 5, singlePip: true }))).toEqual(["`singlePip: true` is only allowed with `count: 1`"]);
    expect(pips({ count: 1, singlePip: false }).success).toBe(false);
  });

  it("meter: max 2–999", () => {
    const meter = (max: number) => trackableSchema.safeParse({ id: "fq-a", kind: "meter", label: "A", icon: "a", max });
    expect(meter(2).success).toBe(true);
    expect(meter(999).success).toBe(true);
    expect(meter(1).success).toBe(false);
    expect(meter(1000).success).toBe(false);
  });

  it("check: no count or max", () => {
    expect(trackableSchema.safeParse({ id: "fq-a", kind: "check", label: "A", icon: "a", count: 2 }).success).toBe(false);
  });
});

describe("statDefSchema", () => {
  it("needs at least one filter", () => {
    expect(statDefSchema.safeParse({ label: "X", match: {}, count: "units" }).success).toBe(false);
  });

  it("section stats count completed sections and take no other filters", () => {
    expect(statDefSchema.safeParse({ label: "Worlds", match: { section: true }, count: "completed" }).success).toBe(true);
    expect(statDefSchema.safeParse({ label: "Worlds", match: { section: true }, count: "units" }).success).toBe(false);
    expect(statDefSchema.safeParse({ label: "W", match: { section: true, icon: "exit" }, count: "completed" }).success).toBe(false);
  });
});

describe("artItemSchema", () => {
  const art = { file: "boss.png", alt: "A boss", owner: "Nintendo" };

  it("non-original art needs a source URL", () => {
    expect(artItemSchema.safeParse({ ...art, license: "official-unlicensed" }).success).toBe(false);
    expect(artItemSchema.safeParse({ ...art, license: "official-unlicensed", source: "https://example.com/a.png" }).success).toBe(true);
    expect(artItemSchema.safeParse({ ...art, license: "original" }).success).toBe(true);
  });

  it("files are lowercase images", () => {
    expect(artItemSchema.safeParse({ ...art, license: "original", file: "Boss.PNG" }).success).toBe(false);
    expect(artItemSchema.safeParse({ ...art, license: "original", file: "../secret.png" }).success).toBe(false);
    expect(artItemSchema.safeParse({ ...art, license: "original", file: "boss.exe" }).success).toBe(false);
  });
});
