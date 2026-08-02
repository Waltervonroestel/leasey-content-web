// Reusable reader for the Clusterización 2026 Google Sheet.
// Usage: node scripts/read-cluster-keywords.mjs <url-substring>
// Example: node scripts/read-cluster-keywords.mjs comparing-tenant-credit-background-check-services
//
// Prints, for the matching URL:
//   - The "Optimizacion de contenido" decision row (GA4/GSC visits, kw count, meta, decision, work).
//   - The full ranking-keyword list from Semrush (keyword | pos | vol | KD | intent) sorted by position.
//   - The Organic Keywords tab rows (second data source) sorted by position.
//   - The cluster (Blog Category) from the "Optimizacion + Clusters (Daniel)" tab.
// Needs GOOGLE_SHEETS_REFRESH_TOKEN in ../.env.local (Sheets scope).

import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
env.split('\n').forEach(l => { const m = l.match(/^([^#=]+)=(.*)$/); if (m) process.env[m[1].trim()] = m[2].trim(); });

const target = process.argv[2];
if (!target) { console.error('Usage: node scripts/read-cluster-keywords.mjs <url-substring>'); process.exit(1); }

const auth = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
auth.setCredentials({ refresh_token: process.env.GOOGLE_SHEETS_REFRESH_TOKEN });
const sheets = google.sheets({ version: 'v4', auth });
const SID = '1g5HW6gK1jfJdlt8U6E13KAQ75z5gax5uw3j1f-ia1dI';

async function tab(name, range) {
  const res = await sheets.spreadsheets.values.get({ spreadsheetId: SID, range: `'${name}'!${range}` });
  return res.data.values || [];
}

// 1. Decision row from "Optimizacion de contenido"
const opt = await tab('Optimizacion de contenido', 'A1:N400');
const optHit = opt.slice(1).find(r => (r[0] || '').includes(target));
if (optHit) {
  console.log('=== Optimizacion de contenido (decision) ===');
  console.log('URL:', optHit[0]);
  console.log('GA4 visits:', optHit[1], '| GSC visits:', optHit[2], '| Ranks:', optHit[3], '| Keyword count:', optHit[4]);
  console.log('Meta title:', optHit[7]);
  console.log('Meta description:', optHit[8]);
  console.log('Accion:', optHit[9], '| Primary pillar:', optHit[10], '| Secondary:', optHit[11]);
  console.log('Decision:', optHit[12]);
  console.log('Trabajo:', optHit[13]);
} else {
  console.log('(no row in Optimizacion de contenido for this URL)');
}

// 2. Semrush ranking keywords (richest source: KD + intent + SERP features)
const sem = await tab('Semrush', 'A1:I2000');
const semHits = sem.slice(1)
  .filter(r => (r[0] || '').includes(target))
  .map(r => ({ kw: r[1], pos: parseFloat(r[2]) || 999, vol: parseInt(r[3]) || 0, kd: r[4], intent: r[7] }))
  .sort((a, b) => a.pos - b.pos);
console.log(`\n=== Semrush ranking keywords (${semHits.length}) — keyword | pos | vol | KD | intent ===`);
semHits.forEach(m => console.log(`${m.kw}\t| ${m.pos}\t| ${m.vol}\t| ${m.kd}\t| ${m.intent}`));

// 3. Organic Keywords tab (second data source)
const org = await tab('Organic Keywords', 'A1:I2000');
const orgHits = org.slice(1)
  .filter(r => (r[1] || '').includes(target))
  .map(r => ({ kw: r[0], pos: parseFloat(r[2]) || 999, vol: parseInt(r[3]) || 0 }))
  .sort((a, b) => a.pos - b.pos);
console.log(`\n=== Organic Keywords tab (${orgHits.length}) — keyword | pos | vol ===`);
orgHits.forEach(m => console.log(`${m.kw}\t| ${m.pos}\t| ${m.vol}`));

// 4. Cluster (Blog Category)
const clu = await tab('Optimizacion + Clusters (Daniel)', 'A1:O400');
const cluHit = clu.slice(1).find(r => (r[0] || '').includes(target));
if (cluHit) console.log('\n=== Cluster (Blog Category):', cluHit[14], '===');
