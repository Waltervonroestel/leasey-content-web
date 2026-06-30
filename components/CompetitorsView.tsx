"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui";

interface FeedItem { source: string; title: string; link: string; date: string; excerpt: string }
interface Resp { ok: boolean; sources?: string[]; count?: number; items?: FeedItem[]; error?: string }

const SOURCE_COLOUR: Record<string, string> = {
  "Propmodo":            "bg-blue/10 text-blue border-blue/30",
  "AppFolio":            "bg-purple-500/10 text-purple-700 border-purple-500/30",
  "Buildium":            "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
  "Multifamily Executive": "bg-amber-500/10 text-amber-700 border-amber-500/30",
};

function PostCard({ item }: { item: FeedItem }) {
  const cls = SOURCE_COLOUR[item.source] || "bg-slate-100 text-slate border-slate-200";
  return (
    <a href={item.link} target="_blank" rel="noreferrer" className="block">
      <div className="rounded-xl border border-line bg-white p-4 flex flex-col gap-2 hover:shadow-sm hover:border-ink/30 transition-all">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${cls}`}>{item.source}</span>
          <span className="text-[11px] text-slate ml-auto font-mono">{item.date || "—"}</span>
        </div>
        <h3 className="text-sm font-semibold text-ink leading-snug line-clamp-2">{item.title}</h3>
        {item.excerpt && <p className="text-xs text-slate leading-relaxed line-clamp-3">{item.excerpt}</p>}
      </div>
    </a>
  );
}

export default function CompetitorsView() {
  const [data, setData] = useState<Resp | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    fetch("/api/competitors").then((r) => r.json()).then((d) => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-slate text-sm">Cargando feeds de competidores…</p>;
  if (!data || !data.ok) return (
    <Card><p className="text-sm text-slate">No se pudieron cargar los feeds. {data?.error}</p></Card>
  );

  const items = data.items || [];
  const sources = data.sources || [];
  const filtered = filter ? items.filter((i) => i.source === filter) : items;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">¿Qué publican los competidores?</h1>
        <p className="text-slate text-sm mt-1">
          Últimas publicaciones de medios de proptech y PM trade press. Inspiración para temas y para detectar tendencias.
          Se actualiza cada hora. Sin costo.
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={() => setFilter("")} className={`text-xs px-2.5 py-1 rounded-full border ${!filter ? "bg-ink text-white border-ink" : "border-line text-slate"}`}>
          Todas <span className="opacity-60 tabular-nums">{items.length}</span>
        </button>
        {sources.map((s) => {
          const n = items.filter((i) => i.source === s).length;
          if (n === 0) return null;
          return (
            <button key={s} onClick={() => setFilter(filter === s ? "" : s)} className={`text-xs px-2.5 py-1 rounded-full border ${filter === s ? "bg-ink text-white border-ink" : "border-line text-slate"}`}>
              {s} <span className="opacity-60 tabular-nums">{n}</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <Card><p className="text-sm text-slate text-center py-4">No hay publicaciones recientes en este filtro.</p></Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, i) => <PostCard key={i} item={item} />)}
        </div>
      )}
    </div>
  );
}
