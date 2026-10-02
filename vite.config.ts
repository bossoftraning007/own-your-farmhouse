/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2020",
    // Framer Motion dominates the bundle. Splitting it out means returning
    // visitors on WhatsApp's in-app browser can pull it from cache.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("framer-motion") || id.includes("node_modules/motion")) {
            return "framer-motion";
          }
          if (id.includes("node_modules/react")) {
            return "react";
          }
        },
      },
    },
  },
  server: {
    port: 5173,
  },
  preview: {
    port: 4173,
  },
  test: {
    environment: "jsdom",
    globals: false,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    css: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/main.tsx", "src/**/*.test.{ts,tsx}", "src/test/**"],
    },
  },
});