import { NextResponse } from "next/server";
import { hasGsc, opportunities } from "@/lib/gsc";

export const runtime = "nodejs";

export async function GET(req: Request) {
  if (!hasGsc()) return NextResponse.json({ connected: false });
  try {
    const days = Number(new URL(req.url).searchParams.get("days") || 90);
    const data = await opportunities(days);
    return NextResponse.json({ connected: true, ...data });
  } catch (e) {
    return NextResponse.json({ connected: true, error: String(e) }, { status: 500 });
  }
}
