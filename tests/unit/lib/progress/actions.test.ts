import { beforeEach, describe, expect, it, vi } from "vitest";

import { fixtureArt, fixtureGame } from "@/tests/unit/fixtures/games";

/**
 * The server actions must check every write against the game data before it
 * reaches the database. Supabase is replaced by a fake that records calls.
 */

type Call = { op: string; table: string; payload?: unknown; filters: [string, unknown][] };
const calls: Call[] = [];
let nextResults: { data?: unknown; error?: { code: string } | null }[] = [];
let user: { id: string } | null = { id: "user-1" };

vi.mock("server-only", () => ({}));
vi.mock("@/data/games/registry", () => ({
  registry: [{ game: fixtureGame, art: fixtureArt }],
  games: [fixtureGame],
}));
vi.mock("@/lib/auth/session", () => ({ getSessionUser: async () => user }));
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    from: (table: string) => {
      const call: Call = { op: "", table, filters: [] };
      const builder = {
        insert: (payload: unknown) => ((call.op = "insert"), (call.payload = payload), builder),
        update: (payload: unknown) => ((call.op = "update"), (call.payload = payload), builder),
        delete: () => ((call.op = "delete"), builder),
        eq: (column: string, value: unknown) => (call.filters.push([column, value]), builder),
        select: () => builder,
        then: (resolve: (r: unknown) => void) => {
          calls.push(call);
          resolve({ data: [], error: null, ...nextResults.shift() });
        },
      };
      return builder;
    },
  }),
}));

const { setCheck, setPip, setMeter } = await import("@/lib/progress/actions");

beforeEach(() => {
  calls.length = 0;
  nextResults = [];
  user = { id: "user-1" };
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

const GAME = "fixture-quest";

describe("setCheck", () => {
  it("ticks with a value-1 row for the signed-in user", async () => {
    expect(await setCheck(GAME, "fq-meadow-1-exit", true)).toEqual({ ok: true });
    expect(calls).toEqual([
      { op: "insert", table: "progress", payload: { user_id: "user-1", game_slug: GAME, item_id: "fq-meadow-1-exit", value: 1 }, filters: [] },
    ]);
  });

  it("treats 'already ticked' as success", async () => {
    nextResults = [{ error: { code: "23505" } }];
    expect(await setCheck(GAME, "fq-meadow-1-exit", true)).toEqual({ ok: true });
  });

  it("un-ticks by deleting the user's row", async () => {
    expect(await setCheck(GAME, "fq-meadow-1-exit", false)).toEqual({ ok: true });
    expect(calls[0]).toMatchObject({ op: "delete", filters: [["user_id", "user-1"], ["item_id", "fq-meadow-1-exit"]] });
  });

  it("refuses unknown games, unknown or retired items, and other kinds", async () => {
    for (const [game, id] of [
      ["nope", "fq-meadow-1-exit"],
      [GAME, "fq-nope"],
      [GAME, "fq-cave-1-secret-exit"], // retired
      [GAME, "fq-meadow-old-exit"], // retired entry
      [GAME, "fq-meadow-1-coins"], // pips
      [GAME, "fq-meadow-1-hearts"], // meter
    ]) {
      expect(await setCheck(game, id, true), id).toEqual({ ok: false, reason: "invalid" });
    }
    expect(calls).toEqual([]);
  });

  it("refuses when signed out", async () => {
    user = null;
    expect(await setCheck(GAME, "fq-meadow-1-exit", true)).toEqual({ ok: false, reason: "signed-out" });
    expect(calls).toEqual([]);
  });

  it("reports database failures", async () => {
    nextResults = [{ error: { code: "42501" } }];
    expect(await setCheck(GAME, "fq-meadow-1-exit", true)).toEqual({ ok: false, reason: "failed" });
  });
});

describe("setPip", () => {
  it("writes '<id>#<n>' rows", async () => {
    expect(await setPip(GAME, "fq-meadow-1-coins", 5, true)).toEqual({ ok: true });
    expect(calls[0]).toMatchObject({ op: "insert", payload: { item_id: "fq-meadow-1-coins#5", value: 1 } });
    expect(await setPip(GAME, "fq-cave-1-coins", 1, false)).toEqual({ ok: true });
    expect(calls[1]).toMatchObject({ op: "delete", filters: [["user_id", "user-1"], ["item_id", "fq-cave-1-coins#1"]] });
  });

  it("refuses pip numbers out of range and non-pips trackables", async () => {
    expect(await setPip(GAME, "fq-meadow-1-coins", 6, true)).toEqual({ ok: false, reason: "invalid" });
    expect(await setPip(GAME, "fq-meadow-1-coins", 0, true)).toEqual({ ok: false, reason: "invalid" });
    expect(await setPip(GAME, "fq-meadow-1-coins", 1.5, true)).toEqual({ ok: false, reason: "invalid" });
    expect(await setPip(GAME, "fq-cave-1-coins", 2, true)).toEqual({ ok: false, reason: "invalid" });
    expect(await setPip(GAME, "fq-meadow-1-exit", 1, true)).toEqual({ ok: false, reason: "invalid" });
    expect(calls).toEqual([]);
  });
});

describe("setMeter", () => {
  it("updates an existing row", async () => {
    nextResults = [{ data: [{ item_id: "fq-meadow-1-hearts" }] }];
    expect(await setMeter(GAME, "fq-meadow-1-hearts", 14)).toEqual({ ok: true });
    expect(calls).toEqual([
      { op: "update", table: "progress", payload: { value: 14 }, filters: [["user_id", "user-1"], ["item_id", "fq-meadow-1-hearts"]] },
    ]);
  });

  it("inserts when there's no row yet", async () => {
    nextResults = [{ data: [] }];
    expect(await setMeter(GAME, "fq-meadow-1-hearts", 3)).toEqual({ ok: true });
    expect(calls.map((c) => c.op)).toEqual(["update", "insert"]);
    expect(calls[1].payload).toEqual({ user_id: "user-1", game_slug: GAME, item_id: "fq-meadow-1-hearts", value: 3 });
  });

  it("updates again if a parallel request inserted first", async () => {
    nextResults = [{ data: [] }, { error: { code: "23505" } }, { data: [{}] }];
    expect(await setMeter(GAME, "fq-meadow-1-hearts", 3)).toEqual({ ok: true });
    expect(calls.map((c) => c.op)).toEqual(["update", "insert", "update"]);
  });

  it("deletes the row at 0", async () => {
    expect(await setMeter(GAME, "fq-meadow-1-hearts", 0)).toEqual({ ok: true });
    expect(calls.map((c) => c.op)).toEqual(["delete"]);
  });

  it("refuses values above max, negatives and non-meters", async () => {
    expect(await setMeter(GAME, "fq-meadow-1-hearts", 21)).toEqual({ ok: false, reason: "invalid" });
    expect(await setMeter(GAME, "fq-meadow-1-hearts", -1)).toEqual({ ok: false, reason: "invalid" });
    expect(await setMeter(GAME, "fq-meadow-1-exit", 1)).toEqual({ ok: false, reason: "invalid" });
    expect(calls).toEqual([]);
  });
});
