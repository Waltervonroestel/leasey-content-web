import { google } from 'googleapis';
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
env.split('\n').forEach(l => { const m = l.match(/^([^#=]+)=(.*)$/); if (m) process.env[m[1].trim()] = m[2].trim(); });
const auth = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
auth.setCredentials({ refresh_token: process.env.GOOGLE_SHEETS_REFRESH_TOKEN });
const sheets = google.sheets({ version: 'v4', auth });
const SID = '1M68a-2T0Js4TulilcpXRkjP0Ti--Pg_f_oTdyDP-XU8';
const D = 'https://docs.google.com/document/d/';
const col = [
  ['Structure Doc v2 (feedback Daniel/Alejandra)'],
  [`${D}1uno2po4JkeRowHl7LQrSHqj-LToyS9peEoC3F1IxA2g/edit`],
  [`${D}1kivzZY7-XARY2o3KQsamav9Fzz3pXS4Txc31Ik0E3mc/edit`],
  [`${D}1frQK6B33DLs4ny73wjeHwKlkLVRijuqklXw-BQt1Yys/edit`],
  [`${D}1MXm3jfqu0jaqHMRYOS5JBxPVmxkDti4CMssZfv5u_pE/edit`],
  [`${D}14bovnOAPp-zuZf354BNojXqFrBxZUGUVTlyZpMwUzEY/edit`],
];
await sheets.spreadsheets.values.update({
  spreadsheetId: SID, range: 'I1:I6', valueInputOption: 'RAW', requestBody: { values: col },
});
console.log('Added Structure Doc v2 column (I1:I6) to the tracker.');
