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

const res = await sheets.spreadsheets.values.get({
  spreadsheetId: TRACKER_SHEET_ID,
  range: 'A:Z',
});

const rows = res.data.values;
console.log('Header:', JSON.stringify(rows[0]));
console.log(`\nTotal rows: ${rows.length - 1}\n`);
for (let i = 0; i < rows.length; i++) {
  const r = rows[i];
  console.log(`Row ${i+1}: ${(r[0]||'').padEnd(45)} | Status: ${(r[1]||'').padEnd(15)} | KW: ${(r[5]||'').substring(0,30)}`);
}
