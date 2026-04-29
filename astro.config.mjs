// @ts-check
import { defineConfig } from "astro/config";

const base = process.env.PUBLIC_BASE_PATH;

// https://astro.build/config
export default defineConfig({
  output: "static",
  site: process.env.PUBLIC_SITE_URL ?? "https://fl-tax.jenny.media",
  ...(base ? { base } : {}),
});
