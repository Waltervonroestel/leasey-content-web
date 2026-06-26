"use client";

import { useEffect, useState } from "react";
import { Card, SectionTitle } from "@/components/ui";

type IdeaQuery = {
  query?: string; impressions: number; clicks: number; ctr: number; position: number;
  intent: string; opp: string; bucket: string; angle: string; whatsHappening: string; action: string;
  alreadyInCalendar?: boolean;
};
type PillarGap = { pillar: string; calendar: number; published: number; isGap: boolean };

type Resp = {
  connected: boolean; days?: number;
  writeNext?: IdeaQuery[]; questions?: IdeaQuery[]; comparisons?: IdeaQuery[]; untapped?: IdeaQuery[];
  pillarGaps?: PillarGap[]; calendarSize?: number; publishedSize?: number; error?: string;
};

const INTENT_COLOUR: Record<string, string> = {
  comparison: "bg-purple-50 text-purple-700 border-purple-200",
  question: "bg-blue-50 text-blue-700 border-blue-200",
  commercial: "bg-amber-50 text-amber-700 border-amber-200",
  local: "bg-green-50 text-green-700 border-green-200",
  branded: "bg-pink-50 text-pink-700 border-pink-200",
  informational: "bg-bg-soft text-slate border-line",
};

function IdeaCard({ q }: { q: IdeaQuery }) {
  return (
    <div className="border border-line rounded-lg p-3 bg-white flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex flex-col gap-1 min-w-0">
          <code className="text-sm text-ink break-all">{q.query}</code>
          <div className="flex gap-1.5 items-center flex-wrap">
            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${INTENT_COLOUR[q.intent] || "bg-bg-soft text-slate border-line"}`}>{q.intent}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded border bg-bg-soft text-slate border-line">{q.opp}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded border bg-bg-soft text-slate border-line">{q.bucket}</span>
            {q.alreadyInCalendar && (
              <span className="text-[10px] px-1.5 py-0.5 rounded border bg-green-50 text-green-700 border-green-200">In calendar ✓</span>
            )}
          </div>
        </div>
        <div className="text-right text-xs text-slate tabular-nums flex flex-col">
          <span>{q.impressions.toLocaleString()} impr</span>
          <span>pos {q.position.toFixed(1)}</span>
        </div>
      </div>
      <div className="text-xs text-slate leading-snug">
        <div><span className="text-ink font-medium">What&apos;s happening: </span>{q.whatsHappening}</div>
        <div className="mt-1"><span className="text-ink font-medium">Write: </span>{q.angle}</div>
      </div>
    </div>
  );
}

function Section({ title, rows, hint, max = 10 }: { title: string; rows: IdeaQuery[]; hint?: string; max?: number }) {
  if (!rows || rows.length === 0) return null;
  return (
    <Card>
      <SectionTitle>{title}</SectionTitle>
      {hint && <p className="text-xs text-slate mb-2">{hint}</p>}
      <div className="flex flex-col gap-2">
        {rows.slice(0, max).map((q, i) => <IdeaCard key={i} q={q} />)}
      </div>
    </Card>
  );
}

export default function IdeasView() {
  const [days, setDays] = useState<28 | 90>(90);
  const [data, setData] = useState<Resp | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/ideas?days=${days}`).then((r) => r.json()).then((d) => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, [days]);

  if (loading) return <p className="text-slate text-sm">Generating content ideas…</p>;
  if (!data || !data.connected) return (
    <Card>
      <SectionTitle>Connect Google Search Console</SectionTitle>
      <p className="text-sm text-slate">Ideas come from real GSC queries cross-referenced with the calendar and the optimisation map. Connect GSC to enable this page.</p>
    </Card>
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">New content ideas</h1>
          <p className="text-slate text-sm mt-1">Suggestions only. Generated from real GSC demand + pillar gaps + calendar overlap. No text is written here.</p>
        </div>
        <div className="flex bg-bg-soft rounded-lg p-0.5">
          {[28, 90].map((d) => (
            <button key={d} onClick={() => setDays(d as 28 | 90)} className={`text-xs px-2.5 py-1 rounded-md ${days === d ? "bg-white text-ink shadow-sm" : "text-slate"}`}>
              {d}d
            </button>
          ))}
        </div>
      </div>

      <Card>
        <SectionTitle>Pillar coverage gap</SectionTitle>
        <p className="text-xs text-slate mb-2">How many pieces in the forward calendar lead with each pillar, vs how many published URLs reinforce it.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(data.pillarGaps || []).map((g) => (
            <div key={g.pillar} className={`border rounded-lg p-3 ${g.isGap ? "border-red-200 bg-red-50/50" : "border-line"}`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-ink">{g.pillar}</span>
                {g.isGap && <span className="text-[10px] text-red-600">GAP</span>}
              </div>
              <div className="text-xs text-slate mt-1 tabular-nums">
                Calendar: <span className="text-ink">{g.calendar}</span> &middot; Published: <span className="text-ink">{g.published}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Section title="Write these next (prioritised)" rows={data.writeNext || []} hint="Queries with real demand on the site and a clear pillar fit. Items marked “In calendar ✓” are already covered." max={12} />
      <Section title="Questions people ask (AEO opportunities)" rows={data.questions || []} hint="Question-shaped queries. Each becomes a research/answer post." max={10} />
      <Section title="Comparison & competitor queries" rows={data.comparisons || []} hint="Demand on vs-competitor terms. Decision-stage pieces." max={10} />
      <Section title="Untapped (high impressions, near-zero clicks)" rows={data.untapped || []} hint="Demand exists, but the site does not capture it. New piece OR title/meta rewrite of the existing page." max={10} />
    </div>
  );
}
