import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const tmpDir = path.join(root, "tmp");
const cacheDir = path.join(tmpDir, "source-cache");
mkdirSync(cacheDir, { recursive: true });

type WatchItem = { label: string; url: string };
const watchlist = JSON.parse(
  readFileSync(path.join(root, "data/watchlist.json"), "utf8"),
) as Record<string, WatchItem[]>;
const previousManifestPath = path.join(tmpDir, "source-cache-manifest.json");
const previousManifest = (() => {
  try {
    return JSON.parse(readFileSync(previousManifestPath, "utf8")) as Record<
      string,
      string
    >;
  } catch {
    return {};
  }
})();

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/https?:\/\//, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90);
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
    const hash = createHash("sha256").update(buffer).digest("hex");
    const extension =
      contentType.includes("pdf") || source.url.toLowerCase().endsWith(".pdf")
        ? "pdf"
        : "html";
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

writeFileSync(previousManifestPath, JSON.stringify(manifest, null, 2));
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
