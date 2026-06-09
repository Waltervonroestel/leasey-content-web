import { NextResponse } from "next/server";
import { runClaude, hasToken } from "@/lib/claude";
import { systemPrompt } from "@/lib/prompt";
import { listInsights } from "@/lib/content";
import { saveContentFile, today } from "@/lib/persist";

export const runtime = "nodejs";
export const maxDuration = 120;

const TOKEN_MSG =
  "Text generation needs CLAUDE_CODE_OAUTH_TOKEN. Generate it with `claude setup-token` and add it as an env var in Render.";

export async function POST(req: Request) {
  if (!hasToken()) return NextResponse.json({ error: TOKEN_MSG }, { status: 503 });
  try {
    const { insightId } = await req.json();
    const insight = listInsights().find((i) => i.id === insightId);
    if (!insight) return NextResponse.json({ error: "insight not found" }, { status: 404 });
    const out = await runClaude({
      system: systemPrompt("Operator-facing blog post, 400-800 words, hook in first two sentences, one internal link to a Leasey service/tool page, demo CTA. Insight-led with the source named in the text."),
      prompt: `Write a blog post built on this insight:\n\nTitle: ${insight.title}\n\nDetails:\n${insight.body}\n\nLead with the datapoint and its source, develop the operator problem, connect to a Leasey positioning pillar, end with a demo CTA. Output only the final post in Markdown, starting with an SEO title line.`,
      model: "sonnet",
    });
    const slug = insight.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase().slice(0, 50);
    const rel = `output/${today()}/blog-${insight.id}-${slug}.md`;
    const file = `Generated from insight ${insight.id}\nStatus: BORRADOR, pasar por editor-qa\n\n---\n\n${out}`;
    const res = await saveContentFile(rel, file);
    return NextResponse.json({ ok: true, path: rel, committed: res.committed, text: out });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
