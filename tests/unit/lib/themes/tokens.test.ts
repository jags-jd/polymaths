import { describe, expect, it } from "vitest";

import { contrastRatio, gameTokens, SKIN_TOKENS, THEMES, tokensToCss } from "@/lib/themes/tokens";

describe("contrastRatio", () => {
  it("matches known values", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 5);
    expect(contrastRatio("#FFFFFF", "#FFFFFF")).toBeCloseTo(1, 5);
  });
});

// docs/themes.md: text on bg/surface, muted on surface and on-accent on accent
// must all be at least 4.5:1.
describe.each(Object.entries(THEMES))("theme %s", (_name, t) => {
  it.each([
    ["text", "bg", t.text, t.bg],
    ["text", "surface", t.text, t.surface],
    ["muted", "surface", t.muted, t.surface],
    ["on-accent", "accent", t["on-accent"], t.accent],
    ["header-text", "header-bg", t["header-text"], t["header-bg"]],
  ])("%s on %s is at least 4.5:1", (_a, _b, fg, bg) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(4.5);
  });
});

describe("smw-save-file skin", () => {
  const s = SKIN_TOKENS["smw-save-file"];
  it.each([
    ["ink on page", s["smw-ink"]!, s["smw-page"]!],
    ["ink on inner box", s["smw-ink"]!, s["smw-inner"]!],
    ["ink on pink row", s["smw-ink"]!, s["smw-row-a"]!],
    ["ink on gold row", s["smw-ink"]!, s["smw-row-b"]!],
    ["ink on frame", s["smw-ink"]!, s["smw-frame"]!],
    ["blue score on inner box", s["smw-blue"]!, s["smw-inner"]!],
    ["red percent on inner box", s["smw-red"]!, s["smw-inner"]!],
    ["header text", "#FFFFFF", s["header-bg"]!],
  ])("%s is at least 4.5:1", (_label, fg, bg) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(4.5);
  });
});

describe("gameTokens", () => {
  it("applies the accent, and on nintendo the header too", () => {
    const t = gameTokens({ theme: "nintendo", accent: "#1F7F2D" });
    expect(t.accent).toBe("#1F7F2D");
    expect(t["header-bg"]).toBe("#1F7F2D");
    expect(gameTokens({ theme: "souls", accent: "#AA0000" })["header-bg"]).toBe(THEMES.souls["header-bg"]);
  });

  it("layers the skin on top", () => {
    const t = gameTokens({ theme: "nintendo", skin: "smw-save-file" });
    expect(t["header-bg"]).toBe("#D3202A");
    expect(t["header-stripe"]).toBe("#1E4FBF");
    expect(t["smw-frame"]).toBe("#F8C030");
  });
});

describe("tokensToCss", () => {
  it("writes custom properties on :root", () => {
    expect(tokensToCss({ bg: "#FFF", "radius-card": "8px" })).toBe(":root{--bg:#FFF;--radius-card:8px;}");
  });
});
