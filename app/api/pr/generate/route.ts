import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { appendToSheet, readSheetTab, sheetsConfigured } from "@/lib/sheets";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

const CALENDAR_SHEET_ID = process.env.CALENDAR_SHEET_ID || "";
const HISTORY_TAB = "PR Log";
const QUEUE_TAB = "Writing Queue";

const HISTORY_HEADER = ["Date Found", "Site Name", "URL", "Category", "Relevance", "Notes"];
const QUEUE_HEADER = ["Queued At", "Title", "Angle", "Pillar", "Cluster", "Status", "Notes"];

export async function GET() {
  if (!sheetsConfigured()) return NextResponse.json({ connected: false, rows: [] });
  const rows = await readSheetTab(CALENDAR_SHEET_ID, HISTORY_TAB);
  const data = rows.filter((r) => r[0] !== "Date Found" && r[0] !== "Date Published" && r[0]);
  return NextResponse.json({ connected: true, rows: data, hasApiKey: Boolean(process.env.ANTHROPIC_API_KEY) });
}

export async function POST() {
  if (!sheetsConfigured()) return NextResponse.json({ error: "Sheets not configured." }, { status: 400 });

  const now = new Date().toISOString().slice(0, 10);
  const apiKey = process.env.ANTHROPIC_API_KEY;

  const hist = await readSheetTab(CALENDAR_SHEET_ID, HISTORY_TAB);
  if (hist.length === 0) await appendToSheet(CALENDAR_SHEET_ID, HISTORY_TAB, [HISTORY_HEADER]);

  // ── Path A: in-page generation via Anthropic API ───────────────────────────
  if (apiKey) {
    const client = new Anthropic({ apiKey });
    const msg = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1500,
      messages: [{
        role: "user",
        content: `You are a PR researcher for Leasey.AI, an AI leasing automation platform for property managers in Canada and the US Sun Belt.

Research and list 8 relevant online publications where Leasey.AI could publish press releases or guest articles. Focus on:
- Property management trade press (Multifamily Executive, NAA, IREM, Units, Yield PRO)
- Proptech media (The Real Deal, Propmodo, GlobeSt, Inman, Geek Estate)
- Canadian real estate media (Canadian Real Estate Magazine, REIN, CBRE Canada, RENX)
- US Sun Belt real estate publications (Austin Business Journal, Atlanta Business Chronicle, Tampa Bay Biz Journal)

Respond with ONLY a JSON array (no markdown fences). Each object: name, url (domain), category ("PM Trade Press" | "Proptech Media" | "Canadian RE" | "US Sun Belt RE"), relevance ("High" | "Medium"), notes (1 sentence on why it fits).`,
      }],
    });

    const text = (msg.content[0] as { text: string }).text.trim();
    const clean = text.replace(/^```json?\n?/, "").replace(/\n?```$/, "").trim();
    let sites: { name: string; url: string; category: string; relevance: string; notes: string }[] = [];
    try { sites = JSON.parse(clean); } catch {
      return NextResponse.json({ error: "Could not parse AI response.", raw: text.slice(0, 500) }, { status: 500 });
    }

    const rows = sites.map((s) => [now, s.name, s.url, s.category, s.relevance, s.notes]);
    await appendToSheet(CALENDAR_SHEET_ID, HISTORY_TAB, rows);
    return NextResponse.json({ ok: true, generated: true, count: rows.length });
  }

  // ── Path B: queue fallback ─────────────────────────────────────────────────
  const existing = await readSheetTab(CALENDAR_SHEET_ID, QUEUE_TAB);
  if (existing.length === 0) await appendToSheet(CALENDAR_SHEET_ID, QUEUE_TAB, [QUEUE_HEADER]);
  await appendToSheet(CALENDAR_SHEET_ID, QUEUE_TAB, [[
    now, "Find PR publication sites",
    "Research 8+ property management / proptech outlets for press releases and guest posts",
    "P1-P6", "pr-sites", "Queued",
    `Run: node scripts/process-content-queue.mjs`,
  ]]);
  return NextResponse.json({ ok: true, queued: true });
}
