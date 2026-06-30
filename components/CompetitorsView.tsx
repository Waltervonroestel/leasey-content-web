"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui";

type FeedCategory = "Competitor" | "Proptech Media" | "PM Trade Press" | "Canadian RE";

interface FeedItem { source: string; category: FeedCategory; title: string; link: string; date: string; excerpt: string }
interface FeedSource { source: string; category: FeedCategory }
interface Resp { ok: boolean; sources?: FeedSource[]; count?: number; items?: FeedItem[]; error?: string }

const CATEGORY_META: Record<FeedCategory, { label: string; bg: string }> = {
  "Competitor":      { label: "Competidor",   bg: "bg-rose-50 text-rose-700 border-rose-200" },
  "Proptech Media":  { label: "Proptech",     bg: "bg-blue/10 text-blue border-blue/30" },
  "PM Trade Press":  { label: "PM Trade",     bg: "bg-purple-500/10 text-purple-700 border-purple-500/30" },
  "Canadian RE":     { label: "Canadian RE",  bg: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30" },
};

const CATEGORY_ORDER: FeedCategory[] = ["Competitor", "Proptech Media", "PM Trade Press", "Canadian RE"];

function highlight(text: string, q: string): React.ReactNode {
  if (!q) return text;
  const lower = text.toLowerCase();
  const term = q.toLowerCase();
  if (!lower.includes(term)) return text;
  const parts: React.ReactNode[] = [];
  let last = 0;
  let idx = lower.indexOf(term);
  while (idx !== -1) {
    if (idx > last) parts.push(text.slice(last, idx));
    parts.push(<mark key={idx} className="bg-amber-200 rounded px-0.5">{text.slice(idx, idx + term.length)}</mark>);
    last = idx + term.length;
    idx = lower.indexOf(term, last);
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

function PostCard({ item, query }: { item: FeedItem; query: string }) {
  const cat = CATEGORY_META[item.category];
  return (
    <a href={item.link} target="_blank" rel="noreferrer" className="block">
      <div className="rounded-xl border border-line bg-white p-4 flex flex-col gap-2 hover:shadow-sm hover:border-ink/30 transition-all h-full">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${cat.bg}`}>{cat.label}</span>
          <span className="text-[11px] text-ink font-medium">{item.source}</span>
          <span className="text-[11px] text-slate ml-auto font-mono">{item.date || "—"}</span>
        </div>
        <h3 className="text-sm font-semibold text-ink leading-snug line-clamp-2">{highlight(item.title, query)}</h3>
        {item.excerpt && <p className="text-xs text-slate leading-relaxed line-clamp-3">{highlight(item.excerpt, query)}</p>}
      </div>
    </a>
  );
}

export default function CompetitorsView() {
  const [data, setData] = useState<Resp | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [category, setCategory] = useState<FeedCategory | "">("");
  const [query, setQuery] = useState("");

  function load(fresh = false) {
    if (fresh) setRefreshing(true); else setLoading(true);
    fetch(`/api/competitors${fresh ? "?refresh=1" : ""}`)
      .then((r) => r.json()).then(setData)
      .catch(() => setData({ ok: false, error: "network" }))
      .finally(() => { setLoading(false); setRefreshing(false); });
  }

  useEffect(() => { load(false); }, []);

  if (loading) return <p className="text-slate text-sm">Cargando feeds de competidores…</p>;
  if (!data || !data.ok) return <Card><p className="text-sm text-slate">No se pudieron cargar los feeds. {data?.error}</p></Card>;

  const items = data.items || [];
  const sources = data.sources || [];

  // Filtros
  const ql = query.trim().toLowerCase();
  const filtered = items.filter((i) => {
    if (category && i.category !== category) return false;
    if (ql && !(`${i.title} ${i.excerpt} ${i.source}`.toLowerCase().includes(ql))) return false;
    return true;
  });

  const sourcesByCategory = CATEGORY_ORDER
    .map((c) => ({ category: c, sources: sources.filter((s) => s.category === c).map((s) => s.source) }))
    .filter((g) => g.sources.length > 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">¿Qué publican competidores y medios?</h1>
          <p className="text-slate text-sm mt-1">
            Últimas publicaciones de competidores (TurboTenant, Rent Manager, Zumper, RentCafe/Yardi) y medios
            proptech, PM trade press y Canadian RE. Los feeds se cachean 1 hora; usa <span className="text-ink font-medium">Buscar ahora</span> para forzar fetch fresco. Algunos competidores (AppFolio, Buildium, DoorLoop) ya no exponen RSS público.
          </p>
        </div>
        <button
          onClick={() => load(true)}
          disabled={refreshing}
          className="text-xs px-3 py-1.5 rounded-lg border border-line text-slate hover:text-ink hover:border-ink/40 transition-colors whitespace-nowrap flex items-center gap-1.5 disabled:opacity-50"
        >
          {refreshing ? (
            <><span className="inline-block w-3 h-3 border-2 border-slate/30 border-t-slate rounded-full animate-spin" />Buscando…</>
          ) : (
            <>🔄 Buscar ahora</>
          )}
        </button>
      </div>

      {/* Search bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por título, contenido o medio…"
          className="bg-white border border-line rounded-lg px-3 py-1.5 text-sm w-72 placeholder:text-slate focus:outline-none focus:border-ink/40"
        />
        {query && (
          <button onClick={() => setQuery("")} className="text-xs text-slate hover:text-ink transition-colors">
            ✕ limpiar
          </button>
        )}
        <span className="text-xs text-slate ml-auto tabular-nums">{filtered.length} de {items.length}</span>
      </div>

      {/* Category filter pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setCategory("")}
          className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${!category ? "bg-ink text-white border-ink" : "border-line text-slate hover:border-ink/30"}`}
        >
          Todas <span className="opacity-60 tabular-nums">{items.length}</span>
        </button>
        {CATEGORY_ORDER.map((c) => {
          const n = items.filter((i) => i.category === c).length;
          if (n === 0) return null;
          const m = CATEGORY_META[c];
          return (
            <button
              key={c}
              onClick={() => setCategory(category === c ? "" : c)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${category === c ? "bg-ink text-white border-ink" : `${m.bg} hover:border-ink/30`}`}
            >
              {m.label} <span className="opacity-60 tabular-nums">{n}</span>
            </button>
          );
        })}
      </div>

      {/* Items */}
      {filtered.length === 0 ? (
        <Card><p className="text-sm text-slate text-center py-6">No hay publicaciones que coincidan con el filtro.</p></Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, i) => <PostCard key={i} item={item} query={ql} />)}
        </div>
      )}

      {/* Sources reference */}
      <details className="text-xs text-slate">
        <summary className="cursor-pointer hover:text-ink">Fuentes que se están leyendo ({sources.length})</summary>
        <div className="mt-2 flex flex-col gap-2 pl-4 border-l border-line">
          {sourcesByCategory.map((g) => (
            <div key={g.category}>
              <span className="text-[10px] uppercase tracking-wide text-slate font-medium">{CATEGORY_META[g.category].label}</span>
              <p className="text-xs text-ink">{g.sources.join(" · ")}</p>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
