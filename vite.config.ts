import { defineConfig } from "vitest/config";
import fs from "fs";
import path from "path";
import react from "@vitejs/plugin-react";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { loadEnv } from "vite";
import type { Plugin } from "vite";

const REQUIRED_ENV_VARS = ["VITE_SENTRY_DSN", "VITE_JUSO_API_KEY"] as const;
const DEFAULT_DEV_SERVER_PORT = 11200;

// manifest.json is what ships to users, so it's the source of truth for the version.
const { version: EXTENSION_VERSION } = JSON.parse(
  fs.readFileSync(path.resolve(import.meta.dirname, "manifest.json"), "utf-8"),
);
const SENTRY_RELEASE = `kor-address-extension@${EXTENSION_VERSION}`;

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
export default defineConfig(({ mode }) => {
  // No VITE_ prefix: config-only values and build-time secrets that must never reach the client bundle.
  const { DEV_SERVER_PORT, SENTRY_AUTH_TOKEN, SENTRY_ORG, SENTRY_PROJECT } = loadEnv(
    mode,
    import.meta.dirname,
    "",
  );
  const uploadSourceMaps = Boolean(SENTRY_AUTH_TOKEN && SENTRY_ORG && SENTRY_PROJECT);

  return {
    plugins: [
      react(),
      warnOnMissingEnv(),
      // Must come last. Source maps are deleted after upload so they never ship in the package.
      uploadSourceMaps &&
        sentryVitePlugin({
          org: SENTRY_ORG,
          project: SENTRY_PROJECT,
          authToken: SENTRY_AUTH_TOKEN,
          release: { name: SENTRY_RELEASE },
          sourcemaps: { filesToDeleteAfterUpload: ["./build/**/*.map"] },
          telemetry: false,
        }),
    ],
    define: {
      __SENTRY_RELEASE__: JSON.stringify(SENTRY_RELEASE),
    },
    server: {
      port: Number(DEV_SERVER_PORT) || DEFAULT_DEV_SERVER_PORT,
    },
    build: {
      outDir: "build",
      // "hidden" emits maps without a sourceMappingURL comment in the bundle.
      sourcemap: uploadSourceMaps ? "hidden" : false,
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
  };
});
