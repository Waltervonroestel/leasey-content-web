"use client";

import { useEffect, useState } from "react";
import { Card, SectionTitle, Stat } from "@/components/ui";
import FilterableTable, { type Col, type Facet } from "@/components/FilterableTable";
import type { OptRow } from "@/lib/sheets";

type Resp = {
  connected: boolean;
  count?: number;
  rows?: OptRow[];
  clusters?: { cluster: string; urls: number; clicks: number; impressions: number; dead: number; high: number; med: number; deadRatio: number; score: number }[];
  pillars?: Record<string, number>;
  sheet?: string;
  error?: string;
};

const PRIORITY_COLOUR: Record<string, string> = {
  "High": "text-red-600 bg-red-50 border-red-200",
  "Medium": "text-amber-700 bg-amber-50 border-amber-200",
  "Low": "text-slate bg-bg-soft border-line",
  "Low (deprioritise)": "text-slate bg-bg-soft border-line",
};

export default function OptimiseView() {
  const [data, setData] = useState<Resp | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/optimise").then((r) => r.json()).then((d) => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-slate text-sm">Loading optimisation map…</p>;
  if (!data || !data.connected) return (
    <Card>
      <SectionTitle>Connect the Optimisation sheet</SectionTitle>
      <p className="text-sm text-slate">
        Set <code>CALENDAR_SHEET_ID</code>, <code>OPTIMISATION_SHEET_ID</code> and the Sheets refresh token env vars to load the 723 old URLs with cluster + pillar + suggested action.
      </p>
    </Card>
  );

  const rows = data.rows || [];
  const clusters = data.clusters || [];
  const pillars = data.pillars || {};
  const high = rows.filter((r) => r.priority === "High").length;
  const medium = rows.filter((r) => r.priority === "Medium").length;
  const alejandra = rows.filter((r) => r.owner.includes("Alejandra")).length;
  const walter = rows.filter((r) => r.owner.includes("Walter")).length;

  const cols: Col<OptRow>[] = [
    { header: "Priority", width: "100px",
      accessor: (r) => <span className={`text-[11px] px-1.5 py-0.5 rounded border ${PRIORITY_COLOUR[r.priority] || ""}`}>{r.priority}</span> },
    { header: "Cluster", width: "180px",
      accessor: (r) => <span className="text-xs text-ink">{r.cluster}</span> },
    { header: "URL",
      accessor: (r) => (
        <a href={`https://www.leasey.ai${r.url}`} target="_blank" rel="noreferrer" className="text-blue underline-offset-2 hover:underline text-xs break-all">
          {r.url}
        </a>
      ) },
    { header: "GA4", width: "60px", className: "text-right tabular-nums",
      accessor: (r) => <span className="text-xs text-slate">{r.ga4}</span> },
    { header: "GSC", width: "60px", className: "text-right tabular-nums",
      accessor: (r) => <span className="text-xs text-slate">{r.gsc}</span> },
    { header: "Primary pillar", width: "160px",
      accessor: (r) => <span className="text-xs font-medium text-ink">{r.primary}</span> },
    { header: "Suggested action",
      accessor: (r) => <span className="text-xs text-ink leading-snug">{r.action}</span> },
    { header: "Owner", width: "150px",
      accessor: (r) => <span className="text-xs text-slate">{r.owner}</span> },
  ];

  const facets: Facet<OptRow>[] = [
    { name: "Priority", getter: (r) => r.priority },
    { name: "Cluster", getter: (r) => r.cluster },
    { name: "Primary pillar", getter: (r) => r.primary },
    { name: "Owner", getter: (r) => r.owner },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-ink">Old content — optimisation map</h1>
        <p className="text-slate text-sm mt-1">
          {rows.length} URLs from Alejandra&apos;s GA4+GSC audit, classified into clusters and mapped to the new pillars. Read-only. Suggestions only — no text is written here.
          {data.sheet && (<> &middot; <a href={data.sheet} target="_blank" rel="noreferrer" className="text-blue hover:underline">Open in Google Sheets</a></>)}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="High priority" value={high} accent />
        <Stat label="Medium priority" value={medium} />
        <Stat label="Alejandra lane" value={alejandra} />
        <Stat label="Walter lane" value={walter} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <SectionTitle>By cluster (top 8)</SectionTitle>
          <div className="flex flex-col gap-1.5 text-sm">
            {clusters.slice(0, 8).map((c) => (
              <div key={c.cluster} className="flex items-center justify-between gap-3">
                <span className="text-ink truncate">{c.cluster}</span>
                <div className="flex items-center gap-3 text-xs text-slate tabular-nums">
                  <span title="URLs">{c.urls} URLs</span>
                  <span title="GSC clicks">{c.clicks} clicks</span>
                  <span title="Dead pages (0 clicks)" className={c.deadRatio > 0.6 ? "text-red-600" : ""}>
                    {Math.round(c.deadRatio * 100)}% dead
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionTitle>Primary pillar coverage (published)</SectionTitle>
          <div className="flex flex-col gap-1.5 text-sm">
            {Object.entries(pillars).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).map(([p, v]) => (
              <div key={p} className="flex items-center justify-between">
                <span className="text-ink">{p}</span>
                <span className="text-slate text-xs tabular-nums">{v} URLs</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <FilterableTable
        rows={rows}
        columns={cols}
        facets={facets}
        searchableText={(r) => `${r.url} ${r.cluster} ${r.primary} ${r.action}`}
      />
    </div>
  );
}
