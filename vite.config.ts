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
