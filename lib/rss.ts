// Minimal RSS/Atom feed parser. No external deps — regex scan good enough for
// blog feeds. Free, fast, server-side only.

export type FeedCategory = "Competitor" | "Proptech Media" | "PM Trade Press" | "Canadian RE";

export interface FeedItem {
  source: string;
  category: FeedCategory;
  title: string;
  link: string;
  date: string;       // ISO YYYY-MM-DD
  excerpt: string;
}

interface FeedSource { source: string; url: string; category: FeedCategory }

// Curated list — only feeds that actively expose RSS. Many modern proptech
// sites (AppFolio, Buildium, DoorLoop, Hemlane, Avail, GlobeSt, The Real Deal,
// Multi-Housing News) have either killed their RSS or moved to SPAs without
// feeds; they're left out until they come back. The fetcher uses
// Promise.allSettled so any single failure does not break the page.
const FEEDS: FeedSource[] = [
  // Direct competitors / competitor-adjacent (PMS, AI leasing, listing platforms)
  { source: "TurboTenant",       url: "https://www.turbotenant.com/blog/feed/",         category: "Competitor" },
  { source: "Rent Manager",      url: "https://www.rentmanager.com/blog/feed/",         category: "Competitor" },
  { source: "Zumper",            url: "https://www.zumper.com/blog/feed/",              category: "Competitor" },
  { source: "RentCafe (Yardi)",  url: "https://www.rentcafe.com/blog/feed/",            category: "Competitor" },

  // Proptech media
  { source: "Propmodo",          url: "https://www.propmodo.com/feed/",                 category: "Proptech Media" },
  { source: "Inman",             url: "https://feeds.feedburner.com/inmannews",         category: "Proptech Media" },
  { source: "Bisnow",            url: "https://www.bisnow.com/rss",                     category: "Proptech Media" },

  // PM trade press
  { source: "Multifamily Executive", url: "https://www.multifamilyexecutive.com/rss.xml", category: "PM Trade Press" },

  // Canadian RE (pillar P4)
  { source: "Canadian Real Estate Magazine", url: "https://www.canadianrealestatemagazine.ca/feed/", category: "Canadian RE" },
];

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#8217;/g, "'").replace(/&#8211;/g, "–").trim();
}

function unCdata(s: string): string {
  return s.replace(/<!\[CDATA\[/g, "").replace(/\]\]>/g, "").trim();
}

function extract(tag: string, src: string): string[] {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "gi");
  const out: string[] = [];
  let m;
  while ((m = re.exec(src)) !== null) out.push(unCdata(m[1]));
  return out;
}

function parseFeed(source: string, category: FeedCategory, xml: string): FeedItem[] {
  const items = extract("item", xml).length > 0 ? extract("item", xml) : extract("entry", xml);
  return items.slice(0, 10).map((block) => {
    const title = stripHtml(extract("title", block)[0] || "");
    const linkRaw = extract("link", block)[0] || "";
    let link = linkRaw.trim();
    const hrefMatch = block.match(/<link[^>]+href="([^"]+)"/i);
    if (!link && hrefMatch) link = hrefMatch[1];
    const pub = extract("pubDate", block)[0] || extract("published", block)[0] || extract("updated", block)[0] || "";
    let date = "";
    if (pub) {
      const d = new Date(pub);
      if (!isNaN(d.getTime())) date = d.toISOString().slice(0, 10);
    }
    const desc = stripHtml(extract("description", block)[0] || extract("summary", block)[0] || extract("content", block)[0] || "").slice(0, 200);
    return { source, category, title, link, date, excerpt: desc };
  }).filter((i) => i.title && i.link);
}

export async function fetchAllFeeds(opts: { fresh?: boolean } = {}): Promise<FeedItem[]> {
  const cacheConfig: RequestInit = opts.fresh
    ? { cache: "no-store" }
    : { next: { revalidate: 3600 } } as RequestInit;

  const results = await Promise.allSettled(FEEDS.map(async ({ source, url, category }) => {
    const res = await fetch(url, { ...cacheConfig, headers: { "User-Agent": "Leasey-Content-Bot/1.0 (+https://www.leasey.ai)" } });
    if (!res.ok) throw new Error(`${source}: ${res.status}`);
    const xml = await res.text();
    return parseFeed(source, category, xml);
  }));
  const items: FeedItem[] = [];
  for (const r of results) if (r.status === "fulfilled") items.push(...r.value);
  items.sort((a, b) => (a.date < b.date ? 1 : -1));
  return items;
}

export function feedSources() {
  return FEEDS.map((f) => ({ source: f.source, category: f.category }));
}
