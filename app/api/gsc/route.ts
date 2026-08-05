import { NextResponse } from "next/server";
import { apiRoute, describeGoogleError } from "@/lib/google-auth-state";
import { hasGsc, queryAnalytics } from "@/lib/gsc";

export const runtime = "nodejs";

export const GET = apiRoute(async (req: Request) => {
  if (!hasGsc()) return NextResponse.json({ connected: false });
  try {
    const days = Number(new URL(req.url).searchParams.get("days") || 28);
    const { rows, startDate, endDate } = await queryAnalytics("page", days);
    const totals = rows.reduce(
      (acc, r) => {
        acc.clicks += r.clicks;
        acc.impressions += r.impressions;
        return acc;
      },
      { clicks: 0, impressions: 0 }
    );
    const ctr = totals.impressions ? totals.clicks / totals.impressions : 0;
    const avgPos = rows.length ? rows.reduce((s, r) => s + r.position, 0) / rows.length : 0;
    return NextResponse.json({ connected: true, rows, startDate, endDate, totals: { ...totals, ctr, avgPos } });
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
