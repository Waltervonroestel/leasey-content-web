import { NextResponse } from "next/server";
import { hasGsc, topicClusters } from "@/lib/gsc";

export const runtime = "nodejs";

export async function GET(req: Request) {
  if (!hasGsc()) return NextResponse.json({ connected: false, clusters: [] });
  try {
    const days = Number(new URL(req.url).searchParams.get("days") || 90);
    const { clusters, other } = await topicClusters(days);
    return NextResponse.json({ connected: true, clusters, other });
  } catch (e) {
    return NextResponse.json({ connected: true, clusters: [], error: String(e) }, { status: 500 });
  }
}
