import { defineConfig } from "vite";
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
    alias: [{ find: "@", replacement: path.join(__dirname, "src") }],
  },
});
