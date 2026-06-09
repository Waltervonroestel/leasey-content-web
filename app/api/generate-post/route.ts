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
    const { topic, voice = "company", channel = "LinkedIn" } = await req.json();
    const voiceGuide: Record<string, string> = {
      carlos: "Voice: Carlos Leal (COO). Direct opener, short paragraphs, founder observation. First person.",
      juan: "Voice: Juan Leal (CEO/CPO). Technical precision, ~60 words, lead with a product or industry datapoint.",
      company: "Voice: Leasey.AI company page. Institutional but direct, 'we' not 'I'.",
      blog: "Operator-facing blog post, 400-800 words, hook in first two sentences, one internal link, demo CTA.",
    };
    const out = await runClaude({
      system: systemPrompt(voiceGuide[voice] || ""),
      prompt: `Write a ${channel} piece about: ${topic}. Follow all system rules (English, no em-dashes, insight-led with attribution, soft demo CTA). Output only the final piece, no preamble.`,
      model: "sonnet",
    });
    const slug = String(topic).replace(/[^a-z0-9]+/gi, "-").toLowerCase().slice(0, 50);
    const rel = `output/${today()}/generated-${voice}-${slug}.md`;
    const file = `Generated via dashboard\nVoice: ${voice} | Channel: ${channel}\nStatus: BORRADOR, pasar por editor-qa\n\n---\n\n${out}`;
    const res = await saveContentFile(rel, file);
    return NextResponse.json({ ok: true, path: rel, committed: res.committed, text: out });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
