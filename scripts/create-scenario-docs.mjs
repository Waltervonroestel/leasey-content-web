import { readFileSync } from 'fs';
import { google } from 'googleapis';

const envFile = readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(l => {
  const m = l.match(/^([^#=]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim();
});

const wpAuth = Buffer.from(`${env.WORDPRESS_USER}:${env.WORDPRESS_APP_PASSWORD}`).toString('base64');
const wpBase = env.WORDPRESS_URL;

async function fetchPost(id) {
  const r = await fetch(`${wpBase}/wp-json/wp/v2/posts/${id}?context=edit`, {
    headers: { 'Authorization': `Basic ${wpAuth}` }
  });
  if (!r.ok) throw new Error(`WP API ${r.status} for post ${id}`);
  const j = await r.json();
  return { id, title: j.title?.raw || `Post ${id}`, raw: j.content?.raw || '' };
}

const groups = [
  {
    name: 'Large Portfolio Operations — Customer Scenarios',
    desc: 'Combined scenarios showing how large multifamily operators, REITs, and growing portfolios use Leasey.AI to automate leasing at scale.',
    ids: [30048, 30084, 30061, 30053, 30067, 30077]
  },
  {
    name: 'Specialized Housing Segments — Customer Scenarios',
    desc: 'Scenarios showing how student housing, senior living, co-living, and affordable housing operators use Leasey.AI.',
    ids: [30054, 30059, 30060, 30078]
  },
  {
    name: 'Technology & Marketplace Integration — Customer Scenarios',
    desc: 'Scenarios showing how property managers integrate Leasey.AI with existing tools, marketplaces, and workflows.',
    ids: [30079, 30072, 30071, 30073, 30068]
  }
];

const o = new google.auth.OAuth2(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET);
o.setCredentials({ refresh_token: env.GOOGLE_SHEETS_REFRESH_TOKEN });
const drive = google.drive({ version: 'v3', auth: o });

const createdDocs = [];

for (const group of groups) {
  console.log(`\n--- ${group.name} ---`);

  let html = `<h1>Leasey.AI — ${group.name}</h1>\n<p><em>${group.desc}</em></p>\n<hr>\n`;

  for (const id of group.ids) {
    try {
      const post = await fetchPost(id);
      if (post.raw.length < 100) {
        console.log(`  ${id}: EMPTY, skipping`);
        continue;
      }
      console.log(`  ${id}: ${post.title.substring(0, 60)} (${post.raw.length} chars)`);
      html += `<h2>${post.title}</h2>\n<p><em>Original WordPress Draft ID: ${id}</em></p>\n${post.raw}\n<hr>\n`;
    } catch (e) {
      console.log(`  ${id}: ERROR ${e.message}`);
    }
  }

  const res = await drive.files.create({
    requestBody: {
      name: `Leasey.AI — ${group.name}`,
      mimeType: 'application/vnd.google-apps.document',
    },
    media: {
      mimeType: 'text/html',
      body: html,
    },
    fields: 'id, name, webViewLink',
  });

  console.log(`  Created: ${res.data.webViewLink}`);
  createdDocs.push({
    name: group.name,
    link: res.data.webViewLink,
    fileId: res.data.id,
    postIds: group.ids,
  });

  await drive.permissions.create({
    fileId: res.data.id,
    requestBody: { role: 'writer', type: 'anyone' },
  });
  console.log(`  Shared as editor`);
}

// Now create the tracker Google Sheet
console.log('\n--- Creating Tracker Sheet ---');
const sheets = google.sheets({ version: 'v4', auth: o });

const sheetRes = await drive.files.create({
  requestBody: {
    name: 'Leasey.AI — Content Consolidation Tracker',
    mimeType: 'application/vnd.google-apps.spreadsheet',
  },
  fields: 'id, webViewLink',
});
const sheetId = sheetRes.data.id;
console.log(`Sheet created: ${sheetRes.data.webViewLink}`);

await drive.permissions.create({
  fileId: sheetId,
  requestBody: { role: 'writer', type: 'anyone' },
});

// Build tracker data
const postTitles = {};
for (const group of groups) {
  for (const id of group.ids) {
    try {
      const post = await fetchPost(id);
      postTitles[id] = post.title || `Draft ${id}`;
    } catch { postTitles[id] = `Draft ${id}`; }
  }
}

const rows = [
  ['New Content Name', 'Old Content Being Replaced', 'WordPress Draft IDs', 'Google Doc Link', 'Status'],
];

for (const doc of createdDocs) {
  const oldContent = doc.postIds
    .filter(id => (postTitles[id] || '').length > 5)
    .map(id => postTitles[id])
    .join('\n');
  const draftIds = doc.postIds.join(', ');
  rows.push([`Leasey.AI — ${doc.name}`, oldContent, draftIds, doc.link, 'Draft']);
}

// Add empty posts row
const emptyIds = [30058, 30056, 30051, 30050, 30049];
rows.push(['(Empty drafts — no content)', emptyIds.map(id => `Draft ${id}`).join(', '), emptyIds.join(', '), '', 'To delete']);

// Tools group (16 posts)
rows.push(['Tools Posts (16 — publish individually with keywords)', 'Various "Best X Tool" draft posts', 'Multiple tool-related drafts', '', 'Publish with SEO']);

// Blog duplicates
rows.push(['PM Software 2026 (keep)', 'PM Software 2025 (eliminate)', 'Blog duplicates', '', 'Keep 2026, delete 2025']);
rows.push(['Marketing for Rental Properties (combine)', 'Two duplicate drafts', 'Blog duplicates', '', 'Combine into one']);
rows.push(['Rental Beast Partnership (publish)', 'Partnership announcement draft', 'Single draft', '', 'Publish as-is']);

await sheets.spreadsheets.values.update({
  spreadsheetId: sheetId,
  range: 'Sheet1!A1',
  valueInputOption: 'RAW',
  requestBody: { values: rows },
});

// Format header row
const ssInfo = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
const sid = ssInfo.data.sheets[0].properties.sheetId;
await sheets.spreadsheets.batchUpdate({
  spreadsheetId: sheetId,
  requestBody: {
    requests: [
      { repeatCell: { range: { sheetId: sid, startRowIndex: 0, endRowIndex: 1 }, cell: { userEnteredFormat: { backgroundColor: { red: 0.15, green: 0.15, blue: 0.15 }, textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } } } }, fields: 'userEnteredFormat(backgroundColor,textFormat)' } },
      { updateDimensionProperties: { range: { sheetId: sid, dimension: 'COLUMNS', startIndex: 0, endIndex: 1 }, properties: { pixelSize: 350 }, fields: 'pixelSize' } },
      { updateDimensionProperties: { range: { sheetId: sid, dimension: 'COLUMNS', startIndex: 1, endIndex: 2 }, properties: { pixelSize: 400 }, fields: 'pixelSize' } },
      { updateDimensionProperties: { range: { sheetId: sid, dimension: 'COLUMNS', startIndex: 3, endIndex: 4 }, properties: { pixelSize: 350 }, fields: 'pixelSize' } },
      { setBasicFilter: { filter: { range: { sheetId: sid, startRowIndex: 0, endRowIndex: rows.length, startColumnIndex: 0, endColumnIndex: 5 } } } },
    ]
  }
});

console.log('\n=== DONE ===');
console.log('Docs:');
createdDocs.forEach(d => console.log(`  ${d.name}: ${d.link}`));
console.log(`Tracker: ${sheetRes.data.webViewLink}`);
