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
const drive = google.drive({ version: 'v3', auth: o });

const TRACKER_ID = '1u0luDlk0ALAUNTZuWK181OyrmsomUbPF-2w-YB87QvY';

// ── STEP 1: Fix existing tracker (Action Required column C, rows 17-27) ──
const actions = [
  ['Contextual CTA after results + 600w SEO body text — see Google Doc'],  // 17 Leasing Overhead
  ['Contextual CTA after results + 600w SEO body text — see Google Doc'],  // 18 Showing Schedule
  ['Contextual CTA after results + 600w SEO body text — see Google Doc'],  // 19 Move-In Checklist
  ['Contextual CTA after results + 600w SEO body text — see Google Doc'],  // 20 Tenant App Risk
  ['Contextual CTA after results + 600w SEO body text — see Google Doc'],  // 21 Reference Check
  ['Contextual CTA after results + 600w SEO body text — see Google Doc'],  // 22 Showing Confirmation
  ['Contextual CTA after results + 600w SEO body text — see Google Doc'],  // 23 Vacancy Reactivation
  ['Contextual CTA after results + 600w SEO body text — see Google Doc'],  // 24 Inquiry Response Time
  ['Contextual CTA after results + 600w SEO body text — see Google Doc'],  // 25 Funnel Conversion
  ['Contextual CTA after results + 600w SEO body text — see Google Doc'],  // 26 Listing Quality
  ['Merge Gap Finder + Readiness Audit into one assessment — see Google Doc'],  // 27 Combined
];

await sheets.spreadsheets.values.update({
  spreadsheetId: TRACKER_ID,
  range: 'Sheet1!C17:C27',
  valueInputOption: 'RAW',
  requestBody: { values: actions },
});
console.log('Tracker Action Required column fixed');

// ── STEP 2: Create PR Tracker sheet ──
const prSheetRes = await drive.files.create({
  requestBody: {
    name: 'Leasey.AI — PR Content Tracker',
    mimeType: 'application/vnd.google-apps.spreadsheet',
  },
  fields: 'id, webViewLink',
});
const prSheetId = prSheetRes.data.id;
console.log(`PR Sheet: ${prSheetRes.data.webViewLink}`);

await drive.permissions.create({
  fileId: prSheetId,
  requestBody: { role: 'writer', type: 'anyone' },
});

const header = [
  'Content Name',
  'Type',
  'Tier',
  'Angle / Hook',
  'Target Publications',
  'Source Draft ID',
  'Status',
  'Google Doc Link',
  'Calendar Overlap',
  'Notes',
];

const prRows = [
  header,
  [
    'Rental Beast Partnership Announcement',
    'Press Release',
    'Tier 1',
    'AI leasing platform expands reach through Rental Beast integration — 48+ marketplace syndication for Canadian and US operators',
    'Multi-Housing News, GlobeSt, Propmodo, Connect CRE, Bisnow',
    '32081',
    'Draft exists — needs PR rewrite',
    'https://docs.google.com/document/d/1mwp0aMGl4euk9i2TV-IIavs0dhLpciU6rTeH8gSiOfQ/edit',
    'YES — M2 W8 (Jul 29 blog + PR). Coordinate timing.',
    'Blog version already publish-ready. PR version needs: quote from Juan/Carlos, quote from Rental Beast contact, boilerplate, distribution list.',
  ],
  [
    'Best PM Software 2026 — Industry Report',
    'Thought Leadership / Report',
    'Tier 1',
    'Comprehensive 2026 PM software comparison positioned as an industry report — Leasey appears within ranking = credibility without being salesy',
    'Propmodo, PropTech Connect, GlobeSt (contributed article), Multifamily Executive',
    '21103',
    'Draft exists — needs editorial trim + report framing',
    'https://docs.google.com/document/d/1rMeq-xc988b7KZtX1kF9X6D_JsvDXzUuOVRF-pdqDEY/edit',
    'No overlap in calendar',
    'Current draft is 10K+ words. Trim to 5-8K. Add executive summary, methodology note, and comparison matrix visual. Position as "2026 Multifamily Leasing Technology Report" not "blog post".',
  ],
  [
    'AI Is Changing Senior Living Leasing',
    'Contributed Article / Byline',
    'Tier 2',
    'How AI addresses the unique challenges of senior living leasing: multi-party decision journeys (adult children + residents), compliance, longer sales cycles',
    'Senior Housing News, McKnight\'s Senior Living, Argentum (association), Senior Living Foresight',
    '30059',
    'Needs full editorial rewrite for PR',
    '',
    'NOT in current calendar — new piece',
    'Must rewrite from marketing blog tone to trade publication editorial. Needs: real data on senior living vacancy/occupancy (NIC MAP, NCAL), expert framing, NO product pitch in body (bio + boilerplate only). Target 1,200-1,500 words.',
  ],
  [
    'Compliance-First Application Tracking for Affordable Housing',
    'Contributed Article / Byline',
    'Tier 2',
    'Waitlist automation + compliance tracking as the next frontier in affordable housing tech — regulation-driven angle',
    'Affordable Housing Finance, National Apartment Association (NAA), Tax Credit Advisor, Journal of Housing & Community Development',
    '30078',
    'Needs full editorial rewrite for PR',
    '',
    'NOT in current calendar — new piece',
    'Strong regulatory hook (LIHTC, HUD compliance). Needs: current affordable housing data (NLIHC, HUD), compliance framework references, NO product mentions in body. Author byline: Carlos Leal (COO angle = operations authority). Target 1,200-1,500 words.',
  ],
];

