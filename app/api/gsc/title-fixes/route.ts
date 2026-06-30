import { NextResponse } from "next/server";
import { hasGsc, queryIntel } from "@/lib/gsc";
import { suggestTitles } from "@/lib/titleSuggest";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  if (!hasGsc()) return NextResponse.json({ connected: false });
  try {
    const days = Number(new URL(req.url).searchParams.get("days") || 90);
    const intel = await queryIntel(days);
    const fixes = intel.ctrFixes.slice(0, 20).map((q) => ({
      query: q.query, impressions: q.impressions, clicks: q.clicks, position: q.position,
      ctr: q.ctr, suggestions: suggestTitles(q.query || "", q.position),
    }));
    return NextResponse.json({ connected: true, days, fixes });
  } catch (e) {
    return NextResponse.json({ connected: true, error: (e as Error).message }, { status: 500 });
  }
}
