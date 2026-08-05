import fs from "fs";
import { apiRoute } from "@/lib/google-auth-state";
import path from "path";
import { NextResponse } from "next/server";
import { contentRoot } from "@/lib/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Las instantáneas semanales son la fuente; los informes se calculan al
// pedirlos. Guardar solo el informe habría dejado el histórico congelado en el
// formato del día que se escribió, y sin posibilidad de comparar dos semanas
// que no fueran consecutivas.
const SIGNALS = () => path.join(contentRoot(), "context", "weekly-signals");
const COMPETITORS = () => path.join(contentRoot(), "context", "competitor-watch");

const dates = (dir: string): string[] => {
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
      .map((f) => f.replace(".json", ""))
      .sort()
      .reverse();
  } catch {
    return [];
  }
};

const read = (dir: string, date: string) => {
  try {
    return JSON.parse(fs.readFileSync(path.join(dir, `${date}.json`), "utf8"));
  } catch {
    return null;
  }
};

interface Row {
  key: string;
  clicks: number;
  impressions: number;
  position: number;
}

export const GET = apiRoute(async (req: Request) => {
  const url = new URL(req.url);
  const weeks = dates(SIGNALS());
  const compWeeks = dates(COMPETITORS());

  // Sin fecha, la más reciente. Con fecha, esa semana contra la anterior.
  const date = url.searchParams.get("date") || weeks[0];
  if (!date) {
    return NextResponse.json({
      available: [],
      empty: true,
      // Decir por qué está vacío, no solo que lo está.
      reason:
        "No snapshots yet. El cron semanal las genera cada lunes; la primera corrida solo registra la línea base porque un diff necesita dos fotos.",
    });
  }

  const current = read(SIGNALS(), date);
  const idx = weeks.indexOf(date);
  const prevDate = idx >= 0 && idx + 1 < weeks.length ? weeks[idx + 1] : null;
  const previous = prevDate ? read(SIGNALS(), prevDate) : null;

  if (!current) return NextResponse.json({ available: weeks, error: `No hay instantánea del ${date}` });

  const q: Row[] = current.queries || [];
  const totals = {
    clicks: q.reduce((s, r) => s + r.clicks, 0),
    impressions: q.reduce((s, r) => s + r.impressions, 0),
    queries: q.length,
  };

  // Lo más accionable, y no depende de tener semana anterior: Google ya nos
  // muestra y nadie entra. Es problema de título y meta, no de contenido.
  const nearMiss = q
    .filter((r) => r.position >= 5 && r.position <= 20 && r.impressions >= 100 && r.clicks <= 2)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 15);

  let diff = null;
  if (previous) {
    const before = new Map<string, Row>((previous.queries || []).map((r: Row) => [r.key, r]));
    const after = new Set(q.map((r) => r.key));

    const moved = q
      .filter((r) => before.has(r.key) && r.impressions >= 50)
      .map((r) => {
        const b = before.get(r.key)!;
        return { ...r, was: b.position, delta: +(b.position - r.position).toFixed(1) };
      })
      .filter((r) => Math.abs(r.delta) >= 3);

    diff = {
      comparedWith: prevDate,
      newQueries: q
        .filter((r) => !before.has(r.key) && r.impressions >= 30)
        .sort((a, b) => b.impressions - a.impressions)
        .slice(0, 20),
      lost: (previous.queries || [])
        .filter((r: Row) => !after.has(r.key) && r.impressions >= 50)
        .sort((a: Row, b: Row) => b.impressions - a.impressions)
        .slice(0, 15),
      up: moved.filter((r) => r.delta > 0).sort((a, b) => b.delta - a.delta).slice(0, 12),
      down: moved.filter((r) => r.delta < 0).sort((a, b) => a.delta - b.delta).slice(0, 12),
      deltaClicks:
        totals.clicks - (previous.queries || []).reduce((s: number, r: Row) => s + r.clicks, 0),
      deltaImpressions:
        totals.impressions -
        (previous.queries || []).reduce((s: number, r: Row) => s + r.impressions, 0),
    };
  }

  // Competidores: la instantánea más cercana a esa fecha, y su anterior.
  let competitors = null;
  const cDate = compWeeks.find((d) => d <= date) || compWeeks[0];
  if (cDate) {
    const cur = read(COMPETITORS(), cDate);
    const cIdx = compWeeks.indexOf(cDate);
    const cPrev = cIdx + 1 < compWeeks.length ? read(COMPETITORS(), compWeeks[cIdx + 1]) : null;
    if (cur) {
      competitors = {
        date: cDate,
        comparedWith: cPrev ? compWeeks[cIdx + 1] : null,
        byCompetitor: Object.entries(cur).map(([name, data]) => {
          const d = data as { tier?: string; error?: string; pages?: { url: string; lastmod: string }[] };
          const before = new Set(((cPrev?.[name]?.pages || []) as { url: string }[]).map((p) => p.url));
          const fresh = (d.pages || []).filter((p) => !before.has(p.url));
          return {
            name,
            tier: d.tier || "",
            error: d.error || null,
            total: (d.pages || []).length,
            // Sin semana anterior no hay "nuevas": hay "todas". Decirlo.
            newCount: cPrev ? fresh.length : null,
            newPages: cPrev ? fresh.slice(0, 10) : [],
          };
        }),
      };
    }
  }

  return NextResponse.json({
    available: weeks,
    date,
    window: current.window,
    totals,
    nearMiss,
    diff,
    competitors,
    isBaseline: !previous,
  });
});
