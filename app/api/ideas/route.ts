import { NextResponse } from "next/server";
import { hasGsc, queryIntel } from "@/lib/gsc";
import { listCalendarRows, listOptimisationRows, sheetsConfigured } from "@/lib/sheets";
import { calendarPillarCoverage, canonical, PILLARS } from "@/lib/analysis";

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
    });
  } catch (e) {
    return NextResponse.json({ connected: false, error: (e as Error).message }, { status: 500 });
  }
}
