// Creates 3 Google Docs under the walter@leasey.ai account (GOOGLE_SHEETS_REFRESH_TOKEN)
// by uploading HTML content from temp files, then shares them and updates the tracker sheet.
import { readFileSync } from 'fs';
import { google } from 'googleapis';
import { Readable } from 'stream';

// Load env
const envFile = readFileSync('.env.local', 'utf8');
envFile.split('\n').forEach(l => {
  const m = l.match(/^([^#=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim();
});

const o = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
o.setCredentials({ refresh_token: process.env.GOOGLE_SHEETS_REFRESH_TOKEN });
const drive = google.drive({ version: 'v3', auth: o });
const sheets = google.sheets({ version: 'v4', auth: o });

const TRACKER_ID = '1u0luDlk0ALAUNTZuWK181OyrmsomUbPF-2w-YB87QvY';

const DOCS = [
  {
    title: 'Leasey.AI — Tool SEO Text + CTAs (Priority Tools)',
    tempFile: String.raw`C:\Users\wally\.claude\projects\C--Users-wally-claude-code-app\07855119-49e9-4618-bd86-b88ac36d89ac\tool-results\mcp-dac33fa0-75e0-40d4-9768-f59da185f9c7-download_file_content-1784057515671.txt`,
    trackerRows: [17, 18, 19, 20, 21], // rows to fill with this doc link
  },
  {
    title: 'Leasey.AI — Tool SEO Text + CTAs (Secondary Tools)',
    tempFile: String.raw`C:\Users\wally\.claude\projects\C--Users-wally-claude-code-app\07855119-49e9-4618-bd86-b88ac36d89ac\tool-results\mcp-dac33fa0-75e0-40d4-9768-f59da185f9c7-download_file_content-1784057520491.txt`,
    trackerRows: [22, 23, 24, 25, 26],
  },
  {
    title: 'Leasey.AI — Leasing Operations Assessment (Combined Tool)',
    tempFile: null, // will be fetched via the same pattern but we need MCP - handle below
    trackerRows: [27],
  },
];

async function createDocFromHtml(title, htmlContent) {
  // Upload HTML as Google Doc (auto-convert)
  const res = await drive.files.create({
    requestBody: {
      name: title,
      mimeType: 'application/vnd.google-apps.document',
    },
    media: {
      mimeType: 'text/html',
      body: Readable.from(Buffer.from(htmlContent, 'utf8')),
    },
    fields: 'id,webViewLink',
  });
  return { id: res.data.id, link: res.data.webViewLink };
}

async function shareAsWriter(fileId) {
  await drive.permissions.create({
    fileId,
    requestBody: { role: 'writer', type: 'anyone' },
  });
}

async function main() {
  const results = [];

  for (const doc of DOCS) {
    if (!doc.tempFile) {
      console.log(`SKIP: ${doc.title} — no temp file (Combined Tool needs MCP download)`);
      results.push({ ...doc, id: null, link: null });
      continue;
    }

    console.log(`Reading: ${doc.title}...`);
    const raw = readFileSync(doc.tempFile, 'utf8');
    const json = JSON.parse(raw);
    const html = Buffer.from(json.content, 'base64').toString('utf8');
    console.log(`  HTML size: ${html.length} chars`);

    console.log(`Creating doc...`);
    const { id, link } = await createDocFromHtml(doc.title, html);
    console.log(`  Created: ${id}`);
    console.log(`  Link: ${link}`);

    console.log(`Sharing as anyone=writer...`);
    await shareAsWriter(id);
    console.log(`  Shared OK`);

    results.push({ ...doc, id, link });
  }

  // Update tracker sheet column E for relevant rows
  // Rows 17-27 → sheet rows are 1-indexed, so range E17:E27
  // We need to build the values array
  const values = [];
  for (let row = 17; row <= 27; row++) {
    const match = results.find(r => r.trackerRows.includes(row));
    if (match && match.link) {
      values.push([match.link]);
    } else {
      values.push(['']); // leave empty if no link
    }
  }

  console.log('\nUpdating tracker sheet E17:E27...');
  await sheets.spreadsheets.values.update({
    spreadsheetId: TRACKER_ID,
    range: 'E17:E27',
    valueInputOption: 'RAW',
    requestBody: { values },
  });
  console.log('Tracker updated.');

  console.log('\n=== SUMMARY ===');
  for (const r of results) {
    console.log(`${r.title}: ${r.link || 'SKIPPED'}`);
  }
}

main().catch(e => { console.error('ERROR:', e.message, e.stack); process.exit(1); });
