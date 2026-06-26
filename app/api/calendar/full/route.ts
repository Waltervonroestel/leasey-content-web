import { NextResponse } from "next/server";
import { listCalendarRows, sheetsConfigured, sheetUrls } from "@/lib/sheets";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  if (!sheetsConfigured()) return NextResponse.json({ connected: false });
  try {
    const rows = await listCalendarRows();
    return NextResponse.json({ connected: true, count: rows.length, rows, sheet: sheetUrls().calendar });
  } catch (e) {
    return NextResponse.json({ connected: false, error: (e as Error).message }, { status: 500 });
  }
}
