import type { APIRoute } from "astro";
import { updateLog } from "../utils/data";
import { absoluteCanonicalUrl, site } from "../utils/site";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export const GET: APIRoute = () => {
  const items = updateLog
    .map((entry) => {
      const title = entry.what_changed[0] ?? "Tracker update";
      const description = entry.what_changed.join(" ");
      const pubDate = new Date(`${entry.date}T12:00:00Z`).toUTCString();

      return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(absoluteCanonicalUrl("/"))}</link>
      <guid isPermaLink="false">${escapeXml(`${entry.date}-${entry.automation_run_id}`)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(description)}</description>
    </item>`;
    })
    .join("\n");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(site.name)} Updates</title>
    <link>${escapeXml(site.url)}</link>
    <description>${escapeXml(site.description)}</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(feed, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
};
