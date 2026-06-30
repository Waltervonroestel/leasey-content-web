import { NextResponse } from "next/server";
import { listCalendarRows, listOptimisationRows, sheetsConfigured } from "@/lib/sheets";
import { queryIntel, hasGsc } from "@/lib/gsc";
import { toCsv, csvResponse } from "@/lib/csv";
import { inferPillarFromTitle } from "@/lib/analysis";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const VALID = new Set(["calendar", "optimise", "ideas"]);

export async function GET(req: Request, ctx: { params: Promise<{ type: string }> }) {
  const { type } = await ctx.params;
  if (!VALID.has(type)) return NextResponse.json({ error: "type must be calendar, optimise, or ideas" }, { status: 400 });

  try {
    if (type === "calendar") {
      if (!sheetsConfigured()) return NextResponse.json({ error: "Sheets not configured" }, { status: 400 });
      const rows = await listCalendarRows();
      const flat = rows.map((r) => ({
        date: r.date, day: r.day, channel: r.channel, voice: r.voice,
        title: r.title, positioningPillar: inferPillarFromTitle(r.title),
        awarenessPhase: r.phase, status: r.status, docLink: r.docLink,
      }));
      return csvResponse(`leasey-calendar-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(flat));
    }
    if (type === "optimise") {
      if (!sheetsConfigured()) return NextResponse.json({ error: "Sheets not configured" }, { status: 400 });
      const rows = await listOptimisationRows();
      const flat = rows.map((r) => ({
        priority: r.priority, cluster: r.cluster, url: r.url,
        gscClicks: r.gsc, ga4Sessions: r.ga4,
        primaryPillar: r.primary, secondaryPillar: r.secondary,
        action: r.action, owner: r.owner,
      }));
      return csvResponse(`leasey-optimise-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(flat));
    }
    if (type === "ideas") {
      if (!hasGsc()) return NextResponse.json({ error: "GSC not configured" }, { status: 400 });
      const days = Number(new URL(req.url).searchParams.get("days") || 90);
      const intel = await queryIntel(days);
      const flat = intel.writeNext.concat(intel.questions, intel.comparisons, intel.untapped).map((q) => ({
        query: q.query, intent: q.intent, opportunity: q.opp, cluster: q.bucket,
        impressions: q.impressions, clicks: q.clicks, position: q.position?.toFixed(1),
        angle: q.angle, whatsHappening: q.whatsHappening,
      }));
      return csvResponse(`leasey-ideas-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(flat));
    }
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
  return NextResponse.json({ error: "unhandled" }, { status: 500 });
}
