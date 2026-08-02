import { NextResponse } from "next/server";
import { listCalendarRows, sheetsConfigured } from "@/lib/sheets";
import { appendCalendarRows, cadence } from "@/lib/calendar-append";
import { hasGsc, queryIntel } from "@/lib/gsc";
import { calendarPillarCoverage, PILLARS } from "@/lib/analysis";
import { rivalTopics } from "@/lib/rival-topics";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

// Propone piezas NUEVAS para después de donde termina el calendario actual, y
// las añade como filas al final de la hoja.
//
// Dos decisiones que definen esto:
//
// 1. Los temas salen de dos fuentes observadas, nunca de un modelo inventando
//    titulares. El sistema ya tuvo un caso donde se publicó una cifra que nadie
//    había abierto; proponer temas que nadie busca es la misma clase de error,
//    más barato de cometer.
//
//    a) Search Console: qué busca la gente.
//    b) Competidores y medios: de qué ha decidido hablar el sector.
//
//    Las dos dicen cosas distintas y por eso se intercalan en vez de mezclarse
//    en un solo ranking. Un tema que cubren tres competidores y nosotros no,
//    NO aparece en GSC — precisamente porque no tenemos nada que rankee ahí.
//    Ese hueco es invisible si solo se mira Search Console.
//
// 2. El título que se escribe en la hoja es un TÍTULO DE TRABAJO derivado de la
//    consulta, marcado como tal. Un titular pulido generado aquí se leería como
//    decisión editorial tomada, y no lo es: quien escriba la pieza decide el
//    titular con el brief delante.
//
// La cadencia (qué días se publica y en qué canal) se hereda de las últimas
// semanas del calendario en vez de fijarla a mano, para que la extensión siga
// el ritmo que el equipo ya tiene y no uno nuevo.

const iso = (d: Date) => d.toISOString().slice(0, 10);
const DAY_NAME = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Palabras significativas, para no proponer dos veces el mismo tema. */
const words = (s: string) =>
  new Set(
    s
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 3),
  );

function overlaps(a: string, b: string): boolean {
  const wa = words(a);
  const wb = words(b);
  if (!wa.size) return false;
  let hits = 0;
  for (const w of wa) if (wb.has(w)) hits++;
  return hits >= Math.max(2, Math.floor(wa.size * 0.6));
}

