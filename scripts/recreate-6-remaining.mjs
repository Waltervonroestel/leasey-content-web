import { readFileSync } from 'fs';
import { google } from 'googleapis';
import { Readable } from 'stream';

// Load env
const envFile = readFileSync('.env.local', 'utf8');
envFile.split('\n').forEach(l => {
  const m = l.match(/^([^#=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim();
});

// Dest (leasey.ai) — uses GOOGLE_SHEETS_REFRESH_TOKEN
const dstAuth = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
dstAuth.setCredentials({ refresh_token: process.env.GOOGLE_SHEETS_REFRESH_TOKEN });
const dstDrive = google.drive({ version: 'v3', auth: dstAuth });
const sheets = google.sheets({ version: 'v4', auth: dstAuth });

const TRACKER_ID = '1u0luDlk0ALAUNTZuWK181OyrmsomUbPF-2w-YB87QvY';

const DOCS = [
  { title: 'Leasey.AI — Senior Living Leasing Automation', srcId: '1qNTrNrHiMhrfZXy4osDyW75SdwRRrg4xDvYD9pIqBPg', trackerCell: 'E11' },
  { title: 'Co-Living Property Management: Fill Rooms in 72 Hours', srcId: '1LVpwXoUPGcF3kiv-DwfA3g9TkGcJvjtBneHsEsya0To', trackerCell: 'E12' },
  { title: 'Affordable Housing Application Tracking Software', srcId: '18OA5gUJtB2AtNYyy2WNtmHeIKTgCrni2Q-37jwUIluE', trackerCell: 'E13' },
  { title: 'Corporate Housing Lease Management Software', srcId: '1PoQAYCzJaM3_UxtwwGL4QFFtpuGaFs3xkwKNxNp2hr0', trackerCell: 'E14' },
  { title: 'Facebook Marketplace Rental Automation for Property Managers', srcId: '1DOCp7wIMVekqlqbYuGfLRENCK0CKf7sfQiKlLn8jyzg', trackerCell: 'E15' },
  { title: 'Fast Lease Turnaround Software for Competitive Markets', srcId: '1pB_isMZ9EMBlDSUUEcW5YJw62i-It3CAeBHMDx5roKc', trackerCell: 'E16' },
];

async function main() {
  // First, verify tracker rows 11-16
  console.log('Verifying tracker rows 11-16...');
  const check = await sheets.spreadsheets.values.get({
    spreadsheetId: TRACKER_ID,
    range: 'Sheet1!A11:E16',
  });
  console.log('Tracker rows 11-16:');
  (check.data.values || []).forEach((row, i) => console.log(`  Row ${11 + i}: ${JSON.stringify(row)}`));
  console.log('');

  const results = [];
  for (const doc of DOCS) {
    console.log(`Downloading: ${doc.title} (${doc.srcId})`);
    const exportUrl = `https://docs.google.com/document/d/${doc.srcId}/export?format=html`;
    const resp = await fetch(exportUrl, { redirect: 'follow' });
    if (!resp.ok) throw new Error(`Failed to download ${doc.srcId}: ${resp.status} ${resp.statusText}`);
    const html = await resp.text();
    console.log(`  Downloaded ${html.length} chars. Creating new doc...`);

    const res = await dstDrive.files.create({
      requestBody: { name: doc.title, mimeType: 'application/vnd.google-apps.document' },
      media: { mimeType: 'text/html', body: Readable.from(Buffer.from(html, 'utf8')) },
      fields: 'id,webViewLink',
    });
    const { id, webViewLink: link } = res.data;
    console.log(`  ID: ${id}, Link: ${link}`);

    await dstDrive.permissions.create({
      fileId: id,
      requestBody: { role: 'writer', type: 'anyone' },
    });
    console.log(`  Shared.`);

    await sheets.spreadsheets.values.update({
      spreadsheetId: TRACKER_ID,
      range: `Sheet1!${doc.trackerCell}`,
      valueInputOption: 'RAW',
      requestBody: { values: [[link]] },
    });
    console.log(`  Tracker updated: ${doc.trackerCell}`);
    results.push({ title: doc.title, id, link });
  }

  console.log('\n=== RESULTS ===');
  results.forEach(r => console.log(`${r.title}\n  ${r.link}\n`));
}

main().catch(e => { console.error(e); process.exit(1); });
