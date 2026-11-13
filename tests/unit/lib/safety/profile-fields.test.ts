import { describe, expect, it } from "vitest";

import { displayNameSchema, ignSchema, onboardingSchema } from "@/lib/safety/profile-fields";
import { isReservedIgn, RESERVED_IGNS } from "@/lib/safety/reserved-igns";

describe("isReservedIgn", () => {
  it("blocks every name in the spec's list", () => {
    for (const name of ["admin", "administrator", "polymaths", "support", "help", "mod", "moderator", "staff", "system", "root", "api", "settings", "login", "u", "games"]) {
      expect(isReservedIgn(name), name).toBe(true);
    }
  });

  it("ignores case and surrounding spaces", () => {
    expect(isReservedIgn("ADMIN")).toBe(true);
    expect(isReservedIgn("  Polymaths ")).toBe(true);
  });

  it("allows ordinary names", () => {
    expect(isReservedIgn("kiko")).toBe(false);
    expect(isReservedIgn("admin_kiko")).toBe(false);
  });

  it("only lists names that are valid IGN characters (or they'd be pointless)", () => {
    for (const name of RESERVED_IGNS) expect(name).toMatch(/^[a-z0-9_]+$/);
  });
});

describe("ignSchema", () => {
  const error = (value: string) => {
    const result = ignSchema.safeParse(value);
    return result.success ? null : result.error.issues[0]?.message;
  };

  it("accepts 3–20 letters, numbers and underscores", () => {
    expect(ignSchema.parse("abc")).toBe("abc");
    expect(ignSchema.parse("Player_One_2026")).toBe("Player_One_2026");
    expect(ignSchema.parse("a".repeat(20))).toBe("a".repeat(20));
  });

  it("trims surrounding whitespace", () => {
    expect(ignSchema.parse("  kiko  ")).toBe("kiko");
  });

  it("rejects bad lengths", () => {
    expect(error("ab")).toMatch(/at least 3/);
    expect(error("a".repeat(21))).toMatch(/at most 20/);
  });

  it("rejects other characters", () => {
    for (const bad of ["has space", "dash-name", "dot.name", "émile", "kiko!", "<b>hi</b>"]) {
      expect(error(bad), bad).toMatch(/letters, numbers and underscores/);
    }
  });

  it("rejects reserved names in any case", () => {
    expect(error("Admin")).toMatch(/reserved/);
    expect(error("SETTINGS")).toMatch(/reserved/);
  });
});

describe("displayNameSchema", () => {
  it("collapses whitespace and trims", () => {
    expect(displayNameSchema.parse("  Kiko \n  the   Great ")).toBe("Kiko the Great");
  });

  it("allows any characters (rendered as plain text)", () => {
    expect(displayNameSchema.parse("Émile <3")).toBe("Émile <3");
  });

  it("rejects empty and over-long names", () => {
    expect(displayNameSchema.safeParse("   ").success).toBe(false);
    expect(displayNameSchema.safeParse("x".repeat(41)).success).toBe(false);
    expect(displayNameSchema.safeParse("x".repeat(40)).success).toBe(true);
  });
});

describe("onboardingSchema", () => {
  it("parses a valid form", () => {
    expect(onboardingSchema.parse({ displayName: " Kiko ", ign: "kiko_99" })).toEqual({
      displayName: "Kiko",
      ign: "kiko_99",
    });
  });
});
