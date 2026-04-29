import type { APIRoute } from "astro";
import { site, withBase } from "../utils/site";

export const GET: APIRoute = () => {
  const manifest = {
    name: site.name,
    short_name: "FL Tax Tracker",
    description: site.description,
    start_url: withBase("/"),
    scope: withBase("/"),
    display: "standalone",
    background_color: "#f8f6ee",
    theme_color: "#111614",
    icons: [
      {
        src: withBase("/favicon.svg"),
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: {
      "Cache-Control": "public, max-age=86400",
      "Content-Type": "application/manifest+json; charset=utf-8",
    },
  });
};
