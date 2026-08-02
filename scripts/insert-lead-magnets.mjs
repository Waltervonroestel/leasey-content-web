import { google } from 'googleapis';
import fs from 'fs';
import { Readable } from 'stream';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
env.split('\n').forEach(l => { const m = l.match(/^([^#=]+)=(.*)$/); if (m) process.env[m[1].trim()] = m[2].trim(); });

const auth = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
auth.setCredentials({ refresh_token: process.env.GOOGLE_SHEETS_REFRESH_TOKEN });
const drive = google.drive({ version: 'v3', auth });

const LISTING_KIT_URL = 'https://claude.ai/code/artifact/8401f0ef-3576-470c-9f1e-97cba5f66f76';
const FUNNEL_DIAGNOSTIC_URL = 'https://claude.ai/code/artifact/f7e3efb8-8c86-410e-a246-ca3139221628';

// Listing Kit cluster
const listingDocs = [
  { docId: '1NaAJIropgssbwVJHHe5fKWx7SBNKf1fNfeYpJpHLBSA', title: 'Rental Listing Description Generator' },
  { docId: '1DY8_JaMNX7XGEh993NJUCTnpTn3bBocu8FzPhN8uvJk', title: 'Facebook Marketplace Rental Automation' },
  { docId: '1mwp0aMGl4euk9i2TV-IIavs0dhLpciU6rTeH8gSiOfQ', title: 'Rental Beast Partnership' },
];

// Funnel Diagnostic cluster
const funnelDocs = [
  { docId: '1UPYUYKXoaYHvsFu_aGx7LUpL4Kj3N935AXD4KthVu4Y', title: 'Leasing Automation for Large Portfolios' },
  { docId: '1aRqn7xTDj0YHftKqB9LWNzpov3QuI3yxXJxd_ecvZcs', title: 'Why Generic CRMs Fail at Leasing' },
  { docId: '1jKjOI3TXw44_2frVhOF9FscXEOfKj1zF_AhW8wbQX7I', title: 'Student Housing Leasing Software' },
  { docId: '1Gh1ufOTiJ8KfBop9nL-4Yv0NIeCDSf7pjNvp2mwlEKE', title: 'Fast Lease Turnaround' },
];

function buildCTA(toolName, toolUrl, toolDescription) {
  return `
<div style="margin-top:24pt;padding:16pt 20pt;background-color:#ecfdf5;border-left:4pt solid #059669;border-radius:4pt;">
<p style="margin:0;font-size:14pt;font-weight:700;color:#047857;">Free Tool: ${toolName}</p>
<p style="margin:6pt 0 10pt;font-size:11pt;color:#475569;">${toolDescription}</p>
<p style="margin:0;"><a href="${toolUrl}" style="font-size:11pt;font-weight:700;color:#059669;text-decoration:underline;">→ Try the ${toolName} now</a></p>
</div>`;
}

const listingCTA = buildCTA(
  'Rental Listing Generator',
  LISTING_KIT_URL,
  'Fill in your property details once and get 5 platform-ready listings (Zillow, Apartments.com, FB Marketplace, Zumper, Craigslist) in 3 tones — professional, casual, and urgent. Edit inline, copy, and post.'
);

const funnelCTA = buildCTA(
  'Leasing Funnel Diagnostic',
  FUNNEL_DIAGNOSTIC_URL,
  'Input your real leasing numbers and get an instant diagnosis of where leads are dying in your funnel — plus editable message templates in 3 tones to fix each bottleneck.'
);

async function insertCTA(docId, title, ctaHtml) {
  try {
    const res = await drive.files.export({ fileId: docId, mimeType: 'text/html' });
    let html = res.data;

    // Check if CTA already exists
    if (html.includes('Free Tool:')) {
      console.log(`  SKIP: ${title} — CTA already exists`);
      return;
    }

    // Insert before closing </body>
    html = html.replace('</body>', ctaHtml + '</body>');

    await drive.files.update({
      fileId: docId,
      media: { mimeType: 'text/html', body: Readable.from(Buffer.from(html, 'utf8')) }
    });
    console.log(`  OK: ${title}`);
  } catch (e) {
    console.error(`  FAIL: ${title} — ${e.message}`);
  }
}

console.log('Inserting Listing Generator CTA:');
for (const doc of listingDocs) {
  await insertCTA(doc.docId, doc.title, listingCTA);
}

console.log('\nInserting Funnel Diagnostic CTA:');
for (const doc of funnelDocs) {
  await insertCTA(doc.docId, doc.title, funnelCTA);
}

console.log('\nDone.');
