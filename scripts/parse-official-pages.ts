import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';

const root = process.cwd();
const reportPath = path.join(root, 'tmp/source-fetch-report.json');
const outputPath = path.join(root, 'tmp/official-page-parse.json');

if (!existsSync(reportPath)) {
  writeFileSync(outputPath, JSON.stringify({ generated_at: new Date().toISOString(), pages: [] }, null, 2));
  console.log('No source fetch report found; wrote empty official page parse report.');
  process.exit(0);
}

const fetchReport = JSON.parse(readFileSync(reportPath, 'utf8')) as { checked: any[] };
const pages = fetchReport.checked
  .filter((item) => item.cache_path?.endsWith('.html'))
  .map((item) => {
    const html = readFileSync(path.join(root, item.cache_path), 'utf8');
    const $ = cheerio.load(html);
    const text = $('body').text().replace(/\s+/g, ' ').trim();
    return {
      label: item.label,
      url: item.url,
      title: $('title').text().trim() || $('h1').first().text().trim(),
      headings: $('h1,h2,h3')
        .toArray()
        .map((heading) => $(heading).text().replace(/\s+/g, ' ').trim())
        .filter(Boolean)
        .slice(0, 20),
      mentions_property_tax: /property tax|ad valorem|homestead/i.test(text),
      mentions_special_session: /special session/i.test(text),
      text_sample: text.slice(0, 1200),
    };
  });

writeFileSync(outputPath, JSON.stringify({ generated_at: new Date().toISOString(), pages }, null, 2));
console.log(`Parsed ${pages.length} cached official page(s).`);
