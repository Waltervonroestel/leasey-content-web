/**
 * Deep cannibalization audit — 5 improvements over the basic analysis:
 * 1. GSC query-level data: find URLs competing for the same search queries
 * 2. Full page content comparison (not just 500 chars)
 * 3. Bigram/trigram semantic comparison (beyond single keywords)
 * 4. Cross-cluster comparison (not just within same cluster)
 * 5. Actual ranking positions from GSC
 *
 * Output: updates columns I, J, K in the Optimisation map spreadsheet
 */

import { readFileSync, writeFileSync } from 'fs';
import { google } from 'googleapis';

// ── ENV ──
const envFile = readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(l => {
  const m = l.match(/^([^#=]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim();
});

const SITE = env.GSC_SITE_URL || 'https://www.leasey.ai/';
const SHEET_ID = env.OPTIMISATION_SHEET_ID;

// ── GSC AUTH ──
async function getAccessToken() {
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
  if (!j.access_token) throw new Error('GSC token refresh failed');
  return j.access_token;
}

// ── GSC QUERY: get queries per page ──
async function fetchQueriesByPage(token) {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 90);
  const fmt = d => d.toISOString().slice(0, 10);

  // Fetch page+query dimension (max 25000 rows)
  const r = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startDate: fmt(start),
        endDate: fmt(end),
        dimensions: ['page', 'query'],
        rowLimit: 25000,
        dataState: 'all',
      }),
    }
  );
  const j = await r.json();
  return (j.rows || []).map(row => ({
    page: row.keys[0],
    query: row.keys[1],
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: row.ctr,
    position: row.position,
  }));
}

// ── FETCH FULL PAGE CONTENT ──
async function fetchFullPage(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch('https://www.leasey.ai' + url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'LeaseyAuditBot/1.0' },
    });
    clearTimeout(timer);
    if (!res.ok) return '';
    const html = await res.text();
    // Strip scripts, styles, nav, footer, header — keep article/main content
    const bodyMatch = html.match(/<(?:main|article)[^>]*>([\s\S]*?)<\/(?:main|article)>/i)
      || html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (!bodyMatch) return '';
    return bodyMatch[1]
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[\s\S]*?<\/nav>/gi, '')
      .replace(/<footer[\s\S]*?<\/footer>/gi, '')
      .replace(/<header[\s\S]*?<\/header>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  } catch {
    clearTimeout(timer);
    return '';
  }
}

// ── NGRAM EXTRACTION ──
const STOPS = new Set(['the','a','an','in','on','at','to','for','of','and','or','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','can','shall','with','by','from','up','about','into','through','during','before','after','above','below','between','under','over','out','off','down','this','that','these','those','it','its','not','no','but','what','which','who','whom','how','when','where','why','all','each','every','both','few','more','most','other','some','such','than','too','very','just','also','only','then','so','if','as','any','same','own','here','there','your','our','their','my','his','her','we','you','they','he','she','me','us','him','them','one','two','three','new','old','good','best','top','key','use','using','get','make','like','need','way','well','even','many','much','still','back','take','come','see','look','find','give','first','last','long','great','high','right','big','small','work','time','year','day','free','full','real','help','know','think','want','let','keep','try','start','turn','call','part','sure','put','set','run','end','number','point','fact','case','thing','idea','question','business','company','companies','service','services','solution','solutions','system','systems','software','management','manager','managers','data','process','tools','tool','platform','team','teams','guide','article','read','learn','check','review','report','page','resources','blog','press','benefits','research','insights','news','listing','listings','property','properties','rental','rentals','tenant','tenants','landlord','landlords','lease','leasing','rent','renting','apartment','apartments','building','buildings','unit','units','market','industry','including','without','based','related','different','important','essential','effective','complete','comprehensive','specific','common','various','available','current','future','modern','smart','online','digital','real','estate','also','more','most','such','than','very','just','only','well','even','still','much','many','back','like','can','will','would','could','should','may','might']);

