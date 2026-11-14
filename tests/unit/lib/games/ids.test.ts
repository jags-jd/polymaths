import { describe, expect, it } from "vitest";

import { isValidId, parseItemId, pipId } from "@/lib/games/ids";

describe("isValidId", () => {
  it("accepts lowercase dash-separated words", () => {
    for (const id of ["smw-donut-plains-1", "ff7r-ch9-quest-a", "a"]) expect(isValidId(id), id).toBe(true);
  });

  it("rejects everything else", () => {
    for (const id of ["", "Smw-x", "smw_x", "smw--x", "-smw", "smw-", "smw x", "smw-x#1"]) expect(isValidId(id), id).toBe(false);
  });
});

describe("pipId", () => {
  it("appends a 1-based pip number", () => {
    expect(pipId("smw-yoshis-island-1-dragon-coins", 3)).toBe("smw-yoshis-island-1-dragon-coins#3");
  });

  it("refuses 0, negatives and fractions", () => {
    expect(() => pipId("a", 0)).toThrow(RangeError);
    expect(() => pipId("a", -1)).toThrow(RangeError);
    expect(() => pipId("a", 1.5)).toThrow(RangeError);
  });
});

describe("parseItemId", () => {
  it("parses plain and pip item IDs", () => {
    expect(parseItemId("smw-x-exit")).toEqual({ trackableId: "smw-x-exit", pip: null });
    expect(parseItemId("smw-x-coins#5")).toEqual({ trackableId: "smw-x-coins", pip: 5 });
    expect(parseItemId(pipId("smw-x-coins", 12))).toEqual({ trackableId: "smw-x-coins", pip: 12 });
  });

  it("rejects malformed IDs", () => {
    for (const bad of ["", "#1", "smw-x#", "smw-x#0", "smw-x#01", "smw-x#-1", "smw-x#1.5", "smw-x#1#2", "SMW-x", "smw-x#99999999999999999999"]) {
      expect(parseItemId(bad), bad).toBeNull();
    }
  });
});
