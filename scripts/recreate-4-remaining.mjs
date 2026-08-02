import { readFileSync } from 'fs';
import { google } from 'googleapis';
import { Readable } from 'stream';

const envFile = readFileSync('.env.local', 'utf8');
envFile.split('\n').forEach(l => {
  const m = l.match(/^([^#=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim();
});

const o = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
o.setCredentials({ refresh_token: process.env.GOOGLE_SHEETS_REFRESH_TOKEN });
const drive = google.drive({ version: 'v3', auth: o });
const sheets = google.sheets({ version: 'v4', auth: o });

const TRACKER_ID = '1u0luDlk0ALAUNTZuWK181OyrmsomUbPF-2w-YB87QvY';

async function createDocFromHtml(title, htmlContent) {
  const res = await drive.files.create({
    requestBody: { name: title, mimeType: 'application/vnd.google-apps.document' },
    media: { mimeType: 'text/html', body: Readable.from(Buffer.from(htmlContent, 'utf8')) },
    fields: 'id,webViewLink',
  });
  return { id: res.data.id, link: res.data.webViewLink };
}

async function shareAsWriter(fileId) {
  await drive.permissions.create({
    fileId,
    requestBody: { role: 'writer', type: 'anyone' },
  });
}

const DOCS = [
  { title: 'Leasey.AI — Leasing Operations Assessment (Combined Tool)', b64File: 'scripts/combined.b64', trackerCell: 'E27' },
  { title: 'Leasey.AI — Leasing Automation for Large Portfolios', b64File: 'scripts/large_portfolio.b64', trackerCell: 'E8' },
  { title: 'Leasey.AI — Scaling Your PM Firm to New Markets', b64File: 'scripts/scale_pm.b64', trackerCell: 'E9' },
  { title: 'Leasey.AI — Why Generic CRMs Fail at Leasing', b64File: 'scripts/why_crms.b64', trackerCell: 'E10' },
];

async function main() {
  const results = [];
  for (const doc of DOCS) {
    console.log(`Reading base64: ${doc.title}`);
    const b64 = readFileSync(doc.b64File, 'utf8').trim();
    const html = Buffer.from(b64, 'base64').toString('utf8');
    console.log(`  Decoded ${html.length} chars. Creating new doc...`);
    const { id, link } = await createDocFromHtml(doc.title, html);
    console.log(`  ID: ${id}, Link: ${link}`);
    await shareAsWriter(id);
    console.log(`  Shared. Updating tracker cell ${doc.trackerCell}...`);
    await sheets.spreadsheets.values.update({
      spreadsheetId: TRACKER_ID,
      range: `Sheet1!${doc.trackerCell}`,
      valueInputOption: 'RAW',
      requestBody: { values: [[link]] },
    });
    console.log(`  Done!`);
    results.push({ title: doc.title, id, link });
  }
  console.log('\n=== RESULTS ===');
  results.forEach(r => console.log(`${r.title}\n  ${r.link}\n`));
}

main().catch(e => { console.error(e); process.exit(1); });
