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

// Docs 16-20 share docId 1uAxEluslH6k9hWHhbsG74sxQbI_c8kVGlDiFYgItQAI
// Docs 21-25 share docId 1D91c_NP__F4BEIlNYpx17gad0eBOpqB08BYomUOVfWU
// Doc 26 has docId 1H_dkAUotqibKZwMPsq-ZL-Dgy1hANsIWoKYhn_xkNR0

const uploads = [
  {
    docId: '1uAxEluslH6k9hWHhbsG74sxQbI_c8kVGlDiFYgItQAI',
    label: 'Priority Tools (5 posts)',
    files: [
      'scripts/docs-html/fixed/leasing_overhead_calculator.html',
      'scripts/docs-html/fixed/showing_schedule_builder.html',
      'scripts/docs-html/fixed/move_in_checklist_builder.html',
      'scripts/docs-html/fixed/tenant_application_risk_scorer.html',
      'scripts/docs-html/fixed/reference_check_question_generator.html',
    ],
  },
  {
    docId: '1D91c_NP__F4BEIlNYpx17gad0eBOpqB08BYomUOVfWU',
    label: 'Secondary Tools (5 posts)',
    files: [
      'scripts/docs-html/fixed/showing_confirmation_message_generator.html',
      'scripts/docs-html/fixed/vacancy_reactivation_checklist.html',
      'scripts/docs-html/fixed/rental_inquiry_response_time_calculator.html',
      'scripts/docs-html/fixed/leasing_funnel_conversion_calculator.html',
      'scripts/docs-html/fixed/rental_listing_quality_scorer.html',
    ],
  },
  {
    docId: '1H_dkAUotqibKZwMPsq-ZL-Dgy1hANsIWoKYhn_xkNR0',
    label: 'Leasing Operations Assessment',
    files: [
      'scripts/docs-html/fixed/leasing_operations_assessment_combined_.html',
    ],
  },
];

async function main() {
  for (const upload of uploads) {
    // Combine all HTML files for this docId with separators
    const combined = upload.files
      .map(f => readFileSync(f, 'utf8'))
      .join('\n<hr>\n<br>\n');

    const html = `<html><body>${combined}</body></html>`;

    console.log(`Uploading: ${upload.label} → ${upload.docId}`);
    console.log(`  Files: ${upload.files.length}, HTML size: ${html.length} chars`);

    try {
      await drive.files.update({
        fileId: upload.docId,
        media: {
          mimeType: 'text/html',
          body: Readable.from(Buffer.from(html)),
        },
      });
      console.log(`  ✓ Updated successfully\n`);
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}\n`);
    }
  }

  console.log('Done.');
}

main().catch(console.error);
