"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, SectionTitle } from "@/components/ui";
import type { CalendarRow } from "@/lib/sheets";
import { PILLAR_META, pillarCodeFrom, channelIcon, channelGroup, type PillarCode } from "@/lib/pillarStyle";

type CalRow = CalendarRow & { positioningPillar?: string };
type Resp = { connected: boolean; count?: number; rows?: CalRow[]; sheet?: string };

const PHASE_LABEL: Record<string, string> = { "1": "Unaware", "2": "Problem", "3": "Solution", "4": "Brand", "5": "Decision" };
const PHASE_COLOUR: Record<string, string> = {
  "1": "bg-slate-100 text-slate",
  "2": "bg-amber-50 text-amber-700",
  "3": "bg-blue/10 text-blue",
  "4": "bg-purple-50 text-purple-700",
  "5": "bg-emerald-50 text-emerald-700",
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

const STATUS_OPTIONS = ["Idea", "Escrito", "Programado", "Publicado"] as const;
const STATUS_COLOUR: Record<string, string> = {
  "": "bg-slate-100 text-slate",
  "Idea": "bg-slate-100 text-slate",
  "Escrito": "bg-blue/10 text-blue",
  "Programado": "bg-amber-50 text-amber-700",
  "Publicado": "bg-emerald-50 text-emerald-700",
};

function PieceCard({ row, isToday, isPast }: { row: CalRow; isToday: boolean; isPast: boolean }) {
  const code = pillarCodeFrom(row.positioningPillar || "") as PillarCode;
  const meta = PILLAR_META[code];
  const phase = PHASE_LABEL[row.phase] || row.phase || "—";
  const phaseClr = PHASE_COLOUR[row.phase] || "bg-bg-soft text-slate";
  const [status, setStatus] = useState(row.status || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  async function updateStatus(next: string) {
    const target = status === next ? "" : next; // toggle off
    setSaving(true); setError(false);
    const prev = status;
    setStatus(target);
    try {
      const r = await fetch("/api/calendar/update", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sheetRow: row.sheetRow, status: target }),
      });
      if (!r.ok) throw new Error();
    } catch { setStatus(prev); setError(true); setTimeout(() => setError(false), 2000); }
    finally { setSaving(false); }
  }

  return (
    <div className={`relative group rounded-xl border bg-white p-4 transition-shadow hover:shadow-md ${isPast ? "opacity-60" : "border-line"}`}>
      <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full" style={{ background: meta.colour }} aria-hidden />
      <div className="pl-3 flex flex-col gap-2">
        <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate">
          <span className="font-mono tabular-nums">{row.date}</span>
          <span className="opacity-50">·</span>
          <span>{row.day}</span>
          {isToday && <span className="px-1.5 py-0.5 rounded-full bg-blue/10 text-blue text-[10px] font-medium">Today</span>}
          <span className="opacity-50">·</span>
          <span title={row.channel} className="inline-flex items-center gap-1">
            <span aria-hidden>{channelIcon(row.channel)}</span>
            <span className="text-ink/70">{row.channel}</span>
          </span>
        </div>

        {row.docLink ? (
          <a href={row.docLink} target="_blank" rel="noreferrer" className="text-sm text-ink leading-snug font-medium hover:text-blue line-clamp-3">
            {row.title}
          </a>
        ) : (
          <p className="text-sm text-ink leading-snug font-medium line-clamp-3">{row.title}</p>
        )}

        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${meta.border} ${meta.bg} ${meta.text} font-medium`}>
            {code === "—" ? meta.label : `${code} ${meta.short}`}
          </span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded ${phaseClr}`}>{phase}</span>
          <span className="text-[10px] text-slate ml-auto">{row.voice}</span>
        </div>

        {/* Status quick-update */}
        <div className="flex items-center gap-1 flex-wrap pt-1 border-t border-line">
          <span className="text-[10px] text-slate uppercase tracking-wide mr-1">Status</span>
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => updateStatus(s)}
              disabled={saving}
              className={`text-[10px] px-1.5 py-0.5 rounded transition-colors ${
                status === s ? STATUS_COLOUR[s] + " font-medium" : "text-slate hover:bg-bg-soft"
              }`}
            >
              {s}
            </button>
          ))}
          {error && <span className="text-[10px] text-rose-600 ml-1">error</span>}
        </div>
      </div>
    </div>
  );
}

