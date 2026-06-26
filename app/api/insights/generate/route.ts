import { NextResponse } from "next/server";
import { appendToSheet, readSheetTab, sheetsConfigured } from "@/lib/sheets";

export const dynamic = "force-dynamic";

const CALENDAR_SHEET_ID = process.env.CALENDAR_SHEET_ID || "";
const HISTORY_TAB = "Insights Log";
const QUEUE_TAB = "Writing Queue";

const HISTORY_HEADER = ["Date", "Title", "Summary", "Sources", "Pillar"];
const QUEUE_HEADER = ["Queued At", "Title", "Angle", "Pillar", "Cluster", "Status", "Notes"];

export async function GET() {
  if (!sheetsConfigured()) return NextResponse.json({ connected: false, rows: [] });
  const rows = await readSheetTab(CALENDAR_SHEET_ID, HISTORY_TAB);
  const data = rows.filter((r) => r[0] !== "Date" && r[0]);
  return NextResponse.json({ connected: true, rows: data });
}

export async function POST() {
  if (!sheetsConfigured()) return NextResponse.json({ error: "Sheets not configured." }, { status: 400 });

  const now = new Date().toISOString().slice(0, 10);

  // Ensure queue header exists
  const existing = await readSheetTab(CALENDAR_SHEET_ID, QUEUE_TAB);
  if (existing.length === 0) await appendToSheet(CALENDAR_SHEET_ID, QUEUE_TAB, [QUEUE_HEADER]);

  // Ensure history header exists
  const hist = await readSheetTab(CALENDAR_SHEET_ID, HISTORY_TAB);
  if (hist.length === 0) await appendToSheet(CALENDAR_SHEET_ID, HISTORY_TAB, [HISTORY_HEADER]);

  await appendToSheet(CALENDAR_SHEET_ID, QUEUE_TAB, [[
    now,
    "Generate market insights",
    "Pull 90-day GSC data + positioning pillars → produce 5 actionable insights",
    "",
    "insights",
    "Queued",
    `Run: node scripts/process-content-queue.mjs`,
  ]]);

  return NextResponse.json({ ok: true, queued: true });
}
