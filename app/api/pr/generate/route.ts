import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { appendToSheet, readSheetTab, sheetsConfigured } from "@/lib/sheets";

export const dynamic = "force-dynamic";

const CALENDAR_SHEET_ID = process.env.CALENDAR_SHEET_ID || "";
const TAB = "PR Log";

const HEADER = ["Date Published", "Site Name", "URL", "Category", "DA/Relevance", "Notes"];

export async function GET() {
  if (!sheetsConfigured()) return NextResponse.json({ connected: false, rows: [] });
  const rows = await readSheetTab(CALENDAR_SHEET_ID, TAB);
  const data = rows.filter((r) => r[0] !== "Date Published" && r[0]);
  return NextResponse.json({ connected: true, rows: data });
}

export async function POST() {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return NextResponse.json({ error: "ANTHROPIC_API_KEY not set on this server." }, { status: 400 });

  const client = new Anthropic({ apiKey: key });
  const msg = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are a PR researcher for Leasey.AI, an AI leasing automation platform for property managers in Canada and the US Sun Belt.

Find 8 relevant publication targets where Leasey.AI could publish press releases or guest posts. Focus on property management trade press, proptech media, Canadian real estate media, and US Sun Belt real estate publications.

Return a JSON array of objects with keys: name, url (best-guess domain), category (e.g. "Proptech Media", "Canadian RE", "PM Trade Press", "US Sun Belt RE"), relevance (High/Medium), notes (1 sentence on why it fits).

Respond with ONLY the JSON array, no markdown fences.`,
      },
    ],
  });

  const text = (msg.content[0] as { text: string }).text.trim();
  let sites: { name: string; url: string; category: string; relevance: string; notes: string }[] = [];
  try {
    sites = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Failed to parse AI response.", raw: text }, { status: 500 });
  }

  const now = new Date().toISOString().slice(0, 10);

  const existing = await readSheetTab(CALENDAR_SHEET_ID, TAB);
  if (existing.length === 0) await appendToSheet(CALENDAR_SHEET_ID, TAB, [HEADER]);

  const newRows = sites.map((s) => [now, s.name, s.url, s.category, s.relevance, s.notes]);
  await appendToSheet(CALENDAR_SHEET_ID, TAB, newRows);

  return NextResponse.json({ ok: true, count: sites.length, sites });
}
