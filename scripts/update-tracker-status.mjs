import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
env.split('\n').forEach(l => { const m = l.match(/^([^#=]+)=(.*)$/); if (m) process.env[m[1].trim()] = m[2].trim(); });

const auth = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
auth.setCredentials({ refresh_token: process.env.GOOGLE_SHEETS_REFRESH_TOKEN });
const sheets = google.sheets({ version: 'v4', auth });

const TRACKER_SHEET_ID = '1u0luDlk0ALAUNTZuWK181OyrmsomUbPF-2w-YB87QvY';

// Rows 2-16 (docs 1-15) + row 27 (Leasing Operations Assessment) → 88% compliant
// Rows 17-26 (10 tools) → keep as "SEO + CTA Written" but note needs separation
const updates = [];

// 16 main docs at 88%
for (let row = 2; row <= 16; row++) {
  updates.push({ range: `B${row}`, values: [['SEO Compliant (88%)']] });
  updates.push({ range: `C${row}`, values: [['Add images (R16) + break long paragraph (R11)']] });
}
// Leasing Operations Assessment row 27
updates.push({ range: `B27`, values: [['SEO Compliant (88%)']] });
updates.push({ range: `C27`, values: [['Add images (R16) + break long paragraph (R11)']] });

// 10 tools rows 17-26
for (let row = 17; row <= 26; row++) {
  updates.push({ range: `C${row}`, values: [['Needs separation into individual docs + word count fix']] });
}

await sheets.spreadsheets.values.batchUpdate({
  spreadsheetId: TRACKER_SHEET_ID,
  requestBody: {
    valueInputOption: 'RAW',
    data: updates,
  },
});

console.log(`Updated ${updates.length} cells in tracker.`);
