import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { appendToSheet, readSheetTab, sheetsConfigured } from "@/lib/sheets";
import { queryIntel } from "@/lib/gsc";

export const dynamic = "force-dynamic";

const CALENDAR_SHEET_ID = process.env.CALENDAR_SHEET_ID || "";
const TAB = "Insights Log";

const HEADER = ["Date", "Title", "Summary", "Sources", "Pillar"];

export async function GET() {
  if (!sheetsConfigured()) return NextResponse.json({ connected: false, rows: [] });
  const rows = await readSheetTab(CALENDAR_SHEET_ID, TAB);
  const data = rows.filter((r) => r[0] !== "Date" && r[0]); // skip header
  return NextResponse.json({ connected: true, rows: data });
}

export async function POST() {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return NextResponse.json({ error: "ANTHROPIC_API_KEY not set on this server." }, { status: 400 });

  // Pull GSC intel for context
  let gscContext = "";
  try {
    const intel = await queryIntel(90);
    const top = intel.writeNext.slice(0, 10).map((w) => `- "${w.query}" (${w.impressions} impressions, pos ${w.position?.toFixed(1)})`).join("\n");
    const comp = intel.comparisons.slice(0, 5).map((w) => `- "${w.query}"`).join("\n");
    gscContext = `Top GSC opportunities:\n${top}\n\nComparison queries:\n${comp}`;
  } catch {
    gscContext = "GSC data unavailable.";
  }

  const client = new Anthropic({ apiKey: key });
  const msg = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are a market intelligence researcher for Leasey.AI, an AI-powered leasing automation platform for property managers in Canada and the US Sun Belt.

Based on the following GSC search intent data, generate 5 concise market insights that would help shape content strategy. Each insight should be actionable and tied to one of these positioning pillars: P1 Speed, P2 Agent, P3 All-in-one, P4 Canadian, P5 Compliance, P6 US Sun Belt.

${gscContext}

Format your response as a JSON array of objects with keys: title, summary (2-3 sentences), pillar (e.g. "P1"), sources (brief note on data source).

Respond with ONLY the JSON array, no markdown fences.`,
      },
    ],
  });

  const text = (msg.content[0] as { text: string }).text.trim();
  let insights: { title: string; summary: string; pillar: string; sources: string }[] = [];
  try {
    insights = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Failed to parse AI response.", raw: text }, { status: 500 });
  }

  const now = new Date().toISOString().slice(0, 10);

  // Ensure header row exists
  const existing = await readSheetTab(CALENDAR_SHEET_ID, TAB);
  if (existing.length === 0) await appendToSheet(CALENDAR_SHEET_ID, TAB, [HEADER]);

  const newRows = insights.map((ins) => [now, ins.title, ins.summary, ins.sources || "GSC + AI", ins.pillar]);
  await appendToSheet(CALENDAR_SHEET_ID, TAB, newRows);

  return NextResponse.json({ ok: true, count: insights.length, insights });
}
