import { readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const banned = ['scam', 'sham', 'radical', 'fake', 'guaranteed', 'will pass', 'must pass', 'tax grab', 'giveaway'];
const discouraged = ['recently', 'clearly proves', 'obviously'];
const files = [
  'data/status.json',
  'data/claims.json',
  'data/timeline.json',
  'data/proposals.json',
  'data/counties.json',
  'content/methodology.md',
  'content/about.md',
  'content/correction-policy.md',
];

const errors: string[] = [];
const warnings: string[] = [];

files.forEach((file) => {
  const text = readFileSync(path.join(root, file), 'utf8').toLowerCase();
  banned.forEach((phrase) => {
    const pattern = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (pattern.test(text)) errors.push(`${file} contains banned phrase: "${phrase}"`);
  });
  discouraged.forEach((phrase) => {
    const pattern = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (pattern.test(text)) warnings.push(`${file} contains discouraged phrase: "${phrase}"`);
  });
});

warnings.forEach((warning) => console.warn(`Warning: ${warning}`));

if (errors.length) {
  console.error('Proofreading failed:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Proofreading passed with ${warnings.length} warning(s).`);
