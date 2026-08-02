// Usage: node scripts/write-doc.mjs <docId> <contentFile>
import { readFileSync } from 'fs';
import { google } from 'googleapis';

const envFile = readFileSync('.env.local', 'utf8');
envFile.split('\n').forEach(l => {
  const m = l.match(/^([^#=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim();
});

const docId = process.argv[2];
const contentFile = process.argv[3];
if (!docId || !contentFile) { console.error('Usage: node scripts/write-doc.mjs <docId> <contentFile>'); process.exit(1); }

const content = readFileSync(contentFile, 'utf8');
const o = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
o.setCredentials({ refresh_token: process.env.GOOGLE_SHEETS_REFRESH_TOKEN });
const docs = google.docs({ version: 'v1', auth: o });

async function main() {
  const doc = await docs.documents.get({ documentId: docId });
  const endIndex = doc.data.body.content[doc.data.body.content.length - 1].endIndex;
  const requests = [];
  if (endIndex > 2) requests.push({ deleteContentRange: { range: { startIndex: 1, endIndex: endIndex - 1 } } });
  requests.push({ insertText: { location: { index: 1 }, text: content } });
  await docs.documents.batchUpdate({ documentId: docId, requestBody: { requests } });
  console.log(`OK: ${content.length} chars -> doc ${docId}`);
}
main().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
