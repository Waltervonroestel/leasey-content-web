// Detects week-over-week anomalies in GSC data. Compares the most recent
// snapshot against the trailing average of previous snapshots. Determines
// "real" movement: ignores low-impression noise, requires >= 30% delta.

import { listSnapshots, listQuerySnapshots, type SnapshotRow, type QuerySnapshotRow } from "@/lib/snapshots";
import { queryAnalytics } from "@/lib/gsc";

export type AnomalyKind = "spike" | "drop";

export interface Anomaly {
  kind: AnomalyKind;
  query: string;
  current: { clicks: number; impressions: number; position: number };
  baseline: { impressions: number; position: number };
  delta: { impressionsPct: number; positionAbs: number };
  message: string;
  action: string;
}

export interface HeadlineTrend {
  current: SnapshotRow | null;
  previous: SnapshotRow | null;
  delta: { clicksPct: number; impressionsPct: number; ctrPct: number; positionAbs: number } | null;
  history: SnapshotRow[];
}

const MIN_IMPR = 100;       // ignore queries below this baseline
const THRESHOLD = 0.3;      // 30% change is the bar

function pct(cur: number, prev: number): number {
  if (prev === 0) return cur > 0 ? 1 : 0;
  return (cur - prev) / prev;
}

export async function computeAnomalies(): Promise<{
  trend: HeadlineTrend;
  anomalies: Anomaly[];
  hasHistory: boolean;
}> {
  const snapshots = await listSnapshots();
  const querySnaps = await listQuerySnapshots();

  // Headline trend: compare most recent vs previous snapshot.
  const current = snapshots[snapshots.length - 1] || null;
  const previous = snapshots[snapshots.length - 2] || null;
  let delta: HeadlineTrend["delta"] = null;
  if (current && previous) {
    delta = {
      clicksPct: pct(current.clicks, previous.clicks),
      impressionsPct: pct(current.impressions, previous.impressions),
      ctrPct: pct(current.ctr, previous.ctr),
      positionAbs: previous.avgPosition - current.avgPosition, // positive = improved
    };
  }
  const trend: HeadlineTrend = { current, previous, delta, history: snapshots };

  const anomalies: Anomaly[] = [];

  // Query-level anomalies need: at least 2 snapshots to have history.
  if (querySnaps.length > 0) {
    // Group by query
    const byQuery = new Map<string, QuerySnapshotRow[]>();
    for (const r of querySnaps) {
      if (!byQuery.has(r.query)) byQuery.set(r.query, []);
      byQuery.get(r.query)!.push(r);
    }

    for (const [query, rows] of byQuery) {
      rows.sort((a, b) => (a.date < b.date ? -1 : 1));
      if (rows.length < 2) continue;
      const cur = rows[rows.length - 1];
      const prev = rows.slice(0, -1);
      const avgImpr = prev.reduce((s, r) => s + r.impressions, 0) / prev.length;
      const avgPos = prev.reduce((s, r) => s + r.position, 0) / prev.length;
      if (avgImpr < MIN_IMPR && cur.impressions < MIN_IMPR) continue;

      const imprDelta = pct(cur.impressions, avgImpr);
      const posDelta = avgPos - cur.position; // + = improved
      if (Math.abs(imprDelta) >= THRESHOLD) {
        const kind: AnomalyKind = imprDelta > 0 ? "spike" : "drop";
        anomalies.push({
          kind, query,
          current: { clicks: cur.clicks, impressions: cur.impressions, position: cur.position },
          baseline: { impressions: Math.round(avgImpr), position: avgPos },
          delta: { impressionsPct: imprDelta, positionAbs: posDelta },
          message: kind === "spike"
            ? `Impresiones subieron ${(imprDelta * 100).toFixed(0)}% sobre el promedio reciente.`
            : `Impresiones cayeron ${(Math.abs(imprDelta) * 100).toFixed(0)}% bajo el promedio reciente.`,
          action: kind === "spike"
            ? "Aprovecha el momentum: si todavía no hay pieza dedicada, encólala. Si ya existe, refresca el contenido."
            : "Revisa si la página perdió posición (¿competidor nuevo?, ¿contenido envejecido?). Considera refrescar el contenido o reescribir el título.",
        });
      }
    }
  }

  // Sort: biggest absolute delta first; drops slightly above spikes (more urgent).
  anomalies.sort((a, b) => {
    const aw = a.kind === "drop" ? 1.1 : 1;
    const bw = b.kind === "drop" ? 1.1 : 1;
    return Math.abs(b.delta.impressionsPct) * bw - Math.abs(a.delta.impressionsPct) * aw;
  });

  // Fallback: if we have zero history yet (no snapshots have been taken),
  // use the live "period-over-period" trend from GSC as a temporary anomaly feed
  // so the page is useful from day one.
  const hasHistory = snapshots.length >= 2;
  if (!hasHistory) {
    try {
      const { rows } = await queryAnalytics("query", 28);
      const valid = rows.filter((r) => r.query && r.impressions >= MIN_IMPR).slice(0, 30);
      // Without history we cannot compute true anomalies, but we surface the
      // most volatile queries as a placeholder.
      for (const r of valid.slice(0, 8)) {
        if (r.position > 30 || r.impressions < MIN_IMPR) continue;
        anomalies.push({
          kind: r.position <= 10 ? "spike" : "drop",
          query: r.query!,
          current: { clicks: r.clicks, impressions: r.impressions, position: r.position },
          baseline: { impressions: 0, position: 0 },
          delta: { impressionsPct: 0, positionAbs: 0 },
          message: "Sin historial todavía. Esta query es de las más visibles ahora — el primer snapshot servirá como base.",
          action: "Cuando GitHub Actions tome el primer snapshot semanal, esta página empezará a detectar cambios reales.",
        });
      }
    } catch { /* ignore */ }
  }

  return { trend, anomalies: anomalies.slice(0, 30), hasHistory };
}
