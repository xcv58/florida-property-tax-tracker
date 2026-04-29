import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

function readJson<T>(filePath: string): T {
  return JSON.parse(readFileSync(path.join(root, filePath), "utf8")) as T;
}

type Source = {
  id: string;
  title: string;
  url: string | null;
  archive_path: string | null;
  source_type: string;
  publisher: string;
  published_date: string | null;
  accessed_date: string;
};

type Claim = {
  id: string;
  claim: string;
  claim_type: string;
  date: string;
  status: string;
  source_ids: string[];
  last_verified: string;
};

const sources = readJson<Source[]>("data/sources.json");
const claims = readJson<Claim[]>("data/claims.json");
const status = readJson<any>("data/status.json");
const overview = readJson<any>("data/overview.json");
const timeline = readJson<any[]>("data/timeline.json");
const proposals = readJson<any[]>("data/proposals.json");
const counties = readJson<any[]>("data/counties.json");
const updateLog = readJson<any[]>("data/update-log.json");

const errors: string[] = [];
const warnings: string[] = [];
let countiesWithoutEstimates = 0;
const sourceIds = new Set(sources.map((source) => source.id));
const claimIds = new Set(claims.map((claim) => claim.id));
const validSourceTypes = new Set([
  "official_legislative",
  "official_election",
  "official_fiscal",
  "official_executive",
  "local_government",
  "stakeholder",
  "news",
  "analysis",
  "other",
]);
const validClaimStatuses = new Set([
  "confirmed",
  "likely",
  "disputed",
  "outdated",
  "retired",
  "needs_review",
]);
const validProposalStatuses = new Set([
  "active",
  "dead",
  "replaced",
  "dormant",
  "watching",
  "historical_context_only",
  "needs_review",
]);
const validTimelineCategories = new Set([
  "legislative",
  "executive",
  "budget",
  "ballot",
  "fiscal",
  "county",
  "stakeholder",
  "media",
  "other",
]);
const validOverviewStatuses = new Set([
  "completed",
  "watching",
  "blocked",
  "not_started",
]);
const bannedLanguage = [
  "scam",
  "sham",
  "radical",
  "fake",
  "guaranteed",
  "will pass",
  "must pass",
  "tax grab",
  "giveaway",
];

