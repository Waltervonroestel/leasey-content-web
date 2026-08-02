import { readFileSync } from 'fs';
import { google } from 'googleapis';

const envFile = readFileSync('.env.local', 'utf8');
envFile.split('\n').forEach(l => {
  const m = l.match(/^([^#=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim();
});

const pages = JSON.parse(readFileSync('page-content-audit.json', 'utf8'));

// Build keyword set from text
function extractKeywords(text) {
  if (!text) return new Set();
  const stops = new Set(['the','a','an','in','on','at','to','for','of','and','or','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','can','shall','with','by','from','up','about','into','through','during','before','after','above','below','between','under','over','out','off','down','this','that','these','those','it','its','not','no','but','what','which','who','whom','how','when','where','why','all','each','every','both','few','more','most','other','some','such','than','too','very','just','also','only','then','so','if','as','any','same','own','here','there','your','our','their','my','his','her','we','you','they','he','she','me','us','him','them','one','two','three','new','old','good','best','top','key','use','using','get','make','like','need','way','well','even','many','much','still','back','take','come','see','look','find','give','first','last','long','great','high','right','big','small','work','time','year','day','free','full','real','help','know','think','want','let','keep','try','start','turn','call','part','sure','put','set','run','end','number','point','fact','case','thing','idea','question','business','company','companies','service','services','solution','solutions','system','systems','software','management','manager','managers','data','process','tools','tool','platform','team','teams','guide','article','read','learn','check','review','report','page','resources','blog','press','benefits','research','insights','news','listing','listings','property','properties','rental','rentals','tenant','tenants','landlord','landlords','lease','leasing','rent','renting','apartment','apartments','building','buildings','unit','units','market','industry','including','without','based','related','different','important','essential','effective','complete','comprehensive','specific','common','various','available','current','future','modern','smart','online','digital','real','estate']);
  return new Set(
    text.toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !stops.has(w))
  );
}

// Jaccard similarity on keyword sets
function jaccardSim(setA, setB) {
  if (setA.size === 0 || setB.size === 0) return 0;
  let inter = 0;
  for (const w of setA) if (setB.has(w)) inter++;
  return inter / (setA.size + setB.size - inter);
}

// Combine all text signals for a page
function pageSignature(p) {
  const parts = [p.h1 || '', p.meta || '', ...(p.h2s || []), p.bodyText || ''];
  return extractKeywords(parts.join(' '));
}

// Group by cluster
const clusters = {};
for (const p of pages) {
  if (!clusters[p.cluster]) clusters[p.cluster] = [];
  clusters[p.cluster].push(p);
}

// Analyze each page
const recommendations = [];

for (const p of pages) {
  const clusterPages = clusters[p.cluster] || [];
  const myKw = pageSignature(p);
  const performance = p.clicks + p.visits;
  const isDeprioritised = p.priority.includes('deprioritise');

  // Find semantically similar pages in same cluster
  const similar = [];
  for (const other of clusterPages) {
    if (other.idx === p.idx) continue;
    const otherKw = pageSignature(other);
    const sim = jaccardSim(myKw, otherKw);
    if (sim >= 0.25) {
      similar.push({
        url: other.url,
        h1: other.h1,
        sim: Math.round(sim * 100),
        clicks: other.clicks,
        visits: other.visits,
        perf: other.clicks + other.visits,
      });
    }
  }
  similar.sort((a, b) => b.perf - a.perf);

  let rec = 'Keep';
  let reason = '';

  // ── SPECIAL CLUSTERS ──

  // Homepage / Brand — always keep
  if (['Homepage', 'Brand / Site pages'].includes(p.cluster)) {
    rec = 'Keep';
    reason = `Core site page (${p.h1 || p.url}). Always keep.`;
    recommendations.push({ sheetRow: p.sheetRow, rec, reason });
    continue;
  }

  // Comparison pages — brand defence, always keep
  if (p.cluster === 'Leasey comparison pages') {
    rec = 'Keep';
    reason = `Comparison page "${p.h1}". Brand defence — captures bottom-funnel "vs" searches.`;
    recommendations.push({ sheetRow: p.sheetRow, rec, reason });
    continue;
  }

  // ── LISTING GUIDES (city-specific) ──
  if (p.cluster === 'Listing Guides' && p.url.includes('/listing-guides/')) {
    if (p.clicks > 0) {
      rec = 'Keep';
      reason = `City guide "${p.h1}" with ${p.clicks} clicks. Keep performing city pages.`;
    } else if (p.visits >= 5) {
      rec = 'Keep';
      reason = `City guide "${p.h1}" with ${p.visits} visits. Monitor — potential to grow.`;
    } else {
      // Check if it's a templated city guide with near-zero traffic
      const performingCityGuides = clusterPages
        .filter(g => g.url.includes('/listing-guides/') && g.clicks > 0)
        .length;
      rec = 'Eliminate';
      reason = `Templated city guide "${p.h1}" with ${p.visits}v/0c. ${performingCityGuides} city guides have clicks — this one doesn't. Remove to reduce index bloat from ~40 similar pages.`;
    }
    recommendations.push({ sheetRow: p.sheetRow, rec, reason });
    continue;
  }

  // ── NEWS PAGES ──
  if (p.cluster === 'News Pages') {
    if (p.clicks > 0) {
      rec = 'Keep';
      reason = `News page "${p.h1}" with ${p.clicks} clicks. Still driving traffic.`;
    } else if (p.visits >= 8) {
      rec = 'Keep';
      reason = `News page "${p.h1}" with ${p.visits} visits. Some interest remains.`;
    } else {
      rec = 'Eliminate';
      reason = `Old news page "${p.h1}" with ${p.visits}v/0c. News content decays fast. Remove to reduce index bloat.`;
    }
    recommendations.push({ sheetRow: p.sheetRow, rec, reason });
    continue;
  }

  // ── DEPRIORITISED (Operations & PM Knowledge, PM Fees) ──
  if (isDeprioritised) {
    if (p.clicks >= 3) {
      rec = 'Keep';
      reason = `Deprioritised but has ${p.clicks} clicks/${p.visits}v. "${p.h1}". Worth keeping for traffic.`;
    } else if (p.clicks > 0) {
      if (similar.length > 0 && similar[0].perf > performance) {
        rec = 'Combine';
        reason = `Deprioritised, ${p.clicks}c/${p.visits}v. "${p.h1}" overlaps ${similar[0].sim}% with "${similar[0].h1}" (${similar[0].clicks}c/${similar[0].visits}v). Merge into stronger page.`;
      } else {
        rec = 'Keep';
        reason = `Deprioritised but has ${p.clicks} clicks. "${p.h1}". Keep for now.`;
      }
    } else if (p.visits >= 8) {
      rec = 'Keep';
      reason = `Deprioritised, 0 clicks but ${p.visits} visits. "${p.h1}". Monitor.`;
    } else {
      if (similar.length > 0 && similar[0].perf > performance) {
        rec = 'Combine';
        reason = `Deprioritised, ${p.visits}v/0c. "${p.h1}" overlaps ${similar[0].sim}% with "${similar[0].h1}" (${similar[0].clicks}c/${similar[0].visits}v). Merge content into stronger page.`;
      } else {
        rec = 'Eliminate';
        reason = `Deprioritised, ${p.visits}v/0c. "${p.h1}". Off-topic for Leasey's positioning pillars. Remove.`;
      }
    }
    recommendations.push({ sheetRow: p.sheetRow, rec, reason });
    continue;
  }

  // ── GENERAL LOGIC (core clusters) ──

  // High performers — keep
  if (p.clicks >= 5) {
    if (similar.length > 0 && similar[0].clicks >= 5) {
      rec = 'Keep';
      reason = `Strong performer (${p.clicks}c/${p.visits}v). "${p.h1}". Note: overlaps ${similar[0].sim}% with "${similar[0].h1}" (${similar[0].clicks}c) — both perform, consider differentiating angles.`;
    } else {
      rec = 'Keep';
      reason = `Strong performer (${p.clicks}c/${p.visits}v). "${p.h1}". Unique in cluster.`;
    }
  }
  // Some clicks
  else if (p.clicks > 0) {
    if (similar.length > 0 && similar[0].clicks > p.clicks) {
      rec = 'Combine';
      reason = `Low clicks (${p.clicks}c/${p.visits}v). "${p.h1}" overlaps ${similar[0].sim}% with "${similar[0].h1}" (${similar[0].clicks}c/${similar[0].visits}v). Merge into stronger page to consolidate ranking.`;
    } else {
      rec = 'Keep';
      reason = `Has clicks (${p.clicks}c/${p.visits}v). "${p.h1}". Best treatment of this topic in cluster.`;
    }
  }
  // Zero clicks, decent visits
  else if (p.visits >= 8) {
    if (similar.length > 0 && similar[0].perf > performance) {
      rec = 'Combine';
      reason = `No clicks despite ${p.visits} visits. "${p.h1}" overlaps ${similar[0].sim}% with "${similar[0].h1}" (${similar[0].clicks}c/${similar[0].visits}v). Merge to strengthen one URL.`;
    } else {
      rec = 'Keep';
      reason = `No clicks but ${p.visits} visits. "${p.h1}". Refresh content to improve CTR.`;
    }
  }
  // Zero clicks, low visits
  else if (p.visits >= 3) {
    if (similar.length > 0 && similar[0].perf > performance) {
      rec = 'Combine';
      reason = `Low traffic (${p.visits}v/0c). "${p.h1}" overlaps ${similar[0].sim}% with "${similar[0].h1}" (${similar[0].clicks}c/${similar[0].visits}v). Combine content.`;
    } else {
      rec = 'Keep';
      reason = `Low traffic (${p.visits}v/0c). "${p.h1}". Unique topic — refresh or monitor.`;
    }
  }
  // Near-zero
  else {
    if (similar.length > 0) {
      const best = similar[0];
      if (best.perf > 0) {
        rec = 'Combine';
        reason = `Near-zero traffic (${p.visits}v/0c). "${p.h1}" overlaps ${best.sim}% with "${best.h1}" (${best.clicks}c/${best.visits}v). Merge useful content into stronger page.`;
      } else {
        rec = 'Eliminate';
        reason = `Near-zero traffic (${p.visits}v/0c). "${p.h1}". Similar page "${best.h1}" also has no traffic. Both redundant — eliminate weaker.`;
      }
    } else {
      rec = 'Eliminate';
      reason = `Near-zero traffic (${p.visits}v/0c). "${p.h1}". No similar page to merge into. Unique but not generating any interest.`;
    }
  }

  recommendations.push({ sheetRow: p.sheetRow, rec, reason });
}

// Summary
const counts = { Keep: 0, Combine: 0, Eliminate: 0 };
for (const r of recommendations) counts[r.rec] = (counts[r.rec] || 0) + 1;
console.log(`\nContent-based audit complete: ${pages.length} URLs analyzed`);
console.log(`  Keep: ${counts.Keep}`);
console.log(`  Combine: ${counts.Combine}`);
console.log(`  Eliminate: ${counts.Eliminate}`);

// Show top cannibalization pairs (high similarity within same cluster)
console.log('\n─── Top cannibalization risks (same cluster, high overlap) ───');
const pairs = [];
for (const [cluster, cPages] of Object.entries(clusters)) {
  if (['Homepage', 'Brand / Site pages', 'Leasey comparison pages'].includes(cluster)) continue;
  for (let i = 0; i < cPages.length; i++) {
    for (let j = i + 1; j < cPages.length; j++) {
      const sim = jaccardSim(pageSignature(cPages[i]), pageSignature(cPages[j]));
      if (sim >= 0.35 && (cPages[i].clicks > 0 || cPages[j].clicks > 0)) {
        pairs.push({ cluster, a: cPages[i], b: cPages[j], sim: Math.round(sim * 100) });
      }
    }
  }
}
pairs.sort((a, b) => b.sim - a.sim);
for (const p of pairs.slice(0, 20)) {
  console.log(`  [${p.cluster}] ${p.sim}% overlap:`);
  console.log(`    A: "${p.a.h1}" (${p.a.clicks}c/${p.a.visits}v) ${p.a.url}`);
  console.log(`    B: "${p.b.h1}" (${p.b.clicks}c/${p.b.visits}v) ${p.b.url}`);
}

// Write to Google Sheets
const o = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
o.setCredentials({ refresh_token: process.env.GOOGLE_SHEETS_REFRESH_TOKEN });
const sheets = google.sheets({ version: 'v4', auth: o });
const SHEET_ID = process.env.OPTIMISATION_SHEET_ID;

const values = recommendations.map(r => [r.rec, r.reason]);

await sheets.spreadsheets.values.update({
  spreadsheetId: SHEET_ID,
  range: `'Optimisation map'!I1:J1`,
  valueInputOption: 'RAW',
  requestBody: { values: [['Recommendation', 'Reason']] },
});

const BATCH = 200;
for (let i = 0; i < values.length; i += BATCH) {
  const batch = values.slice(i, i + BATCH);
  const startRow = i + 2;
  const endRow = startRow + batch.length - 1;
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `'Optimisation map'!I${startRow}:J${endRow}`,
    valueInputOption: 'RAW',
    requestBody: { values: batch },
  });
  console.log(`Wrote rows ${startRow}-${endRow}`);
}

console.log('\nDone! Columns I & J updated with content-based recommendations.');
