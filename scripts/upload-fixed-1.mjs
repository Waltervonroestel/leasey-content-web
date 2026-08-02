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

// Indices 0-8 in manifest (the 9 docs to update)
const docs = [
  { idx: 0, slug: 'rental_beast_partnership' },
  { idx: 1, slug: 'best_pm_software_2026' },
  { idx: 2, slug: 'renovation_roi_calculator' },
  { idx: 3, slug: 'rental_listing_description_generator' },
  { idx: 4, slug: 'appliance_replacement_planner' },
  { idx: 5, slug: 'leasing_automation_for_large_portfolios' },
  { idx: 6, slug: 'scale_your_pm_firm_to_new_markets' },
  { idx: 7, slug: 'why_generic_crms_fail_at_leasing' },
  { idx: 8, slug: 'student_housing_leasing_software' },
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

  console.log('\nAll 9 docs updated successfully.');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