function startOfWeek(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00Z");
  const day = d.getUTCDay(); // 0 Sun .. 6 Sat
  const diff = day === 0 ? -6 : 1 - day; // Monday-start
  d.setUTCDate(d.getUTCDate() + diff);
  return d.toISOString().slice(0, 10);
}
function addDays(dateStr: string, n: number) {
  const d = new Date(dateStr + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
function fmtWeekRange(monday: string) {
  const sunday = addDays(monday, 6);
  const m = new Date(monday + "T00:00:00Z"), s = new Date(sunday + "T00:00:00Z");
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  return `${fmt(m)} – ${fmt(s)}`;
}

export default function CalendarView() {
  const [data, setData] = useState<Resp | null>(null);
  const [loading, setLoading] = useState(true);
  const [pillar, setPillar] = useState<string>("");
  const [channel, setChannel] = useState<string>("");
  const [tense, setTense] = useState<"all" | "upcoming" | "past">("upcoming");

  useEffect(() => {
    fetch("/api/calendar/full").then((r) => r.json()).then((d) => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const rows = data?.rows || [];

  const pillarCounts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const r of rows) {
      const code = pillarCodeFrom(r.positioningPillar || "");
      c[code] = (c[code] || 0) + 1;
    }
    return c;
  }, [rows]);
  const channelCounts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const r of rows) {
      const g = channelGroup(r.channel);
      c[g] = (c[g] || 0) + 1;
    }
    return c;
  }, [rows]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (pillar && pillarCodeFrom(r.positioningPillar || "") !== pillar) return false;
      if (channel && channelGroup(r.channel) !== channel) return false;
      if (tense === "upcoming" && r.date < today) return false;
      if (tense === "past" && r.date >= today) return false;
      return true;
    });
  }, [rows, pillar, channel, tense, today]);

  const grouped = useMemo(() => {
    const m = new Map<string, CalRow[]>();
    for (const r of filtered) {
      const wk = startOfWeek(r.date);
      if (!m.has(wk)) m.set(wk, []);
      m.get(wk)!.push(r);
    }
    return [...m.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1));
  }, [filtered]);

  if (loading) return <p className="text-slate text-sm">Loading calendar…</p>;
  if (!data || !data.connected) return (
    <Card>
      <SectionTitle>Editorial calendar</SectionTitle>
      <p className="text-sm text-slate">Connect <code>CALENDAR_SHEET_ID</code> + the Sheets refresh token to load the editorial calendar.</p>
    </Card>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Editorial calendar</h1>
          <p className="text-slate text-sm mt-1">
            {rows.length} pieces planned across the 90-day window, mapped to the 6 positioning pillars.
            {data.sheet && (<> &middot; <a href={data.sheet} target="_blank" rel="noreferrer" className="text-blue hover:underline">Open the source sheet</a></>)}
          </p>
        </div>
        <a href="/api/export/calendar" className="text-xs px-3 py-1.5 rounded-lg border border-line text-slate hover:text-ink hover:border-ink/40 transition-colors whitespace-nowrap">
          ⬇ Descargar CSV
        </a>
      </div>

      <Card className="!p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 flex-wrap text-xs">
            <span className="text-[11px] uppercase tracking-wide text-slate">Show</span>
            <div className="flex bg-bg-soft rounded-lg p-0.5">
              {(["upcoming", "all", "past"] as const).map((t) => (
                <button key={t} onClick={() => setTense(t)} className={`px-2.5 py-1 rounded-md text-xs capitalize ${tense === t ? "bg-white text-ink shadow-sm" : "text-slate"}`}>
                  {t}
                </button>
              ))}
            </div>
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
            <span className="text-[11px] uppercase tracking-wide text-slate mr-1">Channel</span>
            <FilterPill active={channel === ""} count={rows.length} label="All" onClick={() => setChannel("")} />
            {(["Blog", "LinkedIn", "Press", "Reddit"] as const).map((c) => (
              <FilterPill key={c} active={channel === c} count={channelCounts[c] || 0} label={c} onClick={() => setChannel(channel === c ? "" : c)} />
            ))}
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-6">
        {grouped.length === 0 ? (
          <Card><p className="text-sm text-slate text-center py-6">No pieces match the current filters.</p></Card>
        ) : grouped.map(([wk, pieces]) => {
          const wkContainsToday = pieces.some((p) => p.date === today);
          return (
            <section key={wk}>
              <div className="flex items-baseline gap-3 mb-3">
                <h2 className="text-sm font-semibold text-ink">Week of {fmtWeekRange(wk)}</h2>
                <span className="text-xs text-slate">{pieces.length} pieces</span>
                {wkContainsToday && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue/10 text-blue font-medium">This week</span>}
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {pieces.map((p, i) => (
                  <PieceCard key={i} row={p} isToday={p.date === today} isPast={p.date < today} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
