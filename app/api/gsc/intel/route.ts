import { NextResponse } from "next/server";
import { apiRoute } from "@/lib/google-auth-state";
import { hasGsc, queryIntel, queryTrends } from "@/lib/gsc";

export const runtime = "nodejs";

export const GET = apiRoute(async (req: Request) => {
  if (!hasGsc()) return NextResponse.json({ connected: false });
  try {
    const days = Number(new URL(req.url).searchParams.get("days") || 90);
    const [intel, trends] = await Promise.all([queryIntel(days), queryTrends(days)]);
    return NextResponse.json({ connected: true, days, ...intel, trends });
  } catch (e) {
    return NextResponse.json({ connected: true, error: String(e) }, { status: 500 });
  }
});
