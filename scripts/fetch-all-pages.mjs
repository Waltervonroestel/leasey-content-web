import { readFileSync, writeFileSync } from 'fs';

const data = JSON.parse(readFileSync('optimisation-map.json', 'utf8'));
const rows = data.slice(1);

const pages = rows.map((r, i) => ({
  idx: i,
  sheetRow: i + 2,
  priority: r[0] || '',
  cluster: r[1] || '',
  url: r[2] || '',
  visits: parseInt(r[3]) || 0,
  clicks: parseInt(r[4]) || 0,
}));

const BASE = 'https://www.leasey.ai';
const CONCURRENCY = 10;
const TIMEOUT = 8000;

async function fetchPage(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    const res = await fetch(BASE + url, { signal: controller.signal, headers: { 'User-Agent': 'LeaseyAuditBot/1.0' } });
    clearTimeout(timer);
    if (!res.ok) return { status: res.status, title: '', text: '' };
    const html = await res.text();
    // Extract title
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/is);
    const title = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : '';
    // Extract H1
    const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/is);
    const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : '';
    // Extract H2s
    const h2s = [];
    const h2Re = /<h2[^>]*>(.*?)<\/h2>/gis;
    let m;
    while ((m = h2Re.exec(html)) !== null) {
      h2s.push(m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
    }
    // Extract meta description
    const metaMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/is)
      || html.match(/<meta\s+content=["'](.*?)["']\s+name=["']description["']/is);
    const meta = metaMatch ? metaMatch[1].trim() : '';
    // Extract visible text (rough: strip tags from main/article/body)
    const bodyMatch = html.match(/<(?:main|article)[^>]*>([\s\S]*?)<\/(?:main|article)>/i)
      || html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    let bodyText = '';
    if (bodyMatch) {
      bodyText = bodyMatch[1]
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<nav[\s\S]*?<\/nav>/gi, '')
        .replace(/<footer[\s\S]*?<\/footer>/gi, '')
        .replace(/<header[\s\S]*?<\/header>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 500); // first 500 chars of body text
    }
    return { status: 200, title, h1, h2s, meta, bodyText };
  } catch (e) {
    clearTimeout(timer);
    return { status: 0, title: '', h1: '', h2s: [], meta: '', bodyText: '', error: e.message };
  }
}

async function main() {
  const results = new Array(pages.length).fill(null);
  let done = 0;

  // Process in batches
  for (let i = 0; i < pages.length; i += CONCURRENCY) {
    const batch = pages.slice(i, i + CONCURRENCY);
    const promises = batch.map(async (p, j) => {
      const content = await fetchPage(p.url);
      results[i + j] = { ...p, ...content };
    });
    await Promise.all(promises);
    done += batch.length;
    if (done % 50 === 0 || done === pages.length) {
      process.stdout.write(`\r${done}/${pages.length} fetched`);
    }
  }

  console.log('\nWriting results...');
  writeFileSync('page-content-audit.json', JSON.stringify(results, null, 2));
  console.log(`Done. ${results.filter(r => r.status === 200).length} pages fetched successfully.`);
}

main();