function isIsoDate(value: string | null | undefined): boolean {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function checkSourceIds(owner: string, ids: string[] = []) {
  ids.forEach((id) => {
    if (!sourceIds.has(id))
      errors.push(`${owner} references missing source ID: ${id}`);
  });
}

function checkClaimIds(owner: string, ids: string[] = []) {
  ids.forEach((id) => {
    if (!claimIds.has(id))
      errors.push(`${owner} references missing claim ID: ${id}`);
  });
}

function scanBannedLanguage(owner: string, value: unknown) {
  const text = JSON.stringify(value).toLowerCase();
  bannedLanguage.forEach((phrase) => {
    const pattern = new RegExp(
      `\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
      "i",
    );
    if (pattern.test(text))
      errors.push(`${owner} contains banned advocacy language: "${phrase}"`);
  });
}

sources.forEach((source) => {
  if (!source.id) errors.push("Source is missing id");
  if (!source.title) errors.push(`${source.id} is missing title`);
  if (!source.url && !source.archive_path)
    errors.push(`${source.id} needs either url or archive_path`);
  if (!validSourceTypes.has(source.source_type))
    errors.push(`${source.id} has invalid source_type: ${source.source_type}`);
  if (!source.publisher) errors.push(`${source.id} is missing publisher`);
  if (!isIsoDate(source.accessed_date))
    errors.push(`${source.id} is missing ISO accessed_date`);
  if (!source.archive_path) warnings.push(`${source.id} has no archived copy`);
  if (source.archive_path) {
    const archiveDiskPath = path.join(
      root,
      "public",
      source.archive_path.replace(/^\//, ""),
    );
    if (!existsSync(archiveDiskPath))
      errors.push(
        `${source.id} references missing archive file: ${source.archive_path}`,
      );
  }
});

claims.forEach((claim) => {
  if (!claim.source_ids?.length) errors.push(`${claim.id} has no source_ids`);
  checkSourceIds(`Claim ${claim.id}`, claim.source_ids);
  if (!validClaimStatuses.has(claim.status))
    errors.push(`${claim.id} has invalid status: ${claim.status}`);
  if (claim.status === "confirmed" && !claim.source_ids?.length)
    errors.push(`${claim.id} is confirmed without sources`);
  if (!isIsoDate(claim.date)) errors.push(`${claim.id} is missing ISO date`);
  if (!isIsoDate(claim.last_verified))
    errors.push(`${claim.id} is missing ISO last_verified`);
});

if (!isIsoDate(status.last_verified))
  errors.push("status.last_verified must be an ISO date");
checkClaimIds("status.claim_ids", status.claim_ids);
status.sentence_claim_ids?.forEach((entry: any) => {
  if (!status[entry.field]?.includes(entry.sentence)) {
    errors.push(
      `status sentence mapping does not match field text: ${entry.sentence}`,
    );
  }
  checkClaimIds(`status sentence "${entry.sentence}"`, entry.claim_ids);
});
["current_status_summary", "latest_update", "expected_next"].forEach(
  (field) => {
    const sentences = String(status[field] ?? "")
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sentence.trim())
      .filter(Boolean);
    sentences.forEach((sentence) => {
      const hasMapping = status.sentence_claim_ids?.some(
        (entry: any) => entry.field === field && entry.sentence === sentence,
      );
      if (!hasMapping)
        errors.push(
          `status.${field} sentence lacks claim mapping: ${sentence}`,
        );
    });
  },
);

timeline.forEach((item) => {
  if (!isIsoDate(item.date)) errors.push(`${item.id} is missing ISO date`);
  if (!item.source_ids?.length) errors.push(`${item.id} has no source_ids`);
  checkSourceIds(`Timeline ${item.id}`, item.source_ids);
  checkClaimIds(`Timeline ${item.id}`, item.claim_ids);
  if (!validTimelineCategories.has(item.category))
    errors.push(`${item.id} has invalid category: ${item.category}`);
});

proposals.forEach((proposal) => {
  if (!proposal.source_ids?.length)
    errors.push(`${proposal.id} has no source_ids`);
  checkSourceIds(`Proposal ${proposal.id}`, proposal.source_ids);
  checkClaimIds(`Proposal ${proposal.id}`, proposal.claim_ids);
  if (!validProposalStatuses.has(proposal.status))
    errors.push(`${proposal.id} has invalid status: ${proposal.status}`);
  if (!isIsoDate(proposal.last_action_date))
    errors.push(`${proposal.id} is missing ISO last_action_date`);
  if (proposal.status === "active") {
    const hasOfficialLegislativeSource = proposal.source_ids.some(
      (id: string) => {
        const source = sources.find((candidate) => candidate.id === id);
        return source?.source_type === "official_legislative";
      },
    );
    if (!hasOfficialLegislativeSource)
      errors.push(
        `${proposal.id} is active without official legislative source`,
      );
  }
  if (
    proposal.status === "dead" &&
    /currently active/i.test(proposal.current_relevance)
  ) {
    errors.push(`${proposal.id} is dead but described as currently active`);
  }
});

counties.forEach((county) => {
  if (!county.county) errors.push("County row is missing county name");
  if (!isIsoDate(county.last_verified))
    errors.push(`${county.county} is missing ISO last_verified`);
  if (county.estimated_impact !== null && !county.source_ids?.length) {
    errors.push(`${county.county} has an estimate without source_ids`);
  }
  checkSourceIds(`County ${county.county}`, county.source_ids);
  if (county.estimated_impact === null) countiesWithoutEstimates += 1;
});

if (countiesWithoutEstimates) {
  warnings.push(
    `${countiesWithoutEstimates} county row(s) have no county impact estimate`,
  );
}

updateLog.forEach((entry) => {
  if (!isIsoDate(entry.date))
    errors.push(`Update log entry has invalid date: ${entry.date}`);
  checkSourceIds(`Update log ${entry.date}`, entry.source_ids_added ?? []);
  checkClaimIds(`Update log ${entry.date}`, entry.claims_added ?? []);
});

scanBannedLanguage("data/status.json", status);
overview.brief && checkClaimIds("overview.brief", overview.brief.claim_ids);
overview.brief && checkSourceIds("overview.brief", overview.brief.source_ids);
if (overview.monthly_runway) {
  if (!isIsoDate(overview.monthly_runway.as_of))
    errors.push("overview.monthly_runway.as_of must be an ISO date");
  checkSourceIds("overview.monthly_runway", overview.monthly_runway.source_ids);
  overview.monthly_runway.months?.forEach((item: any) => {
    if (!item.id) errors.push("Overview monthly runway item is missing id");
    if (!validOverviewStatuses.has(item.status))
      errors.push(
        `${item.id} has invalid monthly runway status: ${item.status}`,
      );
    checkSourceIds(`Overview monthly runway ${item.id}`, item.source_ids);
    checkClaimIds(`Overview monthly runway ${item.id}`, item.claim_ids);
  });
}
overview.path_steps?.forEach((step: any) => {
  if (!step.id) errors.push("Overview path step is missing id");
  if (!validOverviewStatuses.has(step.status))
    errors.push(`${step.id} has invalid overview status: ${step.status}`);
  checkSourceIds(`Overview path step ${step.id}`, step.source_ids);
  checkClaimIds(`Overview path step ${step.id}`, step.claim_ids);
});
overview.next_panels?.forEach((panel: any) => {
  if (!validOverviewStatuses.has(panel.status))
    errors.push(`${panel.label} has invalid overview status: ${panel.status}`);
  checkSourceIds(`Overview panel ${panel.label}`, panel.source_ids);
  checkClaimIds(`Overview panel ${panel.label}`, panel.claim_ids);
});
scanBannedLanguage("data/overview.json", overview);
scanBannedLanguage("data/claims.json", claims);
scanBannedLanguage("data/timeline.json", timeline);
scanBannedLanguage("data/proposals.json", proposals);

warnings.forEach((warning) => console.warn(`Warning: ${warning}`));

if (errors.length) {
  console.error("Data validation failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Data validation passed with ${warnings.length} warning(s).`);
