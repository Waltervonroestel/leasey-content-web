// Minimal RSS/Atom feed parser. No external dependencies — just a regex scan
// good enough for blog feeds. Free, fast, server-side only.

export interface FeedItem {
  source: string;
  title: string;
  link: string;
  date: string;       // ISO YYYY-MM-DD
  excerpt: string;
}

const FEEDS: { source: string; url: string }[] = [
  { source: "Propmodo",       url: "https://www.propmodo.com/feed/" },
  { source: "AppFolio",       url: "https://www.appfolio.com/blog/feed/" },
  { source: "Buildium",       url: "https://www.buildium.com/blog/feed/" },
  { source: "Multifamily Executive", url: "https://www.multifamilyexecutive.com/rss.xml" },
];

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
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

function parseFeed(source: string, xml: string): FeedItem[] {
  // Try RSS <item> first, then Atom <entry>
  const items = extract("item", xml).length > 0 ? extract("item", xml) : extract("entry", xml);
  return items.slice(0, 10).map((block) => {
    const title = stripHtml(extract("title", block)[0] || "");
    const linkRaw = extract("link", block)[0] || "";
    // Atom uses <link href="..."/> — try to handle both
    let link = linkRaw.trim();
    const hrefMatch = block.match(/<link[^>]+href="([^"]+)"/i);
    if (!link && hrefMatch) link = hrefMatch[1];
    const pub = extract("pubDate", block)[0] || extract("published", block)[0] || extract("updated", block)[0] || "";
    const date = pub ? new Date(pub).toISOString().slice(0, 10) : "";
    const desc = stripHtml(extract("description", block)[0] || extract("summary", block)[0] || extract("content", block)[0] || "").slice(0, 200);
    return { source, title, link, date, excerpt: desc };
  }).filter((i) => i.title && i.link);
}

export async function fetchAllFeeds(): Promise<FeedItem[]> {
  const results = await Promise.allSettled(FEEDS.map(async ({ source, url }) => {
    const res = await fetch(url, { headers: { "User-Agent": "Leasey-Content-Bot/1.0" }, next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`${source}: ${res.status}`);
    const xml = await res.text();
    return parseFeed(source, xml);
  }));
  const items: FeedItem[] = [];
  for (const r of results) if (r.status === "fulfilled") items.push(...r.value);
  // Sort newest first
  items.sort((a, b) => (a.date < b.date ? 1 : -1));
  return items;
}

export function feedSources() {
  return FEEDS.map((f) => f.source);
}
