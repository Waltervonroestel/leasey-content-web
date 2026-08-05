import { NextResponse } from "next/server";
import { apiRoute } from "@/lib/google-auth-state";
import { hasGa4, pagePerformance, byChannel, joinWithSearch } from "@/lib/ga4";
import { hasGsc, queryAnalytics } from "@/lib/gsc";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const GET = apiRoute(async (req: Request) => {
  const days = Math.min(90, Math.max(7, Number(new URL(req.url).searchParams.get("days")) || 28));

  if (!hasGa4()) {
    return NextResponse.json({
      connected: false,
      // Decir qué falta exactamente, no un "no configurado" genérico: el
      // siguiente que abra esto tiene que saber qué hacer sin leer el código.
      missing: [
        process.env.GA4_PROPERTY_ID ? null : "GA4_PROPERTY_ID",
        process.env.GA4_REFRESH_TOKEN ? null : "GA4_REFRESH_TOKEN (node scripts/auth-ga4.mjs)",
      ].filter(Boolean),
    });
  }

  try {
    const [pages, channels] = await Promise.all([pagePerformance(days), byChannel(days)]);

    // Cruzar con Search Console cuando esté disponible. Cada fuente sola da
    // media respuesta: GSC termina en el clic y GA4 empieza ahí.
    let joined = null;
    if (hasGsc()) {
      // queryAnalytics devuelve { rows, startDate, endDate }, no el array suelto.
      const { rows } = await queryAnalytics("page", days, 500);
      joined = joinWithSearch(pages, rows).slice(0, 100);
    }

    const totals = pages.reduce(
      (a, p) => ({
        sessions: a.sessions + p.sessions,
        users: a.users + p.users,
        conversions: a.conversions + p.conversions,
      }),
      { sessions: 0, users: 0, conversions: 0 }
    );

    return NextResponse.json({
      connected: true,
      days,
      totals,
      channels,
      pages: pages.slice(0, 100),
      joined,
      searchJoined: Boolean(joined),
    });
  } catch (e) {
    return NextResponse.json(
      { connected: false, error: e instanceof Error ? e.message.slice(0, 200) : "error" },
      { status: 200 }
    );
  }
});
