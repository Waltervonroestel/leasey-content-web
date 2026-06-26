import { NextResponse } from "next/server";
import { hasGsc, queryIntel, queryTrends } from "@/lib/gsc";

export const runtime = "nodejs";

export async function GET(req: Request) {
  if (!hasGsc()) return NextResponse.json({ connected: false });
  try {
    const days = Number(new URL(req.url).searchParams.get("days") || 90);
    const [intel, trends] = await Promise.all([queryIntel(days), queryTrends(days)]);
    return NextResponse.json({ connected: true, days, ...intel, trends });
  } catch (e) {
    return NextResponse.json({ connected: true, error: String(e) }, { status: 500 });
  }
}
