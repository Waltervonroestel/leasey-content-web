import { NextResponse } from "next/server";
import { hasGsc, queryAnalytics } from "@/lib/gsc";

export const runtime = "nodejs";

export async function GET(req: Request) {
  if (!hasGsc()) return NextResponse.json({ connected: false });
  try {
    const days = Number(new URL(req.url).searchParams.get("days") || 28);
    const { rows, startDate, endDate } = await queryAnalytics("page", days);
    const totals = rows.reduce(
      (acc, r) => {
        acc.clicks += r.clicks;
        acc.impressions += r.impressions;
        return acc;
      },
      { clicks: 0, impressions: 0 }
    );
    const ctr = totals.impressions ? totals.clicks / totals.impressions : 0;
    const avgPos = rows.length ? rows.reduce((s, r) => s + r.position, 0) / rows.length : 0;
    return NextResponse.json({ connected: true, rows, startDate, endDate, totals: { ...totals, ctr, avgPos } });
  } catch (e) {
    return NextResponse.json({ connected: true, error: String(e) }, { status: 500 });
  }
}
