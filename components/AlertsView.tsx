"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui";

interface Anomaly {
  kind: "spike" | "drop";
  query: string;
  current: { clicks: number; impressions: number; position: number };
  baseline: { impressions: number; position: number };
  delta: { impressionsPct: number; positionAbs: number };
  message: string;
  action: string;
}

interface Trend {
  current: { date: string; clicks: number; impressions: number; ctr: number; avgPosition: number } | null;
  previous: { date: string; clicks: number; impressions: number; ctr: number; avgPosition: number } | null;
  delta: { clicksPct: number; impressionsPct: number; ctrPct: number; positionAbs: number } | null;
  history: { date: string; clicks: number; impressions: number }[];
}

interface Resp { connected: boolean; trend?: Trend; anomalies?: Anomaly[]; hasHistory?: boolean; error?: string }

function pct(n: number): string {
  const v = Math.round(n * 100);
  return `${v >= 0 ? "+" : ""}${v}%`;
}

function TrendStat({ label, current, previous, delta, isPosition }: { label: string; current: number; previous: number; delta: number; isPosition?: boolean }) {
  const isGood = isPosition ? delta > 0 : delta > 0;
  const colour = delta === 0 ? "text-slate" : isGood ? "text-emerald-600" : "text-rose-600";
  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <div className="text-[10px] uppercase tracking-wide text-slate">{label}</div>
      <div className="text-2xl font-bold text-ink mt-1 tabular-nums">{isPosition ? current.toFixed(1) : current.toLocaleString()}</div>
      <div className={`text-xs mt-1 ${colour}`}>
        {isPosition ? (delta > 0 ? "↑ " : delta < 0 ? "↓ " : "") + (Math.abs(delta) || 0).toFixed(1) + " pos" : pct(delta)}
        <span className="text-slate ml-1">vs {previous.toLocaleString()}</span>
      </div>
    </div>
  );
}

function MiniChart({ data }: { data: { date: string; impressions: number }[] }) {
  if (data.length < 2) return null;
  const max = Math.max(...data.map((d) => d.impressions));
  const min = Math.min(...data.map((d) => d.impressions));
  const range = max - min || 1;
  const w = 280, h = 60;
  const step = w / (data.length - 1);
  const points = data.map((d, i) => `${i * step},${h - ((d.impressions - min) / range) * h}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16 mt-2">
      <polyline points={points} fill="none" stroke="#1f6feb" strokeWidth="2" />
      {data.map((d, i) => (<circle key={i} cx={i * step} cy={h - ((d.impressions - min) / range) * h} r="3" fill="#1f6feb" />))}
    </svg>
  );
}

function AnomalyCard({ a }: { a: Anomaly }) {
  const isSpike = a.kind === "spike";
  const bg = isSpike ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200";
  const dot = isSpike ? "bg-emerald-500" : "bg-rose-500";
  const tag = isSpike ? "text-emerald-700" : "text-rose-700";
  return (
    <div className={`rounded-xl border bg-white p-4 flex flex-col gap-2`}>
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${bg} ${tag} flex items-center gap-1`}>
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${dot}`} />
          {isSpike ? "Subida" : "Caída"}
        </span>
        {a.delta.impressionsPct !== 0 && (
          <span className={`text-xs font-medium tabular-nums ${isSpike ? "text-emerald-700" : "text-rose-700"}`}>
            {pct(a.delta.impressionsPct)} impresiones
          </span>
        )}
        <span className="text-xs text-slate ml-auto tabular-nums">pos {a.current.position.toFixed(1)}</span>
      </div>
      <code className="text-sm text-ink break-all">{a.query}</code>
      <div className="text-xs text-slate">
        <span className="text-ink font-medium">Ahora: </span>{a.current.impressions.toLocaleString()} impr · {a.current.clicks} clics
        {a.baseline.impressions > 0 && <> · <span className="text-slate">promedio: {a.baseline.impressions.toLocaleString()}</span></>}
      </div>
      <p className="text-xs text-ink leading-relaxed">{a.message}</p>
      <p className="text-xs text-slate leading-relaxed border-t border-line pt-2"><span className="text-ink font-medium">Acción: </span>{a.action}</p>
    </div>
  );
}

export default function AlertsView() {
  const [data, setData] = useState<Resp | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gsc/anomalies").then((r) => r.json()).then((d) => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-slate text-sm">Detectando anomalías…</p>;
  if (!data || !data.connected) return (
    <Card><p className="text-sm text-slate">Conecta GSC para activar las alertas.</p></Card>
  );

  const t = data.trend;
  const spikes = (data.anomalies || []).filter((a) => a.kind === "spike");
  const drops = (data.anomalies || []).filter((a) => a.kind === "drop");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Alertas</h1>
        <p className="text-slate text-sm mt-1">
          Detección semanal de búsquedas que subieron o cayeron de forma anormal frente al promedio reciente.
          {!data.hasHistory && (
            <span className="block mt-1 text-amber-700">Aún no hay historial — el primer snapshot semanal corre cada lunes 12:00 UTC. Por ahora ves un placeholder con las queries más visibles.</span>
          )}
        </p>
      </div>

      {/* Headline trend */}
      {t && t.current && t.previous && t.delta && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <TrendStat label="Clics" current={t.current.clicks} previous={t.previous.clicks} delta={t.delta.clicksPct} />
          <TrendStat label="Impresiones" current={t.current.impressions} previous={t.previous.impressions} delta={t.delta.impressionsPct} />
          <TrendStat label="CTR" current={Math.round(t.current.ctr * 10000) / 100} previous={Math.round(t.previous.ctr * 10000) / 100} delta={t.delta.ctrPct} />
          <TrendStat label="Posición media" current={t.current.avgPosition} previous={t.previous.avgPosition} delta={t.delta.positionAbs} isPosition />
        </div>
      )}

      {t && t.history.length >= 2 && (
        <Card>
          <div className="text-sm font-semibold text-ink mb-1">Evolución de impresiones · últimos {t.history.length} snapshots</div>
          <MiniChart data={t.history.map((s) => ({ date: s.date, impressions: s.impressions }))} />
          <div className="flex justify-between text-[10px] text-slate mt-1">
            <span>{t.history[0].date}</span>
            <span>{t.history[t.history.length - 1].date}</span>
          </div>
        </Card>
      )}

      {drops.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-ink mb-3">Caídas ({drops.length})</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{drops.map((a, i) => <AnomalyCard key={i} a={a} />)}</div>
        </section>
      )}

      {spikes.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-ink mb-3">Subidas ({spikes.length})</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{spikes.map((a, i) => <AnomalyCard key={i} a={a} />)}</div>
        </section>
      )}

      {(data.anomalies || []).length === 0 && (
        <Card><p className="text-sm text-slate text-center py-4">No hay anomalías significativas esta semana.</p></Card>
      )}
    </div>
  );
}
