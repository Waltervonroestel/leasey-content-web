import { readFileSync } from 'fs';
import { google } from 'googleapis';

const envFile = readFileSync('.env.local', 'utf8');
envFile.split('\n').forEach(l => {
  const m = l.match(/^([^#=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim();
});

const data = JSON.parse(readFileSync('optimisation-map.json', 'utf8'));
const headers = data[0];
const rows = data.slice(1);

// Parse each row
const pages = rows.map((r, i) => ({
  idx: i,
  sheetRow: i + 2, // 1-indexed, row 1 is header
  priority: r[0] || '',
  cluster: r[1] || '',
  url: r[2] || '',
  visits: parseInt(r[3]) || 0,
  clicks: parseInt(r[4]) || 0,
  primaryPillar: r[5] || '',
  secondaryPillar: r[6] || '',
  action: r[7] || '',
}));

// Group by cluster
const clusters = {};
for (const p of pages) {
  if (!clusters[p.cluster]) clusters[p.cluster] = [];
  clusters[p.cluster].push(p);
}

// Extract topic keywords from URL
function urlKeywords(url) {
  return url.replace(/^\//, '').replace(/\/$/, '')
    .split(/[/-]/)
    .filter(w => w.length > 2 && !['resources', 'blog', 'press', 'news', 'tools', 'benefits', 'insights', 'research', 'listing', 'guides', 'testimonials'].includes(w));
}

// Compute similarity between two URLs (Jaccard on keywords)
function similarity(a, b) {
  const ka = new Set(urlKeywords(a));
  const kb = new Set(urlKeywords(b));
  if (ka.size === 0 || kb.size === 0) return 0;
  let inter = 0;
  for (const w of ka) if (kb.has(w)) inter++;
  return inter / (ka.size + kb.size - inter);
}

// Analyze each page
const recommendations = [];

for (const p of pages) {
  let rec = 'Keep';
  let reason = '';

  const clusterPages = clusters[p.cluster] || [];
  const performance = p.clicks + p.visits;

  // 1. Check if this is a deprioritised cluster
  const isDeprioritised = p.priority.includes('deprioritise');

  // 2. Find similar pages within the same cluster
  const similar = [];
  for (const other of clusterPages) {
    if (other.idx === p.idx) continue;
    const sim = similarity(p.url, other.url);
    if (sim >= 0.3) {
      similar.push({ url: other.url, sim, clicks: other.clicks, visits: other.visits });
    }
  }

  // 3. Decision logic

  // Zero performance pages
  if (p.clicks === 0 && p.visits === 0) {
    if (isDeprioritised) {
      rec = 'Eliminate';
      reason = `Zero traffic. Deprioritised cluster "${p.cluster}". No SEO value.`;
    } else if (similar.length > 0) {
      const best = similar.sort((a, b) => (b.clicks + b.visits) - (a.clicks + a.visits))[0];
      rec = 'Combine';
      reason = `Zero traffic. Overlaps with ${best.url} (${best.clicks}c/${best.visits}v). Merge content into the stronger page.`;
    } else {
      rec = 'Eliminate';
      reason = `Zero traffic, no clicks, no visits. No similar page to merge into.`;
    }
  }
  // Very low performance (1-2 visits, 0 clicks)
  else if (p.clicks === 0 && p.visits <= 2) {
    if (isDeprioritised) {
      rec = 'Eliminate';
      reason = `Near-zero traffic (${p.visits}v). Deprioritised cluster. Remove to reduce crawl waste.`;
    } else if (similar.length > 0) {
      const best = similar.sort((a, b) => (b.clicks + b.visits) - (a.clicks + a.visits))[0];
      if (best.clicks + best.visits > performance) {
        rec = 'Combine';
        reason = `Near-zero traffic (${p.visits}v, 0c). Overlaps with ${best.url} which performs better. Merge content.`;
      } else {
        rec = 'Combine';
        reason = `Near-zero traffic (${p.visits}v, 0c). Similar topic as ${best.url}. Combine both into one stronger page.`;
      }
    } else {
      rec = 'Eliminate';
      reason = `Near-zero traffic (${p.visits}v, 0c). No similar page to merge into. Remove.`;
    }
  }
  // Low performance but has some signal
  else if (p.clicks === 0 && p.visits <= 5) {
    if (isDeprioritised) {
      rec = 'Eliminate';
      reason = `Low traffic (${p.visits}v, 0c). Deprioritised cluster, not worth optimising.`;
    } else if (similar.length > 0) {
      const best = similar.sort((a, b) => (b.clicks + b.visits) - (a.clicks + a.visits))[0];
      rec = 'Combine';
      reason = `Low traffic (${p.visits}v). Overlaps with ${best.url}. Consolidate to strengthen one URL.`;
    } else {
      rec = 'Keep';
      reason = `Low traffic but unique topic in cluster. Monitor or refresh content.`;
    }
  }
  // Has clicks — generally keep
  else if (p.clicks > 0) {
    if (similar.length > 0) {
      const competing = similar.filter(s => s.clicks > 0);
      if (competing.length > 0) {
        const best = competing.sort((a, b) => (b.clicks + b.visits) - (a.clicks + a.visits))[0];
        if (p.clicks < best.clicks) {
          rec = 'Combine';
          reason = `Has ${p.clicks}c but competes with ${best.url} (${best.clicks}c). Merge into stronger page to avoid cannibalization.`;
        } else {
          rec = 'Keep';
          reason = `Performing (${p.clicks}c/${p.visits}v). Strongest in its topic area.`;
        }
      } else {
        rec = 'Keep';
        reason = `Performing (${p.clicks}c/${p.visits}v). No competing pages with clicks.`;
      }
    } else {
      rec = 'Keep';
      reason = `Performing (${p.clicks}c/${p.visits}v). Unique topic.`;
    }
  }
  // Moderate visits but 0 clicks
  else {
    if (similar.length > 0) {
      const best = similar.sort((a, b) => (b.clicks + b.visits) - (a.clicks + a.visits))[0];
      rec = 'Combine';
      reason = `Visits (${p.visits}) but 0 clicks. Overlaps with ${best.url}. Combine for stronger ranking.`;
    } else {
      rec = 'Keep';
      reason = `Some visits (${p.visits}v). Unique topic. Refresh to improve CTR.`;
    }
  }

  // Special handling: city listing guides — mass cannibalization
  if (p.cluster === 'Listing Guides' && p.url.includes('/listing-guides/') && p.clicks === 0 && p.visits <= 3) {
    rec = 'Eliminate';
    reason = `City listing guide with near-zero traffic (${p.visits}v). 40+ similar city guides dilute authority. Keep only top-performing cities.`;
  }

  // Special: News pages with zero traffic
  if (p.cluster === 'News Pages' && p.clicks === 0 && p.visits <= 3) {
    rec = 'Eliminate';
    reason = `Old news page with near-zero traffic (${p.visits}v, 0c). News content decays fast. Remove to reduce index bloat.`;
  }

  // Special: Benefits pages with zero traffic
  if (p.cluster === 'Benefits Pages' && p.clicks === 0 && p.visits <= 1) {
    rec = 'Eliminate';
    reason = `Benefits page with zero traffic. Too generic, competes with product/feature pages. Remove.`;
  }

  // Special: Leasey comparison pages — keep all (brand defence)
  if (p.cluster === 'Leasey comparison pages') {
    rec = 'Keep';
    reason = `Comparison page (brand defence). Keep even with low traffic — captures bottom-funnel "vs" searches.`;
  }

  // Special: Homepage, pricing, core product pages — always keep
  if (['Homepage', 'Brand / Site pages'].includes(p.cluster) || ['/pricing/', '/get-started-today/', '/free-trial/', '/free-walkthrough/'].some(u => p.url.includes(u))) {
    rec = 'Keep';
    reason = `Core site page. Always keep.`;
  }

  // Special: Facebook Marketplace cluster — heavy cannibalization
  if (p.cluster === 'Facebook Marketplace' && p.clicks === 0 && p.visits <= 3) {
    const fbPages = clusters['Facebook Marketplace'] || [];
    const topFb = fbPages.filter(f => f.clicks > 0).sort((a, b) => b.clicks - a.clicks);
    if (topFb.length > 0) {
      rec = 'Combine';
      reason = `Low-traffic FB Marketplace page (${p.visits}v). Combine into ${topFb[0].url} (${topFb[0].clicks}c) to consolidate ranking.`;
    }
  }

  recommendations.push({ sheetRow: p.sheetRow, rec, reason });
}

// Summary stats
const counts = { Keep: 0, Combine: 0, Eliminate: 0 };
for (const r of recommendations) counts[r.rec] = (counts[r.rec] || 0) + 1;
console.log(`\nAudit complete: ${pages.length} URLs analyzed`);
console.log(`  Keep: ${counts.Keep}`);
console.log(`  Combine: ${counts.Combine}`);
console.log(`  Eliminate: ${counts.Eliminate}`);

// Write to Google Sheets — columns I and J (indices 8 and 9)
const o = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
o.setCredentials({ refresh_token: process.env.GOOGLE_SHEETS_REFRESH_TOKEN });
const sheets = google.sheets({ version: 'v4', auth: o });

const SHEET_ID = process.env.OPTIMISATION_SHEET_ID;

// Prepare values: column I = Recommendation, column J = Reason
const values = recommendations.map(r => [r.rec, r.reason]);

// First write headers
await sheets.spreadsheets.values.update({
  spreadsheetId: SHEET_ID,
  range: `'Optimisation map'!I1:J1`,
  valueInputOption: 'RAW',
  requestBody: { values: [['Recommendation', 'Reason']] },
});

// Write data in batches of 200
const BATCH = 200;
for (let i = 0; i < values.length; i += BATCH) {
  const batch = values.slice(i, i + BATCH);
  const startRow = i + 2; // row 2 is first data row
  const endRow = startRow + batch.length - 1;
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `'Optimisation map'!I${startRow}:J${endRow}`,
    valueInputOption: 'RAW',
    requestBody: { values: batch },
  });
  console.log(`Wrote rows ${startRow}-${endRow}`);
}

console.log('\nDone! Two new columns (I: Recommendation, J: Reason) added to the Optimisation map sheet.');
