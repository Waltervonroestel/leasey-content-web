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
const drive = google.drive({ version: 'v3', auth: o });
const sheets = google.sheets({ version: 'v4', auth: o });

// All content pieces for the tracker
const allContent = [
  // PUBLISH READY (yellow highlight)
  { name: 'Rental Beast Partnership', status: 'Ready to Publish', action: 'Publish as-is', oldDrafts: '32081', link: 'https://docs.google.com/document/d/1mwp0aMGl4euk9i2TV-IIavs0dhLpciU6rTeH8gSiOfQ/edit', keyword: 'cross-marketplace syndication', priority: 'P1' },
  { name: 'Best PM Software 2026', status: 'Ready to Publish', action: 'Trim to 5-8K words, then publish', oldDrafts: '21103', link: 'https://docs.google.com/document/d/1rMeq-xc988b7KZtX1kF9X6D_JsvDXzUuOVRF-pdqDEY/edit', keyword: 'best property management software 2026', priority: 'P1' },
  { name: 'Renovation ROI Calculator', status: 'Ready to Publish', action: 'Move CTA below tool', oldDrafts: '20837', link: 'https://docs.google.com/document/d/1yqBM8bL7-81_g07F4zTq4jU7PN-p4s_mqfaCrWCLlq0/edit', keyword: 'renovation ROI calculator rental', priority: 'P1' },
  { name: 'Rental Listing Description Generator', status: 'Ready to Publish', action: 'Move CTA below tool, clean REBUILT tag', oldDrafts: '20832', link: 'https://docs.google.com/document/d/1PYjDh8BtMJcNE3kVc3wLHPDv-aWSthIewrQr5Y2nNQk/edit', keyword: 'rental listing description generator', priority: 'P1' },
  { name: 'Appliance Replacement Planner', status: 'Ready to Publish', action: 'Substantiate 60% claim or remove, move CTA', oldDrafts: '20844', link: 'https://docs.google.com/document/d/1uOuJE86UjZBNBGBKgqhvTq-1K6d7j1j8VnQs5Kfqqas/edit', keyword: 'appliance replacement planner rental', priority: 'P1' },

  // COMBINED SCENARIOS (rewritten)
  { name: 'Leasing Automation for Large Portfolios', status: 'Rewritten', action: 'Review & publish', oldDrafts: '30048 + 30084 + 30053', link: 'https://docs.google.com/document/d/1W4DezIi31a77liz5DifheUxEK3Xoj3Z7y39BIr_Kxlg/edit', keyword: 'leasing automation large portfolio', priority: 'P2' },
  { name: 'Scale Your PM Firm to New Markets', status: 'Rewritten', action: 'Review & publish', oldDrafts: '30067 + 30077', link: 'https://docs.google.com/document/d/1-864zveYS83hyV5ol-fUWw4ii2JcRLUTkx1pIrFB1Z8/edit', keyword: 'property management expansion software', priority: 'P2' },
  { name: 'Why Generic CRMs Fail at Leasing', status: 'Rewritten', action: 'Review & publish', oldDrafts: '30079 + 30068 + 30072', link: 'https://docs.google.com/document/d/1u7-0YmRcIxPqW8IXUcj-l4WH21Ob6eiy0KqhTfd0g_o/edit', keyword: 'leasing CRM software', priority: 'P2' },

  // INDIVIDUAL SCENARIOS (to be rewritten)
  { name: 'Student Housing Leasing Software', status: 'To Rewrite', action: 'Unique structure: seasonal crunch lead', oldDrafts: '30054', link: '', keyword: 'student housing leasing software', priority: 'P3' },
  { name: 'Senior Living Leasing Automation', status: 'To Rewrite', action: 'Unique structure: multi-party journey', oldDrafts: '30059', link: '', keyword: 'senior living leasing software', priority: 'P3' },
  { name: 'Co-Living: Fill Rooms in 72 Hours', status: 'To Rewrite', action: 'Unique structure: speed-to-lease', oldDrafts: '30060', link: '', keyword: 'co-living property management software', priority: 'P3' },
  { name: 'Affordable Housing Application Tracking', status: 'To Rewrite', action: 'Unique structure: compliance + waitlist', oldDrafts: '30078', link: '', keyword: 'affordable housing application tracking', priority: 'P3' },
  { name: 'Corporate Housing Lease Management', status: 'To Rewrite', action: 'Unique structure: same-day execution', oldDrafts: '30061', link: '', keyword: 'corporate housing lease management', priority: 'P3' },
  { name: 'Facebook Marketplace Rental Automation', status: 'To Rewrite', action: 'Unique structure: channel automation', oldDrafts: '30071', link: '', keyword: 'Facebook Marketplace rental automation', priority: 'P3' },
  { name: 'Fast Lease Turnaround for Competitive Markets', status: 'To Rewrite', action: 'Unique structure: 24hr decision window', oldDrafts: '30073', link: '', keyword: 'fast lease turnaround software', priority: 'P3' },

  // TOOLS (need CTA + SEO text)
  { name: 'Leasing Overhead Calculator', status: 'Needs CTA + SEO', action: 'Add contextual CTA at results + 500w SEO body', oldDrafts: '28443', link: '', keyword: 'leasing overhead calculator', priority: 'P2' },
  { name: 'Showing Schedule Builder', status: 'Needs CTA + SEO', action: 'Already has Leasey mentions, add SEO body', oldDrafts: '28459', link: '', keyword: 'showing schedule builder leasing', priority: 'P2' },
  { name: 'Move-In Checklist Builder', status: 'Needs CTA + SEO', action: 'Add CTA + SEO body', oldDrafts: '28460', link: '', keyword: 'move-in checklist builder', priority: 'P2' },
  { name: 'Tenant Application Risk Scorer', status: 'Needs CTA + SEO', action: 'Add CTA + SEO body', oldDrafts: '28448', link: '', keyword: 'tenant application risk scorer', priority: 'P2' },
  { name: 'Reference Check Question Generator', status: 'Needs CTA + SEO', action: 'Add CTA + SEO body', oldDrafts: '28466', link: '', keyword: 'tenant reference check questions', priority: 'P2' },
  { name: 'Showing Confirmation Message Generator', status: 'Needs CTA + SEO', action: 'Add CTA + SEO body (no body text at all)', oldDrafts: '28468', link: '', keyword: 'showing confirmation message template', priority: 'P3' },
  { name: 'Vacancy Reactivation Checklist', status: 'Needs CTA + SEO', action: 'Add CTA + SEO body', oldDrafts: '28463', link: '', keyword: 'vacancy reactivation checklist', priority: 'P3' },
  { name: 'Rental Inquiry Response Time Calculator', status: 'Needs CTA + SEO', action: 'Add CTA + SEO body (very simple tool)', oldDrafts: '28442', link: '', keyword: 'rental inquiry response time', priority: 'P3' },
  { name: 'Leasing Funnel Conversion Calculator', status: 'Needs CTA + SEO', action: 'Add CTA + SEO body', oldDrafts: '28438', link: '', keyword: 'leasing funnel conversion rate', priority: 'P3' },
  { name: 'Rental Listing Quality Scorer', status: 'Needs CTA + SEO', action: 'Add CTA + SEO body', oldDrafts: '28449', link: '', keyword: 'rental listing quality check', priority: 'P3' },
  { name: 'Leasing Operations Assessment (COMBINED)', status: 'To Combine', action: 'Merge Gap Finder (28446) + Readiness Audit (28450) into 1 tool', oldDrafts: '28446 + 28450', link: '', keyword: 'leasing operations assessment', priority: 'P3' },

  // ELIMINATED
  { name: '(DELETED) 5 empty scenarios', status: 'Eliminated', action: 'Already deleted from WP', oldDrafts: '30058, 30056, 30051, 30050, 30049', link: '', keyword: '', priority: '' },
  { name: '(DELETED) PM Software 2025', status: 'Eliminated', action: 'Deleted, 301 redirect to 2026 version', oldDrafts: '2566', link: '', keyword: '', priority: '' },
  { name: '(DELETED) Marketing Strategies (empty)', status: 'Eliminated', action: 'Deleted from WP', oldDrafts: '27767', link: '', keyword: '', priority: '' },
];

