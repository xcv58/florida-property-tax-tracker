import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { PDFParse } from 'pdf-parse';

const root = process.cwd();
const reportPath = path.join(root, 'tmp/source-fetch-report.json');
const parsedDir = path.join(root, 'tmp/pdf-text');
const outputPath = path.join(root, 'tmp/pdf-parse-report.json');
mkdirSync(parsedDir, { recursive: true });

if (!existsSync(reportPath)) {
  writeFileSync(outputPath, JSON.stringify({ generated_at: new Date().toISOString(), pdfs: [] }, null, 2));
  console.log('No source fetch report found; wrote empty PDF parse report.');
  process.exit(0);
}

const fetchReport = JSON.parse(readFileSync(reportPath, 'utf8')) as { checked: any[] };
const keywords = [
  'property tax',
  'homestead',
  'non-school',
  'ad valorem',
  'constitutional amendment',
  'Article VII',
  'Article VIII',
  'effective date',
  'January 1, 2027',
  'fiscal impact',
  'county impact',
  'public safety funding',
];
const pdfs: any[] = [];

for (const item of fetchReport.checked.filter((candidate) => candidate.cache_path?.endsWith('.pdf'))) {
  const cachePath = path.join(root, item.cache_path);
  try {
    const parser = new PDFParse({ data: readFileSync(cachePath) });
    const result = await parser.getText();
    await parser.destroy();
    const text = result.text;
    const textPath = path.join(parsedDir, `${path.basename(item.cache_path, '.pdf')}.txt`);
    writeFileSync(textPath, text);
    pdfs.push({
      label: item.label,
      url: item.url,
      text_path: path.relative(root, textPath),
      keyword_hits: keywords.filter((keyword) => text.toLowerCase().includes(keyword.toLowerCase())),
      text_length: text.length,
    });
  } catch (error) {
    pdfs.push({
      label: item.label,
      url: item.url,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

writeFileSync(outputPath, JSON.stringify({ generated_at: new Date().toISOString(), pdfs }, null, 2));
console.log(`Parsed ${pdfs.filter((pdf) => !pdf.error).length} PDF(s); ${pdfs.filter((pdf) => pdf.error).length} error(s).`);
