import { NextResponse } from "next/server";
import { hasWordpress, getCurrentUser, listRecentDrafts } from "@/lib/wordpress";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  if (!hasWordpress()) return NextResponse.json({ connected: false });
  try {
    const [user, drafts] = await Promise.all([getCurrentUser(), listRecentDrafts(8)]);
    return NextResponse.json({
      connected: true,
      user: { name: user.name, slug: user.slug },
      url: process.env.WORDPRESS_URL,
      drafts,
    });
  } catch (e) {
    return NextResponse.json({ connected: false, error: (e as Error).message }, { status: 500 });
  }
}
