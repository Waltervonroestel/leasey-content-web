import { NextResponse } from "next/server";
import { apiRoute, describeGoogleError } from "@/lib/google-auth-state";
import { listCalendarRows, sheetsConfigured, sheetUrls } from "@/lib/sheets";
import { inferPillarFromTitle } from "@/lib/analysis";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const GET = apiRoute(async () => {
  if (!sheetsConfigured()) return NextResponse.json({ connected: false });
  try {
    const raw = await listCalendarRows();
    // enrich each row with the inferred positioning pillar (the sheet's "pillar" column carries the AWARENESS phase, not P1-P6)
    const rows = raw.map((r) => ({ ...r, positioningPillar: inferPillarFromTitle(r.title) }));
    return NextResponse.json({ connected: true, count: rows.length, rows, sheet: sheetUrls().calendar });
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
