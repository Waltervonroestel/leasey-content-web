import { google } from 'googleapis';
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
env.split('\n').forEach(l => { const m = l.match(/^([^#=]+)=(.*)$/); if (m) process.env[m[1].trim()] = m[2].trim(); });
const auth = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
auth.setCredentials({ refresh_token: process.env.GOOGLE_SHEETS_REFRESH_TOKEN });
const sheets = google.sheets({ version: 'v4', auth });
const SID = '1M68a-2T0Js4TulilcpXRkjP0Ti--Pg_f_oTdyDP-XU8';
const res = await sheets.spreadsheets.get({
  spreadsheetId: SID,
  ranges: ['A1:H10'],
  fields: 'sheets(properties(title,sheetId),data(rowData(values(formattedValue,hyperlink))))',
});
for (const sh of res.data.sheets) {
  const title = sh.properties.title;
  const rows = sh.data?.[0]?.rowData || [];
  if (!rows.length) continue;
  console.log(`\n=== TAB: ${title} (gid ${sh.properties.sheetId}) ===`);
  rows.forEach((r, i) => {
    const cells = (r.values || []).map(v => ({ t: v.formattedValue || '', h: v.hyperlink || '' }));
    if (!cells.some(c => c.t || c.h)) return;
    console.log(`Row ${i+1}: ` + cells.map(c => c.h ? `${c.t} <${c.h}>` : c.t).join(' | '));
  });
  break; // first sheet with data is enough
}
