import { NextResponse } from "next/server";
import { hasGsc, queryIntel } from "@/lib/gsc";
import { listCalendarRows, listOptimisationRows, sheetsConfigured } from "@/lib/sheets";
import { calendarPillarCoverage, canonical, PILLARS } from "@/lib/analysis";
import { rivalTopics } from "@/lib/rival-topics";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  const days = Number(new URL(req.url).searchParams.get("days") || 90);
  if (!hasGsc()) return NextResponse.json({ connected: false });
  try {
    const intel = await queryIntel(days);
    const [cal, opt] = sheetsConfigured() ? await Promise.all([listCalendarRows(), listOptimisationRows()]) : [[], []];
    const cov = calendarPillarCoverage(cal);

    // Pillar gaps: ranked by how under-supported they are in the forward calendar
    const pillarGaps = PILLARS.map((p) => {
      const count = cov[p] || 0;
      const published = opt.filter((r) => canonical(r.primary) === p).length;
      return { pillar: p, calendar: count, published, isGap: count < 5 || (p === "P6 US Sun Belt" && count < 10) };
    }).sort((a, b) => Number(b.isGap) - Number(a.isGap) || a.calendar - b.calendar);

    // Title-existence check: which "write next" queries already have a piece in the calendar?
    const calTitles = (cal || []).map((r) => r.title.toLowerCase());
    const titleExists = (q: string) => {
      const qs = q.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
      return calTitles.some((t) => qs.filter((w) => t.includes(w)).length >= Math.max(2, Math.floor(qs.length * 0.6)));
    };
    const writeNextAnnotated = (intel.writeNext || []).map((w) => ({
      ...w,
      alreadyInCalendar: w.query ? titleExists(w.query) : false,
    }));

    // Lo que publica el sector. Es la segunda fuente de ideas y responde algo
    // que GSC no puede: un tema que cubren tres competidores y nosotros no, NO
    // aparece en Search Console precisamente porque no tenemos nada que rankee
    // ahí. Mirando solo GSC ese hueco es invisible.
    //
    // Se marca cuáles ya están en el calendario, igual que las de GSC, en vez de
    // enseñar una lista donde la mitad ya está cubierta.
    const rivals = rivalTopics(120, 40);
    const rivalTopicsAnnotated = rivals.topics
      .filter((t) => t.sources.length >= 2)
      .map((t) => ({ ...t, alreadyInCalendar: titleExists(t.phrase.replace(" + ", " ")) }));

    return NextResponse.json({
      connected: true,
      days,
      writeNext: writeNextAnnotated,
      questions: intel.questions,
      comparisons: intel.comparisons,
      untapped: intel.untapped,
      pillarGaps,
      calendarSize: cal.length,
      publishedSize: opt.length,
      rivalTopics: rivalTopicsAnnotated,
      rivalSources: rivals.sources,
      // La vigilancia tiene huecos declarados: fuentes sin fecha y medios que
      // bloquean. Se pasan a la interfaz para no dar una foto parcial del
      // sector por la foto completa.
      rivalWarnings: [
        ...(rivals.undatedWithoutDiff.length
          ? [
              `Sin fecha en su sitemap y con una sola instantánea, así que entró su archivo entero, no solo lo reciente: ${rivals.undatedWithoutDiff.join(", ")}. Se corrige con el snapshot del lunes.`,
            ]
          : []),
        ...(rivals.sources.some((s) => s.total === 0)
          ? ["Algunas fuentes bloquean el acceso automatizado, así que la vista del sector es parcial."]
          : []),
      ],
    });
  } catch (e) {
    return NextResponse.json({ connected: false, error: (e as Error).message }, { status: 500 });
  }
}
