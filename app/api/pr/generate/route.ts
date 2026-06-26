import { NextResponse } from "next/server";
import { appendToSheet, readSheetTab, sheetsConfigured } from "@/lib/sheets";

export const dynamic = "force-dynamic";

const CALENDAR_SHEET_ID = process.env.CALENDAR_SHEET_ID || "";
const HISTORY_TAB = "PR Log";
const QUEUE_TAB = "Writing Queue";

const HISTORY_HEADER = ["Date Published", "Site Name", "URL", "Category", "DA/Relevance", "Notes"];
const QUEUE_HEADER = ["Queued At", "Title", "Angle", "Pillar", "Cluster", "Status", "Notes"];

export async function GET() {
  if (!sheetsConfigured()) return NextResponse.json({ connected: false, rows: [] });
  const rows = await readSheetTab(CALENDAR_SHEET_ID, HISTORY_TAB);
  const data = rows.filter((r) => r[0] !== "Date Published" && r[0]);
  return NextResponse.json({ connected: true, rows: data });
}

export async function POST() {
  if (!sheetsConfigured()) return NextResponse.json({ error: "Sheets not configured." }, { status: 400 });

  const now = new Date().toISOString().slice(0, 10);

  const existing = await readSheetTab(CALENDAR_SHEET_ID, QUEUE_TAB);
  if (existing.length === 0) await appendToSheet(CALENDAR_SHEET_ID, QUEUE_TAB, [QUEUE_HEADER]);

  const hist = await readSheetTab(CALENDAR_SHEET_ID, HISTORY_TAB);
  if (hist.length === 0) await appendToSheet(CALENDAR_SHEET_ID, HISTORY_TAB, [HISTORY_HEADER]);

  await appendToSheet(CALENDAR_SHEET_ID, QUEUE_TAB, [[
    now,
    "Find PR publication sites",
    "Research 8+ property management / proptech outlets for press releases and guest posts",
    "P1-P6",
    "pr-sites",
    "Queued",
    `Run: node scripts/process-content-queue.mjs`,
  ]]);

  return NextResponse.json({ ok: true, queued: true });
}
