import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { appendToSheet, readSheetTab, sheetsConfigured } from "@/lib/sheets";
import { queryIntel } from "@/lib/gsc";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

const CALENDAR_SHEET_ID = process.env.CALENDAR_SHEET_ID || "";
const HISTORY_TAB = "Insights Log";
const QUEUE_TAB = "Writing Queue";

const HISTORY_HEADER = ["Date", "Title", "Summary", "Sources", "Pillar"];
const QUEUE_HEADER = ["Queued At", "Title", "Angle", "Pillar", "Cluster", "Status", "Notes"];

export async function GET() {
  if (!sheetsConfigured()) return NextResponse.json({ connected: false, rows: [] });
  const rows = await readSheetTab(CALENDAR_SHEET_ID, HISTORY_TAB);
  const data = rows.filter((r) => r[0] !== "Date" && r[0]);
  return NextResponse.json({ connected: true, rows: data, hasApiKey: Boolean(process.env.ANTHROPIC_API_KEY) });
}

export async function POST() {
  if (!sheetsConfigured()) return NextResponse.json({ error: "Sheets not configured." }, { status: 400 });

  const now = new Date().toISOString().slice(0, 10);
  const apiKey = process.env.ANTHROPIC_API_KEY;

  // Headers (idempotent: appendToSheet auto-creates the tab on first call)
  const hist = await readSheetTab(CALENDAR_SHEET_ID, HISTORY_TAB);
  if (hist.length === 0) await appendToSheet(CALENDAR_SHEET_ID, HISTORY_TAB, [HISTORY_HEADER]);

  // ── Path A: ANTHROPIC_API_KEY present — generate in-page ────────────────────
  if (apiKey) {
    let gscContext = "";
    try {
      const intel = await queryIntel(90);
      const top = intel.writeNext.slice(0, 10).map((w) => `- "${w.query}" (${w.impressions} impressions, pos ${w.position?.toFixed(1)})`).join("\n");
      const comp = intel.comparisons.slice(0, 5).map((w) => `- "${w.query}"`).join("\n");
      gscContext = `Top GSC opportunities:\n${top}\n\nComparison queries:\n${comp}`;
    } catch {
      gscContext = "GSC data unavailable.";
    }

    const client = new Anthropic({ apiKey });
    const msg = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1500,
      messages: [{
        role: "user",
        content: `You are a market intelligence researcher for Leasey.AI, an AI-powered leasing automation platform for property managers in Canada and the US Sun Belt.

Based on the following GSC search intent data, generate 5 concise market insights to shape content strategy. Each insight is tied to one of these positioning pillars: P1 Speed, P2 Agent, P3 All-in-one, P4 Canadian, P5 Compliance, P6 US Sun Belt.

${gscContext}

Respond with ONLY a JSON array of objects (no markdown fences, no extra text). Each object must have:
- title: short insight headline
- summary: 2-3 sentences explaining the insight and content angle
- pillar: one of "P1", "P2", "P3", "P4", "P5", "P6"
- sources: brief data source note (e.g. "GSC + striking-distance queries")`,
      }],
    });

    const text = (msg.content[0] as { text: string }).text.trim();
    const clean = text.replace(/^```json?\n?/, "").replace(/\n?```$/, "").trim();
    let insights: { title: string; summary: string; pillar: string; sources: string }[] = [];
    try { insights = JSON.parse(clean); } catch {
      return NextResponse.json({ error: "Could not parse AI response.", raw: text.slice(0, 500) }, { status: 500 });
    }

    const rows = insights.map((ins) => [now, ins.title, ins.summary, ins.sources || "GSC + AI", ins.pillar]);
    await appendToSheet(CALENDAR_SHEET_ID, HISTORY_TAB, rows);
    return NextResponse.json({ ok: true, generated: true, count: rows.length });
  }

  // ── Path B: no API key — fall back to queue ────────────────────────────────
  const existing = await readSheetTab(CALENDAR_SHEET_ID, QUEUE_TAB);
  if (existing.length === 0) await appendToSheet(CALENDAR_SHEET_ID, QUEUE_TAB, [QUEUE_HEADER]);
  await appendToSheet(CALENDAR_SHEET_ID, QUEUE_TAB, [[
    now, "Generate market insights",
    "Pull 90-day GSC data + positioning pillars → produce 5 actionable insights",
    "", "insights", "Queued",
    `Run: node scripts/process-content-queue.mjs`,
  ]]);
  return NextResponse.json({ ok: true, queued: true });
}
