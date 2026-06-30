"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui";
import { PILLAR_META, pillarCodeFrom, type PillarCode } from "@/lib/pillarStyle";

type InsightRow = [string, string, string, string, string]; // date, title, summary, sources, pillar
type HistResp = { connected: boolean; rows: InsightRow[] };
type GenResp = { ok?: boolean; queued?: boolean; generated?: boolean; count?: number; error?: string };

function PillarBadge({ code }: { code: PillarCode }) {
  const m = PILLAR_META[code];
  return <span className={`text-[10px] px-1.5 py-0.5 rounded border ${m.border} ${m.bg} ${m.text} font-medium whitespace-nowrap`}>{code === "—" ? m.label : `${code} ${m.short}`}</span>;
}

function InsightCard({ date, title, summary, sources, pillar }: { date: string; title: string; summary: string; sources: string; pillar: string }) {
  const code = pillarCodeFrom(pillar) as PillarCode;
  const meta = PILLAR_META[code];
  return (
    <div className="relative rounded-xl border border-line bg-white p-4 flex flex-col gap-2 hover:shadow-sm transition-shadow">
      <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full" style={{ background: meta.colour }} aria-hidden />
      <div className="pl-3 flex flex-col gap-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-slate font-mono">{date}</span>
          <PillarBadge code={code} />
        </div>
        <h3 className="text-sm font-semibold text-ink leading-snug">{title}</h3>
        <p className="text-xs text-slate leading-relaxed">{summary}</p>
        <p className="text-[11px] text-slate/70 mt-0.5">Sources: {sources}</p>
      </div>
    </div>
  );
}

export default function InsightsView() {
  const [hist, setHist] = useState<InsightRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [queued, setQueued] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState("");

  const loadHistory = () =>
    fetch("/api/insights/generate")
      .then((r) => r.json())
      .then((d: HistResp) => { setHist(d.rows || []); setLoading(false); })
      .catch(() => setLoading(false));

  useEffect(() => { loadHistory(); }, []);

  async function generate() {
    setGenerating(true);
    setError(""); setQueued(false); setGenerated(false);
    try {
      const r = await fetch("/api/insights/generate", { method: "POST" });
      const d: GenResp = await r.json();
      if (d.error) setError(d.error);
      else if (d.generated) { setGenerated(true); await loadHistory(); }
      else if (d.queued) setQueued(true);
    } catch (e) {
      setError(String(e));
    } finally {
      setGenerating(false);
    }
  }

  // Group by date
  const byDate = hist.reduce<Record<string, InsightRow[]>>((acc, row) => {
    (acc[row[0]] ||= []).push(row);
    return acc;
  }, {});
  const dates = Object.keys(byDate).sort((a, b) => (a > b ? -1 : 1));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Market Insights</h1>
          <p className="text-slate text-sm mt-1">AI-generated insights from GSC search intent data, mapped to the 6 positioning pillars. Each run pulls the latest 90-day signals.</p>
        </div>
        <button
          onClick={generate}
          disabled={generating || queued || generated}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${(queued || generated) ? "bg-emerald-600 text-white" : "bg-ink text-white hover:bg-ink/80 disabled:opacity-50"}`}
        >
          {generating ? (
            <><span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generando…</>
          ) : generated ? (
            <>✓ Insights generados</>
          ) : queued ? (
            <>✓ En cola — corre el script en Claude Code</>
          ) : (
            <><span aria-hidden>✦</span> Generar nuevos insights</>
          )}
        </button>
      </div>

      {generated && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          ✓ Nuevos insights generados con IA y guardados en el Insights Log.
        </div>
      )}
      {queued && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Tarea añadida a la Writing Queue. (Para generar in-page sin script, agrega <code className="font-mono text-xs">ANTHROPIC_API_KEY</code> en Render.) Corre en Claude Code:
          <code className="block mt-1 font-mono text-xs bg-emerald-100 px-2 py-1 rounded">node scripts/process-content-queue.mjs</code>
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <p className="text-slate text-sm">Loading history…</p>
      ) : hist.length === 0 ? (
        <Card><p className="text-sm text-slate text-center py-6">No insights generated yet. Click "Generate new insights" above.</p></Card>
      ) : (
        <div className="flex flex-col gap-6">
          {dates.map((date) => (
            <section key={date}>
              <div className="flex items-baseline gap-3 mb-3">
                <h2 className="text-sm font-semibold text-ink">Generated {date}</h2>
                <span className="text-xs text-slate">{byDate[date].length} insights</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {byDate[date].map((row, i) => (
                  <InsightCard key={i} date={row[0]} title={row[1]} summary={row[2]} sources={row[3]} pillar={row[4]} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
