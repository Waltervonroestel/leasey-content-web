import { google } from 'googleapis';
import fs from 'fs';
import { Readable } from 'stream';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
env.split('\n').forEach(l => { const m = l.match(/^([^#=]+)=(.*)$/); if (m) process.env[m[1].trim()] = m[2].trim(); });

const auth = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
auth.setCredentials({ refresh_token: process.env.GOOGLE_SHEETS_REFRESH_TOKEN });
const drive = google.drive({ version: 'v3', auth });

const fixes = [
  {
    docId: '1yqBM8bL7-81_g07F4zTq4jU7PN-p4s_mqfaCrWCLlq0',
    keyword: 'renovation ROI calculator rental',
    newH1: 'Renovation ROI Calculator Rental Property Owners Need'
  },
  {
    docId: '168mM41sX8tlYEWa8S8CilGyIetdQqIOO5s5cAq-pwGk',
    keyword: 'appliance replacement planner rental',
    newH1: 'Appliance Replacement Planner Rental Operators Need'
  },
  {
    docId: '1UPYUYKXoaYHvsFu_aGx7LUpL4Kj3N935AXD4KthVu4Y',
    keyword: 'leasing automation large portfolio',
    newH1: 'Leasing Automation Large Portfolio Management Guide'
  }
];

for (const fix of fixes) {
  console.log(`\nProcessing: ${fix.newH1}`);

  // Download current HTML
  const res = await drive.files.export({ fileId: fix.docId, mimeType: 'text/html' });
  let html = res.data;

  // Find the first large text (H1-like) — Google Docs uses font-size:24pt or 26pt for titles
  // Pattern: <span style="...font-weight:700...font-size:2Xpt...">TITLE TEXT</span>
  const h1Regex = /(<span[^>]*font-size:\s*2[0-9]pt[^>]*>)([^<]+)(<\/span>)/i;
  const match = html.match(h1Regex);

  if (match) {
    const oldTitle = match[2];
    console.log(`  Old H1: "${oldTitle}"`);
    console.log(`  New H1: "${fix.newH1}"`);
    html = html.replace(match[0], match[1] + fix.newH1 + match[3]);
  } else {
    // Try alternate: actual <h1> tag
    const h1Tag = /<h1[^>]*>([^<]*)<\/h1>/i;
    const m2 = html.match(h1Tag);
    if (m2) {
      console.log(`  Old H1 (tag): "${m2[1]}"`);
      html = html.replace(m2[1], fix.newH1);
    } else {
      console.log(`  WARNING: Could not find H1 pattern`);
      // Brute force: find the title text and replace it
      // The title is typically the first bold, large text in the doc
      const titlePattern = new RegExp('(font-weight:\\s*700[^>]*>)([^<]{10,80})', 'i');
      const m3 = html.match(titlePattern);
      if (m3) {
        console.log(`  Found via font-weight:700: "${m3[2]}"`);
        html = html.replace(m3[0], m3[1] + fix.newH1);
      }
    }
  }

  // Upload back
  await drive.files.update({
    fileId: fix.docId,
    media: { mimeType: 'text/html', body: Readable.from(Buffer.from(html, 'utf8')) }
  });
  console.log(`  Uploaded OK`);
}

console.log('\nDone. All 3 H1s updated.');
