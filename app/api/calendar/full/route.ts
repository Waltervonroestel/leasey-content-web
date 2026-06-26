import { NextResponse } from "next/server";
import { listCalendarRows, sheetsConfigured, sheetUrls } from "@/lib/sheets";
import { inferPillarFromTitle } from "@/lib/analysis";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  if (!sheetsConfigured()) return NextResponse.json({ connected: false });
  try {
    const raw = await listCalendarRows();
    // enrich each row with the inferred positioning pillar (the sheet's "pillar" column carries the AWARENESS phase, not P1-P6)
    const rows = raw.map((r) => ({ ...r, positioningPillar: inferPillarFromTitle(r.title) }));
    return NextResponse.json({ connected: true, count: rows.length, rows, sheet: sheetUrls().calendar });
  } catch (e) {
    return NextResponse.json({ connected: false, error: (e as Error).message }, { status: 500 });
  }
}
