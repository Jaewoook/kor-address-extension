import { defineConfig } from "vitest/config";
import path from "path";
import react from "@vitejs/plugin-react";
import type { Plugin } from "vite";

const REQUIRED_ENV_VARS = ["VITE_SENTRY_DSN", "VITE_JUSO_API_KEY"] as const;

// Only runs for `vite dev` - configureServer never fires for build/preview.
const warnOnMissingEnv = (): Plugin => ({
  name: "warn-on-missing-env",
  configureServer(server) {
    const missing = REQUIRED_ENV_VARS.filter((key) => !server.config.env[key]);
    if (missing.length > 0) {
      server.config.logger.warn(
        `\n⚠️  Missing .env value(s): ${missing.join(", ")} — copy .env.example to .env and fill them in.\n`,
      );
    }
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), warnOnMissingEnv()],
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
    rollupOptions: {
      input: {
        main: path.resolve(import.meta.dirname, "index.html"),
        options: path.resolve(import.meta.dirname, "options.html"),
      },
    },
  },
  resolve: {
    alias: [
      { find: "@popup", replacement: path.join(import.meta.dirname, "apps/popup") },
      { find: "@options", replacement: path.join(import.meta.dirname, "apps/options") },
      { find: "@shared", replacement: path.join(import.meta.dirname, "shared") },
    ],
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setupTests.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "text-summary", "lcov", "html"],
      include: ["apps/**/*.{ts,tsx}", "shared/**/*.{ts,tsx}"],
    },
  },
});
