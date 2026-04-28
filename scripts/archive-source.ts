import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourceId = process.argv[2];

if (!sourceId) {
  console.error('Usage: npm exec tsx scripts/archive-source.ts <source-id>');
  process.exit(1);
}

const sources = JSON.parse(readFileSync(path.join(root, 'data/sources.json'), 'utf8')) as any[];
const source = sources.find((candidate) => candidate.id === sourceId);

if (!source?.url) {
  console.error(`Source not found or has no URL: ${sourceId}`);
  process.exit(1);
}

const response = await fetch(source.url, {
  headers: { 'user-agent': 'FloridaPropertyTaxTracker/0.1 (+static civic tracker)' },
});
if (!response.ok) {
  console.error(`Failed to fetch ${source.url}: ${response.status}`);
  process.exit(1);
}

const buffer = Buffer.from(await response.arrayBuffer());
const contentType = response.headers.get('content-type') ?? '';
const extension = contentType.includes('pdf') || source.url.toLowerCase().endsWith('.pdf') ? 'pdf' : 'html';
const date = new Date().toISOString().slice(0, 10);
const archiveDir = path.join(root, 'public/archive/2026', extension === 'pdf' ? 'pdf' : 'snapshots');
mkdirSync(archiveDir, { recursive: true });
const fileName = `${date}-${source.id}.${extension}`;
const archivePath = path.join(archiveDir, fileName);
writeFileSync(archivePath, buffer);

console.log(
  JSON.stringify(
    {
      source_id: source.id,
      archive_path: `/archive/2026/${extension === 'pdf' ? 'pdf' : 'snapshots'}/${fileName}`,
      sha256: createHash('sha256').update(buffer).digest('hex'),
    },
    null,
    2,
  ),
);
