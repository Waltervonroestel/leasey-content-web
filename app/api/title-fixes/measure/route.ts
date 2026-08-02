import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { contentRoot } from "@/lib/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Cierra el círculo de Title Fixes: hasta ahora detectaba páginas con CTR bajo
// y ahí terminaba. Nadie comprobaba si el cambio funcionó.
//
// La fecha del cambio no la marca nadie a mano: se detecta. Cada instantánea
// semanal guarda el <title> real de las páginas con más impresiones, así que si
// el título de una semana no es el de la anterior, esa es la fecha del cambio.
// Marcar a mano funciona la primera semana y se abandona a la tercera.

interface PageRow {
  key: string;
  clicks: number;
  impressions: number;
  position: number;
}
interface TitleInfo {
  status?: number;
  title?: string;
  description?: string;
}
interface Snapshot {
  date: string;
  window?: string;
  pages?: PageRow[];
  titles?: Record<string, TitleInfo>;
}

// Por debajo de esto una diferencia de CTR es ruido, no resultado.
const MIN_IMPRESSIONS = 200;
// Google tarda en reprocesar un título. Antes de esto no hay nada que leer.
const MIN_DAYS = 14;

const load = (): Snapshot[] => {
  const dir = path.join(contentRoot(), "context", "weekly-signals");
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
      .sort()
      .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as Snapshot);
  } catch {
    return [];
  }
};

const ctr = (p?: PageRow) => (p && p.impressions ? p.clicks / p.impressions : 0);
const pageIn = (s: Snapshot, url: string) => (s.pages || []).find((p) => p.key === url);

export async function GET() {
  const snaps = load();

  if (snaps.length < 2) {
    return NextResponse.json({
      ready: false,
      snapshots: snaps.length,
      // No decir solo "no hay datos": decir qué falta y cuándo llega.
      reason:
        snaps.length === 0
          ? "Todavía no hay instantáneas semanales. El cron las genera cada lunes."
          : "Solo hay una instantánea. Un cambio de título se detecta comparando dos semanas, así que la medición empieza con la segunda corrida del cron.",
    });
  }

  const changes: {
    url: string;
    changedOn: string;
    daysSince: number;
    before: { title: string; ctr: number; clicks: number; impressions: number; position: number };
    after: { title: string; ctr: number; clicks: number; impressions: number; position: number };
    verdict: string;
    readable: boolean;
  }[] = [];

  const latest = snaps[snaps.length - 1];
  const today = latest.date;

  // Recorrer las semanas buscando el momento en que cambió cada título.
  for (let i = 1; i < snaps.length; i++) {
    const prev = snaps[i - 1];
    const cur = snaps[i];
    for (const [url, info] of Object.entries(cur.titles || {})) {
      const old = prev.titles?.[url];
      // Un fallo de red no es un cambio de título: si no se pudo leer una de
      // las dos semanas, no se afirma nada.
      if (!old?.title || !info.title) continue;
      if (old.title === info.title) continue;

      const beforePage = pageIn(prev, url);
      const afterPage = pageIn(latest, url);
      const daysSince = Math.round((Date.parse(today) - Date.parse(cur.date)) / 864e5);

      const b = {
        title: old.title,
        ctr: +(ctr(beforePage) * 100).toFixed(2),
        clicks: beforePage?.clicks ?? 0,
        impressions: beforePage?.impressions ?? 0,
        position: beforePage?.position ?? 0,
      };
      const a = {
        title: info.title,
        ctr: +(ctr(afterPage) * 100).toFixed(2),
        clicks: afterPage?.clicks ?? 0,
        impressions: afterPage?.impressions ?? 0,
        position: afterPage?.position ?? 0,
      };

      const enoughVolume = b.impressions >= MIN_IMPRESSIONS && a.impressions >= MIN_IMPRESSIONS;
      const readable = enoughVolume && daysSince >= MIN_DAYS;

      let verdict: string;
      if (daysSince < MIN_DAYS) {
        verdict = `demasiado pronto: ${daysSince} de ${MIN_DAYS} días`;
      } else if (!enoughVolume) {
        verdict = "sin volumen suficiente para leer el CTR";
      } else if (a.position - b.position > 3) {
        // La posición manda: si la página cayó, el CTR no es comparable.
        verdict = "la página perdió posición, el CTR no se puede atribuir al título";
      } else if (a.ctr > b.ctr * 1.2) {
        verdict = "el título nuevo funciona";
      } else if (a.ctr < b.ctr * 0.8) {
        verdict = "el título nuevo rinde peor que el anterior";
      } else {
        verdict = "sin cambio apreciable";
      }

      changes.push({ url, changedOn: cur.date, daysSince, before: b, after: a, verdict, readable });
    }
  }

  // Si un título cambió varias veces, interesa el cambio más reciente.
  const byUrl = new Map<string, (typeof changes)[number]>();
  for (const c of changes) {
    const prev = byUrl.get(c.url);
    if (!prev || c.changedOn > prev.changedOn) byUrl.set(c.url, c);
  }
  const list = [...byUrl.values()].sort((x, y) => y.changedOn.localeCompare(x.changedOn));

  return NextResponse.json({
    ready: true,
    snapshots: snaps.length,
    from: snaps[0].date,
    to: today,
    tracked: Object.keys(latest.titles || {}).length,
    changes: list,
    readable: list.filter((c) => c.readable).length,
    working: list.filter((c) => c.verdict === "el título nuevo funciona").length,
    worse: list.filter((c) => c.verdict.startsWith("el título nuevo rinde peor")).length,
  });
}
