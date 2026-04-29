import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { load } from "cheerio";

const root = process.cwd();
const tmpDir = path.join(root, "tmp");
const cacheDir = path.join(tmpDir, "source-cache");
const reportsDir = path.join(root, "reports");
mkdirSync(cacheDir, { recursive: true });
mkdirSync(reportsDir, { recursive: true });

type WatchItem = { label: string; url: string };
const watchlist = JSON.parse(
  readFileSync(path.join(root, "data/watchlist.json"), "utf8"),
) as Record<string, WatchItem[]>;
const tmpManifestPath = path.join(tmpDir, "source-cache-manifest.json");
const persistentManifestPath = path.join(
  reportsDir,
  "source-cache-manifest.json",
);

function readManifest(filePath: string) {
  try {
    return JSON.parse(readFileSync(filePath, "utf8")) as Record<string, string>;
  } catch {
    return {};
  }
}

const previousManifest = Object.keys(readManifest(persistentManifestPath))
  .length
  ? readManifest(persistentManifestPath)
  : readManifest(tmpManifestPath);

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/https?:\/\//, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90);
}

function hashContent(content: Buffer | string): string {
  return createHash("sha256").update(content).digest("hex");
}

function normalizeVolatileText(value: string): string {
  return value.replace(
    /\/cdn-cgi\/l\/email-protection#[a-f0-9]+/gi,
    "/cdn-cgi/l/email-protection#redacted",
  );
}

function comparableHtml(html: string): string {
  const $ = load(html);
  $("script, style, noscript, svg, iframe").remove();

  const bodyText = normalizeVolatileText(
    $("body").text().replace(/\s+/g, " ").trim(),
  );
  const links = $("a")
    .map((_, element) => {
      const text = $(element).text().replace(/\s+/g, " ").trim();
      const href = normalizeVolatileText($(element).attr("href") ?? "");
      return `${text} ${href}`.trim();
    })
    .get()
    .filter(Boolean)
    .join("\n");

  return `${bodyText}\n\n${links}`.trim();
}

const sources = Object.entries(watchlist).flatMap(([category, items]) =>
  items.map((item) => ({ ...item, category })),
);
const manifest: Record<string, string> = {};
const checked: any[] = [];
const changed: any[] = [];
const errors: any[] = [];

for (const source of sources) {
  const startedAt = new Date().toISOString();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const response = await fetch(source.url, {
      headers: {
        "user-agent": "FloridaPropertyTaxTracker/0.1 (+static civic tracker)",
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const contentType = response.headers.get("content-type") ?? "";
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const extension =
      contentType.includes("pdf") || source.url.toLowerCase().endsWith(".pdf")
        ? "pdf"
        : "html";
    const rawHash = hashContent(buffer);
    const hash =
      extension === "html"
        ? hashContent(comparableHtml(buffer.toString("utf8")))
        : rawHash;
    const fileName = `${slugify(source.label || source.url)}.${extension}`;
    const cachePath = path.join(cacheDir, fileName);
    writeFileSync(cachePath, buffer);
    manifest[source.url] = hash;

    const changedSinceLastRun =
      previousManifest[source.url] !== undefined &&
      previousManifest[source.url] !== hash;
    const record = {
      ...source,
      status: response.status,
      ok: response.ok,
      content_type: contentType,
      hash,
      raw_hash: rawHash,
      hash_strategy:
        extension === "html" ? "normalized_html_text_and_links" : "raw_bytes",
      changed_since_last_run: changedSinceLastRun,
      cache_path: path.relative(root, cachePath),
      checked_at: startedAt,
    };
    checked.push(record);
    if (changedSinceLastRun) changed.push(record);
  } catch (error) {
    errors.push({
      ...source,
      checked_at: startedAt,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

const report = {
  generated_at: new Date().toISOString(),
  sources_checked: checked.length,
  sources_changed: changed.length,
  errors,
  checked,
  changed,
};

writeFileSync(tmpManifestPath, JSON.stringify(manifest, null, 2));
writeFileSync(persistentManifestPath, JSON.stringify(manifest, null, 2));
writeFileSync(
  path.join(tmpDir, "source-fetch-report.json"),
  JSON.stringify(report, null, 2),
);

if (errors.length) {
  console.warn(
    `Fetched ${checked.length} source(s) with ${errors.length} error(s).`,
  );
  errors.forEach((error) => console.warn(`- ${error.label}: ${error.error}`));
  if (process.env.STRICT_FETCH_FAILURES === "true") process.exit(1);
}

console.log(
  `Fetched ${checked.length} source(s); ${changed.length} changed since the previous run.`,
);
