import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const tmpDir = path.join(root, 'tmp');
mkdirSync(tmpDir, { recursive: true });

const report = {
  generated_at: new Date().toISOString(),
  mode: 'deterministic-first-pass',
  claims_added: [],
  claims_updated: [],
  claims_needing_review: [],
  notes: [
    'No automatic claim mutation is enabled yet.',
    'Future parser rules should create proposed changes and mark ambiguous updates as needs_review.',
  ],
};

writeFileSync(path.join(tmpDir, 'claim-update-report.json'), JSON.stringify(report, null, 2));
console.log('Claim update report generated; no claim mutations applied.');
