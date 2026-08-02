// Sets "anyone with the link can view" permission on all docs in doc-ids.json
import { readFileSync } from 'fs';
import { google } from 'googleapis';

const envFile = readFileSync('.env.local', 'utf8');
envFile.split('\n').forEach(l => {
  const m = l.match(/^([^#=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim();
});

const ids = JSON.parse(readFileSync('doc-ids.json', 'utf8'));
const o = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
o.setCredentials({ refresh_token: process.env.GOOGLE_SHEETS_REFRESH_TOKEN });
const drive = google.drive({ version: 'v3', auth: o });

async function main() {
  let ok = 0, fail = 0;
  for (const id of ids) {
    try {
      await drive.permissions.create({
        fileId: id,
        requestBody: { role: 'reader', type: 'anyone' },
      });
      ok++;
      console.log(`OK: ${id}`);
    } catch (e) {
      fail++;
      console.log(`FAIL: ${id} - ${e.message}`);
    }
  }
  console.log(`\nDone. ${ok} succeeded, ${fail} failed.`);
}
main();
