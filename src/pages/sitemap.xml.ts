import type { APIRoute } from "astro";
import { status } from "../utils/data";
import { absoluteCanonicalUrl } from "../utils/site";

const pages = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/details/", changefreq: "daily", priority: "0.9" },
  { path: "/timeline/", changefreq: "daily", priority: "0.9" },
  { path: "/proposals/", changefreq: "daily", priority: "0.8" },
  { path: "/counties/", changefreq: "weekly", priority: "0.7" },
  { path: "/sources/", changefreq: "daily", priority: "0.8" },
  { path: "/methodology/", changefreq: "monthly", priority: "0.5" },
  { path: "/about/", changefreq: "monthly", priority: "0.5" },
];

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export const GET: APIRoute = () => {
  const urls = pages
    .map(
      (page) => `  <url>
    <loc>${escapeXml(absoluteCanonicalUrl(page.path))}</loc>
    <lastmod>${status.last_verified}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
    )
    .join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(sitemap, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
