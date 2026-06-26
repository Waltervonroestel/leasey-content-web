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

export async function queryAnalyticsRange(
  dimension: "page" | "query",
  startDate: string,
  endDate: string,
  rowLimit = 5000
): Promise<GscRow[]> {
  const res = await searchconsole().searchanalytics.query({
    siteUrl: process.env.GSC_SITE_URL!,
    requestBody: { startDate, endDate, dimensions: [dimension], rowLimit, dataState: "all" },
  });
  return (res.data.rows ?? []).map((r) => ({
    [dimension]: r.keys?.[0] ?? "",
    clicks: r.clicks ?? 0,
    impressions: r.impressions ?? 0,
    ctr: r.ctr ?? 0,
    position: r.position ?? 0,
  })) as GscRow[];
}

export async function queryAnalytics(
  dimension: "page" | "query",
  days: number,
  rowLimit = 5000
): Promise<{ rows: GscRow[]; startDate: string; endDate: string }> {
  const { startDate, endDate } = dateRange(days);
  const rows = await queryAnalyticsRange(dimension, startDate, endDate, rowLimit);
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

// ---------------------------------------------------------------------------
// Query intelligence: classify every query by intent and opportunity, and turn
// it into a concrete content recommendation (what to write, and why).
// All derived from the same GSC query call, no extra cost.
// ---------------------------------------------------------------------------

export type Intent = "comparison" | "question" | "commercial" | "local" | "branded" | "informational";
export type OppType = "ctr-fix" | "striking" | "untapped" | "below-page-2" | "winning";

const COMPETITORS = [
  "appfolio", "buildium", "yardi", "showmojo", "show mojo", "funnel", "entrata",
  "eliseai", "elise ai", "knock", "tenant turner", "rentvine", "doorloop", "hemlane",
  "turbotenant", "avail", "rent manager",
];

function classifyIntent(q: string): Intent {
  const s = q.toLowerCase();
  if (s.includes("leasey") || s.includes("leasy")) return "branded";
  if (/\bvs\b|\balternative/.test(s) || /\bcompare|comparison/.test(s) || COMPETITORS.some((c) => s.includes(c))) return "comparison";
  if (/^(how |what |why |when |which |where |who |is |are |can |should |do |does )/.test(s) || /\bguide\b|\btips\b|\bexplained\b/.test(s)) return "question";
  if (/canada|canadian|ontario|alberta|british columbia|vancouver|toronto|calgary|edmonton|ottawa|montreal|halifax|winnipeg|kijiji|realtor\.ca|rtb|rta/.test(s)) return "local";
  if (/software|platform|\btool\b|pricing|\bprice\b|\bcost\b|\bbest\b|\btop \d|per door|per unit|\bcrm\b/.test(s)) return "commercial";
  return "informational";
}

// Rough CTR-by-position benchmark to flag "ranks but does not get the click".
function expectedCtr(pos: number): number {
  if (pos <= 1) return 0.27;
  if (pos <= 2) return 0.15;
  if (pos <= 3) return 0.10;
  if (pos <= 5) return 0.06;
  if (pos <= 7) return 0.035;
  if (pos <= 10) return 0.022;
  if (pos <= 15) return 0.012;
  if (pos <= 20) return 0.007;
  return 0.003;
}

function classifyOpp(r: GscRow): OppType {
  const exp = expectedCtr(r.position);
  if (r.position <= 10 && r.impressions >= 30 && r.ctr < exp * 0.5) return "ctr-fix";
  if (r.clicks > 0 && r.position <= 10) return "winning";
  if (r.position >= 5 && r.position <= 20 && r.impressions >= 20) return "striking";
  if (r.impressions >= 50 && r.clicks <= 1) return "untapped";
  if (r.position > 20 && r.impressions >= 20) return "below-page-2";
  return "winning";
}

function bucketOf(q: string): string {
  const s = q.toLowerCase();
  const b = TOPIC_BUCKETS.find((x) => x.terms.some((t) => s.includes(t)));
  return b ? b.name : "Other";
}

// The concrete recommendation: what to write and why, given intent + opportunity.
function recommend(q: string, intent: Intent, opp: OppType, bucket: string): { angle: string; whatsHappening: string; action: string } {
  const cap = (x: string) => x.charAt(0).toUpperCase() + x.slice(1);
  let whatsHappening = "";
  switch (opp) {
    case "ctr-fix": whatsHappening = "Ranks on page 1 but is not getting the clicks it should. The page exists; the title/meta is leaving clicks on the table."; break;
    case "striking": whatsHappening = "Sitting in striking distance (page 1-2). A focused piece or a boost to the existing page can push it up fast."; break;
    case "untapped": whatsHappening = "Real demand (impressions) but almost no clicks. Content is too thin or missing for this exact query."; break;
    case "below-page-2": whatsHappening = "Demand exists but we rank below page 2. Needs a dedicated cornerstone piece to gain traction."; break;
    case "winning": whatsHappening = "Already converting. Do not break it; expand the cluster around it."; break;
  }
  let angle = "";
  let action = "";
  switch (intent) {
    case "comparison":
      angle = `Comparison blog (decision-stage): "Leasey.AI vs ${cap(competitorIn(q) || "competitor")}". Honest, where-each-wins format.`;
      action = "Write / strengthen a competitor comparison.";
      break;
    case "question":
      angle = `Explainer or how-to blog answering "${q}" directly in the first two lines (AEO answer pattern).`;
      action = "Write a how-to / explainer blog.";
      break;
    case "commercial":
      angle = `Decision-stage page or comparison for the "${bucket}" cluster. Tie to pricing/ROI and a clear demo CTA.`;
      action = "Write a decision-stage / cornerstone piece.";
      break;
    case "local":
      angle = `Canadian-first angle on "${bucket}". Anchor to a Canadian market scenario (RTA/RTB, a Canadian metro, SingleKey).`;
      action = "Write a Canadian-first blog.";
      break;
    case "branded":
      angle = `Branded query. Reinforce the entity: ensure /llm-info, About, and a clean canonical answer exist.`;
      action = "Entity / AEO reinforcement (mostly Alejandra).";
      break;
    default:
      angle = `Cluster blog on "${bucket}", insight-led, tied to a positioning pillar.`;
      action = "Write a cluster blog.";
  }
  if (opp === "ctr-fix") action = "Title/meta rewrite (Alejandra) — already ranking, capture the click.";
  return { angle, whatsHappening, action };
}

function competitorIn(q: string): string | null {
  const s = q.toLowerCase();
  const c = COMPETITORS.find((x) => s.includes(x));
  if (!c) return null;
  const nice: Record<string, string> = { "show mojo": "ShowMojo", showmojo: "ShowMojo", "elise ai": "EliseAI", eliseai: "EliseAI", appfolio: "AppFolio", buildium: "Buildium", yardi: "Yardi", funnel: "Funnel Leasing", entrata: "Entrata", knock: "Knock CRM", "tenant turner": "Tenant Turner" };
  return nice[c] || c;
}

export interface EnrichedQuery extends GscRow {
  intent: Intent;
  opp: OppType;
  bucket: string;
  angle: string;
  whatsHappening: string;
  action: string;
}

export interface QueryIntel {
  total: number;
  intentCounts: { intent: Intent; queries: number; impressions: number; clicks: number }[];
  writeNext: EnrichedQuery[];     // prioritised "write these next"
  questions: EnrichedQuery[];     // question/AEO queries
  comparisons: EnrichedQuery[];   // competitor / comparison queries
  ctrFixes: EnrichedQuery[];      // rank but no click
  striking: EnrichedQuery[];
  untapped: EnrichedQuery[];
  belowPage2: EnrichedQuery[];
}

export async function queryIntel(days: number): Promise<QueryIntel> {
  const { rows } = await queryAnalytics("query", days);
  const enriched: EnrichedQuery[] = rows
    .filter((r) => r.query && r.impressions >= 5)
    .map((r) => {
      const intent = classifyIntent(r.query!);
      const opp = classifyOpp(r);
      const bucket = bucketOf(r.query!);
      const rec = recommend(r.query!, intent, opp, bucket);
      return { ...r, intent, opp, bucket, ...rec };
    });

  const intentMap = new Map<Intent, { queries: number; impressions: number; clicks: number }>();
  for (const e of enriched) {
    const cur = intentMap.get(e.intent) || { queries: 0, impressions: 0, clicks: 0 };
    cur.queries++; cur.impressions += e.impressions; cur.clicks += e.clicks;
    intentMap.set(e.intent, cur);
  }
  const intentCounts = Array.from(intentMap.entries())
    .map(([intent, v]) => ({ intent, ...v }))
    .sort((a, b) => b.impressions - a.impressions);

  const byImpr = (a: EnrichedQuery, b: EnrichedQuery) => b.impressions - a.impressions;
  const questions = enriched.filter((e) => e.intent === "question").sort(byImpr).slice(0, 30);
  const comparisons = enriched.filter((e) => e.intent === "comparison").sort(byImpr).slice(0, 30);
  const ctrFixes = enriched.filter((e) => e.opp === "ctr-fix").sort(byImpr).slice(0, 30);
  const striking = enriched.filter((e) => e.opp === "striking").sort(byImpr).slice(0, 30);
  const untapped = enriched.filter((e) => e.opp === "untapped").sort(byImpr).slice(0, 30);
  const belowPage2 = enriched.filter((e) => e.opp === "below-page-2").sort(byImpr).slice(0, 30);

  // "Write next": prioritise content-writable opportunities (not pure CTR fixes,
  // which are Alejandra's lane). Weight by impressions and how close to page 1.
  const score = (e: EnrichedQuery) => {
    let s = e.impressions;
    if (e.opp === "untapped") s *= 1.6;
    if (e.opp === "striking") s *= 1.4;
    if (e.opp === "below-page-2") s *= 1.1;
    if (e.intent === "comparison") s *= 1.5;
    if (e.intent === "question") s *= 1.3;
    if (e.intent === "branded") s *= 0.2;
    return s;
  };
  const writeNext = enriched
    .filter((e) => e.opp !== "winning" && e.opp !== "ctr-fix" && e.intent !== "branded")
    .sort((a, b) => score(b) - score(a))
    .slice(0, 20);

  return { total: enriched.length, intentCounts, writeNext, questions, comparisons, ctrFixes, striking, untapped, belowPage2 };
}

// Period-over-period trend: which queries are rising or declining.
export interface TrendRow extends GscRow {
  prevClicks: number;
  prevImpressions: number;
  prevPosition: number;
  clickDelta: number;
  imprDelta: number;
  posDelta: number; // positive = improved (moved up)
}

export async function queryTrends(days: number): Promise<{ rising: TrendRow[]; declining: TrendRow[] }> {
  const end = new Date();
  const curStart = new Date(); curStart.setDate(end.getDate() - days);
  const prevEnd = new Date(curStart); prevEnd.setDate(curStart.getDate() - 1);
  const prevStart = new Date(prevEnd); prevStart.setDate(prevEnd.getDate() - days);
  const fmt = (d: Date) => d.toISOString().split("T")[0];

  const [cur, prev] = await Promise.all([
    queryAnalyticsRange("query", fmt(curStart), fmt(end)),
    queryAnalyticsRange("query", fmt(prevStart), fmt(prevEnd)),
  ]);
  const prevMap = new Map(prev.map((r) => [r.query, r]));
  const trends: TrendRow[] = cur
    .filter((r) => r.query && (r.impressions >= 20 || (prevMap.get(r.query)?.impressions ?? 0) >= 20))
    .map((r) => {
      const p = prevMap.get(r.query);
      const prevClicks = p?.clicks ?? 0;
      const prevImpressions = p?.impressions ?? 0;
      const prevPosition = p?.position ?? r.position;
      return {
        ...r,
        prevClicks, prevImpressions, prevPosition,
        clickDelta: r.clicks - prevClicks,
        imprDelta: r.impressions - prevImpressions,
        posDelta: prevPosition - r.position, // up = improved
      };
    });
  const rising = [...trends].sort((a, b) => b.imprDelta - a.imprDelta).slice(0, 15);
  const declining = [...trends].sort((a, b) => a.imprDelta - b.imprDelta).slice(0, 15);
  return { rising, declining };
}
