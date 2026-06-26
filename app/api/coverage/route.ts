import { NextResponse } from "next/server";
import { listCalendarRows, listOptimisationRows, sheetsConfigured } from "@/lib/sheets";
import { pillarGap, PILLARS } from "@/lib/analysis";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  if (!sheetsConfigured()) return NextResponse.json({ connected: false });
  try {
    const [cal, opt] = await Promise.all([listCalendarRows(), listOptimisationRows()]);
    const gap = pillarGap(cal, opt);
    const calendarTotal = cal.length;
    const publishedTotal = opt.length;
    return NextResponse.json({ connected: true, pillars: PILLARS, gap, calendarTotal, publishedTotal });
  } catch (e) {
    return NextResponse.json({ connected: false, error: (e as Error).message }, { status: 500 });
  }
}
