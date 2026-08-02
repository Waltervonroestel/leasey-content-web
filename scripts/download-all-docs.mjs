import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
}

const TRACKER_SHEET_ID = '1u0luDlk0ALAUNTZuWK181OyrmsomUbPF-2w-YB87QvY';

const auth = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);
auth.setCredentials({ refresh_token: process.env.GOOGLE_SHEETS_REFRESH_TOKEN });

const sheets = google.sheets({ version: 'v4', auth });
const drive = google.drive({ version: 'v3', auth });

// Read tracker
const sheetRes = await sheets.spreadsheets.values.get({
  spreadsheetId: TRACKER_SHEET_ID,
  range: 'A:Z',
});
const rows = sheetRes.data.values;

// Create output dir
const outDir = path.join(__dirname, 'docs-html');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const manifest = [];

for (let i = 1; i < rows.length; i++) {
  const row = rows[i];
  const title = (row[0] || '').trim();
  if (!title || title.startsWith('(DELETED)')) continue;

  let docId = null;
  for (const cell of row) {
    if (!cell) continue;
    const m = cell.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/);
    if (m) { docId = m[1]; break; }
  }
  if (!docId) { console.log(`SKIP (no doc ID): ${title}`); continue; }

  const keyword = (row[5] || '').trim();
  const cell = `E${i + 1}`;

  try {
    const htmlRes = await drive.files.export({ fileId: docId, mimeType: 'text/html' });
    const plainRes = await drive.files.export({ fileId: docId, mimeType: 'text/plain' });

    const slug = title.replace(/[^a-zA-Z0-9]+/g, '_').substring(0, 60).toLowerCase();
    const htmlPath = path.join(outDir, `${slug}.html`);
    const plainPath = path.join(outDir, `${slug}.txt`);

    fs.writeFileSync(htmlPath, htmlRes.data, 'utf-8');
    fs.writeFileSync(plainPath, plainRes.data, 'utf-8');

    const wordCount = plainRes.data.split(/\s+/).filter(w => w.length > 0).length;

    manifest.push({ title, docId, keyword, cell, slug, wordCount, row: i + 1 });
    console.log(`OK: ${title} (${wordCount} words, kw: "${keyword}")`);
  } catch (e) {
    console.error(`FAIL: ${title} — ${e.message}`);
  }
}

// Write manifest
fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf-8');
console.log(`\nDownloaded ${manifest.length} docs. Manifest at docs-html/manifest.json`);
