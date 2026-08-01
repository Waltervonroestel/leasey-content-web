import { google } from "googleapis";

// GA4 responde lo que Search Console no puede: qué pasó DESPUÉS del clic.
//
// Search Console termina en el clic. Una página con muchos clics y rebote
// inmediato y otra con pocos clics y sesiones largas se ven idénticas en GSC, y
// son problemas opuestos. Sin esto, "esta página funciona" solo significa "esta
// página recibe clics".
//
// Hasta ahora el único dato de GA4 del proyecto era una columna de una hoja con
// una foto de junio de 2026, que además se mostraba con la etiqueta de
// impresiones. Esto la sustituye por datos vivos.

const PROPERTY_ID = process.env.GA4_PROPERTY_ID || "";

export function hasGa4(): boolean {
  return Boolean(
    PROPERTY_ID &&
      process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GA4_REFRESH_TOKEN
  );
}

function client() {
  const o = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
  o.setCredentials({ refresh_token: process.env.GA4_REFRESH_TOKEN });
  return google.analyticsdata({ version: "v1beta", auth: o });
}

export function dateRange(days: number) {
  const d = (n: number) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);
  // GA4 no tiene el retraso de 2 días de Search Console, pero se deja 1 día de
  // margen porque el de ayer todavía se está consolidando.
  return { startDate: d(days), endDate: d(1) };
}

export interface Ga4PageRow {
  path: string;
  sessions: number;
  users: number;
  engagedSessions: number;
  engagementRate: number;
  avgDuration: number;
  conversions: number;
}

/** Rendimiento por página: sesiones, engagement y conversiones. */
export async function pagePerformance(days = 28, limit = 500): Promise<Ga4PageRow[]> {
  if (!hasGa4()) return [];
  const { startDate, endDate } = dateRange(days);
  const res = await client().properties.runReport({
    property: `properties/${PROPERTY_ID}`,
    requestBody: {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "pagePath" }],
      metrics: [
        { name: "sessions" },
        { name: "totalUsers" },
        { name: "engagedSessions" },
        { name: "engagementRate" },
        { name: "averageSessionDuration" },
        { name: "keyEvents" },
      ],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: String(limit),
    },
  });

  return (res.data.rows || []).map((r) => {
    const v = (i: number) => Number(r.metricValues?.[i]?.value || 0);
    return {
      path: r.dimensionValues?.[0]?.value || "",
      sessions: v(0),
      users: v(1),
      engagedSessions: v(2),
      engagementRate: +v(3).toFixed(3),
      avgDuration: Math.round(v(4)),
      conversions: v(5),
    };
  });
}

/** Sesiones por canal, para separar lo orgánico del resto. */
export async function byChannel(days = 28) {
  if (!hasGa4()) return [];
  const { startDate, endDate } = dateRange(days);
  const res = await client().properties.runReport({
    property: `properties/${PROPERTY_ID}`,
    requestBody: {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "sessionDefaultChannelGroup" }],
      metrics: [{ name: "sessions" }, { name: "keyEvents" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    },
  });
  return (res.data.rows || []).map((r) => ({
    channel: r.dimensionValues?.[0]?.value || "",
    sessions: Number(r.metricValues?.[0]?.value || 0),
    conversions: Number(r.metricValues?.[1]?.value || 0),
  }));
}

export interface PostClickRow extends Ga4PageRow {
  clicks: number;
  impressions: number;
  position: number;
  /** Lo que ninguna de las dos fuentes dice por separado. */
  verdict: string;
}

/**
 * Cruza Search Console con GA4 por ruta, que es donde está el valor: cada
 * fuente sola da media respuesta.
 *
 * Los cuatro casos que importan:
 *   - Muchas impresiones, pocos clics -> problema de título y meta.
 *   - Muchos clics, engagement bajo -> la página promete algo que no cumple.
 *   - Pocos clics, engagement alto -> merece más alcance del que tiene.
 *   - Sesiones sin conversión -> falta el CTA o está en el sitio equivocado.
 */
export function joinWithSearch(
  ga4: Ga4PageRow[],
  gsc: { page?: string; clicks: number; impressions: number; position: number }[]
): PostClickRow[] {
  const norm = (u: string) => {
    try {
      return new URL(u, "https://x").pathname.replace(/\/$/, "") || "/";
    } catch {
      return u.replace(/\/$/, "") || "/";
    }
  };
  const bySearch = new Map(gsc.filter((r) => r.page).map((r) => [norm(r.page!), r]));

  return ga4
    .map((g) => {
      const s = bySearch.get(norm(g.path));
      const clicks = s?.clicks ?? 0;
      const impressions = s?.impressions ?? 0;
      const position = s ? +s.position.toFixed(1) : 0;
      const ctr = impressions ? clicks / impressions : 0;

      let verdict = "sin señal suficiente";
      if (impressions >= 300 && ctr < 0.01 && position <= 20)
        verdict = "el título y la meta no se ganan el clic";
      else if (clicks >= 30 && g.engagementRate < 0.4)
        verdict = "entra gente y se va: la página no cumple lo que promete";
      else if (clicks > 0 && clicks < 20 && g.engagementRate >= 0.6)
        verdict = "funciona con quien llega, le falta alcance";
      else if (g.sessions >= 50 && g.conversions === 0)
        verdict = "tráfico sin conversión: revisar el CTA";
      else if (clicks >= 20 && g.engagementRate >= 0.5) verdict = "sana";

      return { ...g, clicks, impressions, position, verdict };
    })
    .sort((a, b) => b.sessions - a.sessions);
}
