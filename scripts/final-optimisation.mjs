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

  // ── GSC DATA ──
  console.log('1. Fetching GSC page+query data...');
  const r1 = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ startDate: fmt(start), endDate: fmt(end), dimensions: ['page', 'query'], rowLimit: 25000, dataState: 'all' }),
    }
  );
  const gscRows = (await r1.json()).rows || [];
  console.log(`   ${gscRows.length} page+query rows`);

  // Build per-URL data
  const urlData = {}; // url -> { queries: [{query, clicks, impressions, position}], topQuery, strikingQueries, totalClicks, totalImpressions }
  const queryToUrls = {}; // query -> [urls]

  for (const row of gscRows) {
    const url = row.keys[0];
    const query = row.keys[1];
    if (!urlData[url]) urlData[url] = { queries: [], totalClicks: 0, totalImpressions: 0 };
    urlData[url].queries.push({ query, clicks: row.clicks, impressions: row.impressions, position: row.position });
    urlData[url].totalClicks += row.clicks;
    urlData[url].totalImpressions += row.impressions;

    if (!queryToUrls[query]) queryToUrls[query] = [];
    queryToUrls[query].push({ url, clicks: row.clicks, impressions: row.impressions, position: row.position });
  }

  // Sort each URL's queries
  for (const d of Object.values(urlData)) {
    d.queries.sort((a, b) => b.impressions - a.impressions);
  }

  // ── PAGE CONTENT ──
  console.log('2. Loading page content data...');
  const pages = JSON.parse(readFileSync('page-content-audit.json', 'utf8'));
  const pageByUrl = {};
  for (const p of pages) pageByUrl[p.url] = p;

  // ── NGRAMS for similarity ──
  const STOPS = new Set(['the','a','an','in','on','at','to','for','of','and','or','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','can','shall','with','by','from','up','about','into','through','during','before','after','above','below','between','under','over','out','off','down','this','that','these','those','it','its','not','no','but','what','which','who','whom','how','when','where','why','all','each','every','both','few','more','most','other','some','such','than','too','very','just','also','only','then','so','if','as','any','same','own','here','there','your','our','their','my','his','her','we','you','they','he','she','me','us','him','them','one','two','three','new','old','good','best','top','key','use','using','get','make','like','need','way','well','even','many','much','still','back','take','come','see','look','find','give','first','last','long','great','high','right','big','small','work','time','year','day','free','full','real','help','know','think','want','let','keep','try','start','turn','call','part','sure','put','set','run','end']);
  function ngrams(text) {
    const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !STOPS.has(w));
    const s = new Set();
    for (const w of words) s.add(w);
    for (let i = 0; i < words.length - 1; i++) s.add(words[i] + ' ' + words[i + 1]);
    return s;
  }
  function sim(a, b) { if (!a.size || !b.size) return 0; let i = 0; for (const w of a) if (b.has(w)) i++; return i / (a.size + b.size - i); }

  // ── BUILD RECOMMENDATIONS ──
  console.log('3. Building recommendations...');

  // Cannibalized queries
  const cannibalizedQueries = {};
  for (const [query, urls] of Object.entries(queryToUrls)) {
    if (urls.length >= 2) cannibalizedQueries[query] = urls;
  }

  // Per-URL cannibalization
  const urlCannib = {};
  for (const [query, urls] of Object.entries(cannibalizedQueries)) {
    for (const u of urls) {
      for (const other of urls) {
        if (u.url === other.url) continue;
        if (!urlCannib[u.url]) urlCannib[u.url] = [];
        urlCannib[u.url].push({ query, competitor: other.url, myPos: u.position, theirPos: other.position, impressions: u.impressions + other.impressions });
      }
    }
  }

  // Cluster grouping + signatures
  const clusters = {};
  const sigs = {};
  for (const p of pages) {
    if (!clusters[p.cluster]) clusters[p.cluster] = [];
    clusters[p.cluster].push(p);
    sigs[p.url] = ngrams([p.h1 || '', p.meta || '', ...(p.h2s || []), p.bodyText || ''].join(' '));
  }

  // Similar pages (within + cross cluster via GSC)
  const similarMap = {};
  // Within cluster
  for (const cPages of Object.values(clusters)) {
    for (let i = 0; i < cPages.length; i++) {
      for (let j = i + 1; j < cPages.length; j++) {
        const s = sim(sigs[cPages[i].url], sigs[cPages[j].url]);
        if (s < 0.15) continue;
        const a = cPages[i].url, b = cPages[j].url;
        if (!similarMap[a]) similarMap[a] = [];
        if (!similarMap[b]) similarMap[b] = [];
        const sharedQ = (urlCannib[a] || []).filter(c => c.competitor === 'https://www.leasey.ai' + b || c.competitor === b).length;
        similarMap[a].push({ url: b, sim: Math.round(s * 100), sharedQueries: sharedQ, perf: (pageByUrl[b]?.clicks || 0) + (pageByUrl[b]?.visits || 0) });
        similarMap[b].push({ url: a, sim: Math.round(s * 100), sharedQueries: sharedQ, perf: (pageByUrl[a]?.clicks || 0) + (pageByUrl[a]?.visits || 0) });
      }
    }
  }
  // Cross cluster via GSC
  for (const [url, cannData] of Object.entries(urlCannib)) {
    const path = url.replace('https://www.leasey.ai', '');
    for (const c of cannData) {
      const cPath = c.competitor.replace('https://www.leasey.ai', '');
      if (pageByUrl[path] && pageByUrl[cPath] && pageByUrl[path].cluster !== pageByUrl[cPath].cluster) {
        if (!similarMap[path]) similarMap[path] = [];
        const s = sim(sigs[path] || new Set(), sigs[cPath] || new Set());
        const existing = similarMap[path].find(x => x.url === cPath);
        if (!existing) {
          similarMap[path].push({ url: cPath, sim: Math.round(s * 100), sharedQueries: 1, perf: (pageByUrl[cPath]?.clicks || 0) + (pageByUrl[cPath]?.visits || 0) });
        } else {
          existing.sharedQueries++;
        }
      }
    }
  }
  for (const url of Object.keys(similarMap)) {
    similarMap[url].sort((a, b) => (b.sharedQueries * 1000 + b.sim) - (a.sharedQueries * 1000 + a.sim));
  }

  // ── CTR MODEL for impact estimation ──
  // Average CTR by position (Google organic)
  const ctrByPos = [0, 0.30, 0.15, 0.10, 0.07, 0.05, 0.04, 0.03, 0.025, 0.02, 0.018, 0.015, 0.013, 0.011, 0.010, 0.009, 0.008, 0.007, 0.006, 0.005, 0.004];

  function estimateGain(queries) {
    let gain = 0;
    for (const q of queries) {
      if (q.position > 10 && q.position <= 25 && q.impressions >= 5) {
        // Estimate: if we move to position ~7 (mid page 1)
        const currentCtr = ctrByPos[Math.min(Math.round(q.position), 20)] || 0.003;
        const targetCtr = ctrByPos[7]; // 0.03
        const potentialClicks = q.impressions * (targetCtr - currentCtr);
        if (potentialClicks > 0) gain += potentialClicks;
      }
    }
    return Math.round(gain);
  }

  // ── GENERATE FINAL ROWS ──
  console.log('4. Generating final table...');

  const results = [];

  for (const p of pages) {
    const fullUrl = 'https://www.leasey.ai' + p.url;
    const ud = urlData[fullUrl] || urlData[p.url] || { queries: [], totalClicks: 0, totalImpressions: 0 };
    const perf = p.clicks + p.visits;
    const similar = similarMap[p.url] || [];
    const topByQueries = similar.find(s => s.sharedQueries > 0);
    const topComp = similar[0] || null;
    const isDeprioritised = p.priority.includes('deprioritise');

    // Striking distance queries for this URL
    const strikingQs = ud.queries.filter(q => q.position > 10 && q.position <= 25 && q.impressions >= 5);
    const topStriking = strikingQs.sort((a, b) => b.impressions - a.impressions).slice(0, 3);
    const estGain = estimateGain(ud.queries);

    let rec = 'Keep';
    let reason = '';
    let combineWith = '';
    let action = '';
    let priority = '';
    let targetKeyword = '';
    let estImpact = '';

    // ── ALWAYS KEEP ──
    if (['Homepage', 'Brand / Site pages'].includes(p.cluster)) {
      rec = 'Keep'; reason = 'Core site page.';
      if (topStriking.length > 0) {
        targetKeyword = topStriking[0].query;
        action = `Optimize for "${topStriking[0].query}" (pos ${topStriking[0].position.toFixed(1)}, ${topStriking[0].impressions}i)`;
        estImpact = estGain > 0 ? `+${estGain} clicks/90d` : '';
        priority = estGain >= 10 ? 'HIGH' : estGain >= 3 ? 'MEDIUM' : 'LOW';
      } else { priority = 'LOW'; }
      results.push({ p, rec, reason, combineWith, action, priority, targetKeyword, estImpact });
      continue;
    }
    if (p.cluster === 'Leasey comparison pages') {
      rec = 'Keep'; reason = `Brand defence "${p.h1}".`;
      priority = p.clicks > 0 ? 'MEDIUM' : 'LOW';
      if (topStriking.length > 0) {
        targetKeyword = topStriking[0].query;
        action = `Optimize for "${topStriking[0].query}" (pos ${topStriking[0].position.toFixed(1)})`;
        estImpact = estGain > 0 ? `+${estGain} clicks/90d` : '';
      }
      results.push({ p, rec, reason, combineWith, action, priority, targetKeyword, estImpact });
      continue;
    }

    // ── REAL CANNIBALIZATION ──
    if (topByQueries) {
      const comp = pageByUrl[topByQueries.url];
      const compPerf = comp ? comp.clicks + comp.visits : 0;
      const queries = (urlCannib[fullUrl] || []).filter(c => c.competitor === 'https://www.leasey.ai' + topByQueries.url).map(c => c.query).slice(0, 3).map(q => `"${q}"`).join(', ');

      if (perf < compPerf) {
        rec = 'Combine';
        reason = `Cannibalizes with ${topByQueries.url} on ${topByQueries.sharedQueries} GSC queries (${queries}). This: ${p.clicks}c/${p.visits}v vs ${comp?.clicks}c/${comp?.visits}v.`;
        combineWith = 'https://www.leasey.ai' + topByQueries.url;
        action = `Redirect to ${topByQueries.url}. Move unique content sections first.`;
        priority = topByQueries.sharedQueries >= 3 ? 'HIGH' : 'MEDIUM';
        // Impact = the combine target's striking queries gain authority
        const compUd = urlData['https://www.leasey.ai' + topByQueries.url] || { queries: [] };
        const compGain = estimateGain(compUd.queries);
        estImpact = compGain > 0 ? `Unlocks +${compGain} clicks on target` : 'Concentrates authority';
        results.push({ p, rec, reason, combineWith, action, priority, targetKeyword: '', estImpact });
        continue;
      } else {
        rec = 'Keep';
        reason = `Stronger side. ${topByQueries.url} cannibalizes on ${topByQueries.sharedQueries} queries (${queries}). Absorb its content.`;
        action = `Absorb content from ${topByQueries.url} when it merges. `;
        if (topStriking.length > 0) {
          targetKeyword = topStriking[0].query;
          action += `Then optimize for "${topStriking[0].query}" (pos ${topStriking[0].position.toFixed(1)}, ${topStriking[0].impressions}i).`;
          estImpact = estGain > 0 ? `+${estGain} clicks/90d` : '';
        }
        priority = estGain >= 10 ? 'HIGH' : topByQueries.sharedQueries >= 3 ? 'HIGH' : 'MEDIUM';
        results.push({ p, rec, reason, combineWith, action, priority, targetKeyword, estImpact });
        continue;
      }
    }

    // ── LISTING GUIDES ──
    if (p.cluster === 'Listing Guides' && p.url.includes('/listing-guides/')) {
      if (p.clicks > 0) {
        rec = 'Keep'; reason = `City guide with ${p.clicks}c.`;
        if (topStriking.length > 0) {
          targetKeyword = topStriking[0].query;
          action = `Optimize for "${topStriking[0].query}" (pos ${topStriking[0].position.toFixed(1)})`;
          estImpact = estGain > 0 ? `+${estGain} clicks/90d` : '';
          priority = estGain >= 5 ? 'MEDIUM' : 'LOW';
        } else { priority = 'LOW'; }
      } else if (p.visits >= 5) {
        rec = 'Keep'; reason = `City guide ${p.visits}v. Monitor.`; priority = 'LOW';
      } else {
        rec = 'Eliminate'; reason = `Templated city guide ${p.visits}v/0c. Index bloat.`;
        action = 'Remove or noindex. No redirect needed (no traffic).';
        priority = 'LOW';
      }
      results.push({ p, rec, reason, combineWith, action, priority, targetKeyword, estImpact });
      continue;
    }

    // ── NEWS ──
    if (p.cluster === 'News Pages') {
      if (p.clicks > 0) {
        rec = 'Keep'; reason = `News with ${p.clicks}c.`; priority = 'LOW';
      } else if (p.visits >= 8) {
        rec = 'Keep'; reason = `News ${p.visits}v.`; priority = 'LOW';
      } else {
        rec = 'Eliminate'; reason = `Old news ${p.visits}v/0c.`;
        action = 'Remove or noindex.'; priority = 'LOW';
      }
      results.push({ p, rec, reason, combineWith, action, priority, targetKeyword, estImpact });
      continue;
    }

    // ── DEPRIORITISED ──
    if (isDeprioritised) {
      if (p.clicks >= 3) {
        rec = 'Keep'; reason = `Deprioritised but ${p.clicks}c.`; priority = 'LOW';
        if (topStriking.length > 0) { targetKeyword = topStriking[0].query; action = `Optimize for "${topStriking[0].query}"`; estImpact = estGain > 0 ? `+${estGain}` : ''; }
      } else if (topComp && topComp.perf > perf && (topComp.sim >= 20 || topComp.sharedQueries > 0)) {
        rec = 'Combine'; reason = `Deprioritised, ${p.clicks}c/${p.visits}v. ${topComp.sim}% overlap with ${topComp.url}.`;
        combineWith = 'https://www.leasey.ai' + topComp.url;
        action = `Move unique content to ${topComp.url}, redirect.`; priority = 'LOW';
      } else if (p.visits >= 8) {
        rec = 'Keep'; reason = `Deprioritised ${p.visits}v.`; priority = 'LOW';
      } else {
        rec = 'Eliminate'; reason = `Deprioritised ${p.visits}v/0c. Off-topic.`;
        action = 'Remove or noindex.'; priority = 'LOW';
      }
      results.push({ p, rec, reason, combineWith, action, priority, targetKeyword, estImpact });
      continue;
    }

    // ── GENERAL ──
    if (p.clicks >= 5) {
      rec = 'Keep';
      if (topStriking.length > 0) {
        targetKeyword = topStriking[0].query;
        action = `Optimize for "${topStriking[0].query}" (pos ${topStriking[0].position.toFixed(1)}, ${topStriking[0].impressions}i).`;
        if (topStriking.length > 1) action += ` Also: "${topStriking[1].query}" (pos ${topStriking[1].position.toFixed(1)}).`;
        estImpact = estGain > 0 ? `+${estGain} clicks/90d` : '';
        priority = estGain >= 20 ? 'HIGH' : estGain >= 5 ? 'MEDIUM' : 'LOW';
      } else {
        priority = 'MEDIUM';
      }
      reason = `Strong (${p.clicks}c/${p.visits}v).`;
      if (topComp && topComp.sim >= 30) reason += ` Note: ${topComp.sim}% overlap with ${topComp.url}.`;
    } else if (p.clicks > 0) {
      if (topComp && topComp.perf > perf && topComp.sim >= 25) {
        rec = 'Combine'; reason = `Low clicks (${p.clicks}c). ${topComp.sim}% overlap with ${topComp.url} (${pageByUrl[topComp.url]?.clicks}c).`;
        combineWith = 'https://www.leasey.ai' + topComp.url;
        action = `Move unique angles to ${topComp.url}, redirect.`;
        priority = 'MEDIUM';
      } else {
        rec = 'Keep'; reason = `Has clicks (${p.clicks}c/${p.visits}v). Best in topic.`;
        if (topStriking.length > 0) {
          targetKeyword = topStriking[0].query;
          action = `Optimize for "${topStriking[0].query}" (pos ${topStriking[0].position.toFixed(1)}).`;
          estImpact = estGain > 0 ? `+${estGain} clicks/90d` : '';
          priority = estGain >= 5 ? 'MEDIUM' : 'LOW';
        } else { priority = 'LOW'; }
      }
    } else if (p.visits >= 8) {
      if (topComp && topComp.perf > perf && topComp.sim >= 25) {
        rec = 'Combine'; reason = `No clicks, ${p.visits}v. ${topComp.sim}% overlap with ${topComp.url}.`;
        combineWith = 'https://www.leasey.ai' + topComp.url;
        action = `Merge content, redirect.`; priority = 'LOW';
      } else {
        rec = 'Keep'; reason = `No clicks but ${p.visits}v. Refresh for CTR.`;
        if (topStriking.length > 0) { targetKeyword = topStriking[0].query; action = `Target "${topStriking[0].query}" (pos ${topStriking[0].position.toFixed(1)}).`; estImpact = estGain > 0 ? `+${estGain}` : ''; }
        priority = 'LOW';
      }
    } else if (p.visits >= 3) {
      if (topComp && topComp.perf > perf && topComp.sim >= 20) {
        rec = 'Combine'; reason = `Low traffic (${p.visits}v/0c). ${topComp.sim}% overlap with ${topComp.url}.`;
        combineWith = 'https://www.leasey.ai' + topComp.url; action = 'Merge content, redirect.'; priority = 'LOW';
      } else {
        rec = 'Keep'; reason = `Low traffic (${p.visits}v). Unique topic.`; priority = 'LOW';
        if (topStriking.length > 0) { targetKeyword = topStriking[0].query; action = `Target "${topStriking[0].query}".`; }
      }
    } else {
      if (topComp && topComp.perf > 0) {
        rec = 'Combine'; reason = `Near-zero (${p.visits}v/0c). ${topComp.sim}% overlap with ${topComp.url}.`;
        combineWith = 'https://www.leasey.ai' + topComp.url; action = 'Merge content, redirect.'; priority = 'LOW';
      } else {
        rec = 'Eliminate'; reason = `Near-zero (${p.visits}v/0c). No interest.`;
        action = 'Remove or noindex.'; priority = 'LOW';
      }
    }

    results.push({ p, rec, reason, combineWith, action, priority, targetKeyword, estImpact });
  }

  // ── SORT BY PRIORITY ──
  const prioOrder = { HIGH: 0, MEDIUM: 1, LOW: 2, '': 3 };
  results.sort((a, b) => {
    // First by priority
    const pd = (prioOrder[a.priority] ?? 3) - (prioOrder[b.priority] ?? 3);
    if (pd !== 0) return pd;
    // Then by recommendation (Keep > Combine > Eliminate)
    const recOrder = { Keep: 0, Combine: 1, Eliminate: 2 };
    return (recOrder[a.rec] ?? 3) - (recOrder[b.rec] ?? 3);
  });

  // ── SUMMARY ──
  const counts = { Keep: 0, Combine: 0, Eliminate: 0 };
  const prioCounts = { HIGH: 0, MEDIUM: 0, LOW: 0 };
  let totalEstGain = 0;
  for (const r of results) {
    counts[r.rec]++;
    if (r.priority) prioCounts[r.priority]++;
    const g = parseInt((r.estImpact || '').replace(/[^0-9]/g, '')) || 0;
    if (r.rec === 'Keep') totalEstGain += g;
  }

  console.log(`\n═══ FINAL TABLE ═══`);
  console.log(`  Keep: ${counts.Keep} | Combine: ${counts.Combine} | Eliminate: ${counts.Eliminate}`);
  console.log(`  HIGH priority: ${prioCounts.HIGH} | MEDIUM: ${prioCounts.MEDIUM} | LOW: ${prioCounts.LOW}`);
  console.log(`  Est. total gain from striking distance: +${totalEstGain} clicks/90d`);

  // ── WRITE TO SHEET ──
  console.log('\n5. Writing to Optimisation map...');
  const o = new google.auth.OAuth2(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET);
  o.setCredentials({ refresh_token: env.GOOGLE_SHEETS_REFRESH_TOKEN });
  const sheets = google.sheets({ version: 'v4', auth: o });

  // New headers for columns I-N
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `'Optimisation map'!I1:N1`,
    valueInputOption: 'RAW',
    requestBody: { values: [['Priority', 'Recommendation', 'Reason', 'Combine with', 'Action', 'Est. Impact']] },
  });

  // Sort back to sheet order
  results.sort((a, b) => a.p.sheetRow - b.p.sheetRow);

  const values = results.map(r => [
    r.priority,
    r.rec,
    r.reason,
    r.combineWith,
    r.action,
    r.estImpact,
  ]);

  const BATCH = 200;
  for (let i = 0; i < values.length; i += BATCH) {
    const batch = values.slice(i, i + BATCH);
    const startRow = i + 2;
    const endRow = startRow + batch.length - 1;
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `'Optimisation map'!I${startRow}:N${endRow}`,
      valueInputOption: 'RAW',
      requestBody: { values: batch },
    });
    console.log(`  Wrote rows ${startRow}-${endRow}`);
  }

  // Print top HIGH priority actions
  const highPrio = results.filter(r => r.priority === 'HIGH');
  console.log(`\n═══ TOP HIGH PRIORITY ACTIONS ═══`);
  for (const r of highPrio.slice(0, 15)) {
    console.log(`  [${r.rec}] ${r.p.url}`);
    console.log(`    ${r.action}`);
    console.log(`    ${r.estImpact}`);
  }

  console.log('\n✓ Done. Columns I-N updated.');
}

main().catch(e => { console.error(e); process.exit(1); });
