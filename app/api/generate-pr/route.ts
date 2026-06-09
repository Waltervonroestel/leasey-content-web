import { NextResponse } from "next/server";
import { runClaude, hasToken } from "@/lib/claude";
import { systemPrompt } from "@/lib/prompt";
import { saveContentFile, today } from "@/lib/persist";

export const runtime = "nodejs";
export const maxDuration = 120;

const TOKEN_MSG =
  "Text generation needs CLAUDE_CODE_OAUTH_TOKEN. Generate it with `claude setup-token` and add it as an env var in Render.";

export async function POST(req: Request) {
  if (!hasToken()) return NextResponse.json({ error: TOKEN_MSG }, { status: 503 });
  try {
    const { topic, outlet } = await req.json();
    const out = await runClaude({
      system: systemPrompt("Press release. Inverted pyramid: headline + subhead, dateline (New York/Vancouver/Toronto), lead paragraph, market context with a sourced datapoint, detail anchored to a real client, founder quote (Juan for product/tech, Carlos for strategy), boilerplate About Leasey.AI, press contact [VERIFY]. English, no em-dashes."),
      prompt: `Write a press release about: ${topic}.${outlet ? ` Target outlet: ${outlet}.` : ""} For unconfirmed partnerships, mark [VERIFY partnership status]. Output only the press release.`,
      model: "sonnet",
    });
    const slug = String(topic).replace(/[^a-z0-9]+/gi, "-").toLowerCase().slice(0, 50);
    const rel = `output/${today()}/press-release-${slug}.md`;
    const file = `Generated press release\nTarget: ${outlet || "general"}\nStatus: BORRADOR, pasar por editor-qa\n\n---\n\n${out}`;
    const res = await saveContentFile(rel, file);
    return NextResponse.json({ ok: true, path: rel, committed: res.committed, text: out });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
