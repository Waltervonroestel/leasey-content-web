import { NextResponse } from "next/server";
import { fetchAllFeeds, feedSources } from "@/lib/rss";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
// Cache the feed fetch for 1 hour at the route level too
export const revalidate = 3600;

export async function GET() {
  try {
    const items = await fetchAllFeeds();
    return NextResponse.json({ ok: true, sources: feedSources(), count: items.length, items });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
