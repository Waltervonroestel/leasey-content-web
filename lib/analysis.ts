import { CalendarRow, OptRow } from "./sheets";

export const PILLARS = ["P1 Speed", "P2 Agent", "P3 All-in-one", "P4 Canadian", "P5 Compliance", "P6 US Sun Belt"] as const;
export type PillarName = (typeof PILLARS)[number];

// Map free-text pillar labels (with US/CA lens suffixes) to the canonical 6.
export function canonical(label: string): PillarName | "Other" {
  const s = (label || "").toLowerCase();
  if (s.includes("p1")) return "P1 Speed";
  if (s.includes("p2")) return "P2 Agent";
  if (s.includes("p3")) return "P3 All-in-one";
  if (s.includes("p4")) return "P4 Canadian";
  if (s.includes("p5")) return "P5 Compliance";
  if (s.includes("p6")) return "P6 US Sun Belt";
  return "Other";
}

// The calendar sheet's "Pillar" column carries the awareness PHASE (1-5), not the positioning pillar (P1-P6).
// Infer the positioning pillar from the working title via keyword match.
export function inferPillarFromTitle(title: string): PillarName | "Other" {
  const t = (title || "").toLowerCase();
  if (/(sun[\s-]?belt|austin|phoenix|tampa|charlotte|dallas|atlanta|miami|raleigh|nashville|orlando|\bus property|us operator|us multifamily|us renter|us secondary|us market|in the us)/i.test(t)) return "P6 US Sun Belt";
  if (/(canadian|canada|toronto|vancouver|calgary|edmonton|montreal|ottawa|halifax|kijiji|realtor\.ca|cmhc|rta|rtb|singlekey|aedn|aquilini|terez)/i.test(t)) return "P4 Canadian";
  if (/(fair housing|compliance|doj|realpage|screening|fraud|id verification|legal|tenancy|eviction|landlord rights|tenant rights)/i.test(t)) return "P5 Compliance";
  if (/(\bvs\b|comparison|all-in-one|syndication|marketplace|stack|platform|listing to signature|appfolio|buildium|yardi|entrata|elise|knock|showmojo|funnel|tenant turner|best property management|top property management|pms)/i.test(t)) return "P3 All-in-one";
  if (/(\bagent\b|widget|ai leasing|liza|chatbot|conversational|automation|automated leasing|leasing ai|respond)/i.test(t)) return "P2 Agent";
  if (/(speed|cooling market|response time|after-hours|days[\s-]on[\s-]market|lease[\s-]?up|vacancy|filling|days to lease|no[\s-]show|reconfirmation|tour confirmation|tour friction)/i.test(t)) return "P1 Speed";
  return "Other";
}

export function calendarPillarCoverage(rows: CalendarRow[]) {
  const counts: Record<string, number> = { "P1 Speed": 0, "P2 Agent": 0, "P3 All-in-one": 0, "P4 Canadian": 0, "P5 Compliance": 0, "P6 US Sun Belt": 0, "Other": 0 };
  for (const r of rows) counts[inferPillarFromTitle(r.title)]++;
  return counts;
}

export function optimisationPillarCoverage(rows: OptRow[]) {
  const primary: Record<string, number> = { "P1 Speed": 0, "P2 Agent": 0, "P3 All-in-one": 0, "P4 Canadian": 0, "P5 Compliance": 0, "P6 US Sun Belt": 0, "Other": 0 };
  for (const r of rows) primary[canonical(r.primary)]++;
  return primary;
}

// Cluster health: clicks, URLs, dead-ratio (URLs with 0 GSC clicks / total)
//
// La columna D de la hoja son VISITAS de GA4 y la E son CLICS de Search
// Console. Hasta el 1 de agosto de 2026 las visitas de GA4 se sumaban a un
// campo llamado `impressions`, y el panel mostraba sesiones con la etiqueta de
// impresiones. No son lo mismo ni se parecen: la home tiene 1.886 visitas GA4,
// 252 clics y unas 19.000 impresiones reales. Con ese nombre, cualquier
// decisión de "esta página no tiene alcance" se tomaba con un número diez veces
// más pequeño del que se creía.
//
// Es el mismo error que ya había en la sheet de Clusterización, donde la
// columna "Visitas GSC" eran clics y se leyeron como impresiones. Ahí llevó a
// marcar para borrar páginas que estaban funcionando.
//
// El campo ahora se llama por lo que es. Las impresiones de verdad viven en
// Search Console y se piden a la API, no a una hoja.
export function clusterHealth(rows: OptRow[]) {
  const m = new Map<string, { urls: number; clicks: number; ga4Visits: number; dead: number; high: number; med: number }>();
  for (const r of rows) {
    const c = r.cluster || "Unclassified";
    if (!m.has(c)) m.set(c, { urls: 0, clicks: 0, ga4Visits: 0, dead: 0, high: 0, med: 0 });
    const x = m.get(c)!;
    x.urls++; x.clicks += r.gscClicks; x.ga4Visits += r.ga4Visits;
    if (r.gscClicks === 0) x.dead++;
    // high y med cuentan ahora TIPO DE TRABAJO, no prioridad: la hoja de
    // Clusterización no tiene prioridades.
    if (/reescribir/i.test(r.work)) x.high++;
    if (/optimizar/i.test(r.work)) x.med++;
  }
  return [...m.entries()].map(([cluster, x]) => ({
    cluster,
    ...x,
    deadRatio: x.urls ? x.dead / x.urls : 0,
    score: x.urls ? Math.round((x.clicks * 10 + x.urls) / (x.dead + 1)) : 0,
  })).sort((a, b) => b.clicks - a.clicks);
}

// Pillar gap: comparing calendar (forward) vs old content (published) per pillar
export function pillarGap(cal: CalendarRow[], opt: OptRow[]) {
  const c = calendarPillarCoverage(cal);
  const o = optimisationPillarCoverage(opt);
  return PILLARS.map((p) => ({ pillar: p, calendar: c[p] || 0, published: o[p] || 0 }));
}

// Las páginas donde hay trabajo pendiente y algo que perder.
//
// Antes esto filtraba por priority "High" o "Medium", que eran los valores de
// la hoja vieja. La de Clusterización no usa prioridades: usa la columna
// "Trabajo", con valores como Optimizar, Reescribir o Landing reescribir. Con
// el filtro viejo esta función habría devuelto cero filas sin que nada fallara,
// que es la peor forma de romperse.
//
// Se ordenan por clics, porque una página que ya trae tráfico y necesita
// trabajo es más urgente que una que no trae nada.
const NEEDS_WORK = /^(optimizar|reescribir|landing (optimizar|reescribir|crear))$/i;

export function highImpactOldPages(rows: OptRow[], n = 30) {
  return rows
    .filter((r) => NEEDS_WORK.test((r.work || "").trim()))
    .sort((a, b) => b.gscClicks - a.gscClicks)
    .slice(0, n);
}
