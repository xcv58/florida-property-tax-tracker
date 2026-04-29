// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  output: "static",
  site: process.env.PUBLIC_SITE_URL ?? "https://fl-tax.jenny.media",
});
