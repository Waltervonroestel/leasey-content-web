import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
env.split('\n').forEach(l => { const m = l.match(/^([^#=]+)=(.*)$/); if (m) process.env[m[1].trim()] = m[2].trim(); });

const auth = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
auth.setCredentials({ refresh_token: process.env.GOOGLE_SHEETS_REFRESH_TOKEN });
const drive = google.drive({ version: 'v3', auth });

const docs = [
  { docId: '1yqBM8bL7-81_g07F4zTq4jU7PN-p4s_mqfaCrWCLlq0', keyword: 'renovation ROI calculator rental', title: 'Renovation ROI Calculator' },
  { docId: '168mM41sX8tlYEWa8S8CilGyIetdQqIOO5s5cAq-pwGk', keyword: 'appliance replacement planner rental', title: 'Appliance Replacement Planner' },
  { docId: '1UPYUYKXoaYHvsFu_aGx7LUpL4Kj3N935AXD4KthVu4Y', keyword: 'leasing automation large portfolio', title: 'Leasing Automation for Large Portfolios' },
];

for (const doc of docs) {
  const html = (await drive.files.export({ fileId: doc.docId, mimeType: 'text/html' })).data;
  const plain = (await drive.files.export({ fileId: doc.docId, mimeType: 'text/plain' })).data;

  const kw = doc.keyword.toLowerCase();

  // R5: keyword in H1 (font-size:2Xpt span) AND in body
  const h1Match = html.match(/<span[^>]*font-size:\s*2[0-9]pt[^>]*>([^<]+)<\/span>/i);
  const h1Text = h1Match ? h1Match[1].toLowerCase() : '';
  const kwInH1 = h1Text.includes(kw);
  const kwInBody = plain.toLowerCase().includes(kw);

  // Also check <h1> tags
  const h1Tag = html.match(/<h1[^>]*>(.*?)<\/h1>/is);
  const h1TagText = h1Tag ? h1Tag[1].replace(/<[^>]+>/g, '').toLowerCase() : '';
  const kwInH1Tag = h1TagText.includes(kw);

  console.log(`\n${doc.title}`);
  console.log(`  H1 (span): "${h1Text}" → kw in H1: ${kwInH1}`);
  console.log(`  H1 (tag):  "${h1TagText}" → kw in H1: ${kwInH1Tag}`);
  console.log(`  KW in body: ${kwInBody}`);
  console.log(`  R5 PASS: ${kwInH1 || kwInH1Tag}`);

  // Show word count
  const words = plain.split(/\s+/).filter(w => w.length > 0).length;
  console.log(`  Words: ${words}`);
}
