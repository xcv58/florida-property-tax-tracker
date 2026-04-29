import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const reportsDir = path.join(root, "reports");
mkdirSync(reportsDir, { recursive: true });

function readOptional(file: string) {
  const filePath = path.join(root, file);
  if (!existsSync(filePath)) return null;
  return JSON.parse(readFileSync(filePath, "utf8"));
}

const sourceFetch = readOptional("tmp/source-fetch-report.json");
const officialPages = readOptional("tmp/official-page-parse.json");
const pdfs = readOptional("tmp/pdf-parse-report.json");
const claimUpdates = readOptional("tmp/claim-update-report.json");
const latestUpdate = JSON.parse(
  readFileSync(path.join(root, "data/update-log.json"), "utf8"),
)[0];

const report = {
  generated_at: new Date().toISOString(),
  source_fetch: sourceFetch,
  official_pages: officialPages,
  pdfs,
  claim_updates: claimUpdates,
  latest_update_log_entry: latestUpdate,
  build_status: "not run by generate-report",
  deployment_status: "handled by hosting workflow",
};

const markdown = `# Latest Tracker Update

Generated: ${report.generated_at}

## Sources Checked

${sourceFetch ? sourceFetch.sources_checked : 0}

## Sources Changed

${sourceFetch ? sourceFetch.sources_changed : 0}

## Claims

- Added: ${claimUpdates?.claims_added?.length ?? 0}
- Updated: ${claimUpdates?.claims_updated?.length ?? 0}
- Needs review: ${claimUpdates?.claims_needing_review?.length ?? 0}

## Latest Update Log Entry

${latestUpdate?.date ?? "Not available"}
`;

writeFileSync(
  path.join(reportsDir, "latest-update.json"),
  JSON.stringify(report, null, 2),
);
writeFileSync(path.join(reportsDir, "latest-update.md"), markdown);
console.log(
  "Reports written to reports/latest-update.md and reports/latest-update.json.",
);
