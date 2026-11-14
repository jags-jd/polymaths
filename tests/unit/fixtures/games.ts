import type { ArtManifest, Game } from "@/lib/games/schema";

/**
 * A made-up game that uses every feature of the format: all three trackable
 * kinds, a single pip, retired items, extras groups, goals and every stat kind.
 * Not real game data — only for testing the engine.
 *
 * Units (live only):
 *   Meadow: course-1 = 1 + 5 + 1 (meter) = 7; retired-course = 0; boss = 1;
 *           extras hats = 2               → 10
 *   Caves:  cave-1 = 1 + 1 (single pip) + 1 (meter), retired check excluded = 3 → 3
 *   Goals:  1                              → total 14
 */
export const fixtureGame = {
  slug: "fixture-quest",
  title: "Fixture Quest",
  idPrefix: "fq-",
  publisher: "Test Co",
  platforms: ["Test"],
  theme: "nintendo",
  sections: [
    {
      id: "fq-meadow",
      title: "Meadow",
      label: "World 1",
      layout: "rows",
      entries: [
        {
          id: "fq-meadow-1",
          name: "Meadow 1",
          kind: "course",
          trackables: [
            { id: "fq-meadow-1-exit", kind: "check", label: "Exit", icon: "exit" },
            { id: "fq-meadow-1-coins", kind: "pips", label: "Coins", icon: "coin", count: 5 },
            { id: "fq-meadow-1-hearts", kind: "meter", label: "Hearts", icon: "heart", max: 20 },
          ],
        },
        {
          id: "fq-meadow-old",
          name: "Old course",
          kind: "course",
          retired: true,
          trackables: [{ id: "fq-meadow-old-exit", kind: "check", label: "Exit", icon: "exit" }],
        },
        {
          id: "fq-meadow-boss",
          name: "Meadow Boss",
          kind: "castle",
          image: "meadow-boss",
          trackables: [{ id: "fq-meadow-boss-exit", kind: "check", label: "Beat the boss", icon: "castle" }],
        },
      ],
      extras: [
        {
          id: "fq-meadow-hats",
          title: "Hats",
          layout: "chips",
          entries: [
            { id: "fq-hat-red", name: "Red hat", kind: "hat", trackables: [{ id: "fq-hat-red-owned", kind: "check", label: "Owned", icon: "hat" }] },
            { id: "fq-hat-blue", name: "Blue hat", kind: "hat", trackables: [{ id: "fq-hat-blue-owned", kind: "check", label: "Owned", icon: "hat" }] },
          ],
        },
      ],
    },
    {
      id: "fq-caves",
      title: "Caves",
      layout: "rows",
      spoiler: true,
      entries: [
        {
          id: "fq-cave-1",
          name: "Cave 1",
          kind: "course",
          trackables: [
            { id: "fq-cave-1-exit", kind: "check", label: "Exit", icon: "exit" },
            { id: "fq-cave-1-coins", kind: "pips", label: "Coins", icon: "coin", count: 1, singlePip: true },
            { id: "fq-cave-1-gems", kind: "meter", label: "Gems", icon: "gem", max: 3 },
            { id: "fq-cave-1-secret-exit", kind: "check", label: "Secret exit", icon: "key", retired: true },
          ],
        },
      ],
    },
  ],
  goals: [
    {
      id: "fq-goal-all-exits",
      name: "Find every exit",
      kind: "goal",
      trackables: [{ id: "fq-goal-all-exits-done", kind: "check", label: "Done", icon: "star" }],
    },
  ],
  stats: [
    { label: "Exits", match: { idSuffix: "-exit" }, count: "completed" },
    { label: "Coins", match: { trackableKind: "pips" }, count: "units" },
    { label: "Coin sets", match: { trackableKind: "pips" }, count: "completed" },
    { label: "Bosses", match: { entryKind: "castle" }, count: "completed" },
    { label: "Hearts", match: { icon: "heart" }, count: "completed" },
    { label: "Worlds", match: { section: true }, count: "completed" },
  ],
} satisfies Game;

export const fixtureArt: ArtManifest = {
  "meadow-boss": {
    file: "meadow-boss.png",
    alt: "The Meadow Boss",
    source: "https://example.com/meadow-boss.png",
    owner: "Test Co",
    license: "official-unlicensed",
  },
};

/** A second, minimal game for cross-game checks. */
export const otherGame = {
  slug: "other-game",
  title: "Other Game",
  idPrefix: "og-",
  publisher: "Test Co",
  platforms: ["Test"],
  theme: "default",
  sections: [
    {
      id: "og-area",
      title: "Area",
      layout: "cards",
      entries: [{ id: "og-thing", name: "Thing", kind: "thing", trackables: [{ id: "og-thing-done", kind: "check", label: "Done", icon: "tick" }] }],
    },
  ],
  stats: [],
} satisfies Game;

/** Deep copy for tests that break a fixture on purpose. */
export function clone<T>(value: T): T {
  return structuredClone(value);
}
