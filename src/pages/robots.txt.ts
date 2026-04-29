import type { APIRoute } from "astro";
import { absoluteCanonicalUrl, site } from "../utils/site";

export const GET: APIRoute = () => {
  const rules = site.indexing
    ? ["User-agent: *", "Allow: /"]
    : ["User-agent: *", "Disallow: /"];

  return new Response(
    [...rules, `Sitemap: ${absoluteCanonicalUrl("/sitemap.xml")}`, ""].join(
      "\n",
    ),
    {
      headers: {
        "Cache-Control": "public, max-age=3600",
        "Content-Type": "text/plain; charset=utf-8",
      },
    },
  );
};
