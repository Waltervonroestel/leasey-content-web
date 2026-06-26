import { NextResponse } from "next/server";
import { listOptimisationRows, sheetsConfigured, sheetUrls } from "@/lib/sheets";
import { clusterHealth, optimisationPillarCoverage } from "@/lib/analysis";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  if (!sheetsConfigured()) return NextResponse.json({ connected: false });
  try {
    const rows = await listOptimisationRows();
    const clusters = clusterHealth(rows);
    const pillars = optimisationPillarCoverage(rows);
    return NextResponse.json({ connected: true, count: rows.length, rows, clusters, pillars, sheet: sheetUrls().optimisation });
  } catch (e) {
    return NextResponse.json({ connected: false, error: (e as Error).message }, { status: 500 });
  }
}
