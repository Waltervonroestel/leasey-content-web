import { NextResponse } from "next/server";
import { hasGsc } from "@/lib/gsc";
import { computeAnomalies } from "@/lib/anomalies";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  if (!hasGsc()) return NextResponse.json({ connected: false });
  try {
    const data = await computeAnomalies();
    return NextResponse.json({ connected: true, ...data });
  } catch (e) {
    return NextResponse.json({ connected: true, error: (e as Error).message }, { status: 500 });
  }
}
