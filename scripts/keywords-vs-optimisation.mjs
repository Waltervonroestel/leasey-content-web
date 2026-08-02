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

async function getToken() {
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID, client_secret: env.GOOGLE_CLIENT_SECRET,
      refresh_token: env.GOOGLE_REFRESH_TOKEN, grant_type: 'refresh_token',
    }),
  });
  return (await r.json()).access_token;
}

async function main() {
  const token = await getToken();
  const end = new Date(), start = new Date();
  start.setDate(end.getDate() - 90);
  const fmt = d => d.toISOString().slice(0, 10);

  // GSC page+query
  console.log('Fetching GSC page+query data...');
  const r = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ startDate: fmt(start), endDate: fmt(end), dimensions: ['page', 'query'], rowLimit: 25000, dataState: 'all' }),
    }
  );
  const gscRows = (await r.json()).rows || [];
  console.log(`${gscRows.length} page+query rows`);

  // Read current recommendations from sheet
  const o = new google.auth.OAuth2(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET);
  o.setCredentials({ refresh_token: env.GOOGLE_SHEETS_REFRESH_TOKEN });
  const sheets = google.sheets({ version: 'v4', auth: o });

  const sheetData = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `'Optimisation map'!A:K`,
  });
  const rows = sheetData.data.values || [];
  const header = rows[0];
  const urlCol = header.indexOf('URL');
  const recCol = header.indexOf('Recommendation');
  const reasonCol = header.indexOf('Reason');
  const combineCol = header.indexOf('Combine with');
  const clusterCol = header.indexOf('Cluster');

  // Build URL -> recommendation map
  const urlRec = {};
  for (let i = 1; i < rows.length; i++) {
    const url = rows[i][urlCol] || '';
    urlRec[url] = {
      rec: rows[i][recCol] || '',
      reason: rows[i][reasonCol] || '',
      combineWith: rows[i][combineCol] || '',
      cluster: rows[i][clusterCol] || '',
    };
  }

  // Map GSC data to recommendations
  const keywordMap = []; // {query, page, clicks, impressions, position, rec, combineWith, cluster, impact}

  for (const row of gscRows) {
    const fullUrl = row.keys[0];
    const query = row.keys[1];
    const path = fullUrl.replace('https://www.leasey.ai', '').replace('https://blog.leasey.ai', '');

    // Try to find the URL in the sheet (could be full URL or path)
    let info = urlRec[path] || urlRec[fullUrl];
    if (!info) {
      // Try without trailing slash
      info = urlRec[path.replace(/\/$/, '')] || urlRec[path + '/'];
    }

    keywordMap.push({
      query,
      page: fullUrl,
      clicks: row.clicks,
      impressions: row.impressions,
      position: row.position,
      rec: info?.rec || 'Not in map',
      combineWith: info?.combineWith || '',
      cluster: info?.cluster || '',
    });
  }

  // ── ANALYSIS ──

  // 1. Keywords AT RISK (on pages marked Eliminate or Combine)
  const atRisk = keywordMap
    .filter(k => ['Eliminate', 'Combine'].includes(k.rec) && k.clicks > 0)
    .sort((a, b) => b.clicks - a.clicks);

  // 2. Keywords that GAIN (on Keep pages that receive combine traffic)
  const combineTargets = new Set();
  for (const url of Object.keys(urlRec)) {
    if (urlRec[url].combineWith) combineTargets.add(urlRec[url].combineWith);
  }
  const gainers = keywordMap
    .filter(k => k.rec === 'Keep' && combineTargets.has(k.page))
    .sort((a, b) => b.impressions - a.impressions);

  // 3. Striking distance keywords on pages marked Keep (best optimization opportunities)
  const strikingKeep = keywordMap
    .filter(k => k.rec === 'Keep' && k.position > 10 && k.position <= 20 && k.impressions >= 10)
    .sort((a, b) => b.impressions - a.impressions);

  // 4. Cannibalized keywords (same query, 2+ pages, at least one marked Combine)
  const queryPages = {};
  for (const k of keywordMap) {
    if (!queryPages[k.query]) queryPages[k.query] = [];
    queryPages[k.query].push(k);
  }
  const cannibalized = [];
  for (const [query, pages] of Object.entries(queryPages)) {
    if (pages.length < 2) continue;
    const hasAction = pages.some(p => ['Combine', 'Eliminate'].includes(p.rec));
    if (!hasAction) continue;
    const totalImpr = pages.reduce((s, p) => s + p.impressions, 0);
    if (totalImpr < 5) continue;
    cannibalized.push({ query, pages, totalImpr });
  }
  cannibalized.sort((a, b) => b.totalImpr - a.totalImpr);

  // ── WRITE TO NEW SHEET ──
  const SHEET_NAME = 'Keywords vs Optimisation';
  const sp = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID, fields: 'sheets.properties' });
  const existing = sp.data.sheets.find(s => s.properties.title === SHEET_NAME);
  if (existing) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID,
      requestBody: { requests: [{ deleteSheet: { sheetId: existing.properties.sheetId } }] },
    });
  }

  // Estimate rows needed
  const totalRows = 10 + atRisk.length + 5 + Math.min(gainers.length, 200) + 5 + Math.min(strikingKeep.length, 300) + 5 + cannibalized.length * 4;
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: {
      requests: [{ addSheet: { properties: { title: SHEET_NAME, gridProperties: { rowCount: Math.max(totalRows, 100), columnCount: 9 } } } }],
    },
  });

  // Build all rows
  const allRows = [];

  // ── Section 1: AT RISK ──
  allRows.push(['═══ KEYWORDS AT RISK (clicks on pages to Eliminate/Combine) ═══', '', '', '', '', '', '', '', '']);
  allRows.push(['These keywords have real clicks but their page is marked for removal or merge.']);
  allRows.push(['Action: ensure the combine-target page covers this keyword before removing.']);
  allRows.push([]);
  allRows.push(['Query', 'Clicks', 'Impressions', 'Position', 'Page', 'Recommendation', 'Combine Into', 'Cluster', 'Risk Level']);

  for (const k of atRisk.slice(0, 500)) {
    const risk = k.clicks >= 5 ? 'HIGH' : k.clicks >= 2 ? 'MEDIUM' : 'LOW';
    allRows.push([k.query, k.clicks, k.impressions, Math.round(k.position * 10) / 10, k.page, k.rec, k.combineWith, k.cluster, risk]);
  }

  // ── Section 2: STRIKING DISTANCE ──
  allRows.push([]);
  allRows.push(['═══ STRIKING DISTANCE OPPORTUNITIES (pos 11-20 on Keep pages) ═══']);
  allRows.push(['These keywords are almost on page 1. Optimize these pages to push them into top 10.']);
  allRows.push([]);
  allRows.push(['Query', 'Clicks', 'Impressions', 'Position', 'Page', 'Recommendation', '', 'Cluster', 'Potential']);

  for (const k of strikingKeep.slice(0, 300)) {
    const potential = k.impressions >= 100 ? 'HIGH' : k.impressions >= 30 ? 'MEDIUM' : 'LOW';
    allRows.push([k.query, k.clicks, k.impressions, Math.round(k.position * 10) / 10, k.page, k.rec, '', k.cluster, potential]);
  }

  // ── Section 3: CANNIBALIZED QUERIES ──
  allRows.push([]);
  allRows.push(['═══ CANNIBALIZED QUERIES (2+ URLs, at least one marked Combine/Eliminate) ═══']);
  allRows.push(['After consolidation, the Keep page should absorb all this traffic.']);
  allRows.push([]);
  allRows.push(['Query', 'Total Impressions', '# URLs', 'URL', 'Clicks', 'Position', 'Recommendation', 'Cluster', '']);

  for (const c of cannibalized.slice(0, 200)) {
    for (let i = 0; i < c.pages.length; i++) {
      const p = c.pages[i];
      allRows.push([
        i === 0 ? c.query : '',
        i === 0 ? c.totalImpr : '',
        i === 0 ? c.pages.length : '',
        p.page, p.clicks, Math.round(p.position * 10) / 10, p.rec, p.cluster, '',
      ]);
    }
    allRows.push([]); // separator
  }

  // Write
  console.log(`Writing ${allRows.length} rows to "${SHEET_NAME}"...`);

  // Expand if needed
  if (allRows.length > totalRows) {
    const sheetInfo = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID, fields: 'sheets.properties' });
    const s = sheetInfo.data.sheets.find(s => s.properties.title === SHEET_NAME);
    if (s) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SHEET_ID,
        requestBody: {
          requests: [{
            updateSheetProperties: {
              properties: { sheetId: s.properties.sheetId, gridProperties: { rowCount: allRows.length + 10, columnCount: 9 } },
              fields: 'gridProperties.rowCount',
            },
          }],
        },
      });
    }
  }

  const BATCH = 500;
  for (let i = 0; i < allRows.length; i += BATCH) {
    const batch = allRows.slice(i, i + BATCH);
    const startRow = i + 1;
    const endRow = startRow + batch.length - 1;
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `'${SHEET_NAME}'!A${startRow}:I${endRow}`,
      valueInputOption: 'RAW',
      requestBody: { values: batch },
    });
    process.stdout.write(`  ${endRow}/${allRows.length}\r`);
  }

  // ── CONSOLE SUMMARY ──
  const riskClicks = atRisk.reduce((s, k) => s + k.clicks, 0);
  const riskImpr = atRisk.reduce((s, k) => s + k.impressions, 0);
  const highRisk = atRisk.filter(k => k.clicks >= 5);

  console.log(`\n\n═══ RESUMEN ═══`);
  console.log(`\n📍 KEYWORDS AT RISK (en páginas a Eliminar/Combinar):`);
  console.log(`   ${atRisk.length} keywords con clicks`);
  console.log(`   ${riskClicks} clicks totales en riesgo`);
  console.log(`   ${riskImpr} impressions totales en riesgo`);
  console.log(`   ${highRisk.length} keywords HIGH risk (5+ clicks)`);
  console.log(`   Top 10:`);
  for (const k of atRisk.slice(0, 10)) {
    console.log(`     "${k.query}" ${k.clicks}c/pos ${k.position.toFixed(1)} → ${k.rec} (${k.page.replace('https://www.leasey.ai', '')})`);
  }

  console.log(`\n🎯 STRIKING DISTANCE (pos 11-20 en páginas Keep):`);
  console.log(`   ${strikingKeep.length} keywords por optimizar`);
  console.log(`   Top 10:`);
  for (const k of strikingKeep.slice(0, 10)) {
    console.log(`     "${k.query}" ${k.impressions}i/pos ${k.position.toFixed(1)} → ${k.page.replace('https://www.leasey.ai', '')}`);
  }

  console.log(`\n🔀 QUERIES CANIBALIZADAS con acción pendiente:`);
  console.log(`   ${cannibalized.length} queries donde la consolidación ayuda`);
  console.log(`   Top 10:`);
  for (const c of cannibalized.slice(0, 10)) {
    const keep = c.pages.find(p => p.rec === 'Keep');
    const lose = c.pages.find(p => ['Combine', 'Eliminate'].includes(p.rec));
    console.log(`     "${c.query}" (${c.totalImpr}i) — Keep: ${keep?.page.replace('https://www.leasey.ai', '') || '?'} | ${lose?.rec}: ${lose?.page.replace('https://www.leasey.ai', '') || '?'}`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
