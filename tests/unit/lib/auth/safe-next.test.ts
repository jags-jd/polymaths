import { describe, expect, it } from "vitest";

import { safeNextPath } from "@/lib/auth/safe-next";

describe("safeNextPath", () => {
  it("keeps same-site paths", () => {
    expect(safeNextPath("/games/super-mario-world")).toBe("/games/super-mario-world");
    expect(safeNextPath("/u/kiko?tab=games")).toBe("/u/kiko?tab=games");
  });

  it("falls back to home for missing values", () => {
    expect(safeNextPath(null)).toBe("/");
    expect(safeNextPath(undefined)).toBe("/");
    expect(safeNextPath("")).toBe("/");
  });

  it("blocks open redirects", () => {
    for (const bad of [
      "https://evil.com",
      "//evil.com",
      "/\\evil.com",
      "/\t/evil.com",
      "/\n/evil.com",
      "evil.com",
      "javascript:alert(1)",
    ]) {
      expect(safeNextPath(bad), JSON.stringify(bad)).toBe("/");
    }
  });

  it("never sends people back into the auth flow", () => {
    expect(safeNextPath("/login")).toBe("/");
    expect(safeNextPath("/onboarding")).toBe("/");
    expect(safeNextPath("/auth/callback")).toBe("/");
  });
});
