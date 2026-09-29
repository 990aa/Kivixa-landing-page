import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// Kivixa is a privacy-first product landing page. Astro renders to HTML at
// build time; React islands handle only the small bits of stateful UI
// (clipboard copy, FAQ disclosure, mobile nav).
export default defineConfig({
  site: "https://kivixa.dev",
  output: "static",
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: "hover",
  },
});