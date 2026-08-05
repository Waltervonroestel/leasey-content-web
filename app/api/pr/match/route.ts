import fs from "fs";
import { apiRoute } from "@/lib/google-auth-state";
import path from "path";
import { NextResponse } from "next/server";
import { contentRoot } from "@/lib/content";
import { listCalendarRows } from "@/lib/sheets";
import { hasGsc, queryAnalytics } from "@/lib/gsc";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Cruza tres cosas que hasta ahora vivían separadas: qué vamos a anunciar
// (calendario), qué publica cada medio (vigilancia) y qué busca la gente (GSC).
//
// El emparejamiento no adivina si un pitch va a entrar. Solo dice de qué viene
// hablando cada medio, que es el dato que hoy falta cuando alguien escribe un
// pitch: se manda el mismo texto a los cinco y se acepta en ninguno.

interface Page {
  url: string;
  lastmod: string;
}

// Qué temas trata un medio, deducido de sus propias URLs. No es una taxonomía
// nuestra impuesta encima: son las palabras que ellos usan.
const TOPICS: Record<string, RegExp> = {
  "IA y automatización": /\b(ai|artificial|automat|machine-learning|chatbot|proptech)\b/i,
  "Screening y fraude": /\b(screening|fraud|background|credit|verification|eviction)\b/i,
  "Operaciones y centralización": /\b(centraliz|operations|staffing|onsite|workforce|portfolio)\b/i,
  "Mercado y vacancia": /\b(vacancy|rent-growth|market|forecast|supply|absorption|occupancy)\b/i,
  "Financiación y M&A": /\b(acquisi|merger|funding|invest|capital|deal|financ)\b/i,
  "Producto y lanzamientos": /\b(launch|release|announce|partnership|integration|unveil)\b/i,
  "Regulación y compliance": /\b(law|regulat|compliance|fair-housing|doj|legisl|policy)\b/i,
  Resident: /\b(resident|tenant|renter|experience|retention|amenity)\b/i,
};

// MultifamilyBiz escribe sus slugs con guion bajo, y  no ve límite de palabra
// ahí porque el guion bajo cuenta como carácter de palabra: "completes_acquisition"
// no casaba con /acquisi/. Se normaliza a espacios antes de comparar.
// Temas que los medios cubren y nosotros no: cubren el sector entero, nosotros
// una parte. Sirven para entender al medio, no para darnos ideas.
const NOT_OURS = ["Financiación y M&A"];

const flatten = (u: string) => u.replace(/[_+]/g, "-");

const readWatch = (): Record<string, { kind?: string; tier?: string; error?: string; pages?: Page[] }> | null => {
  const dir = path.join(contentRoot(), "context", "competitor-watch");
  try {
    const latest = fs
      .readdirSync(dir)
      .filter((f) => /\.json$/.test(f))
      .sort()
      .pop();
    return latest ? JSON.parse(fs.readFileSync(path.join(dir, latest), "utf8")) : null;
  } catch {
    return null;
  }
};

export const GET = apiRoute(async () => {
  const watch = readWatch();
  const calendar = await listCalendarRows();

  // Los anuncios del calendario: press releases y announcements de empresa.
  // Anuncios: los dos tracks que lo son, más el canal de press release. Antes
  // esto miraba canal y pilar y solo encontraba dos de veintidós.
  const announcements = calendar
    .filter(
      (r) =>
        /^Press-Release/i.test(r.channel) ||
        /key announcements|product releases/i.test(r.track)
    )
    .map((r) => ({ date: r.date, title: r.title, channel: r.channel, track: r.track, docLink: r.docLink }));

  // Perfil temático de cada medio, de sus últimas URLs.
  const outlets = Object.entries(watch || {})
    .filter(([, d]) => d.kind === "medio")
    .map(([name, d]) => {
      const pages = (d.pages || []).slice().sort((a, b) => (b.lastmod || "").localeCompare(a.lastmod || ""));
      const recent = pages.slice(0, 300);
      const topics = Object.entries(TOPICS)
        .map(([topic, re]) => ({ topic, n: recent.filter((p) => re.test(flatten(p.url))).length }))
        .filter((t) => t.n > 0)
        .sort((a, b) => b.n - a.n);
      return {
        name,
        tier: d.tier || "",
        error: d.error || null,
        total: pages.length,
        topics: topics.slice(0, 4),
        recent: recent.slice(0, 5),
      };
    });

  // A qué medio encaja cada anuncio, por solape de tema.
  const matches = announcements.map((a) => {
    const t = a.title.toLowerCase();
    const scored = outlets
      .filter((o) => !o.error)
      .map((o) => {
        // Los temas del medio que además aparecen en el título del anuncio.
        const hits = o.topics.filter((x) => TOPICS[x.topic].test(t));
        return { outlet: o.name, tier: o.tier, score: hits.length, why: hits.map((h) => h.topic) };
      })
      .filter((s) => s.score > 0)
      .sort((a2, b2) => b2.score - a2.score);

    return {
      ...a,
      // Sin coincidencia no se inventa una: se dice que no la hay.
      best: scored.slice(0, 3),
      note: scored.length
        ? null
        : "Ningún medio vigilado viene tratando este tema. O es un ángulo nuevo, o hay que buscar otro medio.",
    };
  });

  // Qué escribir: temas que los medios tratan y donde además hay demanda medida.
  let ideas: { topic: string; outlets: string[]; queries: { q: string; impressions: number; position: number }[] }[] = [];
  if (hasGsc()) {
    try {
      const { rows } = await queryAnalytics("query", 90, 5000);
      ideas = Object.keys(TOPICS)
        .map((topic) => {
          const re = TOPICS[topic];
          const outletsOn = outlets.filter((o) => !o.error && o.topics.some((t) => t.topic === topic));
          const queries = rows
            .filter(
              (r) =>
                r.query &&
                re.test(r.query) &&
                r.impressions >= 50 &&
                // Posición 30 es el corte: más abajo no es una oportunidad, es
                // una consulta donde apenas existimos. "1031 exchange capital
                // gains" en posición 86 aparecía como idea y no es tema nuestro.
                r.position <= 30
            )
            .sort((a, b) => b.impressions - a.impressions)
            .slice(0, 5)
            .map((r) => ({ q: r.query!, impressions: r.impressions, position: +r.position.toFixed(1) }));
          return { topic, outlets: outletsOn.map((o) => o.name), queries };
        })
        // Interesa donde coinciden las dos señales: el medio habla de eso Y la
        // gente lo busca. Una sola de las dos no basta para escribir.
        //
        // Financiación y M&A se excluye a propósito: los medios hablan mucho de
        // eso porque cubren el sector entero, pero Leasey no compra edificios.
        // Que un medio trate un tema no lo convierte en tema nuestro.
        .filter((i) => !NOT_OURS.includes(i.topic))
        .filter((i) => i.outlets.length > 0 && i.queries.length > 0)
        .sort((a, b) => b.queries[0].impressions - a.queries[0].impressions);
    } catch {
      ideas = [];
    }
  }

  return NextResponse.json({
    connected: Boolean(watch),
    outlets,
    matches,
    ideas,
    blocked: outlets.filter((o) => o.error).map((o) => o.name),
  });
});
