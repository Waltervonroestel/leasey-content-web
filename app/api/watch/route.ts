import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { contentRoot } from "@/lib/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Sirve el histórico de la vigilancia. Las instantáneas fechadas son la fuente
// y el diff se calcula al pedirlo, igual que en /api/signals: guardar solo el
// informe habría dejado el pasado congelado en el formato del día que se
// escribió, y no permitiría comparar dos semanas que no fueran consecutivas.
//
// ?kind=medio devuelve solo los medios, que es lo que consume el tab de PR.

const DIR = () => path.join(contentRoot(), "context", "competitor-watch");

interface Page {
  url: string;
  lastmod: string;
}
interface Entry {
  kind?: string;
  tier?: string;
  error?: string;
  host?: string;
  pages?: Page[];
}

const dates = (): string[] => {
  try {
    return fs
      .readdirSync(DIR())
      .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
      .map((f) => f.replace(".json", ""))
      .sort()
      .reverse();
  } catch {
    return [];
  }
};

const read = (date: string): Record<string, Entry> | null => {
  try {
    return JSON.parse(fs.readFileSync(path.join(DIR(), `${date}.json`), "utf8"));
  } catch {
    return null;
  }
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const kind = url.searchParams.get("kind"); // "medio" | "competidor" | null
  const available = dates();

  if (!available.length) {
    return NextResponse.json({
      available: [],
      empty: true,
      reason:
        "Todavía no hay instantáneas. El cron semanal las genera cada lunes, y la primera solo registra la línea base porque un diff necesita dos fotos.",
    });
  }

  const date = url.searchParams.get("date") || available[0];
  const current = read(date);
  if (!current) return NextResponse.json({ available, error: `No hay instantánea del ${date}` });

  // La anterior en el tiempo, para el diff.
  const idx = available.indexOf(date);
  const prevDate = idx >= 0 && idx + 1 < available.length ? available[idx + 1] : null;
  const previous = prevDate ? read(prevDate) : null;

  const entries = Object.entries(current).filter(([, d]) => !kind || d.kind === kind);

  const rows = entries.map(([name, d]) => {
    const before = new Set(((previous?.[name]?.pages || []) as Page[]).map((p) => p.url));
    const pages = d.pages || [];
    const fresh = previous ? pages.filter((p) => !before.has(p.url)) : [];

    // Una URL actualizada suele decir más que una nueva: significa que están
    // reoptimizando algo que ya les rankea, y eso señala dónde ven valor.
    const updated = previous
      ? pages.filter((p) => {
          const old = ((previous[name]?.pages || []) as Page[]).find((q) => q.url === p.url);
          return old && p.lastmod && old.lastmod && p.lastmod > old.lastmod;
        })
      : [];

    return {
      name,
      kind: d.kind || "competidor",
      tier: d.tier || "",
      error: d.error || null,
      total: pages.length,
      // Sin semana anterior no hay "nuevas", hay "todas". Decirlo en vez de
      // mostrar un cero que parece "no publicaron nada".
      newCount: previous ? fresh.length : null,
      updatedCount: previous ? updated.length : null,
      newPages: fresh
        .sort((a, b) => (b.lastmod || "").localeCompare(a.lastmod || ""))
        .slice(0, 12),
      updatedPages: updated.slice(0, 6),
    };
  });

  return NextResponse.json({
    available,
    date,
    comparedWith: prevDate,
    isBaseline: !previous,
    rows: rows.sort((a, b) => (b.newCount ?? b.total) - (a.newCount ?? a.total)),
    blocked: rows.filter((r) => r.error).map((r) => r.name),
    totalNew: rows.reduce((s, r) => s + (r.newCount ?? 0), 0),
  });
}
