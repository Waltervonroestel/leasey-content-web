import { appendToSheet, readSheetTab, listCalendarRows, CALENDAR_TAB } from "@/lib/sheets";

// Escribir filas nuevas en el calendario, en un solo sitio.
//
// Vive aparte porque ya falló una vez: la primera versión componía la fila por
// POSICIÓN de columna adivinada y las piezas habrían entrado sin canal y sin
// responsable — la cabecera real dice "Social Network / Channel" y
// "Responsible", no "channel" y "voice". Con dos rutas escribiendo en el
// calendario (extender el plan, y mandar una idea desde el tab de Ideas),
// duplicar ese mapeo garantizaba que la corrección se aplicara solo a una.

const CALENDAR_SHEET_ID = process.env.CALENDAR_SHEET_ID || "";

export interface NewPiece {
  date: string;
  channel: string;
  voice: string;
  title: string;
  pillar: string;
  notes: string;
}

export interface AppendResult {
  ok: boolean;
  written?: number;
  error?: string;
  headerRow?: string[];
  sampleRow?: string[];
  unmapped?: string[];
}

const norm = (s: unknown) => String(s ?? "").replace(/\s+/g, " ").trim().toLowerCase();

/**
 * Compone las filas contra la cabecera REAL de la hoja y las añade.
 *
 * Con `dryRun` devuelve la fila tal como se escribiría sin tocar nada, que es
 * lo que permitió ver que cuatro columnas no mapeaban antes de escribir.
 */
export async function appendCalendarRows(
  pieces: NewPiece[],
  dryRun = false,
): Promise<AppendResult> {
  if (!pieces.length) return { ok: true, written: 0 };

  const raw = await readSheetTab(CALENDAR_SHEET_ID, CALENDAR_TAB);
  const headerIdx = raw.findIndex((row) => row.some((c) => /publication date|^date$/.test(norm(c))));
  if (headerIdx < 0) {
    return { ok: false, error: "Could not find the header row in the calendar tab, so nothing was written." };
  }

  const header = raw[headerIdx].map(norm);

  // Coincidencia exacta primero, y por SUBCADENA después. Buscar por prefijo
  // era lo que dejaba "Social Network / Channel" sin encontrar.
  const at = (...names: string[]) => {
    for (const n of names) {
      const i = header.findIndex((h) => h === n);
      if (i >= 0) return i;
    }
    for (const n of names) {
      const i = header.findIndex((h) => h.includes(n));
      if (i >= 0) return i;
    }
    return -1;
  };

  const COLS: [string, number, (p: NewPiece) => string][] = [
    ["date", at("publication date", "date"), (p) => p.date],
    ["channel", at("social network / channel", "channel", "social network"), (p) => p.channel],
    ["voice", at("responsible", "voice", "author", "owner"), (p) => p.voice],
    ["title", at("title of the blog", "title", "topic"), (p) => p.title],
    ["pillar", at("pillar"), (p) => p.pillar],
    ["status", at("status"), () => "Idea"],
    ["track", at("track"), () => "Editorial / SEO"],
    ["notes", at("description", "notes", "note", "angle"), (p) => p.notes],
  ];

  // Sin fecha, título o canal la fila no es una pieza: es basura con fecha.
  const critical = ["date", "channel", "title"];
  const missing = COLS.filter(([n, i]) => critical.includes(n) && i < 0).map(([n]) => n);
  if (missing.length) {
    return {
      ok: false,
      error: `Nothing was written: these columns are missing from the calendar header: ${missing.join(", ")}.`,
      headerRow: raw[headerIdx],
    };
  }

  const width = header.length;
  const built = pieces.map((p) => {
    const row = new Array<string>(width).fill("");
    for (const [, i, val] of COLS) if (i >= 0 && i < width) row[i] = val(p);
    return row;
  });

  if (dryRun) {
    return {
      ok: true,
      written: 0,
      headerRow: raw[headerIdx],
      sampleRow: built[0],
      unmapped: COLS.filter(([, i]) => i < 0).map(([n]) => n),
    };
  }

  await appendToSheet(CALENDAR_SHEET_ID, CALENDAR_TAB, built);
  return { ok: true, written: built.length };
}

export interface Slot {
  weekday: number;
  channel: string;
  voice: string;
}

/**
 * Qué se publica cada día de la semana, leído de las últimas cuatro semanas
 * reales del calendario en vez de fijarlo a mano, para que lo nuevo siga el
 * ritmo que el equipo ya tiene.
 */
export function cadence(rows: { date: string; channel: string; voice: string }[]): Slot[] {
  const recent = [...rows].filter((r) => r.date).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 28);
  const byDay = new Map<number, Map<string, { n: number; voice: string }>>();

  for (const r of recent) {
    const wd = new Date(r.date + "T00:00:00Z").getUTCDay();
    if (!byDay.has(wd)) byDay.set(wd, new Map());
    const m = byDay.get(wd)!;
    const cur = m.get(r.channel) || { n: 0, voice: r.voice };
    m.set(r.channel, { n: cur.n + 1, voice: cur.voice || r.voice });
  }

  const slots: Slot[] = [];
  for (const [weekday, channels] of byDay) {
    for (const [channel, info] of channels) {
      // Un canal que solo apareció una vez en cuatro semanas es una excepción,
      // no cadencia; repetirlo semanalmente inventaría un ritmo que no existe.
      if (info.n < 2) continue;
      slots.push({ weekday, channel, voice: info.voice });
    }
  }
  return slots.sort((a, b) => a.weekday - b.weekday || a.channel.localeCompare(b.channel));
}

/**
 * El siguiente hueco libre después de donde termina el calendario.
 *
 * Lo usa el tab de Ideas: mandar una idea al calendario tiene que ponerla en el
 * siguiente día que toca según la cadencia, no en una fecha inventada ni encima
 * de una pieza que ya existe.
 */
export async function nextFreeSlots(count: number): Promise<{ date: string; channel: string; voice: string }[]> {
  const rows = await listCalendarRows();
  const dated = rows.filter((r) => r.date);
  if (!dated.length) return [];

  const slots = cadence(dated);
  if (!slots.length) return [];

  const taken = new Set(dated.map((r) => `${r.date}|${r.channel}`));
  const last = dated.map((r) => r.date).sort().at(-1)!;
  const start = new Date(last + "T00:00:00Z");

  const out: { date: string; channel: string; voice: string }[] = [];
  // Un año por delante es tope de seguridad, no un objetivo: si en 365 días no
  // caben, algo va mal en la cadencia y es mejor devolver de menos que girar.
  for (let d = 1; d <= 365 && out.length < count; d++) {
    const day = new Date(start);
    day.setUTCDate(day.getUTCDate() + d);
    const iso = day.toISOString().slice(0, 10);
    for (const s of slots.filter((x) => x.weekday === day.getUTCDay())) {
      if (out.length >= count) break;
      if (taken.has(`${iso}|${s.channel}`)) continue;
      taken.add(`${iso}|${s.channel}`);
      out.push({ date: iso, channel: s.channel, voice: s.voice });
    }
  }
  return out;
}
