"use client";

import { useEffect, useState } from "react";
import { Card, SectionTitle, Stat } from "@/components/ui";
import FilterableTable, { type Col, type Facet } from "@/components/FilterableTable";
import type { CalendarRow } from "@/lib/sheets";

type Resp = { connected: boolean; count?: number; rows?: CalendarRow[]; sheet?: string };

const phaseLabel = (p: string) => ({ "1": "1 · Unaware", "2": "2 · Problem", "3": "3 · Solution", "4": "4 · Brand", "5": "5 · Decision" }[p] || p);

export default function CalendarView() {
  const [data, setData] = useState<Resp | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/calendar/full").then((r) => r.json()).then((d) => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-slate text-sm">Loading calendar…</p>;
  if (!data || !data.connected) return (
    <Card>
      <SectionTitle>Editorial calendar</SectionTitle>
      <p className="text-sm text-slate">Connect <code>CALENDAR_SHEET_ID</code> + the Sheets refresh token to load the 95-piece editorial calendar.</p>
    </Card>
  );

  const rows = data.rows || [];
  const published = rows.filter((r) => /publicad|publish/i.test(r.status)).length;
  const drafted = rows.filter((r) => /qa|draft|borrador/i.test(r.status)).length;
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = rows.filter((r) => r.date >= today).length;

  const cols: Col<CalendarRow>[] = [
    { header: "Date", width: "100px", accessor: (r) => <span className="text-xs text-slate">{r.date} · {r.day}</span> },
    { header: "Channel", width: "160px", accessor: (r) => <span className="text-xs text-ink">{r.channel}</span> },
    { header: "Title", accessor: (r) => (
      r.docLink
        ? <a href={r.docLink} target="_blank" rel="noreferrer" className="text-ink hover:text-blue text-xs leading-snug">{r.title}</a>
        : <span className="text-ink text-xs leading-snug">{r.title}</span>
    ) },
    { header: "Voice", width: "120px", accessor: (r) => <span className="text-xs text-slate">{r.voice}</span> },
    { header: "Pillar", width: "70px", accessor: (r) => <span className="text-xs text-ink">{r.pillar}</span> },
    { header: "Phase", width: "100px", accessor: (r) => <span className="text-xs text-slate">{phaseLabel(r.phase)}</span> },
    { header: "Status", width: "100px", accessor: (r) => <span className="text-xs text-slate">{r.status || "—"}</span> },
  ];

  const facets: Facet<CalendarRow>[] = [
    { name: "Channel", getter: (r) => r.channel },
    { name: "Voice", getter: (r) => r.voice },
    { name: "Pillar", getter: (r) => r.pillar },
    { name: "Phase", getter: (r) => phaseLabel(r.phase) },
    { name: "Status", getter: (r) => r.status || "—" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-ink">Editorial calendar</h1>
        <p className="text-slate text-sm mt-1">
          {rows.length} pieces planned across the 90-day window. Read-only view of the Google Sheet calendar.
          {data.sheet && (<> &middot; <a href={data.sheet} target="_blank" rel="noreferrer" className="text-blue hover:underline">Open in Google Sheets</a></>)}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Total pieces" value={rows.length} accent />
        <Stat label="Upcoming" value={upcoming} />
        <Stat label="In draft / QA" value={drafted} />
        <Stat label="Published" value={published} />
      </div>

      <FilterableTable
        rows={rows}
        columns={cols}
        facets={facets}
        searchableText={(r) => `${r.title} ${r.channel} ${r.voice}`}
      />
    </div>
  );
}
