import { describe, expect, it } from "vitest";

import { summarizeGames, type DatedProgressRow } from "@/lib/games/my-games";
import type { Check, Game } from "@/lib/games/schema";
import { clone, fixtureGame, otherGame } from "@/tests/unit/fixtures/games";

/** Only games with a page are listed; until 0.4 that means a skin. */
function withPage(game: Game, slug = game.slug): Game {
  return { ...clone(game), slug, skin: "smw-save-file" };
}

const quest = withPage(fixtureGame as Game);
const other = withPage(otherGame as Game);
const third = withPage(otherGame as Game, "third-game");

const row = (game_slug: string, item_id: string, updated_at: string): DatedProgressRow => ({ game_slug, item_id, value: 1, updated_at });

describe("summarizeGames", () => {
  it("puts every game in `others` when nothing is ticked, in registry order", () => {
    expect(summarizeGames([quest, other, third], [])).toEqual({ started: [], others: [quest, other, third] });
  });

  it("lists started games most recently played first", () => {
    const { started, others } = summarizeGames(
      [quest, other, third],
      [
        row("fixture-quest", "fq-meadow-1-exit", "2026-11-10T09:00:00+00:00"),
        row("other-game", "og-thing-done", "2026-11-12T09:00:00+00:00"),
        row("fixture-quest", "fq-cave-1-exit", "2026-11-14T09:00:00+00:00"),
      ],
    );
    expect(started.map((s) => [s.game.slug, s.lastPlayed])).toEqual([
      ["fixture-quest", "2026-11-14T09:00:00+00:00"],
      ["other-game", "2026-11-12T09:00:00+00:00"],
    ]);
    expect(others).toEqual([third]);
  });

  it("works out progress with the shared maths", () => {
    const { started } = summarizeGames([quest], [row("fixture-quest", "fq-meadow-1-exit", "2026-11-10T09:00:00+00:00")]);
    expect(started[0]!.progress).toEqual({ done: 1, total: 14, percent: 7 });
  });

  it("works out automatic goals instead of reading their rows", () => {
    const game = withPage(fixtureGame as Game);
    (game.goals![0]!.trackables[0] as Check).auto = { match: { idSuffix: "-exit" }, unit: "exits" };
    const rows = ["fq-meadow-1-exit", "fq-meadow-boss-exit", "fq-cave-1-exit"].map((id) => row("fixture-quest", id, "2026-11-10T09:00:00+00:00"));
    expect(summarizeGames([game], rows).started[0]!.progress.done).toBe(4); // 3 exits + the goal
    const stray = [row("fixture-quest", "fq-goal-all-exits-done", "2026-11-10T09:00:00+00:00")];
    expect(summarizeGames([game], stray).started[0]!.progress.done).toBe(0);
  });

  it("ignores rows for games that aren't registered", () => {
    expect(summarizeGames([quest], [row("gone-game", "gg-x", "2026-11-10T09:00:00+00:00")])).toEqual({ started: [], others: [quest] });
  });

  it("leaves out games without a page", () => {
    const noPage = clone(otherGame) as Game;
    expect(summarizeGames([quest, noPage], [row("other-game", "og-thing-done", "2026-11-10T09:00:00+00:00")])).toEqual({
      started: [],
      others: [quest],
    });
  });
});
