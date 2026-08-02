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

  console.log('1. GSC data...');
  const r1 = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ startDate: fmt(start), endDate: fmt(end), dimensions: ['page', 'query'], rowLimit: 25000, dataState: 'all' }),
    }
  );
  const gscRows = (await r1.json()).rows || [];

  const urlData = {};
  const queryToUrls = {};
  for (const row of gscRows) {
    const url = row.keys[0], query = row.keys[1];
    if (!urlData[url]) urlData[url] = { queries: [] };
    urlData[url].queries.push({ query, clicks: row.clicks, impressions: row.impressions, position: row.position });
    if (!queryToUrls[query]) queryToUrls[query] = [];
    queryToUrls[query].push({ url, clicks: row.clicks, impressions: row.impressions, position: row.position });
  }

  console.log('2. Page content...');
  const pages = JSON.parse(readFileSync('page-content-audit.json', 'utf8'));
  const pageByUrl = {};
  for (const p of pages) pageByUrl[p.url] = p;

  // Ngrams
  const STOPS = new Set(['the','a','an','in','on','at','to','for','of','and','or','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','can','shall','with','by','from','up','about','into','through','during','before','after','above','below','between','under','over','out','off','down','this','that','these','those','it','its','not','no','but','what','which','who','whom','how','when','where','why','all','each','every','both','few','more','most','other','some','such','than','too','very','just','also','only','then','so','if','as','any','same','own','here','there','your','our','their','my','his','her','we','you','they','he','she','me','us','him','them','one','two','three','new','old','good','best','top','key','use','using','get','make','like','need','way','well','even','many','much','still','back','take','come','see','look','find','give','first','last','long','great','high','right','big','small','work','time','year','day','free','full','real','help','know','think','want','let','keep','try','start','turn','call','part','sure','put','set','run','end']);
  function ng(text) {
    const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !STOPS.has(w));
    const s = new Set();
    for (const w of words) s.add(w);
    for (let i = 0; i < words.length - 1; i++) s.add(words[i] + ' ' + words[i + 1]);
    return s;
  }
  function similarity(a, b) { if (!a.size || !b.size) return 0; let i = 0; for (const w of a) if (b.has(w)) i++; return i / (a.size + b.size - i); }

  const sigs = {};
  const clusters = {};
  for (const p of pages) {
    sigs[p.url] = ng([p.h1 || '', p.meta || '', ...(p.h2s || []), p.bodyText || ''].join(' '));
    if (!clusters[p.cluster]) clusters[p.cluster] = [];
    clusters[p.cluster].push(p);
  }

  // Cannibalization from GSC
  const urlCannib = {};
  for (const [query, urls] of Object.entries(queryToUrls)) {
    if (urls.length < 2) continue;
    for (const u of urls) {
      for (const other of urls) {
        if (u.url === other.url) continue;
        if (!urlCannib[u.url]) urlCannib[u.url] = [];
        urlCannib[u.url].push({ query, competitor: other.url, myPos: u.position, theirPos: other.position });
      }
    }
  }

  // Similar pages
  const similarMap = {};
  for (const cPages of Object.values(clusters)) {
    for (let i = 0; i < cPages.length; i++) {
      for (let j = i + 1; j < cPages.length; j++) {
        const s = similarity(sigs[cPages[i].url], sigs[cPages[j].url]);
        if (s < 0.15) continue;
        const a = cPages[i].url, b = cPages[j].url;
        if (!similarMap[a]) similarMap[a] = [];
        if (!similarMap[b]) similarMap[b] = [];
        const sharedQ = (urlCannib['https://www.leasey.ai' + a] || []).filter(c => c.competitor === 'https://www.leasey.ai' + b).length;
        similarMap[a].push({ url: b, sim: Math.round(s * 100), sharedQueries: sharedQ, perf: (pageByUrl[b]?.clicks || 0) + (pageByUrl[b]?.visits || 0) });
        similarMap[b].push({ url: a, sim: Math.round(s * 100), sharedQueries: sharedQ, perf: (pageByUrl[a]?.clicks || 0) + (pageByUrl[a]?.visits || 0) });
      }
    }
  }
  // Cross-cluster via GSC
  for (const [url, cannData] of Object.entries(urlCannib)) {
    const path = url.replace('https://www.leasey.ai', '');
    for (const c of cannData) {
      const cPath = c.competitor.replace('https://www.leasey.ai', '');
      if (pageByUrl[path] && pageByUrl[cPath] && pageByUrl[path].cluster !== pageByUrl[cPath].cluster) {
        if (!similarMap[path]) similarMap[path] = [];
        if (!similarMap[path].find(x => x.url === cPath)) {
          const s = similarity(sigs[path] || new Set(), sigs[cPath] || new Set());
          similarMap[path].push({ url: cPath, sim: Math.round(s * 100), sharedQueries: 1, perf: (pageByUrl[cPath]?.clicks || 0) + (pageByUrl[cPath]?.visits || 0) });
        } else {
          similarMap[path].find(x => x.url === cPath).sharedQueries++;
        }
      }
    }
  }
  for (const url of Object.keys(similarMap)) {
    similarMap[url].sort((a, b) => (b.sharedQueries * 1000 + b.sim) - (a.sharedQueries * 1000 + a.sim));
  }

  // CTR model
  const ctrByPos = [0, 0.30, 0.15, 0.10, 0.07, 0.05, 0.04, 0.03, 0.025, 0.02, 0.018, 0.015, 0.013, 0.011, 0.010, 0.009, 0.008, 0.007, 0.006, 0.005, 0.004];
  function estimateGain(queries) {
    let gain = 0;
    for (const q of queries) {
      if (q.position > 10 && q.position <= 25 && q.impressions >= 5) {
        const cur = ctrByPos[Math.min(Math.round(q.position), 20)] || 0.003;
        gain += q.impressions * (0.03 - cur);
      }
    }
    return Math.round(gain);
  }

  // ── 4 CLEAN COLUMNS: Decision | What to do | Target keyword | Est. impact ──
  console.log('3. Generating clean columns...');

  const results = [];

  for (const p of pages) {
    const fullUrl = 'https://www.leasey.ai' + p.url;
    const ud = urlData[fullUrl] || { queries: [] };
    const perf = p.clicks + p.visits;
    const similar = similarMap[p.url] || [];
    const topByQ = similar.find(s => s.sharedQueries > 0);
    const topComp = similar[0] || null;
    const isDepri = p.priority.includes('deprioritise');

    const strikingQs = ud.queries.filter(q => q.position > 10 && q.position <= 25 && q.impressions >= 5).sort((a, b) => b.impressions - a.impressions);
    const estGain = estimateGain(ud.queries);

    let decision = '';   // Column I: one-word verdict + where
    let whatToDo = '';    // Column J: concrete next step
    let targetKw = '';    // Column K: the keyword to optimize for
    let impact = '';      // Column L: estimated clicks gained

    // ── ALWAYS KEEP ──
    if (['Homepage', 'Brand / Site pages'].includes(p.cluster)) {
      decision = 'Keep';
      if (strikingQs.length > 0) {
        targetKw = strikingQs[0].query;
        whatToDo = `Optimize H1/H2s for "${strikingQs[0].query}" (pos ${strikingQs[0].position.toFixed(1)})`;
        impact = estGain > 0 ? `+${estGain}` : '';
      }
      results.push({ p, decision, whatToDo, targetKw, impact, estGain }); continue;
    }
    if (p.cluster === 'Leasey comparison pages') {
      decision = 'Keep';
      if (strikingQs.length > 0) {
        targetKw = strikingQs[0].query;
        whatToDo = `Optimize for "${strikingQs[0].query}" (pos ${strikingQs[0].position.toFixed(1)})`;
        impact = estGain > 0 ? `+${estGain}` : '';
      }
      results.push({ p, decision, whatToDo, targetKw, impact, estGain }); continue;
    }

    // ── GSC CANNIBALIZATION ──
    if (topByQ) {
      const comp = pageByUrl[topByQ.url];
      const compPerf = comp ? comp.clicks + comp.visits : 0;
      if (perf < compPerf) {
        decision = `Combine → ${topByQ.url}`;
        whatToDo = `Redirect. Move unique sections to ${topByQ.url} first.`;
        const compUd = urlData['https://www.leasey.ai' + topByQ.url] || { queries: [] };
        const compGain = estimateGain(compUd.queries);
        impact = compGain > 0 ? `+${compGain} on target` : '';
        results.push({ p, decision, whatToDo, targetKw, impact, estGain: compGain }); continue;
      } else {
        decision = 'Keep';
        whatToDo = `Absorb ${topByQ.url} content after merge`;
        if (strikingQs.length > 0) {
          targetKw = strikingQs[0].query;
          whatToDo += `. Optimize for "${strikingQs[0].query}" (pos ${strikingQs[0].position.toFixed(1)})`;
        }
        impact = estGain > 0 ? `+${estGain}` : '';
        results.push({ p, decision, whatToDo, targetKw, impact, estGain }); continue;
      }
    }

    // ── LISTING GUIDES ──
    if (p.cluster === 'Listing Guides' && p.url.includes('/listing-guides/')) {
      if (p.clicks > 0) {
        decision = 'Keep';
        if (strikingQs.length > 0) { targetKw = strikingQs[0].query; whatToDo = `Optimize for "${strikingQs[0].query}"`; impact = estGain > 0 ? `+${estGain}` : ''; }
      } else if (p.visits >= 5) {
        decision = 'Keep'; whatToDo = 'Monitor. Add local content to differentiate.';
      } else {
        decision = 'Eliminate'; whatToDo = 'Noindex or remove. No redirect needed.';
      }
      results.push({ p, decision, whatToDo, targetKw, impact, estGain }); continue;
    }

    // ── NEWS ──
    if (p.cluster === 'News Pages') {
      if (p.clicks > 0) { decision = 'Keep'; }
      else if (p.visits >= 8) { decision = 'Keep'; whatToDo = 'Monitor.'; }
      else { decision = 'Eliminate'; whatToDo = 'Noindex or remove.'; }
      results.push({ p, decision, whatToDo, targetKw, impact, estGain }); continue;
    }

    // ── DEPRIORITISED ──
    if (isDepri) {
      if (p.clicks >= 3) {
        decision = 'Keep';
        if (strikingQs.length > 0) { targetKw = strikingQs[0].query; whatToDo = `Optimize for "${strikingQs[0].query}"`; impact = estGain > 0 ? `+${estGain}` : ''; }
      } else if (topComp && topComp.perf > perf && (topComp.sim >= 20 || topComp.sharedQueries > 0)) {
        decision = `Combine → ${topComp.url}`;
        whatToDo = 'Move unique content, redirect.';
      } else if (p.visits >= 8) {
        decision = 'Keep'; whatToDo = 'Monitor.';
      } else {
        decision = 'Eliminate'; whatToDo = 'Noindex or remove.';
      }
      results.push({ p, decision, whatToDo, targetKw, impact, estGain }); continue;
    }

    // ── GENERAL ──
    if (p.clicks >= 5) {
      decision = 'Keep';
      if (strikingQs.length > 0) {
        targetKw = strikingQs[0].query;
        whatToDo = `Optimize for "${strikingQs[0].query}" (pos ${strikingQs[0].position.toFixed(1)}, ${strikingQs[0].impressions}i)`;
        if (strikingQs.length > 1) whatToDo += `. Also "${strikingQs[1].query}"`;
        impact = estGain > 0 ? `+${estGain}` : '';
      }
    } else if (p.clicks > 0) {
      if (topComp && topComp.perf > perf && topComp.sim >= 25) {
        decision = `Combine → ${topComp.url}`;
        whatToDo = 'Move unique angles, redirect.';
        const compUd = urlData['https://www.leasey.ai' + topComp.url] || { queries: [] };
        const cg = estimateGain(compUd.queries);
        impact = cg > 0 ? `+${cg} on target` : '';
      } else {
        decision = 'Keep';
        if (strikingQs.length > 0) {
          targetKw = strikingQs[0].query;
          whatToDo = `Optimize for "${strikingQs[0].query}" (pos ${strikingQs[0].position.toFixed(1)})`;
          impact = estGain > 0 ? `+${estGain}` : '';
        }
      }
    } else if (p.visits >= 8) {
      if (topComp && topComp.perf > perf && topComp.sim >= 25) {
        decision = `Combine → ${topComp.url}`;
        whatToDo = 'Merge content, redirect.';
      } else {
        decision = 'Keep';
        whatToDo = 'Refresh content for CTR.';
        if (strikingQs.length > 0) { targetKw = strikingQs[0].query; impact = estGain > 0 ? `+${estGain}` : ''; }
      }
    } else if (p.visits >= 3) {
      if (topComp && topComp.perf > perf && topComp.sim >= 20) {
        decision = `Combine → ${topComp.url}`;
        whatToDo = 'Merge content, redirect.';
      } else {
        decision = 'Keep';
        if (strikingQs.length > 0) { targetKw = strikingQs[0].query; whatToDo = `Optimize for "${strikingQs[0].query}"`; impact = estGain > 0 ? `+${estGain}` : ''; }
      }
    } else {
      if (topComp && topComp.perf > 0) {
        decision = `Combine → ${topComp.url}`;
        whatToDo = 'Merge content, redirect.';
      } else {
        decision = 'Eliminate';
        whatToDo = 'Noindex or remove.';
      }
    }

    results.push({ p, decision, whatToDo, targetKw, impact, estGain });
  }

  // ── WRITE ──
  console.log('4. Writing to sheet...');
  const o = new google.auth.OAuth2(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET);
  o.setCredentials({ refresh_token: env.GOOGLE_SHEETS_REFRESH_TOKEN });
  const sheets = google.sheets({ version: 'v4', auth: o });

  // Clear old columns I-N first
  await sheets.spreadsheets.values.clear({
    spreadsheetId: SHEET_ID,
    range: `'Optimisation map'!I:N`,
  });

  // Headers I-L
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `'Optimisation map'!I1:L1`,
    valueInputOption: 'RAW',
    requestBody: { values: [['Decision', 'What to do', 'Target keyword', 'Est. clicks gained']] },
  });

  // Data sorted by sheet row
  results.sort((a, b) => a.p.sheetRow - b.p.sheetRow);

  const values = results.map(r => [r.decision, r.whatToDo, r.targetKw, r.impact]);

  const BATCH = 200;
  for (let i = 0; i < values.length; i += BATCH) {
    const batch = values.slice(i, i + BATCH);
    const startRow = i + 2;
    const endRow = startRow + batch.length - 1;
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `'Optimisation map'!I${startRow}:L${endRow}`,
      valueInputOption: 'RAW',
      requestBody: { values: batch },
    });
    console.log(`  Rows ${startRow}-${endRow}`);
  }

  // Summary
  let keeps = 0, combines = 0, elims = 0, totalGain = 0;
  for (const r of results) {
    if (r.decision === 'Keep') keeps++;
    else if (r.decision === 'Eliminate') elims++;
    else combines++;
    if (r.decision === 'Keep') totalGain += r.estGain;
  }

  console.log(`\n═══ CLEAN TABLE ═══`);
  console.log(`  Keep: ${keeps} | Combine: ${combines} | Eliminate: ${elims}`);
  console.log(`  Total est. gain on Keep pages: +${totalGain} clicks/90d`);

  // Top opportunities
  const topOps = results.filter(r => r.decision === 'Keep' && r.estGain > 0).sort((a, b) => b.estGain - a.estGain);
  console.log(`\n  Top 10 optimization opportunities:`);
  for (const r of topOps.slice(0, 10)) {
    console.log(`    +${r.estGain} clicks | "${r.targetKw}" → ${r.p.url}`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
