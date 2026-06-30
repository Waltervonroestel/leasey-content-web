import { NextResponse } from "next/server";
import { hasGsc, queryAnalytics } from "@/lib/gsc";
import { appendSnapshot, appendQuerySnapshots } from "@/lib/snapshots";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

// Protected by CRON_SECRET. GitHub Actions calls this weekly with the header.
async function takeSnapshot(days: number) {
  const { rows } = await queryAnalytics("query", days);
  const valid = rows.filter((r) => r.query && r.impressions > 0);
  const totalImpr = valid.reduce((s, r) => s + r.impressions, 0);
  const totalClicks = valid.reduce((s, r) => s + r.clicks, 0);
  const ctr = totalImpr ? totalClicks / totalImpr : 0;
  const avgPosition = totalImpr ? valid.reduce((s, r) => s + r.position * r.impressions, 0) / totalImpr : 0;

  const date = new Date().toISOString().slice(0, 10);
  await appendSnapshot({
    date, days,
    clicks: totalClicks, impressions: totalImpr,
    ctr, avgPosition, uniqueQueries: valid.length,
  });

  // Persist top 200 queries by impressions so we can detect anomalies later.
  const top = [...valid].sort((a, b) => b.impressions - a.impressions).slice(0, 200);
  await appendQuerySnapshots(top.map((r) => ({
    date, query: r.query!, clicks: r.clicks, impressions: r.impressions, position: r.position,
  })));
  return { date, clicks: totalClicks, impressions: totalImpr, queries: valid.length };
}

function authorised(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // No secret set → allow (useful for local testing)
  const header = req.headers.get("x-cron-secret");
  return header === secret;
}

export async function GET(req: Request) {
  if (!hasGsc()) return NextResponse.json({ error: "GSC not configured" }, { status: 400 });
  if (!authorised(req)) return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  try {
    const days = Number(new URL(req.url).searchParams.get("days") || 28);
    const result = await takeSnapshot(days);
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export const POST = GET;
