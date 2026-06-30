"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui";

interface Suggestion { title: string; meta: string; rationale: string }
interface Fix { query: string; impressions: number; clicks: number; position: number; ctr: number; suggestions: Suggestion[] }
interface Resp { connected: boolean; fixes?: Fix[]; error?: string }

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1500); }}
      className="text-[10px] px-1.5 py-0.5 rounded border border-line text-slate hover:text-ink hover:border-ink/30 transition-colors"
    >
      {done ? "✓ copiado" : "copiar"}
    </button>
  );
}

function FixCard({ f }: { f: Fix }) {
  return (
    <div className="rounded-xl border border-line bg-white p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <code className="text-sm text-ink break-all flex-1">{f.query}</code>
        <div className="text-right text-[11px] text-slate tabular-nums">
          <div>{f.impressions.toLocaleString()} impr · {f.clicks} clic{f.clicks === 1 ? "" : "s"}</div>
          <div>pos {f.position.toFixed(1)} · CTR {(f.ctr * 100).toFixed(2)}%</div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {f.suggestions.map((s, i) => (
          <div key={i} className="border-l-2 border-blue/30 pl-3 flex flex-col gap-1.5">
            <div className="flex items-start gap-2">
              <p className="text-sm font-medium text-ink flex-1 leading-snug">{s.title}</p>
              <CopyButton text={s.title} />
            </div>
            <div className="flex items-start gap-2">
              <p className="text-xs text-slate flex-1 leading-relaxed">{s.meta}</p>
              <CopyButton text={s.meta} />
            </div>
            <p className="text-[10px] text-slate italic">Razón: {s.rationale}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TitleFixesView() {
  const [data, setData] = useState<Resp | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gsc/title-fixes?days=90").then((r) => r.json()).then((d) => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-slate text-sm">Generando sugerencias de título…</p>;
  if (!data || !data.connected) return <Card><p className="text-sm text-slate">Conecta GSC para sugerir reescrituras.</p></Card>;
  const fixes = data.fixes || [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Sugerencias de título (CTR fixes)</h1>
        <p className="text-slate text-sm mt-1">
          Páginas que ya rankean en página 1 pero pierden el clic. Para cada una, 3 títulos sugeridos por plantillas SEO probadas — copia y pega.
          Sin IA: son reglas determinísticas (intent + posición + año + power-prefix). Cero costo.
        </p>
      </div>

      {fixes.length === 0 ? (
        <Card><p className="text-sm text-slate text-center py-4">No hay queries con CTR-fix detectado en los últimos 90 días.</p></Card>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {fixes.map((f, i) => <FixCard key={i} f={f} />)}
        </div>
      )}
    </div>
  );
}
