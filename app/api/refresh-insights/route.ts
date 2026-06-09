import { NextResponse } from "next/server";
import { runClaude, hasToken } from "@/lib/claude";
import { systemPrompt } from "@/lib/prompt";
import { readFileMd } from "@/lib/content";
import { saveContentFile } from "@/lib/persist";

export const runtime = "nodejs";
export const maxDuration = 300;

const TOKEN_MSG =
  "Insight search needs CLAUDE_CODE_OAUTH_TOKEN. Generate it with `claude setup-token` and add it as an env var in Render.";

export async function POST() {
  if (!hasToken()) return NextResponse.json({ error: TOKEN_MSG }, { status: 503 });
  try {
    const current = readFileMd("context/signals.md") || "";
    const out = await runClaude({
      system: systemPrompt("You are the news-researcher. Find FRESH insights (last 30-60 days) on PropTech, leasing automation, AI in real estate, rent regulation and vacancy in Canada/US, and competitor moves. Each insight: title, source URL + date, why it matters to property managers, suggested content angle, Leasey connection. English. No invented numbers."),
      prompt: `Search the web for fresh, relevant insights for Leasey.AI. Return 3 to 5 NEW insights NOT already covered below, formatted as Markdown sections like '### N9. Title' with source URLs. Do not repeat existing ones.\n\nEXISTING:\n${current.slice(0, 6000)}`,
      model: "sonnet",
      allowedTools: ["WebSearch", "WebFetch"],
    });
    // Anexa al final de la sección de noticias (antes de "## Competidores").
    let updated: string;
    if (current.includes("## Competidores")) {
      updated = current.replace("## Competidores", `${out.trim()}\n\n## Competidores`);
    } else {
      updated = `${current.trim()}\n\n${out.trim()}\n`;
    }
    const res = await saveContentFile("context/signals.md", updated);
    return NextResponse.json({ ok: true, committed: res.committed, added: out });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
