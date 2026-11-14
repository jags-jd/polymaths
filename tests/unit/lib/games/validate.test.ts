import { describe, expect, it } from "vitest";

import { validateRegistry } from "@/lib/games/validate";
import { clone, fixtureArt, fixtureGame, otherGame } from "@/tests/unit/fixtures/games";

const allFilesExist = () => true;

describe("validateRegistry", () => {
  it("passes valid games", () => {
    expect(
      validateRegistry(
        [
          { game: fixtureGame, art: fixtureArt },
          { game: otherGame, art: {} },
        ],
        allFilesExist,
      ),
    ).toEqual([]);
  });

  it("passes an empty registry", () => {
    expect(validateRegistry([], allFilesExist)).toEqual([]);
  });

  it("reports schema problems with their path", () => {
    const game = clone(fixtureGame);
    (game.sections[0].entries[0].trackables[1] as { count: number }).count = 40;
    expect(validateRegistry([{ game, art: fixtureArt }], allFilesExist)).toEqual([
      "registry[0]: sections.0.entries.0.trackables.1.count: Pips count must be 2–30",
    ]);
  });

  it("finds IDs shared between games", () => {
    // Same prefix, different slug → the shared IDs and the prefix both clash.
    const copy = { ...clone(fixtureGame), slug: "fixture-copy" };
    const problems = validateRegistry(
      [
        { game: fixtureGame, art: fixtureArt },
        { game: copy, art: fixtureArt },
      ],
      allFilesExist,
    );
    expect(problems).toContain('fixture-copy: idPrefix "fq-" is used by another game');
    expect(problems).toContain('fixture-copy: ID "fq-meadow-1-exit" is also used by fixture-quest');
  });

  it("finds duplicate slugs", () => {
    const problems = validateRegistry(
      [
        { game: otherGame, art: {} },
        { game: JSON.parse(JSON.stringify(otherGame).replaceAll('"og-', '"og2-')), art: {} },
      ],
      allFilesExist,
    );
    expect(problems).toEqual(['other-game: slug "other-game" is used by another game']);
  });

  it("reports games that fail the schema", () => {
    const problems = validateRegistry([{ game: { ...clone(otherGame), sections: [] }, art: {} }], allFilesExist);
    expect(problems).toEqual(["registry[0]: sections: A game needs at least one section"]);
  });

  it("finds images missing from the art manifest", () => {
    expect(validateRegistry([{ game: fixtureGame, art: {} }], allFilesExist)).toEqual([
      'fixture-quest: entry "fq-meadow-boss" uses image "meadow-boss", which isn\'t in art.ts',
    ]);
  });

  it("finds manifest files missing from public/", () => {
    const seen: string[] = [];
    const problems = validateRegistry([{ game: fixtureGame, art: fixtureArt }], (path) => {
      seen.push(path);
      return false;
    });
    expect(seen).toEqual(["games/fixture-quest/meadow-boss.png"]);
    expect(problems).toEqual([
      'fixture-quest art: "meadow-boss" points to public/games/fixture-quest/meadow-boss.png, which doesn\'t exist',
    ]);
  });

  it("reports bad art manifests", () => {
    const art = { "meadow-boss": { ...fixtureArt["meadow-boss"], source: undefined } };
    expect(validateRegistry([{ game: fixtureGame, art }], allFilesExist)).toEqual([
      "fixture-quest art: meadow-boss.source: Non-original art must record its source URL",
    ]);
  });
});
