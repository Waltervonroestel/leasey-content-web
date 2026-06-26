"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, SectionTitle } from "@/components/ui";
import type { OptRow } from "@/lib/sheets";
import { PILLAR_META, pillarCodeFrom, type PillarCode } from "@/lib/pillarStyle";

type ClusterRow = { cluster: string; urls: number; clicks: number; impressions: number; dead: number; deadRatio: number; high: number; med: number; score: number };
type Resp = { connected: boolean; count?: number; rows?: OptRow[]; clusters?: ClusterRow[]; pillars?: Record<string, number>; sheet?: string };

const PRIORITY_ORDER = ["High", "Medium", "Low", "Low (deprioritise)"];
const PRIORITY_META: Record<string, { label: string; ring: string; dot: string; bg: string; text: string }> = {
  "High":               { label: "High",     ring: "ring-red-200",   dot: "bg-red-500",    bg: "bg-red-50",    text: "text-red-700" },
  "Medium":             { label: "Medium",   ring: "ring-amber-200", dot: "bg-amber-500",  bg: "bg-amber-50",  text: "text-amber-700" },
  "Low":                { label: "Low",      ring: "ring-line",      dot: "bg-slate-300",  bg: "bg-bg-soft",   text: "text-slate" },
  "Low (deprioritise)": { label: "Skip",     ring: "ring-line",      dot: "bg-slate-300",  bg: "bg-bg-soft",   text: "text-slate" },
};

function FilterPill({ active, count, label, onClick, colour }: { active: boolean; count: number; label: string; onClick: () => void; colour?: string }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-2.5 py-1 rounded-full border transition-colors whitespace-nowrap ${
        active ? "bg-ink text-white border-ink" : "bg-white text-slate border-line hover:border-ink/30 hover:text-ink"
      }`}
    >
      {colour && <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle" style={{ background: colour }} />}
      {label} <span className="opacity-60 tabular-nums">{count}</span>
    </button>
  );
}

function URLCard({ r }: { r: OptRow }) {
  const code = pillarCodeFrom(r.primary) as PillarCode;
  const meta = PILLAR_META[code];
  const prio = PRIORITY_META[r.priority] || PRIORITY_META["Low"];

  return (
    <div className={`rounded-xl border border-line bg-white p-4 flex flex-col gap-3 hover:shadow-md transition-shadow relative`}>
      <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full" style={{ background: meta.colour }} aria-hidden />
      <div className="pl-3 flex flex-col gap-2.5">
        {/* Header: priority + cluster */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${prio.bg} ${prio.text}`}>
            <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 align-middle ${prio.dot}`} />
            {prio.label}
          </span>
          <span className="text-[11px] text-slate">{r.cluster}</span>
        </div>

        {/* URL */}
        <a href={`https://www.leasey.ai${r.url}`} target="_blank" rel="noreferrer" className="text-xs font-mono text-ink hover:text-blue break-all leading-snug">
          {r.url}
        </a>

        {/* Metrics + pillar */}
        <div className="flex items-center gap-3 text-xs flex-wrap">
          <span className="flex items-center gap-1 text-slate">
            <span className="text-[10px] uppercase tracking-wide opacity-70">GSC</span>
            <span className="text-ink font-medium tabular-nums">{r.gsc}</span>
          </span>
          <span className="flex items-center gap-1 text-slate">
            <span className="text-[10px] uppercase tracking-wide opacity-70">GA4</span>
            <span className="text-ink font-medium tabular-nums">{r.ga4}</span>
          </span>
          <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded border ${meta.border} ${meta.bg} ${meta.text} font-medium`}>
            {code === "—" ? meta.label : `${code} ${meta.short}`}
          </span>
        </div>

        {/* Suggested action */}
        <div className="border-t border-line pt-2.5 mt-0.5 flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-wide text-slate">Suggested action</span>
          <p className="text-xs text-ink leading-snug">{r.action}</p>
          {r.owner && r.owner !== "—" && (
            <span className="text-[10px] text-slate">Owner: <span className="text-ink">{r.owner}</span></span>
          )}
        </div>
      </div>
    </div>
  );
}

function ClusterPanel({ cluster, rows }: { cluster: string; rows: OptRow[] }) {
  const [open, setOpen] = useState(false);
  const high = rows.filter((r) => r.priority === "High").length;
  const med = rows.filter((r) => r.priority === "Medium").length;
  const dead = rows.filter((r) => r.gsc === 0).length;
  const deadRatio = rows.length ? Math.round((dead / rows.length) * 100) : 0;
  const pillar = rows[0]?.primary || "—";
  const code = pillarCodeFrom(pillar) as PillarCode;
  const meta = PILLAR_META[code];

  return (
    <div className="rounded-xl border border-line bg-white overflow-hidden">
      <button onClick={() => setOpen((x) => !x)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bg-soft transition-colors text-left">
        <span className="w-1 h-8 rounded-full" style={{ background: meta.colour }} />
        <span className="flex-1 min-w-0">
          <span className="text-sm font-medium text-ink block">{cluster}</span>
          <span className="text-[11px] text-slate">
            {rows.length} URLs · {high} high · {med} medium · {deadRatio}% dead
          </span>
        </span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${meta.border} ${meta.bg} ${meta.text} font-medium`}>
          {code === "—" ? meta.label : `${code} ${meta.short}`}
        </span>
        <span className="text-slate text-sm" aria-hidden>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="p-4 border-t border-line bg-bg-soft/30 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {rows.slice(0, 24).map((r, i) => <URLCard key={i} r={r} />)}
          {rows.length > 24 && <div className="text-xs text-slate p-2">{rows.length - 24} more URLs — refine filters above.</div>}
        </div>
      )}
    </div>
  );
}