await sheets.spreadsheets.values.update({
  spreadsheetId: prSheetId,
  range: 'Sheet1!A1',
  valueInputOption: 'RAW',
  requestBody: { values: prRows },
});

// Format the sheet
const ssInfo = await sheets.spreadsheets.get({ spreadsheetId: prSheetId });
const sid = ssInfo.data.sheets[0].properties.sheetId;

const requests = [
  // Header
  { repeatCell: { range: { sheetId: sid, startRowIndex: 0, endRowIndex: 1 }, cell: { userEnteredFormat: { backgroundColor: { red: 0.1, green: 0.1, blue: 0.1 }, textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 }, fontSize: 11 } } }, fields: 'userEnteredFormat(backgroundColor,textFormat)' } },
  // Column widths
  { updateDimensionProperties: { range: { sheetId: sid, dimension: 'COLUMNS', startIndex: 0, endIndex: 1 }, properties: { pixelSize: 300 }, fields: 'pixelSize' } },
  { updateDimensionProperties: { range: { sheetId: sid, dimension: 'COLUMNS', startIndex: 1, endIndex: 2 }, properties: { pixelSize: 180 }, fields: 'pixelSize' } },
  { updateDimensionProperties: { range: { sheetId: sid, dimension: 'COLUMNS', startIndex: 2, endIndex: 3 }, properties: { pixelSize: 80 }, fields: 'pixelSize' } },
  { updateDimensionProperties: { range: { sheetId: sid, dimension: 'COLUMNS', startIndex: 3, endIndex: 4 }, properties: { pixelSize: 400 }, fields: 'pixelSize' } },
  { updateDimensionProperties: { range: { sheetId: sid, dimension: 'COLUMNS', startIndex: 4, endIndex: 5 }, properties: { pixelSize: 350 }, fields: 'pixelSize' } },
  { updateDimensionProperties: { range: { sheetId: sid, dimension: 'COLUMNS', startIndex: 5, endIndex: 6 }, properties: { pixelSize: 100 }, fields: 'pixelSize' } },
  { updateDimensionProperties: { range: { sheetId: sid, dimension: 'COLUMNS', startIndex: 6, endIndex: 7 }, properties: { pixelSize: 200 }, fields: 'pixelSize' } },
  { updateDimensionProperties: { range: { sheetId: sid, dimension: 'COLUMNS', startIndex: 7, endIndex: 8 }, properties: { pixelSize: 300 }, fields: 'pixelSize' } },
  { updateDimensionProperties: { range: { sheetId: sid, dimension: 'COLUMNS', startIndex: 8, endIndex: 9 }, properties: { pixelSize: 250 }, fields: 'pixelSize' } },
  { updateDimensionProperties: { range: { sheetId: sid, dimension: 'COLUMNS', startIndex: 9, endIndex: 10 }, properties: { pixelSize: 400 }, fields: 'pixelSize' } },
  // Filter
  { setBasicFilter: { filter: { range: { sheetId: sid, startRowIndex: 0, endRowIndex: prRows.length, startColumnIndex: 0, endColumnIndex: 10 } } } },
  // Tier 1 rows (2-3) = yellow
  { repeatCell: { range: { sheetId: sid, startRowIndex: 1, endRowIndex: 3, startColumnIndex: 0, endColumnIndex: 10 }, cell: { userEnteredFormat: { backgroundColor: { red: 1, green: 0.95, blue: 0.6 } } }, fields: 'userEnteredFormat.backgroundColor' } },
  // Tier 2 rows (4-5) = light orange
  { repeatCell: { range: { sheetId: sid, startRowIndex: 3, endRowIndex: 5, startColumnIndex: 0, endColumnIndex: 10 }, cell: { userEnteredFormat: { backgroundColor: { red: 1, green: 0.9, blue: 0.8 } } }, fields: 'userEnteredFormat.backgroundColor' } },
  // Wrap text
  { repeatCell: { range: { sheetId: sid, startRowIndex: 0, endRowIndex: prRows.length, startColumnIndex: 0, endColumnIndex: 10 }, cell: { userEnteredFormat: { wrapStrategy: 'WRAP' } }, fields: 'userEnteredFormat.wrapStrategy' } },
];

await sheets.spreadsheets.batchUpdate({
  spreadsheetId: prSheetId,
  requestBody: { requests },
});

console.log('\n=== DONE ===');
console.log(`PR Tracker: ${prSheetRes.data.webViewLink}`);
