import { NextResponse } from "next/server";
import { apiRoute, describeGoogleError } from "@/lib/google-auth-state";
import { listOptimisationRows, sheetsConfigured, sheetUrls } from "@/lib/sheets";
import { clusterHealth, optimisationPillarCoverage } from "@/lib/analysis";
import { buildLinkMap } from "@/lib/internalLinks";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const GET = apiRoute(async () => {
  if (!sheetsConfigured()) return NextResponse.json({ connected: false });
  try {
    const rows = await listOptimisationRows();
    const clusters = clusterHealth(rows);
    const pillars = optimisationPillarCoverage(rows);
    const linkMap = buildLinkMap(rows);
    return NextResponse.json({ connected: true, count: rows.length, rows, clusters, pillars, linkMap, sheet: sheetUrls().optimisation });
  } catch (e) {
    // Un fallo de credencial se atendió correctamente: lo que falta es acceso.
    // Devolverlo como 500 hacía que el cliente lo tratara como caída y se
    // quedara reintentando, y dejaba en pantalla un mensaje ('invalid_grant')
    // que no dice a nadie qué hacer.
    const info = describeGoogleError(e);
    return NextResponse.json(
      { connected: false, error: info.message, action: info.action, kind: info.kind },
      { status: info.kind === 'auth' ? 200 : 500 },
    );
  }
});
