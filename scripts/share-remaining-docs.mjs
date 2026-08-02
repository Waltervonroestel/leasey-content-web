import { readFileSync } from 'fs';
import { google } from 'googleapis';

const envFile = readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(l => {
  const m = l.match(/^([^#=]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim();
});

// Try both refresh tokens
const tokens = [
  { name: 'SHEETS', token: env.GOOGLE_SHEETS_REFRESH_TOKEN },
  { name: 'GSC', token: env.GOOGLE_REFRESH_TOKEN },
];

const docs = [
  { name: 'Priority Tools SEO+CTA', id: '1WISto7HKZI371P3QSTP6_PwNs6djCxotXRqBJA7_CDo' },
  { name: 'Secondary Tools SEO+CTA', id: '1JkNmoNY7ROlRatkW7hEzZpWvfGS3D3G7o09Meh_YUXg' },
  { name: 'Combined Tool SEO+CTA', id: '1Ap8QCgzTJ8xiRX0iwSQVfDRVZDhf5K-sxmoqcSRWfDw' },
  { name: 'Rental Listing Description Generator', id: '1PYjDh8BtMJcNE3kVc3wLHPDv-aWSthIewrQr5Y2nNQk' },
  { name: 'Appliance Replacement Planner', id: '1uOuJE86UjZBNBGBKgqhvTq-1K6d7j1j8VnQs5Kfqqas' },
  { name: 'Large Portfolio Scenarios', id: '1W4DezIi31a77liz5DifheUxEK3Xoj3Z7y39BIr_Kxlg' },
  { name: 'Scale to New Markets', id: '1-864zveYS83hyV5ol-fUWw4ii2JcRLUTkx1pIrFB1Z8' },
  { name: 'Why Generic CRMs Fail', id: '1u7-0YmRcIxPqW8IXUcj-l4WH21Ob6eiy0KqhTfd0g_o' },
];

for (const t of tokens) {
  console.log(`\n--- Trying ${t.name} token ---`);
  const o = new google.auth.OAuth2(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET);
  o.setCredentials({ refresh_token: t.token });
  const drive = google.drive({ version: 'v3', auth: o });

  for (const doc of docs) {
    try {
      await drive.permissions.create({
        fileId: doc.id,
        requestBody: { role: 'writer', type: 'anyone' },
      });
      console.log(`  ✓ ${doc.name}`);
    } catch (e) {
      const msg = e.message?.substring(0, 80) || 'unknown';
      console.log(`  ✗ ${doc.name}: ${msg}`);
    }
  }
}
