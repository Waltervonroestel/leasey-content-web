"use client";

import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n";
import TitleFixesMeasure from "@/components/TitleFixesMeasure";
import { Card } from "@/components/ui";

interface Suggestion { title: string; meta: string; rationale: string }
interface Fix { query: string; impressions: number; clicks: number; position: number; ctr: number; suggestions: Suggestion[] }
interface Resp { connected: boolean; fixes?: Fix[]; error?: string }

function CopyButton({ text }: { text: string }) {
  const t = useT();
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1500); }}
      className="text-[10px] px-1.5 py-0.5 rounded border border-line text-slate hover:text-ink hover:border-ink/30 transition-colors"
    >
      {done ? "✓ " + t("copied") : t("copy")}
    </button>
  );
}

function FixCard({ f }: { f: Fix }) {
  const t = useT();
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
            <p className="text-[10px] text-slate italic">{t("Reason")}: {s.rationale}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TitleFixesView() {
  const t = useT();
  const [data, setData] = useState<Resp | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gsc/title-fixes?days=90").then((r) => r.json()).then((d) => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-slate text-sm">{t("Generating title suggestions…")}</p>;
  if (!data || !data.connected) return <Card><p className="text-sm text-slate">Conecta GSC para sugerir reescrituras.</p></Card>;
  const fixes = data.fixes || [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">{t("Title suggestions (CTR fixes)")}</h1>
        <p className="text-slate text-sm mt-1">
          {t("Pages that already rank on page 1 but lose the click. For each one, 3 titles suggested from proven SEO templates — copy and paste.")}
          {t("No AI: these are deterministic rules (intent + position + year + power prefix). Zero cost.")}
        </p>
      </div>

      <TitleFixesMeasure />

      {fixes.length === 0 ? (
        <Card><p className="text-sm text-slate text-center py-4">{t("No queries with a detected CTR fix in the last 90 days.")}</p></Card>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {fixes.map((f, i) => <FixCard key={i} f={f} />)}
        </div>
      )}
    </div>
  );
}
