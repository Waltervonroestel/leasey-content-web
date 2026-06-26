"use client";

import { useEffect, useState } from "react";
import { Card, SectionTitle } from "@/components/ui";

type Gap = { pillar: string; calendar: number; published: number };
type Resp = { connected: boolean; gap?: Gap[]; calendarTotal?: number; publishedTotal?: number };
type ClusterRow = { cluster: string; urls: number; clicks: number; dead: number; deadRatio: number; high: number };
type OptResp = { connected: boolean; clusters?: ClusterRow[] };

export default function CoverageInsights() {
  const [cov, setCov] = useState<Resp | null>(null);
  const [opt, setOpt] = useState<OptResp | null>(null);

  useEffect(() => {
    fetch("/api/coverage").then((r) => r.json()).then(setCov).catch(() => setCov({ connected: false }));
    fetch("/api/optimise").then((r) => r.json()).then(setOpt).catch(() => setOpt({ connected: false }));
  }, []);

  if (!cov || !opt) return <p className="text-slate text-sm">Loading deeper analysis…</p>;
  if (!cov.connected && !opt.connected) {
    return (
      <Card>
        <SectionTitle>Deeper analysis</SectionTitle>
        <p className="text-xs text-slate">Connect Sheets credentials to see pillar coverage and cluster health.</p>
      </Card>
    );
  }

  const maxCal = Math.max(1, ...(cov.gap || []).map((g) => g.calendar));
  const maxPub = Math.max(1, ...(cov.gap || []).map((g) => g.published));
  const clusters = (opt.clusters || []).slice(0, 12);
  const maxClicks = Math.max(1, ...clusters.map((c) => c.clicks));

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card>
        <SectionTitle>Pillar coverage</SectionTitle>
        <p className="text-xs text-slate mb-3">
          Forward calendar ({cov.calendarTotal ?? 0} pieces) vs published URLs ({cov.publishedTotal ?? 0}). Bars show distribution across the 6 pillars.
        </p>
        <div className="flex flex-col gap-2">
          {(cov.gap || []).map((g) => (
            <div key={g.pillar} className="text-xs">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-ink font-medium">{g.pillar}</span>
                <span className="text-slate tabular-nums">cal {g.calendar} &middot; pub {g.published}</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <div className="h-2 bg-bg-soft rounded overflow-hidden">
                  <div className="h-full bg-blue" style={{ width: `${(g.calendar / maxCal) * 100}%` }} />
                </div>
                <div className="h-2 bg-bg-soft rounded overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${(g.published / maxPub) * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-3 text-[10px] text-slate">
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue rounded-sm" /> Calendar (forward)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-sm" /> Published (URLs)</span>
        </div>
      </Card>

      <Card>
        <SectionTitle>Cluster health</SectionTitle>
        <p className="text-xs text-slate mb-3">
          Top {clusters.length} clusters by GSC clicks. High dead-page ratio = many URLs ranking with zero clicks (capture problem).
        </p>
        <div className="flex flex-col gap-2">
          {clusters.map((c) => (
            <div key={c.cluster} className="text-xs">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-ink truncate">{c.cluster}</span>
                <span className="text-slate tabular-nums">
                  {c.clicks} clicks &middot;
                  <span className={c.deadRatio > 0.6 ? "text-red-600 ml-1" : "ml-1"}>{Math.round(c.deadRatio * 100)}% dead</span>
                </span>
              </div>
              <div className="h-2 bg-bg-soft rounded overflow-hidden">
                <div className="h-full bg-blue" style={{ width: `${(c.clicks / maxClicks) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
