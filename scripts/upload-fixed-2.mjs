import { readFileSync } from 'fs';
import { Readable } from 'stream';
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

const manifest = JSON.parse(readFileSync('scripts/docs-html/manifest.json', 'utf8'));

// Indices 9-14 in manifest (the 6 docs to update)
const docs = [
  { idx: 9,  slug: 'senior_living_leasing_automation' },
  { idx: 10, slug: 'co_living_fill_rooms_in_72_hours' },
  { idx: 11, slug: 'affordable_housing_application_tracking' },
  { idx: 12, slug: 'corporate_housing_lease_management' },
  { idx: 13, slug: 'facebook_marketplace_rental_automation' },
  { idx: 14, slug: 'fast_lease_turnaround_for_competitive_markets' },
];

async function main() {
  for (const doc of docs) {
    const entry = manifest[doc.idx];
    const html = readFileSync(`scripts/docs-html/fixed/${doc.slug}.html`, 'utf8');

    console.log(`Updating: ${entry.title} (${entry.docId})...`);

    await drive.files.update({
      fileId: entry.docId,
      media: {
        mimeType: 'text/html',
        body: Readable.from(Buffer.from(html)),
      },
    });

    console.log(`  Done: ${entry.title}`);
  }

  console.log('\nAll 6 docs updated successfully.');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
