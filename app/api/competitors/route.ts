import { NextResponse } from "next/server";
import { fetchAllFeeds, feedSources } from "@/lib/rss";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(req: Request) {
  const fresh = new URL(req.url).searchParams.get("refresh") === "1";
  try {
    const items = await fetchAllFeeds({ fresh });
    return NextResponse.json({ ok: true, sources: feedSources(), count: items.length, items, refreshed: fresh });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
