import { NextResponse } from "next/server";
import { appendToSheet, readSheetTab, sheetsConfigured, listCalendarRows } from "@/lib/sheets";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Encola de golpe todas las piezas del calendario que caen en un rango de
// fechas, para poder escribir la semana que viene o el mes entero de una vez.
//
// La app NO escribe: no tiene ANTHROPIC_API_KEY en Render y eso es deliberado.
// Encola en la pestaña "Writing Queue" y quien escribe es Claude Code corriendo
// process-content-queue.mjs. Este endpoint solo decide QUÉ entra en la cola.
//
// Lo que no se encola importa más que lo que sí:
//   - una fila con Google Doc ya tiene borrador, y encolarla otra vez produce
//     una segunda versión que compite con la primera;
//   - una fila Programado o Publicado ya salió, y reescribirla no es "escribir
//     la semana", es pisar trabajo hecho;
//   - un título que ya está en la cola no se duplica.
// En los tres casos se dice por qué se saltó, en vez de devolver un número
// menor sin explicación.

const CALENDAR_SHEET_ID = process.env.CALENDAR_SHEET_ID || "";
const TAB = "Writing Queue";
const HEADER = ["Queued At", "Title", "Angle", "Pillar", "Cluster", "Status", "Notes"];

/** Estados que significan "esto ya salió o está a punto". */
const DONE = /^(programado|publicado|scheduled|published)$/i;

const iso = (d: Date) => d.toISOString().slice(0, 10);

/** Lunes de la semana que contiene esa fecha, en UTC. */
function monday(from: Date): Date {
  const d = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()));
  const day = d.getUTCDay(); // 0 domingo
  d.setUTCDate(d.getUTCDate() + (day === 0 ? -6 : 1 - day));
  return d;
}

function rangeFor(scope: string, todayIso: string): { from: string; to: string; label: string } {
  const today = new Date(todayIso + "T00:00:00Z");

  if (scope === "this-week") {
    const m = monday(today);
    const end = new Date(m);
    end.setUTCDate(end.getUTCDate() + 6);
    return { from: iso(m), to: iso(end), label: "this week" };
  }
  if (scope === "next-week") {
    const m = monday(today);
    m.setUTCDate(m.getUTCDate() + 7);
    const end = new Date(m);
    end.setUTCDate(end.getUTCDate() + 6);
    return { from: iso(m), to: iso(end), label: "next week" };
  }
  if (scope === "next-month") {
    const s = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 1));
    const e = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 2, 0));
    return { from: iso(s), to: iso(e), label: "next month" };
  }
  // this-month
  const s = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
  const e = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 0));
  return { from: iso(s), to: iso(e), label: "this month" };
}

export async function POST(req: Request) {
  if (!sheetsConfigured()) {
    return NextResponse.json({ error: "Sheets is not configured." }, { status: 400 });
  }

  const body = (await req.json()) as {
    scope?: string;
    from?: string;
    to?: string;
    channel?: string;
    dryRun?: boolean;
    /**
     * Incluir piezas que ya tienen Google Doc. Apagado por defecto: las 91
     * filas del calendario ya tienen borrador, así que encenderlo sin querer
     * encolaría el calendario entero para reescribir.
     */
    includeWritten?: boolean;
  };

  const today = iso(new Date());
  const r =
    body.from && body.to
      ? { from: body.from, to: body.to, label: `${body.from} → ${body.to}` }
      : rangeFor(body.scope || "next-week", today);

  const rows = await listCalendarRows();
  const inRange = rows.filter((x) => x.date && x.date >= r.from && x.date <= r.to);

  if (!inRange.length) {
    return NextResponse.json({
      ok: true,
      range: r,
      queued: [],
      skipped: [],
      // Un cero necesita causa: el calendario puede no llegar tan lejos.
      note: `The calendar has no pieces dated between ${r.from} and ${r.to}.`,
    });
  }

  const existing = await readSheetTab(CALENDAR_SHEET_ID, TAB);
  const already = new Set(
    existing.slice(1).map((row) => String(row[1] || "").trim().toLowerCase()).filter(Boolean),
  );

  const queued: { title: string; date: string; channel: string }[] = [];
  const skipped: { title: string; date: string; reason: string }[] = [];
  const toAppend: string[][] = [];

  for (const x of inRange) {
    if (body.channel && x.channel !== body.channel) continue;

    if (x.docLink && !body.includeWritten) {
      skipped.push({ title: x.title, date: x.date, reason: "already has a Google Doc" });
      continue;
    }
    if (DONE.test(x.status || "")) {
      skipped.push({ title: x.title, date: x.date, reason: `status is ${x.status}` });
      continue;
    }
    const key = x.title.trim().toLowerCase();
    if (!key) {
      skipped.push({ title: "(untitled row)", date: x.date, reason: "the row has no title" });
      continue;
    }
    if (already.has(key)) {
      skipped.push({ title: x.title, date: x.date, reason: "already in the queue" });
      continue;
    }

    already.add(key);
    queued.push({ title: x.title, date: x.date, channel: x.channel });
    toAppend.push([
      today,
      x.title,
      // El ángulo del calendario es el canal y la voz: quien escribe necesita
      // saber si es un blog o un post de fundador antes de abrir el documento.
      `${x.channel}${x.voice ? ` · ${x.voice}` : ""}`,
      x.pillar || "",
      x.track || "",
      "Queued",
      // Si ya había documento, quien escribe tiene que saber que es una
      // reescritura sobre un borrador existente y no una pieza en blanco.
      [
        `Calendar row ${x.sheetRow}`,
        `publishes ${x.date}`,
        `phase ${x.phase || "—"}`,
        x.docLink ? `REWRITE of existing doc: ${x.docLink}` : "",
      ]
        .filter(Boolean)
        .join(" · "),
    ]);
  }

  if (body.dryRun) {
    return NextResponse.json({ ok: true, dryRun: true, range: r, queued, skipped });
  }

  if (toAppend.length) {
    if (existing.length === 0) await appendToSheet(CALENDAR_SHEET_ID, TAB, [HEADER]);
    await appendToSheet(CALENDAR_SHEET_ID, TAB, toAppend);
  }

  return NextResponse.json({
    ok: true,
    range: r,
    queued,
    skipped,
    command: "node scripts/process-content-queue.mjs",
  });
}
