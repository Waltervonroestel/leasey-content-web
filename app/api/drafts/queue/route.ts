import { NextResponse } from "next/server";
import { appendToSheet, readSheetTab, sheetsConfigured } from "@/lib/sheets";

export const dynamic = "force-dynamic";

const CALENDAR_SHEET_ID = process.env.CALENDAR_SHEET_ID || "";
const TAB = "Writing Queue";

const HEADER = ["Queued At", "Title", "Angle", "Pillar", "Cluster", "Status", "Notes"];

export async function GET() {
  if (!sheetsConfigured()) return NextResponse.json({ connected: false, rows: [] });
  const rows = await readSheetTab(CALENDAR_SHEET_ID, TAB);
  const data = rows.filter((r) => r[0] !== "Queued At" && r[0]);
  return NextResponse.json({ connected: true, rows: data });
}

export async function POST(req: Request) {
  if (!sheetsConfigured()) return NextResponse.json({ error: "Sheets not configured." }, { status: 400 });
  const body = await req.json() as { title?: string; angle?: string; pillar?: string; cluster?: string; notes?: string };
  const { title = "", angle = "", pillar = "", cluster = "", notes = "" } = body;
  if (!title) return NextResponse.json({ error: "title is required" }, { status: 400 });

  const existing = await readSheetTab(CALENDAR_SHEET_ID, TAB);
  if (existing.length === 0) await appendToSheet(CALENDAR_SHEET_ID, TAB, [HEADER]);

  const now = new Date().toISOString().slice(0, 10);
  await appendToSheet(CALENDAR_SHEET_ID, TAB, [[now, title, angle, pillar, cluster, "Queued", notes]]);

  return NextResponse.json({ ok: true });
}