export default function OptimiseView() {
  const [data, setData] = useState<Resp | null>(null);
  const [loading, setLoading] = useState(true);
  const [pillar, setPillar] = useState<string>("");
  const [owner, setOwner] = useState<string>("");
  const [q, setQ] = useState<string>("");

  useEffect(() => {
    fetch("/api/optimise").then((r) => r.json()).then((d) => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const rows = data?.rows || [];
  const clusters = data?.clusters || [];

  const ownerCounts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const r of rows) c[r.owner || "—"] = (c[r.owner || "—"] || 0) + 1;
    return c;
  }, [rows]);
  const pillarCounts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const r of rows) {
      const code = pillarCodeFrom(r.primary);
      c[code] = (c[code] || 0) + 1;
    }
    return c;
  }, [rows]);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (pillar && pillarCodeFrom(r.primary) !== pillar) return false;
      if (owner && r.owner !== owner) return false;
      if (ql && !(`${r.url} ${r.cluster} ${r.action}`.toLowerCase().includes(ql))) return false;
      return true;
    });
  }, [rows, pillar, owner, q]);

  const highImpact = useMemo(() => filtered.filter((r) => r.priority === "High").slice(0, 12), [filtered]);
  const byCluster = useMemo(() => {
    const m = new Map<string, OptRow[]>();
    for (const r of filtered) {
      const c = r.cluster || "Unclassified";
      if (!m.has(c)) m.set(c, []);
      m.get(c)!.push(r);
    }
    return [...m.entries()].sort((a, b) => {
      const order = ["High", "Medium", "Low", "Low (deprioritise)"];
      const score = (rs: OptRow[]) => rs.reduce((acc, r) => acc + (4 - order.indexOf(r.priority)) * 10, 0);
      return score(b[1]) - score(a[1]);
    });
  }, [filtered]);

  if (loading) return <p className="text-slate text-sm">Loading optimisation map…</p>;
  if (!data || !data.connected) return (
    <Card>
      <SectionTitle>Connect the Optimisation sheet</SectionTitle>
      <p className="text-sm text-slate">Set the sheet IDs and Sheets refresh token to load the published-URL optimisation map.</p>
    </Card>
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Optimise old content</h1>
        <p className="text-slate text-sm mt-1">
          {rows.length} published URLs classified into clusters and mapped to the 6 positioning pillars, each with a suggested action and owner.
          {data.sheet && (<> &middot; <a href={data.sheet} target="_blank" rel="noreferrer" className="text-blue hover:underline">Open the source sheet</a></>)}
        </p>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {([
          { label: "High priority", value: rows.filter((r) => r.priority === "High").length, accent: true },
          { label: "Medium priority", value: rows.filter((r) => r.priority === "Medium").length, accent: false },
          { label: "Alejandra lane", value: rows.filter((r) => r.owner.includes("Alejandra")).length, accent: false },
          { label: "Walter lane", value: rows.filter((r) => r.owner === "Walter" || r.owner === "Walter (decision)").length, accent: false },
        ]).map((s) => (
          <div key={s.label} className={`rounded-xl border bg-white p-3 ${s.accent ? "border-red-200" : "border-line"}`}>
            <div className="text-[10px] uppercase tracking-wide text-slate">{s.label}</div>
            <div className={`text-2xl font-bold mt-0.5 tabular-nums ${s.accent ? "text-red-600" : "text-ink"}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <Card className="!p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search URL, cluster, action…"
              className="bg-white border border-line rounded-lg px-3 py-1.5 text-sm w-64 placeholder:text-slate"
            />
            <span className="ml-auto text-xs text-slate tabular-nums">{filtered.length} of {rows.length}</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] uppercase tracking-wide text-slate mr-1">Pillar</span>
            <FilterPill active={pillar === ""} count={rows.length} label="All" onClick={() => setPillar("")} />
            {(["P1", "P2", "P3", "P4", "P5", "P6"] as const).map((p) => (
              <FilterPill key={p} active={pillar === p} count={pillarCounts[p] || 0} label={`${p} ${PILLAR_META[p].short}`} colour={PILLAR_META[p].colour} onClick={() => setPillar(pillar === p ? "" : p)} />
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] uppercase tracking-wide text-slate mr-1">Owner</span>
            <FilterPill active={owner === ""} count={rows.length} label="All" onClick={() => setOwner("")} />
            {Object.entries(ownerCounts).filter(([, v]) => v > 0 && v > 5).sort((a, b) => b[1] - a[1]).map(([o, c]) => (
              <FilterPill key={o} active={owner === o} count={c} label={o} onClick={() => setOwner(owner === o ? "" : o)} />
            ))}
          </div>
        </div>
      </Card>

      {/* High-impact queue */}
      {highImpact.length > 0 && (
        <section>
          <div className="flex items-baseline gap-3 mb-3">
            <h2 className="text-sm font-semibold text-ink">Work on this first</h2>
            <span className="text-xs text-slate">{highImpact.length} high-priority pages bleeding impressions</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {highImpact.map((r, i) => <URLCard key={i} r={r} />)}
          </div>
        </section>
      )}

      {/* Cluster panels */}
      <section>
        <div className="flex items-baseline gap-3 mb-3">
          <h2 className="text-sm font-semibold text-ink">By cluster</h2>
          <span className="text-xs text-slate">{byCluster.length} clusters · click to expand</span>
        </div>
        <div className="flex flex-col gap-2">
          {byCluster.map(([cluster, rs]) => (
            <ClusterPanel key={cluster} cluster={cluster} rows={rs} />
          ))}
        </div>
      </section>
    </div>
  );
}