async function main() {
  // Create the tracker sheet
  console.log('Creating tracker sheet...');
  const sheetRes = await drive.files.create({
    requestBody: {
      name: 'Leasey.AI — Content Consolidation Tracker',
      mimeType: 'application/vnd.google-apps.spreadsheet',
    },
    fields: 'id, webViewLink',
  });
  const sheetId = sheetRes.data.id;
  console.log(`Sheet: ${sheetRes.data.webViewLink}`);

  await drive.permissions.create({
    fileId: sheetId,
    requestBody: { role: 'writer', type: 'anyone' },
  });

  // Write data
  const header = ['Content Name', 'Status', 'Action Required', 'Old Draft IDs', 'Google Doc Link', 'Target Keyword', 'Priority'];
  const rows = [header, ...allContent.map(c => [c.name, c.status, c.action, c.oldDrafts, c.link, c.keyword, c.priority])];

  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: 'Sheet1!A1',
    valueInputOption: 'RAW',
    requestBody: { values: rows },
  });

  // Get sheet tab ID
  const ssInfo = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
  const sid = ssInfo.data.sheets[0].properties.sheetId;

  // Find which rows are "Ready to Publish" (for yellow highlight)
  const publishRows = [];
  const rewrittenRows = [];
  const toRewriteRows = [];
  const toolRows = [];
  const combineRows = [];
  const elimRows = [];

  allContent.forEach((c, i) => {
    const row = i + 1; // +1 for header
    if (c.status === 'Ready to Publish') publishRows.push(row);
    else if (c.status === 'Rewritten') rewrittenRows.push(row);
    else if (c.status === 'To Rewrite') toRewriteRows.push(row);
    else if (c.status === 'Needs CTA + SEO') toolRows.push(row);
    else if (c.status === 'To Combine') combineRows.push(row);
    else if (c.status === 'Eliminated') elimRows.push(row);
  });

  const requests = [
    // Header formatting
    { repeatCell: { range: { sheetId: sid, startRowIndex: 0, endRowIndex: 1 }, cell: { userEnteredFormat: { backgroundColor: { red: 0.1, green: 0.1, blue: 0.1 }, textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 }, fontSize: 11 } } }, fields: 'userEnteredFormat(backgroundColor,textFormat)' } },
    // Column widths
    { updateDimensionProperties: { range: { sheetId: sid, dimension: 'COLUMNS', startIndex: 0, endIndex: 1 }, properties: { pixelSize: 320 }, fields: 'pixelSize' } },
    { updateDimensionProperties: { range: { sheetId: sid, dimension: 'COLUMNS', startIndex: 1, endIndex: 2 }, properties: { pixelSize: 130 }, fields: 'pixelSize' } },
    { updateDimensionProperties: { range: { sheetId: sid, dimension: 'COLUMNS', startIndex: 2, endIndex: 3 }, properties: { pixelSize: 350 }, fields: 'pixelSize' } },
    { updateDimensionProperties: { range: { sheetId: sid, dimension: 'COLUMNS', startIndex: 3, endIndex: 4 }, properties: { pixelSize: 160 }, fields: 'pixelSize' } },
    { updateDimensionProperties: { range: { sheetId: sid, dimension: 'COLUMNS', startIndex: 4, endIndex: 5 }, properties: { pixelSize: 350 }, fields: 'pixelSize' } },
    { updateDimensionProperties: { range: { sheetId: sid, dimension: 'COLUMNS', startIndex: 5, endIndex: 6 }, properties: { pixelSize: 250 }, fields: 'pixelSize' } },
    { updateDimensionProperties: { range: { sheetId: sid, dimension: 'COLUMNS', startIndex: 6, endIndex: 7 }, properties: { pixelSize: 80 }, fields: 'pixelSize' } },
    // Filter
    { setBasicFilter: { filter: { range: { sheetId: sid, startRowIndex: 0, endRowIndex: rows.length, startColumnIndex: 0, endColumnIndex: 7 } } } },
  ];

  // Yellow highlight for Ready to Publish
  for (const row of publishRows) {
    requests.push({
      repeatCell: {
        range: { sheetId: sid, startRowIndex: row, endRowIndex: row + 1, startColumnIndex: 0, endColumnIndex: 7 },
        cell: { userEnteredFormat: { backgroundColor: { red: 1, green: 0.95, blue: 0.6 } } },
        fields: 'userEnteredFormat.backgroundColor'
      }
    });
  }

  // Light green for Rewritten (ready for review)
  for (const row of rewrittenRows) {
    requests.push({
      repeatCell: {
        range: { sheetId: sid, startRowIndex: row, endRowIndex: row + 1, startColumnIndex: 0, endColumnIndex: 7 },
        cell: { userEnteredFormat: { backgroundColor: { red: 0.85, green: 0.95, blue: 0.85 } } },
        fields: 'userEnteredFormat.backgroundColor'
      }
    });
  }

  // Light red for Eliminated
  for (const row of elimRows) {
    requests.push({
      repeatCell: {
        range: { sheetId: sid, startRowIndex: row, endRowIndex: row + 1, startColumnIndex: 0, endColumnIndex: 7 },
        cell: { userEnteredFormat: { backgroundColor: { red: 0.95, green: 0.85, blue: 0.85 }, textFormat: { strikethrough: true } } },
        fields: 'userEnteredFormat(backgroundColor,textFormat)'
      }
    });
  }

  // Light blue for Tools
  for (const row of [...toolRows, ...combineRows]) {
    requests.push({
      repeatCell: {
        range: { sheetId: sid, startRowIndex: row, endRowIndex: row + 1, startColumnIndex: 0, endColumnIndex: 7 },
        cell: { userEnteredFormat: { backgroundColor: { red: 0.85, green: 0.9, blue: 1 } } },
        fields: 'userEnteredFormat.backgroundColor'
      }
    });
  }

  // Light orange for To Rewrite
  for (const row of toRewriteRows) {
    requests.push({
      repeatCell: {
        range: { sheetId: sid, startRowIndex: row, endRowIndex: row + 1, startColumnIndex: 0, endColumnIndex: 7 },
        cell: { userEnteredFormat: { backgroundColor: { red: 1, green: 0.9, blue: 0.8 } } },
        fields: 'userEnteredFormat.backgroundColor'
      }
    });
  }

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: sheetId,
    requestBody: { requests }
  });

  console.log('\n=== TRACKER CREATED ===');
  console.log(`Link: ${sheetRes.data.webViewLink}`);
  console.log(`Total rows: ${allContent.length}`);
  console.log(`Ready to publish (yellow): ${publishRows.length}`);
  console.log(`Rewritten (green): ${rewrittenRows.length}`);
  console.log(`To rewrite (orange): ${toRewriteRows.length}`);
  console.log(`Tools (blue): ${toolRows.length + combineRows.length}`);
  console.log(`Eliminated (red): ${elimRows.length}`);
}

main().catch(e => { console.error(e); process.exit(1); });
