import { NextResponse } from "next/server";
import { apiRoute } from "@/lib/google-auth-state";
import { sheetsConfigured, listCalendarRows } from "@/lib/sheets";
import { appendCalendarRows, nextFreeSlots, type NewPiece } from "@/lib/calendar-append";
import { calendarPillarCoverage, PILLARS } from "@/lib/analysis";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Manda ideas del tab de Ideas al calendario, en el siguiente hueco libre según
// la cadencia que el equipo ya sigue.
//
// Antes de esto, Ideas solo LEÍA el calendario (para los huecos de pilar y para
// marcar lo que ya estaba cubierto). El camino de vuelta no existía: una idea
// buena se quedaba en la pantalla o iba a la cola de escritura sin fecha ni
// canal, así que nunca entraba en el plan.
//
// La fecha y el canal no los elige quien pulsa: salen del siguiente slot libre.
// Dejar escribir una fecha a mano habría producido dos piezas el mismo día en
// el mismo canal, que es justo lo que la cadencia existe para evitar.

export const POST = apiRoute(async (req: Request) => {
  if (!sheetsConfigured()) return NextResponse.json({ error: "Sheets is not configured." }, { status: 400 });

  const body = (await req.json()) as {
    items?: { title: string; notes?: string; pillar?: string }[];
    dryRun?: boolean;
  };
  const items = (body.items || []).filter((i) => i?.title?.trim());
  if (!items.length) return NextResponse.json({ error: "No ideas were sent." }, { status: 400 });

  const rows = await listCalendarRows();

  // No repetir lo que ya está planeado. Comparar por palabras y no por igualdad
  // exacta: "tenant screening canada" y "Tenant screening in Canada" son la
  // misma pieza y una igualdad estricta las dejaría pasar a las dos.
  const sig = (s: string) =>
    new Set(s.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 3));
  const already = rows.map((r) => sig(r.title));
  const isDuplicate = (title: string) => {
    const w = sig(title);
    if (!w.size) return false;
    return already.some((t) => {
      let hits = 0;
      for (const x of w) if (t.has(x)) hits++;
      return hits >= Math.max(2, Math.floor(w.size * 0.6));
    });
  };

  const wanted = items.filter((i) => !isDuplicate(i.title));
  const duplicates = items.filter((i) => isDuplicate(i.title)).map((i) => i.title);

  if (!wanted.length) {
    return NextResponse.json({
      ok: true,
      added: [],
      duplicates,
      note: "All of them are already planned in the calendar, so nothing was added.",
    });
  }

  const slots = await nextFreeSlots(wanted.length);
  if (slots.length < wanted.length) {
    // Decirlo en vez de inventar fechas para las que sobran.
    return NextResponse.json(
      {
        error: `Only ${slots.length} free slots were found for ${wanted.length} ideas. Nothing was written.`,
      },
      { status: 422 },
    );
  }

  // El pilar por defecto es el que menos cubierto está, que es la razón por la
  // que Ideas mira el calendario en primer lugar.
  const cov = calendarPillarCoverage(rows);
  const leastCovered = [...PILLARS].sort((a, b) => (cov[a] || 0) - (cov[b] || 0))[0];

  const pieces: NewPiece[] = wanted.map((i, n) => ({
    date: slots[n].date,
    channel: slots[n].channel,
    voice: slots[n].voice,
    title: `[working title] ${i.title}`,
    pillar: i.pillar || leastCovered,
    notes: i.notes || "Sent from the Ideas tab.",
  }));

  const res = await appendCalendarRows(pieces, body.dryRun);
  if (!res.ok) return NextResponse.json(res, { status: 422 });

  return NextResponse.json({
    ok: true,
    dryRun: body.dryRun || false,
    added: pieces.map((p) => ({ date: p.date, channel: p.channel, title: p.title })),
    duplicates,
    written: res.written,
    sampleRow: res.sampleRow,
  });
});
