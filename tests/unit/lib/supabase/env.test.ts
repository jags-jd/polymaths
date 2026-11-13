import { afterEach, describe, expect, it, vi } from "vitest";

import { publicEnv } from "@/lib/supabase/env";

describe("publicEnv", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns the Supabase URL and publishable key when set", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://127.0.0.1:54321");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "sb_publishable_test");

    expect(publicEnv.url).toBe("http://127.0.0.1:54321");
    expect(publicEnv.publishableKey).toBe("sb_publishable_test");
  });

  it("throws a helpful error when a variable is missing", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");

    expect(() => publicEnv.url).toThrow(/NEXT_PUBLIC_SUPABASE_URL.*\.env\.example/);
  });
});
