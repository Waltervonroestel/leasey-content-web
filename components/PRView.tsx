"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui";

type SiteRow = [string, string, string, string, string, string]; // date, name, url, category, relevance, notes
type HistResp = { connected: boolean; rows: SiteRow[] };
type GenResp = { ok?: boolean; count?: number; sites?: { name: string; url: string; category: string; relevance: string; notes: string }[]; error?: string };

const CATEGORY_COLOURS: Record<string, string> = {
  "Proptech Media":    "bg-blue/10 text-blue border-blue/30",
  "PM Trade Press":    "bg-purple-500/10 text-purple-700 border-purple-500/30",
  "Canadian RE":       "bg-red-500/10 text-red-700 border-red-500/30",
  "US Sun Belt RE":    "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
};

function CategoryBadge({ cat }: { cat: string }) {
  const cls = CATEGORY_COLOURS[cat] || "bg-slate-100 text-slate border-slate-200";
  return <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${cls}`}>{cat}</span>;
}

function SiteCard({ name, url, category, relevance, notes, date }: { name: string; url: string; category: string; relevance: string; notes: string; date: string }) {
  return (
    <div className="rounded-xl border border-line bg-white p-4 flex flex-col gap-2 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-sm font-semibold text-ink">{name}</span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${relevance === "High" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>{relevance}</span>
      </div>
      <a href={url.startsWith("http") ? url : `https://${url}`} target="_blank" rel="noreferrer" className="text-xs font-mono text-blue hover:underline break-all">{url}</a>
      <div className="flex items-center gap-2 flex-wrap">
        <CategoryBadge cat={category} />
        <span className="text-[11px] text-slate ml-auto font-mono">{date}</span>
      </div>
      <p className="text-xs text-slate leading-relaxed border-t border-line pt-2">{notes}</p>
    </div>
  );
}

export default function PRView() {
  const [hist, setHist] = useState<SiteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");

  const loadHistory = () =>
    fetch("/api/pr/generate")
      .then((r) => r.json())
      .then((d: HistResp) => { setHist(d.rows || []); setLoading(false); })
      .catch(() => setLoading(false));

  useEffect(() => { loadHistory(); }, []);

  async function generate() {
    setGenerating(true);
    setError("");
    try {
      const r = await fetch("/api/pr/generate", { method: "POST" });
      const d: GenResp = await r.json();
      if (d.error) setError(d.error);
      else await loadHistory();
    } catch (e) {
      setError(String(e));
    } finally {
      setGenerating(false);
    }
  }

  const filtered = hist.filter((r) => {
    if (!filter) return true;
    return `${r[1]} ${r[2]} ${r[3]}`.toLowerCase().includes(filter.toLowerCase());
  });

  const categories = [...new Set(hist.map((r) => r[3]).filter(Boolean))];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Press &amp; Publications</h1>
          <p className="text-slate text-sm mt-1">Property management and proptech outlets where Leasey.AI can publish press releases and guest posts.</p>
        </div>
        <button
          onClick={generate}
          disabled={generating}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:bg-ink/80 disabled:opacity-50 transition-colors whitespace-nowrap"
        >
          {generating ? (
            <><span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Searching…</>
          ) : (
            <><span aria-hidden>✦</span> Find new publication sites</>
          )}
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error.includes("ANTHROPIC_API_KEY") ? (
            <>Add <code className="font-mono">ANTHROPIC_API_KEY</code> to your Render environment variables to enable AI generation.</>
          ) : error}
        </div>
      )}

      {hist.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search sites…"
            className="border border-line rounded-lg px-3 py-1.5 text-sm w-56 placeholder:text-slate bg-white"
          />
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setFilter("")} className={`text-xs px-2.5 py-1 rounded-full border ${!filter ? "bg-ink text-white border-ink" : "border-line text-slate"}`}>All {hist.length}</button>
            {categories.map((c) => (
              <button key={c} onClick={() => setFilter(c)} className={`text-xs px-2.5 py-1 rounded-full border ${filter === c ? "bg-ink text-white border-ink" : "border-line text-slate"}`}>{c}</button>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-slate text-sm">Loading history…</p>
      ) : hist.length === 0 ? (
        <Card><p className="text-sm text-slate text-center py-6">No sites found yet. Click "Find new publication sites" above.</p></Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((row, i) => (
            <SiteCard key={i} date={row[0]} name={row[1]} url={row[2]} category={row[3]} relevance={row[4]} notes={row[5]} />
          ))}
        </div>
      )}
    </div>
  );
}
