import { NextResponse } from "next/server";
import { runClaude, hasToken } from "@/lib/claude";
import { systemPrompt } from "@/lib/prompt";
import { readFileMd } from "@/lib/content";
import { saveContentFile } from "@/lib/persist";

export const runtime = "nodejs";
export const maxDuration = 300;

const TOKEN_MSG =
  "Directory search needs CLAUDE_CODE_OAUTH_TOKEN. Generate it with `claude setup-token` and add it as an env var in Render.";

export async function POST(req: Request) {
  if (!hasToken()) return NextResponse.json({ error: TOKEN_MSG }, { status: 503 });
  try {
    const { kind } = await req.json();
    const isPm = kind === "pm";
    const rel = isPm ? "context/distribution/pm-publications.md" : "context/distribution/subreddits.md";
    const current = readFileMd(rel) || "";
    const task = isPm
      ? "Find property management / multifamily publications that accept press releases or guest posts. For each: name, URL, what they accept, and what Leasey should write there (PR vs thought-leadership)."
      : "Find subreddits relevant to property management, landlords, multifamily and real estate investing. For each: name, audience, rules on self-promotion, and what Leasey should write there (value-first, no hard pitch).";
    const out = await runClaude({
      system: systemPrompt("You are the distribution researcher. English, factual, with real URLs. No invented outlets."),
      prompt: `${task}\n\nReturn an updated Markdown directory, keeping useful existing entries and adding new ones with sources. Current file:\n\n${current.slice(0, 6000)}`,
      model: "sonnet",
      allowedTools: ["WebSearch", "WebFetch"],
    });
    const res = await saveContentFile(rel, out.trim() + "\n");
    return NextResponse.json({ ok: true, committed: res.committed });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