function extractNgrams(text) {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !STOPS.has(w));
  const ngrams = new Set();
  // Unigrams
  for (const w of words) ngrams.add(w);
  // Bigrams
  for (let i = 0; i < words.length - 1; i++) {
    ngrams.add(words[i] + ' ' + words[i + 1]);
  }
  // Trigrams
  for (let i = 0; i < words.length - 2; i++) {
    ngrams.add(words[i] + ' ' + words[i + 1] + ' ' + words[i + 2]);
  }
  return ngrams;
}

function ngramSimilarity(a, b) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const w of a) if (b.has(w)) inter++;
  return inter / (a.size + b.size - inter);
}

// ══════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════

async function main() {
  const pages = JSON.parse(readFileSync('page-content-audit.json', 'utf8'));

  // ── STEP 1: GSC query-level data ──
  console.log('1/5 Fetching GSC query data (90 days)...');
  const token = await getAccessToken();
  const gscRows = await fetchQueriesByPage(token);
  console.log(`   ${gscRows.length} page+query rows from GSC`);

  // Build lookup: URL -> queries, and query -> URLs
  const urlToQueries = {};  // url -> [{query, clicks, impressions, position}]
  const queryToUrls = {};   // query -> [{url, clicks, impressions, position}]

  for (const row of gscRows) {
    const urlPath = row.page.replace('https://www.leasey.ai', '').replace('https://blog.leasey.ai', '');
    if (!urlToQueries[urlPath]) urlToQueries[urlPath] = [];
    urlToQueries[urlPath].push({ query: row.query, clicks: row.clicks, impressions: row.impressions, position: row.position });

    if (!queryToUrls[row.query]) queryToUrls[row.query] = [];
    queryToUrls[row.query].push({ url: urlPath, clicks: row.clicks, impressions: row.impressions, position: row.position });
  }

  // Find REAL cannibalization: queries where 2+ URLs from the site appear
  const cannibalizedQueries = {};
  for (const [query, urls] of Object.entries(queryToUrls)) {
    if (urls.length >= 2) {
      cannibalizedQueries[query] = urls.sort((a, b) => b.impressions - a.impressions);
    }
  }
  console.log(`   ${Object.keys(cannibalizedQueries).length} queries with 2+ URLs competing`);

  // Build per-URL cannibalization map
  const urlCannibalization = {}; // url -> [{query, competitor_url, my_position, their_position, impressions}]
  for (const [query, urls] of Object.entries(cannibalizedQueries)) {
    for (let i = 0; i < urls.length; i++) {
      for (let j = 0; j < urls.length; j++) {
        if (i === j) continue;
        const me = urls[i];
        const them = urls[j];
        if (!urlCannibalization[me.url]) urlCannibalization[me.url] = [];
        urlCannibalization[me.url].push({
          query,
          competitor: them.url,
          myPosition: me.position,
          theirPosition: them.position,
          myClicks: me.clicks,
          theirClicks: them.clicks,
          impressions: me.impressions + them.impressions,
        });
      }
    }
  }

  // ── STEP 2: Fetch full page content for pages in the optimisation map ──
  console.log('2/5 Fetching full page content...');
  const CONCURRENCY = 10;
  const fullContent = {};
  const urls = pages.map(p => p.url);

  for (let i = 0; i < urls.length; i += CONCURRENCY) {
    const batch = urls.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map(u => fetchFullPage(u)));
    for (let j = 0; j < batch.length; j++) {
      fullContent[batch[j]] = results[j];
    }
    if ((i + CONCURRENCY) % 100 === 0 || i + CONCURRENCY >= urls.length) {
      process.stdout.write(`\r   ${Math.min(i + CONCURRENCY, urls.length)}/${urls.length} pages`);
    }
  }
  console.log('');

  // ── STEP 3: Build ngram signatures ──
  console.log('3/5 Building ngram signatures...');
  const signatures = {};
  for (const p of pages) {
    const text = [p.h1 || '', p.meta || '', ...(p.h2s || []), fullContent[p.url] || ''].join(' ');
    signatures[p.url] = extractNgrams(text);
  }

  // ── STEP 4: Cross-cluster comparison ──
  console.log('4/5 Cross-cluster similarity analysis...');
  // For efficiency, only compare pages that share GSC queries OR are in same cluster
  // Build pairs to compare
  const pairsToCompare = new Set();

  // Same-cluster pairs
  const clusters = {};
  for (const p of pages) {
    if (!clusters[p.cluster]) clusters[p.cluster] = [];
    clusters[p.cluster].push(p);
  }
  for (const cPages of Object.values(clusters)) {
    for (let i = 0; i < cPages.length; i++) {
      for (let j = i + 1; j < cPages.length; j++) {
        pairsToCompare.add(`${cPages[i].url}|||${cPages[j].url}`);
      }
    }
  }

  // Cross-cluster pairs from GSC cannibalization
  for (const [url, cannData] of Object.entries(urlCannibalization)) {
    for (const c of cannData) {
      const key = [url, c.competitor].sort().join('|||');
      pairsToCompare.add(key);
    }
  }

  console.log(`   ${pairsToCompare.size} pairs to compare`);

  // Compute similarities
  const similarityMap = {}; // url -> [{url, sim, sameCluster, sharedQueries}]
  const pageByUrl = {};
  for (const p of pages) pageByUrl[p.url] = p;

  for (const pair of pairsToCompare) {
    const [a, b] = pair.split('|||');
    if (!signatures[a] || !signatures[b]) continue;

    const sim = ngramSimilarity(signatures[a], signatures[b]);
    if (sim < 0.15) continue; // too low to matter

    const pa = pageByUrl[a], pb = pageByUrl[b];
    if (!pa || !pb) continue;

    const sameCluster = pa.cluster === pb.cluster;

    // Count shared GSC queries
    let sharedQueries = 0;
    let sharedQueryList = [];
    if (urlCannibalization[a]) {
      for (const c of urlCannibalization[a]) {
        if (c.competitor === b) {
          sharedQueries++;
          sharedQueryList.push(c.query);
        }
      }
    }

    const entry = { sim: Math.round(sim * 100), sameCluster, sharedQueries, sharedQueryList: sharedQueryList.slice(0, 5) };

    if (!similarityMap[a]) similarityMap[a] = [];
    similarityMap[a].push({ url: b, ...entry, perf: pb.clicks + pb.visits });

    if (!similarityMap[b]) similarityMap[b] = [];
    similarityMap[b].push({ url: a, ...entry, perf: pa.clicks + pa.visits });
  }

  // Sort each URL's similar pages by (shared queries desc, similarity desc)
  for (const url of Object.keys(similarityMap)) {
    similarityMap[url].sort((a, b) => (b.sharedQueries * 1000 + b.sim) - (a.sharedQueries * 1000 + a.sim));
  }

  // ── STEP 5: Generate recommendations ──
  console.log('5/5 Generating recommendations...');

  const recommendations = [];

  for (const p of pages) {
    const similar = similarityMap[p.url] || [];
    const perf = p.clicks + p.visits;
    const isDeprioritised = p.priority.includes('deprioritise');
    const gscQueries = urlToQueries[p.url] || [];
    const cannibData = urlCannibalization[p.url] || [];

    // Find top competitor (most shared queries, then highest similarity)
    const topCompetitor = similar[0] || null;
    const topByQueries = similar.find(s => s.sharedQueries > 0) || null;

    let rec = 'Keep';
    let reason = '';
    let combineWith = '';

    // ── ALWAYS KEEP ──
    if (['Homepage', 'Brand / Site pages'].includes(p.cluster)) {
      rec = 'Keep';
      reason = `Core site page. Always keep.`;
      recommendations.push({ sheetRow: p.sheetRow, rec, reason, combineWith });
      continue;
    }
    if (p.cluster === 'Leasey comparison pages') {
      rec = 'Keep';
      reason = `Comparison page "${p.h1}". Brand defence, captures "vs" searches.`;
      recommendations.push({ sheetRow: p.sheetRow, rec, reason, combineWith });
      continue;
    }

    // ── REAL CANNIBALIZATION (shared GSC queries) ──
    if (topByQueries) {
      const competitor = pageByUrl[topByQueries.url];
      const competitorPerf = competitor ? competitor.clicks + competitor.visits : 0;
      const queries = topByQueries.sharedQueryList.map(q => `"${q}"`).join(', ');

      if (perf < competitorPerf) {
        // This page is the weaker one
        if (p.clicks === 0) {
          rec = 'Combine';
          reason = `CANNIBALIZATION: shares ${topByQueries.sharedQueries} GSC queries with ${topByQueries.url} (${queries}). This page: ${p.clicks}c/${p.visits}v. Competitor: ${competitor.clicks}c/${competitor.visits}v. Merge into stronger page.`;
          combineWith = 'https://www.leasey.ai' + topByQueries.url;
        } else {
          rec = 'Combine';
          reason = `CANNIBALIZATION: shares ${topByQueries.sharedQueries} queries with ${topByQueries.url} (${queries}). Both rank but this page weaker (${p.clicks}c vs ${competitor.clicks}c). Consolidate to stop splitting authority.`;
          combineWith = 'https://www.leasey.ai' + topByQueries.url;
        }
        recommendations.push({ sheetRow: p.sheetRow, rec, reason, combineWith });
        continue;
      } else {
        // This page is the stronger one — keep but note the issue
        reason = `Keep (stronger side). Note: cannibalizes with ${topByQueries.url} on ${topByQueries.sharedQueries} queries (${queries}). Consider absorbing that page's content here.`;
        rec = 'Keep';
        recommendations.push({ sheetRow: p.sheetRow, rec, reason, combineWith });
        continue;
      }
    }

    // ── CONTENT SIMILARITY WITHOUT GSC DATA ──

    // Listing guides (city templates)
    if (p.cluster === 'Listing Guides' && p.url.includes('/listing-guides/')) {
      if (p.clicks > 0) {
        rec = 'Keep';
        reason = `City guide "${p.h1}" with ${p.clicks}c. Keep performing pages.`;
      } else if (p.visits >= 5) {
        rec = 'Keep';
        reason = `City guide "${p.h1}" with ${p.visits}v. Monitor.`;
      } else {
        rec = 'Eliminate';
        reason = `Templated city guide "${p.h1}" (${p.visits}v/0c). ~40 similar city guides dilute authority. Keep only top performers.`;
      }
      recommendations.push({ sheetRow: p.sheetRow, rec, reason, combineWith });
      continue;
    }

    // News pages
    if (p.cluster === 'News Pages') {
      if (p.clicks > 0) {
        rec = 'Keep'; reason = `News "${p.h1}" with ${p.clicks}c. Still driving traffic.`;
      } else if (p.visits >= 8) {
        rec = 'Keep'; reason = `News "${p.h1}" with ${p.visits}v. Some interest.`;
      } else {
        rec = 'Eliminate'; reason = `Old news "${p.h1}" (${p.visits}v/0c). News decays fast. Remove.`;
      }
      recommendations.push({ sheetRow: p.sheetRow, rec, reason, combineWith });
      continue;
    }

    // Deprioritised
    if (isDeprioritised) {
      if (p.clicks >= 3) {
        rec = 'Keep'; reason = `Deprioritised but ${p.clicks}c/${p.visits}v. "${p.h1}". Worth keeping.`;
      } else if (p.clicks > 0 && topCompetitor && topCompetitor.perf > perf) {
        rec = 'Combine';
        reason = `Deprioritised, ${p.clicks}c. "${p.h1}" overlaps ${topCompetitor.sim}% with "${pageByUrl[topCompetitor.url]?.h1}". Merge.`;
        combineWith = 'https://www.leasey.ai' + topCompetitor.url;
      } else if (p.clicks > 0) {
        rec = 'Keep'; reason = `Deprioritised but has ${p.clicks}c. "${p.h1}".`;
      } else if (p.visits >= 8) {
        rec = 'Keep'; reason = `Deprioritised, ${p.visits}v. "${p.h1}". Monitor.`;
      } else if (topCompetitor && topCompetitor.perf > perf) {
        rec = 'Combine';
        reason = `Deprioritised, ${p.visits}v/0c. "${p.h1}" overlaps ${topCompetitor.sim}% with "${pageByUrl[topCompetitor.url]?.h1}" (${pageByUrl[topCompetitor.url]?.clicks}c/${pageByUrl[topCompetitor.url]?.visits}v).`;
        combineWith = 'https://www.leasey.ai' + topCompetitor.url;
      } else {
        rec = 'Eliminate'; reason = `Deprioritised, ${p.visits}v/0c. "${p.h1}". Off-topic. Remove.`;
      }
      recommendations.push({ sheetRow: p.sheetRow, rec, reason, combineWith });
      continue;
    }

    // ── GENERAL (core clusters) ──
    if (p.clicks >= 5) {
      if (topCompetitor && topCompetitor.sim >= 30 && pageByUrl[topCompetitor.url]?.clicks >= 5) {
        rec = 'Keep';
        reason = `Strong (${p.clicks}c/${p.visits}v). "${p.h1}". Content overlap ${topCompetitor.sim}% with "${pageByUrl[topCompetitor.url]?.h1}" — both perform, differentiate angles.`;
      } else {
        rec = 'Keep';
        reason = `Strong (${p.clicks}c/${p.visits}v). "${p.h1}".`;
      }
    } else if (p.clicks > 0) {
      if (topCompetitor && topCompetitor.perf > perf && topCompetitor.sim >= 25) {
        rec = 'Combine';
        reason = `Low clicks (${p.clicks}c). "${p.h1}" overlaps ${topCompetitor.sim}% with "${pageByUrl[topCompetitor.url]?.h1}" (${pageByUrl[topCompetitor.url]?.clicks}c). Merge.`;
        combineWith = 'https://www.leasey.ai' + topCompetitor.url;
      } else {
        rec = 'Keep';
        reason = `Has clicks (${p.clicks}c/${p.visits}v). "${p.h1}". Best in topic.`;
      }
    } else if (p.visits >= 8) {
      if (topCompetitor && topCompetitor.perf > perf && topCompetitor.sim >= 25) {
        rec = 'Combine';
        reason = `No clicks, ${p.visits}v. "${p.h1}" overlaps ${topCompetitor.sim}% with "${pageByUrl[topCompetitor.url]?.h1}" (${pageByUrl[topCompetitor.url]?.clicks}c). Merge.`;
        combineWith = 'https://www.leasey.ai' + topCompetitor.url;
      } else {
        rec = 'Keep';
        reason = `No clicks but ${p.visits}v. "${p.h1}". Refresh to improve CTR.`;
      }
    } else if (p.visits >= 3) {
      if (topCompetitor && topCompetitor.perf > perf && topCompetitor.sim >= 20) {
        rec = 'Combine';
        reason = `Low traffic (${p.visits}v/0c). "${p.h1}" overlaps ${topCompetitor.sim}% with "${pageByUrl[topCompetitor.url]?.h1}". Combine.`;
        combineWith = 'https://www.leasey.ai' + topCompetitor.url;
      } else {
        rec = 'Keep';
        reason = `Low traffic (${p.visits}v/0c). "${p.h1}". Unique topic — monitor.`;
      }
    } else {
      if (topCompetitor && topCompetitor.perf > 0) {
        rec = 'Combine';
        reason = `Near-zero (${p.visits}v/0c). "${p.h1}" overlaps ${topCompetitor.sim}% with "${pageByUrl[topCompetitor.url]?.h1}" (${pageByUrl[topCompetitor.url]?.clicks}c/${pageByUrl[topCompetitor.url]?.visits}v). Merge.`;
        combineWith = 'https://www.leasey.ai' + topCompetitor.url;
      } else if (topCompetitor) {
        rec = 'Eliminate';
        reason = `Near-zero (${p.visits}v/0c). "${p.h1}". Similar page also has no traffic. Both redundant.`;
      } else {
        rec = 'Eliminate';
        reason = `Near-zero (${p.visits}v/0c). "${p.h1}". No similar page to merge into. No interest.`;
      }
    }

    recommendations.push({ sheetRow: p.sheetRow, rec, reason, combineWith });
  }

  // ── SUMMARY ──
  const counts = { Keep: 0, Combine: 0, Eliminate: 0 };
  for (const r of recommendations) counts[r.rec]++;

  console.log(`\n═══ RESULTS ═══`);
  console.log(`  Keep: ${counts.Keep}`);
  console.log(`  Combine: ${counts.Combine}`);
  console.log(`  Eliminate: ${counts.Eliminate}`);

  // Show top cannibalization pairs (from GSC data)
  const cannPairs = [];
  for (const [query, urls] of Object.entries(cannibalizedQueries)) {
    if (urls.length >= 2 && urls[0].impressions >= 10) {
      cannPairs.push({ query, urls: urls.slice(0, 3), totalImpressions: urls.reduce((s, u) => s + u.impressions, 0) });
    }
  }
  cannPairs.sort((a, b) => b.totalImpressions - a.totalImpressions);

  console.log(`\n═══ TOP 20 CANNIBALIZED QUERIES (real GSC data) ═══`);
  for (const cp of cannPairs.slice(0, 20)) {
    console.log(`  "${cp.query}" (${cp.totalImpressions} total impressions):`);
    for (const u of cp.urls) {
      console.log(`    pos ${u.position.toFixed(1)} | ${u.clicks}c/${u.impressions}i | ${u.url}`);
    }
  }

  // Cross-cluster cannibalization
  console.log(`\n═══ CROSS-CLUSTER CANNIBALIZATION ═══`);
  let crossCount = 0;
  for (const [url, sims] of Object.entries(similarityMap)) {
    for (const s of sims) {
      if (!s.sameCluster && s.sharedQueries >= 2) {
        const pa = pageByUrl[url], pb = pageByUrl[s.url];
        if (pa && pb) {
          console.log(`  [${pa.cluster}] "${pa.h1}" vs [${pb.cluster}] "${pb.h1}"`);
          console.log(`    ${s.sharedQueries} shared queries, ${s.sim}% content overlap`);
          crossCount++;
          if (crossCount >= 15) break;
        }
      }
    }
    if (crossCount >= 15) break;
  }

  // ── WRITE TO SHEET ──
  console.log('\nWriting to spreadsheet...');
  const o = new google.auth.OAuth2(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET);
  o.setCredentials({ refresh_token: env.GOOGLE_SHEETS_REFRESH_TOKEN });
  const sheets = google.sheets({ version: 'v4', auth: o });

  // Headers
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `'Optimisation map'!I1:K1`,
    valueInputOption: 'RAW',
    requestBody: { values: [['Recommendation', 'Reason', 'Combine with']] },
  });

  // Data
  const values = recommendations.map(r => [r.rec, r.reason, r.combineWith]);
  const BATCH = 200;
  for (let i = 0; i < values.length; i += BATCH) {
    const batch = values.slice(i, i + BATCH);
    const startRow = i + 2;
    const endRow = startRow + batch.length - 1;
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `'Optimisation map'!I${startRow}:K${endRow}`,
      valueInputOption: 'RAW',
      requestBody: { values: batch },
    });
    console.log(`  Wrote rows ${startRow}-${endRow}`);
  }

  console.log('\n✓ Done. Columns I, J, K updated with deep cannibalization analysis.');
}

main().catch(e => { console.error(e); process.exit(1); });
