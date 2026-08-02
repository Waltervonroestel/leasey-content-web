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

const id = '1g5HW6gK1jfJdlt8U6E13KAQ75z5gax5uw3j1f-ia1dI';
const map = JSON.parse(fs.readFileSync('C:/Users/wally/AppData/Local/Temp/claude/C--Users-wally-claude-code-app/07855119-49e9-4618-bd86-b88ac36d89ac/scratchpad/urlcat.json', 'utf8'));

// 1) duplicate the "Optimizacion de contenido" tab
const dup = await sheets.spreadsheets.batchUpdate({
  spreadsheetId: id,
  requestBody: { requests: [{ duplicateSheet: { sourceSheetId: 1683936252, newSheetName: 'Optimizacion + Clusters (Daniel)' } }] },
});
const np = dup.data.replies[0].duplicateSheet.properties;
const newTitle = np.title, newSheetId = np.sheetId;
console.log('Duplicated ->', newTitle, 'sheetId', newSheetId);

// 2) read URLs (column A) of the new tab
const got = await sheets.spreadsheets.values.get({ spreadsheetId: id, range: `${newTitle}!A1:A248` });
const col = got.data.values || [];

// 3) build the cluster column aligned to each row
const out = [['Cluster (Blog Category)']];
let matched = 0;
for (let i = 1; i < col.length; i++) {
  const url = ((col[i] && col[i][0]) || '').trim();
  const cat = url && map[url] !== undefined ? map[url] : '';
  if (cat) matched++;
  out.push([cat]);
}

// 4) write into column N (keeps clear of the 12 existing data columns)
await sheets.spreadsheets.values.update({
  spreadsheetId: id,
  range: `${newTitle}!N1:N${out.length}`,
  valueInputOption: 'RAW',
  requestBody: { values: out },
});
console.log(`Wrote cluster for ${matched} URLs into column N of "${newTitle}".`);
console.log('Open: https://docs.google.com/spreadsheets/d/' + id + '/edit#gid=' + newSheetId);
