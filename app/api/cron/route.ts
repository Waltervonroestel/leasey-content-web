import { NextResponse } from "next/server";
import { startJob } from "@/lib/jobs";

export const runtime = "nodejs";
export const maxDuration = 60;

// Disparador del refresh automático semanal de datos frescos.
// Llamado por GitHub Actions con el header x-cron-secret.
// El job real corre en background; este endpoint responde rápido para no exceder el timeout del runner.
export async function POST(req: Request) {
  const secret = req.headers.get("x-cron-secret");
  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const insights = startJob("refresh-insights", "Weekly auto-refresh: insights", {});
  const pm = startJob("refresh-directory", "Weekly auto-refresh: PM outlets", { kind: "pm" });
  const reddit = startJob("refresh-directory", "Weekly auto-refresh: subreddits", { kind: "reddit" });
  return NextResponse.json({ ok: true, started: [insights.id, pm.id, reddit.id] });
}

export async function GET() {
  return NextResponse.json({ ok: true, info: "POST with x-cron-secret to trigger weekly refresh" });
}
