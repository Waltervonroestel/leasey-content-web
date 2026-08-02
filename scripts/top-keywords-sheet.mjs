import { readFileSync } from 'fs';
import { google } from 'googleapis';

const envFile = readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(l => {
  const m = l.match(/^([^#=]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim();
});

const SITE = env.GSC_SITE_URL || 'https://www.leasey.ai/';
const SHEET_ID = env.OPTIMISATION_SHEET_ID;

// GSC auth
async function getToken() {
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      refresh_token: env.GOOGLE_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });
  const j = await r.json();
  if (!j.access_token) throw new Error('Token refresh failed');
  return j.access_token;
}

async function gscQuery(token, dimensions, rowLimit = 25000) {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 90);
  const fmt = d => d.toISOString().slice(0, 10);
  const r = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ startDate: fmt(start), endDate: fmt(end), dimensions, rowLimit, dataState: 'all' }),
    }
  );
  return (await r.json()).rows || [];
}

async function main() {
  console.log('Fetching GSC data...');
  const token = await getToken();

  // Query-level data
  const queryRows = await gscQuery(token, ['query'], 25000);
  console.log(`${queryRows.length} queries from GSC`);

  // Page+query for URL mapping
  const pageQueryRows = await gscQuery(token, ['page', 'query'], 25000);

  // Build query -> best URL map
  const queryBestUrl = {};
  for (const r of pageQueryRows) {
    const q = r.keys[1];
    if (!queryBestUrl[q] || r.clicks > queryBestUrl[q].clicks || (r.clicks === queryBestUrl[q].clicks && r.position < queryBestUrl[q].position)) {
      queryBestUrl[q] = { url: r.keys[0], clicks: r.clicks, position: r.position };
    }
  }

  // Sort by position (best first), then by impressions
  const sorted = queryRows
    .map(r => ({
      query: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      position: r.position,
      url: queryBestUrl[r.keys[0]]?.url || '',
    }))
    .sort((a, b) => a.position - b.position);

  // Create sheet
  const o = new google.auth.OAuth2(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET);
  o.setCredentials({ refresh_token: env.GOOGLE_SHEETS_REFRESH_TOKEN });
  const sheets = google.sheets({ version: 'v4', auth: o });

  // Try to add new sheet tab
  const SHEET_NAME = 'Top Keywords GSC';
  // Get existing sheets
  const sp = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID, fields: 'sheets.properties' });
  const existing = sp.data.sheets.find(s => s.properties.title === SHEET_NAME);

  if (existing) {
    // Delete and recreate to reset row count
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID,
      requestBody: { requests: [{ deleteSheet: { sheetId: existing.properties.sheetId } }] },
    });
  }
  const totalRows = sorted.length + 2;
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: {
      requests: [{ addSheet: { properties: { title: SHEET_NAME, gridProperties: { rowCount: totalRows, columnCount: 6 } } } }],
    },
  });
  console.log(`Created sheet "${SHEET_NAME}" with ${totalRows} rows`);

  // Headers
  const header = ['Query', 'Position', 'Clicks (90d)', 'Impressions (90d)', 'CTR', 'Best URL'];

  // Data rows
  const rows = sorted.map(r => [
    r.query,
    Math.round(r.position * 10) / 10,
    r.clicks,
    r.impressions,
    Math.round(r.ctr * 10000) / 100 + '%',
    r.url,
  ]);

  const all = [header, ...rows];

  // Write in batches
  const BATCH = 500;
  for (let i = 0; i < all.length; i += BATCH) {
    const batch = all.slice(i, i + BATCH);
    const startRow = i + 1;
    const endRow = startRow + batch.length - 1;
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `'${SHEET_NAME}'!A${startRow}:F${endRow}`,
      valueInputOption: 'RAW',
      requestBody: { values: batch },
    });
    console.log(`  Wrote rows ${startRow}-${endRow}`);
  }

  // Summary
  const top10 = sorted.filter(r => r.position <= 10);
  const top3 = sorted.filter(r => r.position <= 3);
  const striking = sorted.filter(r => r.position > 10 && r.position <= 20);

  console.log(`\n═══ RESUMEN ═══`);
  console.log(`  Total queries: ${sorted.length}`);
  console.log(`  Top 3 (pos 1-3): ${top3.length}`);
  console.log(`  Top 10 (pos 1-10): ${top10.length}`);
  console.log(`  Striking distance (pos 11-20): ${striking.length}`);
  console.log(`\n  Top 15 keywords por posición:`);
  for (const r of sorted.slice(0, 15)) {
    console.log(`    pos ${r.position.toFixed(1)} | ${r.clicks}c/${r.impressions}i | "${r.query}" → ${r.url.replace('https://www.leasey.ai', '')}`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
