import { readFileSync } from 'fs';
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

const docs = [
  // Tool SEO+CTA docs
  { name: 'Priority Tools SEO+CTA', id: '1WISto7HKZI371P3QSTP6_PwNs6djCxotXRqBJA7_CDo' },
  { name: 'Secondary Tools SEO+CTA', id: '1JkNmoNY7ROlRatkW7hEzZpWvfGS3D3G7o09Meh_YUXg' },
  { name: 'Combined Tool SEO+CTA', id: '1Ap8QCgzTJ8xiRX0iwSQVfDRVZDhf5K-sxmoqcSRWfDw' },
  // Publish-ready docs (from tracker)
  { name: 'Rental Beast Partnership', id: '1mwp0aMGl4euk9i2TV-IIavs0dhLpciU6rTeH8gSiOfQ' },
  { name: 'Best PM Software 2026', id: '1rMeq-xc988b7KZtX1kF9X6D_JsvDXzUuOVRF-pdqDEY' },
  { name: 'Renovation ROI Calculator', id: '1yqBM8bL7-81_g07F4zTq4jU7PN-p4s_mqfaCrWCLlq0' },
  { name: 'Rental Listing Description Generator', id: '1PYjDh8BtMJcNE3kVc3wLHPDv-aWSthIewrQr5Y2nNQk' },
  { name: 'Appliance Replacement Planner', id: '1uOuJE86UjZBNBGBKgqhvTq-1K6d7j1j8VnQs5Kfqqas' },
  // Combined scenario docs
  { name: 'Large Portfolio Scenarios', id: '1W4DezIi31a77liz5DifheUxEK3Xoj3Z7y39BIr_Kxlg' },
  { name: 'Scale to New Markets', id: '1-864zveYS83hyV5ol-fUWw4ii2JcRLUTkx1pIrFB1Z8' },
  { name: 'Why Generic CRMs Fail', id: '1u7-0YmRcIxPqW8IXUcj-l4WH21Ob6eiy0KqhTfd0g_o' },
  // Trackers
  { name: 'Content Consolidation Tracker', id: '1u0luDlk0ALAUNTZuWK181OyrmsomUbPF-2w-YB87QvY' },
  { name: 'PR Content Tracker', id: '1slItUknjbQ1C-94ltVtY89TDleYjQRNhic-e7dF83uA' },
];

for (const doc of docs) {
  try {
    await drive.permissions.create({
      fileId: doc.id,
      requestBody: { role: 'writer', type: 'anyone' },
    });
    console.log(`✓ ${doc.name}`);
  } catch (e) {
    console.log(`✗ ${doc.name}: ${e.message}`);
  }
}
console.log('\nDone — all docs shared as "anyone with link can edit"');
