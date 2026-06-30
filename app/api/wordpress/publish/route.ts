import { NextResponse } from "next/server";
import { hasWordpress, publishPost } from "@/lib/wordpress";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  if (!hasWordpress()) return NextResponse.json({ error: "WordPress not configured" }, { status: 400 });
  const body = await req.json() as {
    title?: string; content?: string; excerpt?: string;
    status?: "draft" | "publish" | "pending"; isMarkdown?: boolean;
  };
  if (!body.title || !body.content) return NextResponse.json({ error: "title and content are required" }, { status: 400 });

  try {
    const post = await publishPost({
      title: body.title,
      content: body.content,
      excerpt: body.excerpt,
      // Force draft for safety — never auto-publish from the dashboard.
      status: "draft",
      isMarkdown: body.isMarkdown !== false,
    });
    return NextResponse.json({ ok: true, post: { id: post.id, link: post.link, status: post.status } });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
