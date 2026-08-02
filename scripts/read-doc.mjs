// Usage: node scripts/read-doc.mjs <docId> [outputFile]
import { readFileSync, writeFileSync } from 'fs';
import { google } from 'googleapis';

const envFile = readFileSync('.env.local', 'utf8');
envFile.split('\n').forEach(l => {
  const m = l.match(/^([^#=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim();
});

const docId = process.argv[2];
const outFile = process.argv[3];
if (!docId) { console.error('Usage: node scripts/read-doc.mjs <docId> [outputFile]'); process.exit(1); }

const o = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
o.setCredentials({ refresh_token: process.env.GOOGLE_SHEETS_REFRESH_TOKEN });
const docs = google.docs({ version: 'v1', auth: o });

async function main() {
  const doc = await docs.documents.get({ documentId: docId });
  let text = '';
  if (doc.data.body && doc.data.body.content) {
    for (const el of doc.data.body.content) {
      if (el.paragraph && el.paragraph.elements) {
        for (const e of el.paragraph.elements) { if (e.textRun) text += e.textRun.content; }
      }
    }
  }
  if (outFile) { writeFileSync(outFile, text, 'utf8'); console.log(`OK: ${text.split(/\s+/).length} words -> ${outFile}`); }
  else console.log(text);
}
main().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
