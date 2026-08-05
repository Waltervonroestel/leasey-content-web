import { NextResponse } from "next/server";
import { apiRoute } from "@/lib/google-auth-state";
import { hasGsc } from "@/lib/gsc";
import { analyseGsc } from "@/lib/gscAnalysis";

export const runtime = "nodejs";

export const GET = apiRoute(async (req: Request) => {
  if (!hasGsc()) return NextResponse.json({ connected: false });
  try {
    const days = Number(new URL(req.url).searchParams.get("days") || 90);
    const analysis = await analyseGsc(days);
    return NextResponse.json(analysis);
  } catch (e) {
    return NextResponse.json({ connected: true, error: String(e) }, { status: 500 });
  }
});