export async function POST(req: Request) {
  if (!sheetsConfigured()) return NextResponse.json({ error: "Sheets is not configured." }, { status: 400 });
  // Sin GSC todavía quedan los competidores y los medios, así que no se
  // bloquea: se avisa de que falta una de las dos fuentes.
  const gscOn = hasGsc();

  const body = (await req.json()) as { weeks?: number; dryRun?: boolean };
  const weeks = Math.min(Math.max(Number(body.weeks) || 4, 1), 13);

  const rows = await listCalendarRows();
  const dated = rows.filter((r) => r.date);
  if (!dated.length) return NextResponse.json({ error: "The calendar has no dated rows." }, { status: 400 });

  const lastDate = dated.map((r) => r.date).sort().at(-1)!;
  const slots = cadence(dated);
  if (!slots.length) {
    return NextResponse.json(
      { error: "Could not infer a cadence from the last four weeks of the calendar." },
      { status: 422 },
    );
  }

  // Demanda medida, sin lo que ya está en el calendario.
  const intel = gscOn ? await queryIntel(90) : null;
  // `query` es opcional en el tipo de GSC, así que se normaliza a una forma con
  // los campos garantizados en vez de arrastrar `string | undefined` hasta el
  // punto donde se escribe una fila.
  interface Candidate {
    query: string;
    impressions: number;
    position: number;
    angle: string;
    source: "gsc" | "rivals";
    covers?: string[]; // quién lo cubre, cuando viene del sector
    examples?: { source: string; url: string }[];
  }

  const fromGsc: Candidate[] = [
    ...(intel?.writeNext || []),
    ...(intel?.questions || []),
    ...(intel?.untapped || []),
  ]
    .filter((c): c is typeof c & { query: string } => Boolean(c?.query))
    .map((c) => ({
      query: c.query,
      impressions: c.impressions || 0,
      position: c.position || 0,
      angle: ("angle" in c && c.angle) || ("action" in c && c.action) || "",
      source: "gsc" as const,
    }))
    .sort((a, b) => b.impressions - a.impressions);

  // Lo que competidores y medios publicaron. Dos fuentes que dicen cosas
  // distintas y por eso no se mezclan en una sola lista ordenada por
  // impresiones: GSC dice qué busca la gente, esto dice de qué ha decidido
  // hablar el sector. Un tema que cubren tres competidores y nosotros no,
  // no aparece en GSC precisamente porque no tenemos nada que rankee.
  const rivals = rivalTopics(120, 80);
  const fromRivals: Candidate[] = rivals.topics
    // Una sola fuente es una apuesta suya; dos ya es el sector.
    .filter((t) => t.sources.length >= 2)
    .map((t) => ({
      query: t.phrase,
      impressions: 0,
      position: 0,
      angle: `Covered by ${t.sources.join(", ")}. Our angle has to be the one they are not taking.`,
      source: "rivals" as const,
      covers: t.sources,
      examples: t.examples,
    }));

  // Se intercalan para que una tanda no salga entera de una sola fuente.
  const candidates: Candidate[] = [];
  for (let i = 0; i < Math.max(fromGsc.length, fromRivals.length); i++) {
    if (fromGsc[i]) candidates.push(fromGsc[i]);
    if (fromRivals[i]) candidates.push(fromRivals[i]);
  }

  const taken: string[] = dated.map((r) => r.title);
  const fresh: Candidate[] = [];
  for (const c of candidates) {
    if (taken.some((t) => overlaps(c.query, t))) continue;
    taken.push(c.query);
    fresh.push(c);
  }

  // Pilares por hueco: el que menos cubierto está va primero.
  const cov = calendarPillarCoverage(dated);
  const pillarOrder = [...PILLARS].sort((a, b) => (cov[a] || 0) - (cov[b] || 0));

  // Fechas: se sigue a partir del día siguiente al último del calendario.
  const start = new Date(lastDate + "T00:00:00Z");
  start.setUTCDate(start.getUTCDate() + 1);

  const proposed: {
    date: string;
    day: string;
    channel: string;
    voice: string;
    title: string;
    pillar: string;
    query: string;
    impressions: number;
    position: number;
    angle: string;
    source: string;
    covers?: string[];
    examples?: { source: string; url: string }[];
  }[] = [];

  let ci = 0;
  let pi = 0;
  for (let d = 0; d < weeks * 7 && ci < fresh.length; d++) {
    const day = new Date(start);
    day.setUTCDate(day.getUTCDate() + d);
    const wd = day.getUTCDay();
    for (const s of slots.filter((x) => x.weekday === wd)) {
      if (ci >= fresh.length) break;
      const c = fresh[ci++];
      proposed.push({
        date: iso(day),
        day: DAY_NAME[wd],
        channel: s.channel,
        voice: s.voice,
        // Marcado como título de trabajo a propósito: es la consulta, no un
        // titular decidido.
        // Las dos fuentes producen cosas distintas y el título lo dice:
        // de GSC viene una consulta real, del sector viene un par de palabras
        // que varias fuentes comparten. Llamar "working title" a "fraud +
        // detection" habría hecho pasar dos palabras por un titular.
        title:
          c.source === "gsc"
            ? `[working title] ${c.query}`
            : `[topic from rivals] ${c.query} — covered by ${(c.covers || []).length} sources`,
        pillar: pillarOrder[pi++ % pillarOrder.length],
        query: c.query,
        impressions: c.impressions,
        position: Math.round(c.position * 10) / 10,
        angle: c.angle,
        source: c.source,
        covers: c.covers,
        examples: c.examples,
      });
    }
  }

  // Si la demanda libre se agota antes que las semanas pedidas, se dice. Rellenar
  // con temas inventados sería exactamente lo que el sistema existe para impedir.
  const exhausted = ci >= fresh.length && proposed.length < weeks * slots.length;

  const result = {
    ok: true,
    from: iso(start),
    weeks,
    lastCalendarDate: lastDate,
    cadence: slots.map((s) => `${DAY_NAME[s.weekday]} · ${s.channel}`),
    proposed,
    availableTopics: fresh.length,
    exhausted,
    // De dónde salió cada cosa, para que no haya que creerse el número.
    sources: {
      gsc: gscOn ? fromGsc.length : null,
      rivals: fromRivals.length,
      rivalCoverage: rivals.sources,
      // Fuentes cuyo sitemap no trae fecha y de las que aún no hay dos
      // instantáneas: entra todo su archivo, no solo lo reciente.
      undatedWithoutDiff: rivals.undatedWithoutDiff,
    },
    warnings: [
      ...(gscOn ? [] : ["Search Console is not connected: the proposals come only from competitors and outlets."]),
      ...(rivals.undatedWithoutDiff.length
        ? [
            `These sources publish no dates and there is only one snapshot, so their whole archive counted as candidates, not just recent posts: ${rivals.undatedWithoutDiff.join(", ")}. A second weekly snapshot fixes this.`,
          ]
        : []),
      ...(rivals.sources.filter((s) => s.used === 0 && s.total === 0).length
        ? ["Some sources returned nothing (they block automated access), so the sector view is partial."]
        : []),
    ],
    note: exhausted
      ? `Measured demand ran out at ${proposed.length} pieces. The rest is not filled in with invented topics — bring more queries (or a longer GSC window) to extend further.`
      : undefined,
  };

  // El mapeo de columnas vive en lib/calendar-append: esta ruta y la de Ideas
  // escriben en la misma hoja, y duplicar la lectura de la cabecera habría
  // hecho que una corrección se aplicara solo a una de las dos.
  const res = await appendCalendarRows(
    proposed.map((p) => ({
      date: p.date,
      channel: p.channel,
      voice: p.voice,
      title: p.title,
      pillar: p.pillar,
      notes:
        p.source === "gsc"
          ? `From GSC: "${p.query}" · ${p.impressions} impressions · position ${p.position}. ${p.angle}`
          : `From competitor/outlet watch. ${p.angle} Examples: ${(p.examples || [])
              .slice(0, 3)
              .map((e) => `${e.source} ${e.url}`)
              .join(" | ")}`,
    })),
    body.dryRun,
  );

  if (!res.ok) return NextResponse.json({ ...result, ...res }, { status: 422 });

  return NextResponse.json({ ...result, dryRun: body.dryRun || false, ...res });
}
