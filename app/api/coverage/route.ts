import { NextResponse } from "next/server";
import { apiRoute, describeGoogleError } from "@/lib/google-auth-state";
import { listCalendarRows, listOptimisationRows, sheetsConfigured } from "@/lib/sheets";
import { pillarGap, PILLARS } from "@/lib/analysis";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const GET = apiRoute(async () => {
  if (!sheetsConfigured()) return NextResponse.json({ connected: false });
  try {
    const [cal, opt] = await Promise.all([listCalendarRows(), listOptimisationRows()]);
    const gap = pillarGap(cal, opt);
    const calendarTotal = cal.length;
    const publishedTotal = opt.length;
    return NextResponse.json({ connected: true, pillars: PILLARS, gap, calendarTotal, publishedTotal });
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
