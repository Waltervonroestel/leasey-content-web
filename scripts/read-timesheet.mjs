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

const id = '1DFQqb9Su_bjhJ7sJicDsUN4PRKhAJRh0blr45DXm-SQ';

// First get all sheet names
const meta = await sheets.spreadsheets.get({ spreadsheetId: id });
console.log('Tabs:', meta.data.sheets.map(s => `${s.properties.title} (gid=${s.properties.sheetId})`).join(', '));

// Find the tab with gid 70172581
const tab = meta.data.sheets.find(s => s.properties.sheetId === 70172581);
const tabName = tab ? tab.properties.title : 'Sheet1';
console.log('Target tab:', tabName);

// Read all data
const res = await sheets.spreadsheets.values.get({
  spreadsheetId: id,
  range: `'${tabName}'!A1:Z200`,
});
const rows = res.data.values || [];
rows.forEach((r, i) => console.log(`${i+1}\t${r.join('\t')}`));
