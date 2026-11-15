import { describe, expect, it } from "vitest";

import { pixelRuns } from "@/components/icons/pixel/PixelIcon";
import { SMW_ICONS } from "@/components/icons/super-mario-world/pixel-maps";

describe("pixelRuns", () => {
  it("merges horizontal runs and skips transparent pixels", () => {
    expect(pixelRuns(["aab.", ".bbb"], { a: "red", b: "blue" })).toEqual([
      { x: 0, y: 0, width: 2, fill: "red" },
      { x: 2, y: 0, width: 1, fill: "blue" },
      { x: 1, y: 1, width: 3, fill: "blue" },
    ]);
  });

  it("throws on a character with no palette color", () => {
    expect(() => pixelRuns(["ax"], { a: "red" })).toThrow(/no palette color for "x"/);
  });
});

describe("Super Mario World icons", () => {
  for (const [key, pair] of Object.entries(SMW_ICONS)) {
    for (const [state, art] of Object.entries(pair)) {
      it(`${key} (${state}) is a rectangular map with every color defined`, () => {
        const width = art.map[0]!.length;
        expect(art.map.length).toBeGreaterThan(0);
        for (const row of art.map) expect(row).toHaveLength(width);
        expect(() => pixelRuns(art.map, art.palette)).not.toThrow();
      });
    }
  }
});
