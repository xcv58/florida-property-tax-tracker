import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const distDir = join(process.cwd(), "dist");
const canonicalOrigin = (
  process.env.PUBLIC_CANONICAL_URL || "https://fl-tax.jenny.media"
).replace(/\/$/, "");
const indexing = process.env.PUBLIC_INDEXING !== "false";

const requiredFiles = [
  "index.html",
  "404.html",
  "robots.txt",
  "sitemap.xml",
  "feed.xml",
  "site.webmanifest",
  "og-image.svg",
  "og-image.png",
];
const sitemapRoutes = [
  "/",
  "/details/",
  "/timeline/",
  "/proposals/",
  "/counties/",
  "/sources/",
  "/methodology/",
  "/about/",
];

function fail(message: string): never {
  throw new Error(`SEO validation failed: ${message}`);
}

function readDist(path: string): string {
  const fullPath = join(distDir, path);
  if (!existsSync(fullPath)) {
    fail(`missing dist/${path}`);
  }

  return readFileSync(fullPath, "utf8");
}

for (const file of requiredFiles) {
  if (!existsSync(join(distDir, file))) {
    fail(`missing dist/${file}`);
  }
}

const home = readDist("index.html");
const robots = readDist("robots.txt");
const sitemap = readDist("sitemap.xml");
const feed = readDist("feed.xml");
const manifest = readDist("site.webmanifest");

const expectedCanonical = `${canonicalOrigin}/`;
const expectedRobotsTokens = indexing
  ? ["index", "follow"]
  : ["noindex", "follow"];
const expectedRobotsRule = indexing ? "Allow: /" : "Disallow: /";

if (!home.includes("<title>Florida Property Tax Tracker")) {
  fail("homepage title is missing or unexpected");
}

if (!home.includes('name="description"')) {
  fail("homepage meta description is missing");
}

if (!home.includes(`rel="canonical" href="${expectedCanonical}"`)) {
  fail(`homepage canonical should be ${expectedCanonical}`);
}

const robotsMeta = home.match(/name="robots" content="([^"]+)"/)?.[1] ?? "";
const robotsMetaTokens = robotsMeta.split(",").map((token) => token.trim());
if (!expectedRobotsTokens.every((token) => robotsMetaTokens.includes(token))) {
  fail(
    `homepage robots meta should include ${expectedRobotsTokens.join(", ")}`,
  );
}

for (const token of [
  'property="og:image"',
  'name="twitter:card"',
  'type="application/ld+json"',
  'rel="manifest"',
  'type="application/rss+xml"',
]) {
  if (!home.includes(token)) {
    fail(`homepage is missing ${token}`);
  }
}

if (!robots.includes(expectedRobotsRule)) {
  fail(`robots.txt should include ${expectedRobotsRule}`);
}

if (!robots.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`)) {
  fail("robots.txt should point at the canonical sitemap URL");
}

for (const route of sitemapRoutes) {
  if (!sitemap.includes(`<loc>${canonicalOrigin}${route}</loc>`)) {
    fail(`sitemap is missing ${route}`);
  }
}

if (
  !feed.includes("<rss") ||
  !feed.includes("Florida Property Tax Tracker Updates")
) {
  fail("RSS feed is missing expected channel metadata");
}

if (!manifest.includes('"name": "Florida Property Tax Tracker"')) {
  fail("web manifest is missing the full site name");
}

console.log("SEO validation passed.");
