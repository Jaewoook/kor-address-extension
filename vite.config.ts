import { defineConfig } from "vitest/config";
import path from "path";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 11200,
  },
  build: {
    outDir: "build",
    // This is a single-view extension popup loaded from local files, not a
    // network-served multi-page app - there's no route to code-split around,
    // so the default 500kB warning is a false positive here. Current output
    // is ~900kB; this leaves headroom before warning on genuine bloat.
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: [{ find: "@", replacement: path.join(import.meta.dirname, "src") }],
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setupTests.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "text-summary", "lcov", "html"],
      include: ["src/**/*.{ts,tsx}"],
    },
  },
});
