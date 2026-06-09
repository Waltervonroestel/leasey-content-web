import { google } from "googleapis";

// Google Search Console (igual que FastStrat). Gated: si faltan credenciales,
// hasGsc() es false y la UI muestra el estado "conectar GSC".

export function hasGsc(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REFRESH_TOKEN &&
      process.env.GSC_SITE_URL
  );
}

function searchconsole() {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return google.searchconsole({ version: "v1", auth });
}

export function dateRange(days: number) {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);
  const fmt = (d: Date) => d.toISOString().split("T")[0];
  return { startDate: fmt(start), endDate: fmt(end) };
}

export interface GscRow {
  query?: string;
  page?: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export async function queryAnalytics(
  dimension: "page" | "query",
  days: number,
  rowLimit = 1000
): Promise<{ rows: GscRow[]; startDate: string; endDate: string }> {
  const { startDate, endDate } = dateRange(days);
  const res = await searchconsole().searchanalytics.query({
    siteUrl: process.env.GSC_SITE_URL!,
    requestBody: { startDate, endDate, dimensions: [dimension], rowLimit, dataState: "all" },
  });
  const rows = (res.data.rows ?? []).map((r) => ({
    [dimension]: r.keys?.[0] ?? "",
    clicks: r.clicks ?? 0,
    impressions: r.impressions ?? 0,
    ctr: r.ctr ?? 0,
    position: r.position ?? 0,
  })) as GscRow[];
  return { rows, startDate, endDate };
}

// Buckets temáticos de Leasey para agrupar queries (alineados al posicionamiento).
const TOPIC_BUCKETS: { name: string; terms: string[] }[] = [
  { name: "Leasing automation", terms: ["leasing", "automation", "automate", "ai leasing", "leasing agent"] },
  { name: "Tenant screening", terms: ["screening", "tenant screen", "background", "credit check", "singlekey"] },
  { name: "Facebook Marketplace", terms: ["facebook", "marketplace"] },
  { name: "Listing syndication", terms: ["syndication", "syndicate", "zillow", "zumper", "kijiji", "listing"] },
  { name: "Showings & tours", terms: ["showing", "tour", "self-show", "schedule", "scheduler"] },
  { name: "Vacancy & market", terms: ["vacancy", "rent", "market", "days on market", "lease-up"] },
  { name: "Canada", terms: ["canada", "canadian", "ontario", "alberta", "vancouver", "toronto", "calgary"] },
  { name: "PMS integration", terms: ["yardi", "buildium", "rent manager", "pms", "appfolio", "integration"] },
  { name: "Fair Housing / compliance", terms: ["fair housing", "compliance", "regulation", "legal"] },
  { name: "Pricing & ROI", terms: ["price", "pricing", "cost", "roi", "per door"] },
];

export interface Cluster {
  name: string;
  clicks: number;
  impressions: number;
  queryCount: number;
  avgPosition: number;
}

export async function topicClusters(days: number): Promise<{ clusters: Cluster[]; other: { impressions: number; clicks: number } }> {
  const { rows } = await queryAnalytics("query", days);
  const map = new Map<string, { clicks: number; impressions: number; queryCount: number; posSum: number }>();
  let otherImpr = 0;
  let otherClicks = 0;
  for (const r of rows) {
    const q = (r.query || "").toLowerCase();
    const bucket = TOPIC_BUCKETS.find((b) => b.terms.some((t) => q.includes(t)));
    if (!bucket) {
      otherImpr += r.impressions;
      otherClicks += r.clicks;
      continue;
    }
    const cur = map.get(bucket.name) || { clicks: 0, impressions: 0, queryCount: 0, posSum: 0 };
    cur.clicks += r.clicks;
    cur.impressions += r.impressions;
    cur.queryCount += 1;
    cur.posSum += r.position;
    map.set(bucket.name, cur);
  }
  const clusters = Array.from(map.entries())
    .map(([name, v]) => ({ name, clicks: v.clicks, impressions: v.impressions, queryCount: v.queryCount, avgPosition: v.queryCount ? v.posSum / v.queryCount : 0 }))
    .sort((a, b) => b.impressions - a.impressions);
  return { clusters, other: { impressions: otherImpr, clicks: otherClicks } };
}

// Oportunidades para el reporte (metodología FastStrat).
export interface Opportunities {
  strikingDistance: GscRow[]; // pos 5-20, impresiones >= 20
  untapped: GscRow[]; // impresiones >= 50, clicks <= 1
  topByClicks: GscRow[];
}

export async function opportunities(days: number): Promise<Opportunities> {
  const { rows } = await queryAnalytics("query", days);
  const strikingDistance = rows
    .filter((r) => r.position >= 5 && r.position <= 20 && r.impressions >= 20)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 40);
  const untapped = rows
    .filter((r) => r.impressions >= 50 && r.clicks <= 1)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 40);
  const topByClicks = rows.filter((r) => r.clicks > 0).sort((a, b) => b.clicks - a.clicks).slice(0, 20);
  return { strikingDistance, untapped, topByClicks };
}
