"use client";

import { useEffect, useState } from "react";

type Severity = "win" | "opportunity" | "watch" | "risk";

interface Finding {
  id: string;
  severity: Severity;
  title: string;
  metric: string;
  meaning: string;
  action: string;
  why: string;
  owner: string;
  examples?: string[];
}

interface Analysis {
  connected: boolean;
  days: number;
  error?: string;
  headline?: {
    clicks: number;
    impressions: number;
    ctr: number;
    avgPosition: number;
    captureRate: number;
    summary: string;
    verdict: Severity;
  };
  potentialClicks?: { ctrFix: number; striking: number; total: number };
  findings?: Finding[];
}

const SEV: Record<Severity, { label: string; dot: string; bg: string; border: string; text: string }> = {
  risk:        { label: "Riesgo",      dot: "bg-rose-500",    bg: "bg-rose-50",    border: "border-rose-200",    text: "text-rose-700" },
  opportunity: { label: "Oportunidad", dot: "bg-blue",        bg: "bg-blue/5",     border: "border-blue/30",     text: "text-blue" },
  win:         { label: "Va bien",     dot: "bg-emerald-500", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
  watch:       { label: "Vigilar",     dot: "bg-amber-500",   bg: "bg-amber-50",   border: "border-amber-200",   text: "text-amber-700" },
};

const VERDICT_BANNER: Record<Severity, string> = {
  risk:        "border-rose-200 bg-rose-50",
  opportunity: "border-blue/30 bg-blue/5",
  win:         "border-emerald-200 bg-emerald-50",
  watch:       "border-amber-200 bg-amber-50",
};

function FindingCard({ f }: { f: Finding }) {
  const s = SEV[f.severity];
  return (
    <div className={`rounded-xl border ${s.border} bg-white p-4 flex flex-col gap-3`}>
      <div className="flex items-start gap-2 flex-wrap">
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${s.bg} ${s.text} flex items-center gap-1`}>
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${s.dot}`} />{s.label}
        </span>
        <span className="text-sm font-semibold text-ink flex-1 min-w-0">{f.title}</span>
      </div>

      <div className={`text-xs font-medium ${s.text} tabular-nums`}>{f.metric}</div>

      <div className="flex flex-col gap-2 text-xs leading-relaxed">
        <div>
          <span className="text-slate uppercase tracking-wide text-[10px]">Qué significa</span>
          <p className="text-ink mt-0.5">{f.meaning}</p>
        </div>
        <div>
          <span className="text-slate uppercase tracking-wide text-[10px]">Qué hacer</span>
          <p className="text-ink mt-0.5">{f.action}</p>
        </div>
        <div>
          <span className="text-slate uppercase tracking-wide text-[10px]">Por qué</span>
          <p className="text-slate mt-0.5">{f.why}</p>
        </div>
      </div>

      {f.examples && f.examples.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-line">
          {f.examples.map((q, i) => (
            <span key={i} className="text-[10px] bg-bg-soft text-slate px-1.5 py-0.5 rounded font-mono">{q}</span>
          ))}
        </div>
      )}

      <div className="text-[10px] text-slate">Responsable sugerido: <span className="text-ink font-medium">{f.owner}</span></div>
    </div>
  );
}

export default function AnalysisSummary({ days }: { days: number }) {
  const [data, setData] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/gsc/analysis?days=${days}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ connected: false } as Analysis))
      .finally(() => setLoading(false));
  }, [days]);

  if (loading && !data) return <div className="rounded-xl border border-line bg-white p-4 text-sm text-slate">Analizando los datos de búsqueda…</div>;
  if (!data || !data.connected || !data.headline) return null;

  const h = data.headline;
  const pc = data.potentialClicks;

  return (
    <div className="flex flex-col gap-4">
      {/* Lectura general */}
      <div className={`rounded-xl border p-5 ${VERDICT_BANNER[h.verdict]}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs uppercase tracking-wide text-slate font-medium">Lectura del período · {data.days} días</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${SEV[h.verdict].bg} ${SEV[h.verdict].text} flex items-center gap-1`}>
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${SEV[h.verdict].dot}`} />{SEV[h.verdict].label}
          </span>
        </div>
        <p className="text-sm text-ink leading-relaxed">{h.summary}</p>

        {pc && pc.total > 0 && (
          <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-ink/10">
            <div>
              <div className="text-[10px] uppercase tracking-wide text-slate">Upside total</div>
              <div className="text-xl font-bold text-ink tabular-nums">+{pc.total.toLocaleString()} <span className="text-xs font-normal text-slate">clics/sin contenido nuevo</span></div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wide text-slate">Arreglando títulos</div>
              <div className="text-xl font-bold text-ink tabular-nums">+{pc.ctrFix.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wide text-slate">Empujando striking distance</div>
              <div className="text-xl font-bold text-ink tabular-nums">+{pc.striking.toLocaleString()}</div>
            </div>
          </div>
        )}
      </div>

      {/* Hallazgos accionables */}
      {data.findings && data.findings.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-ink mb-3">Qué hacer con estos números, en orden de prioridad</h3>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {data.findings.map((f) => <FindingCard key={f.id} f={f} />)}
          </div>
        </div>
      )}
    </div>
  );
}
