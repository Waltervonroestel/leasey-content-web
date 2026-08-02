import { readFileSync } from 'fs';
import { google } from 'googleapis';

const envFile = readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(l => {
  const m = l.match(/^([^#=]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim();
});

const o = new google.auth.OAuth2(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET);
o.setCredentials({ refresh_token: env.GOOGLE_SHEETS_REFRESH_TOKEN });
const sheets = google.sheets({ version: 'v4', auth: o });

const SHEET_ID = '1u0luDlk0ALAUNTZuWK181OyrmsomUbPF-2w-YB87QvY';

const priorityDoc = 'https://docs.google.com/document/d/1WISto7HKZI371P3QSTP6_PwNs6djCxotXRqBJA7_CDo/edit';
const secondaryDoc = 'https://docs.google.com/document/d/1JkNmoNY7ROlRatkW7hEzZpWvfGS3D3G7o09Meh_YUXg/edit';
const combinedDoc = 'https://docs.google.com/document/d/1Ap8QCgzTJ8xiRX0iwSQVfDRVZDhf5K-sxmoqcSRWfDw/edit';

// Rows 17-27 in the sheet (0-indexed: 16-26), column E = index 4
// Row 17: Leasing Overhead Calculator (P2 priority)
// Row 18: Showing Schedule Builder (P2 priority)
// Row 19: Move-In Checklist Builder (P2 priority)
// Row 20: Tenant Application Risk Scorer (P2 priority)
// Row 21: Reference Check Question Generator (P2 priority)
// Row 22: Showing Confirmation Message Generator (P3 secondary)
// Row 23: Vacancy Reactivation Checklist (P3 secondary)
// Row 24: Rental Inquiry Response Time Calculator (P3 secondary)
// Row 25: Leasing Funnel Conversion Calculator (P3 secondary)
// Row 26: Rental Listing Quality Scorer (P3 secondary)
// Row 27: Leasing Operations Assessment COMBINED (P3 combined)

const links = [
  priorityDoc,   // row 17
  priorityDoc,   // row 18
  priorityDoc,   // row 19
  priorityDoc,   // row 20
  priorityDoc,   // row 21
  secondaryDoc,  // row 22
  secondaryDoc,  // row 23
  secondaryDoc,  // row 24
  secondaryDoc,  // row 25
  secondaryDoc,  // row 26
  combinedDoc,   // row 27
];

const statuses = links.map(() => 'SEO + CTA Written');

// Update links (column E, rows 17-27)
await sheets.spreadsheets.values.update({
  spreadsheetId: SHEET_ID,
  range: 'Sheet1!E17:E27',
  valueInputOption: 'RAW',
  requestBody: { values: links.map(l => [l]) },
});
console.log('Links updated');

// Update status (column B, rows 17-27)
await sheets.spreadsheets.values.update({
  spreadsheetId: SHEET_ID,
  range: 'Sheet1!B17:B27',
  valueInputOption: 'RAW',
  requestBody: { values: statuses.map(s => [s]) },
});
console.log('Statuses updated');

// Change color from blue to green for these rows
const ssInfo = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
const sid = ssInfo.data.sheets[0].properties.sheetId;

const requests = [];
for (let i = 16; i < 27; i++) {
  requests.push({
    repeatCell: {
      range: { sheetId: sid, startRowIndex: i, endRowIndex: i + 1, startColumnIndex: 0, endColumnIndex: 7 },
      cell: { userEnteredFormat: { backgroundColor: { red: 0.85, green: 0.95, blue: 0.85 } } },
      fields: 'userEnteredFormat.backgroundColor'
    }
  });
}

await sheets.spreadsheets.batchUpdate({
  spreadsheetId: SHEET_ID,
  requestBody: { requests },
});
console.log('Colors updated to green');
console.log('Done!');
