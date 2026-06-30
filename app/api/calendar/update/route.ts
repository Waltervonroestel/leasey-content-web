import { NextResponse } from "next/server";
import { google } from "googleapis";
import { sheetsConfigured, CALENDAR_TAB } from "@/lib/sheets";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SHEET_ID = process.env.CALENDAR_SHEET_ID || "";
const STATUS_COL = "J"; // Status column in the calendar tab

function sheetsClient() {
  const o = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
  o.setCredentials({ refresh_token: process.env.GOOGLE_SHEETS_REFRESH_TOKEN });
  return google.sheets({ version: "v4", auth: o });
}

const ALLOWED = new Set(["", "Idea", "Escrito", "Programado", "Publicado"]);

export async function POST(req: Request) {
  if (!sheetsConfigured()) return NextResponse.json({ error: "Sheets not configured." }, { status: 400 });
  const body = await req.json() as { sheetRow?: number; status?: string };
  const { sheetRow, status } = body;
  if (typeof sheetRow !== "number" || sheetRow < 2) return NextResponse.json({ error: "sheetRow >= 2 required" }, { status: 400 });
  if (typeof status !== "string" || !ALLOWED.has(status)) return NextResponse.json({ error: `status must be one of: ${[...ALLOWED].filter(Boolean).join(", ")}` }, { status: 400 });

  const s = sheetsClient();
  await s.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${CALENDAR_TAB}!${STATUS_COL}${sheetRow}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [[status]] },
  });
  return NextResponse.json({ ok: true, sheetRow, status });
}
