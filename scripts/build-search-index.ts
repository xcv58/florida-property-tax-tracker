import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const publicDir = path.join(root, 'public');
mkdirSync(publicDir, { recursive: true });

function readJson<T>(file: string): T {
  return JSON.parse(readFileSync(path.join(root, file), 'utf8')) as T;
}

const index = {
  generated_at: new Date().toISOString(),
  counties: readJson<any[]>('data/counties.json').map((county) => ({
    title: county.county,
    type: 'county',
    text: `${county.county} ${county.proposal_version} ${county.source_type ?? ''} ${county.notes}`,
  })),
  sources: readJson<any[]>('data/sources.json').map((source) => ({
    title: source.title,
    type: 'source',
    text: `${source.id} ${source.title} ${source.publisher} ${source.source_type}`,
  })),
  proposals: readJson<any[]>('data/proposals.json').map((proposal) => ({
    title: proposal.name,
    type: 'proposal',
    text: `${proposal.name} ${proposal.title} ${proposal.status} ${proposal.current_relevance}`,
  })),
  timeline: readJson<any[]>('data/timeline.json').map((item) => ({
    title: item.title,
    type: 'timeline',
    text: `${item.date} ${item.title} ${item.summary} ${item.importance}`,
  })),
};

writeFileSync(path.join(publicDir, 'search-index.json'), JSON.stringify(index, null, 2));
console.log('Search index written to public/search-index.json.');
