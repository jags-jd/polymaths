import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    // Most unit tests (progress maths, schemas, safety helpers) need no DOM.
    // Component tests opt in per file with: // @vitest-environment jsdom
    environment: "node",
    include: ["tests/unit/**/*.test.{ts,tsx}", "{app,components,lib,data}/**/*.test.{ts,tsx}"],
    exclude: ["node_modules", "tests/e2e/**"],
  },
});
