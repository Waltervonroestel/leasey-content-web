"use client";
import { useEffect, useState } from "react";

type Enriched = {
  query?: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  intent: string;
  opp: string;
  bucket: string;
  angle: string;
  whatsHappening: string;
  action: string;
};
type Trend = Enriched & { imprDelta: number; clickDelta: number; posDelta: number; prevImpressions: number };
type Data = {
  connected: boolean;
  total?: number;
  intentCounts?: { intent: string; queries: number; impressions: number; clicks: number }[];
  writeNext?: Enriched[];
  questions?: Enriched[];
  comparisons?: Enriched[];
  ctrFixes?: Enriched[];
  striking?: Enriched[];
  untapped?: Enriched[];
  belowPage2?: Enriched[];
  trends?: { rising: Trend[]; declining: Trend[] };
};

const INTENT_COLOR: Record<string, string> = {
  comparison: "bg-purple-100 text-purple-700",
  question: "bg-blue-100 text-blue-700",
  commercial: "bg-teal-100 text-teal-700",
  local: "bg-amber-100 text-amber-700",
  branded: "bg-slate-200 text-slate-600",
  informational: "bg-slate-100 text-slate-600",
};
const OPP_COLOR: Record<string, string> = {
  "ctr-fix": "bg-rose-100 text-rose-700",
  striking: "bg-emerald-100 text-emerald-700",
  untapped: "bg-indigo-100 text-indigo-700",
  "below-page-2": "bg-orange-100 text-orange-700",
  winning: "bg-green-100 text-green-700",
};
const OPP_LABEL: Record<string, string> = {
  "ctr-fix": "CTR fix",
  striking: "striking distance",
  untapped: "untapped",
  "below-page-2": "below page 2",
  winning: "winning",
};

function Badge({ text, cls }: { text: string; cls: string }) {
  return <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${cls}`}>{text}</span>;
}

function QueryRow({ q, showAngle = true }: { q: Enriched; showAngle?: boolean }) {
  return (
    <div className="py-2.5 border-b border-line/50 last:border-0">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm text-ink font-medium">{q.query}</span>
            <Badge text={q.intent} cls={INTENT_COLOR[q.intent] || "bg-slate-100 text-slate-600"} />
            <Badge text={OPP_LABEL[q.opp] || q.opp} cls={OPP_COLOR[q.opp] || "bg-slate-100"} />
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate whitespace-nowrap">
          <span title="impressions">{q.impressions.toLocaleString()} impr</span>
          <span title="clicks">{q.clicks} clk</span>
          <span title="CTR">{(q.ctr * 100).toFixed(1)}%</span>
          <span title="position" className="font-medium text-ink">#{q.position.toFixed(1)}</span>
        </div>
      </div>
      {showAngle && (
        <div className="mt-1.5 text-xs text-slate">
          <span className="text-ink/70">{q.whatsHappening}</span>
          <div className="mt-1 pl-2 border-l-2 border-blue/40 text-ink/90">
            <span className="font-medium text-blue">Write:</span> {q.angle}
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, subtitle, rows, showAngle = true }: { title: string; subtitle: string; rows?: Enriched[]; showAngle?: boolean }) {
  if (!rows || rows.length === 0) return null;
  return (
    <div className="bg-white border border-line rounded-xl p-4">
      <h3 className="font-semibold text-sm text-ink">{title} <span className="text-slate font-normal">({rows.length})</span></h3>
      <p className="text-xs text-slate mb-1">{subtitle}</p>
      <div>{rows.map((r, i) => <QueryRow key={i} q={r} showAngle={showAngle} />)}</div>
    </div>
  );
}

const RANGES = [28, 90];

export default function Reports() {
  const [days, setDays] = useState(90);
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/gsc/intel?days=${days}`).then((r) => r.json()).then(setData).catch(() => setData({ connected: false })).finally(() => setLoading(false));
  }, [days]);

  if (loading && !data) return <p className="text-slate text-sm">Loading query intelligence…</p>;
  if (data && data.connected === false) {
    return (
      <div className="bg-white border border-line rounded-xl p-6">
        <h2 className="text-lg font-bold text-ink mb-2">Connect Google Search Console</h2>
        <p className="text-slate text-sm">
          With GSC connected, this page reads every query, classifies it by intent and opportunity, and turns it into a
          concrete content recommendation: what to write, and why. See Analytics for the env vars.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Query reports</h1>
          <p className="text-slate text-sm mt-0.5">{data?.total ?? 0} queries analysed · what is happening, and what to write next.</p>
        </div>
        <div className="flex gap-1">
          {RANGES.map((d) => (
            <button key={d} onClick={() => setDays(d)} className={`text-sm px-3 py-1.5 rounded-md ${days === d ? "bg-blue text-white" : "border border-line text-slate hover:bg-bg-2"}`}>{d}d</button>
          ))}
        </div>
      </div>

      {/* WRITE NEXT — the prioritised list */}
      <div className="bg-white border-2 border-blue/30 rounded-xl p-4">
        <h2 className="font-bold text-base text-ink">Write these next</h2>
        <p className="text-xs text-slate mb-1">Prioritised by demand and how close to page 1. CTR fixes and branded queries are excluded (those are Alejandra&apos;s technical lane).</p>
        <div>{(data?.writeNext || []).map((r, i) => <QueryRow key={i} q={r} />)}</div>
        {(!data?.writeNext || data.writeNext.length === 0) && <p className="text-slate text-xs py-3">No content opportunities surfaced for this range.</p>}
      </div>

      {/* Detailed sections */}
      <Section title="Questions people ask" subtitle="High-intent for AEO. Answer the question in the first two lines; LLMs cite direct answers." rows={data?.questions} />
      <Section title="Comparison & competitor queries" subtitle="Decision-stage. The buyer is comparing; a honest Leasey vs [X] piece captures them." rows={data?.comparisons} />
      <Section title="Striking distance" subtitle="Position 5-20. A focused piece or a boost to the existing page moves these up fast." rows={data?.striking} />
      <Section title="Untapped" subtitle="Real impressions, near-zero clicks. The content is too thin or missing for this exact query." rows={data?.untapped} />
      <Section title="Below page 2" subtitle="Demand exists but we rank low. Needs a dedicated cornerstone piece." rows={data?.belowPage2} />
      <Section title="CTR fixes (Alejandra's lane)" subtitle="Already ranking on page 1, but the title/meta is leaving clicks on the table. Not content work." rows={data?.ctrFixes} showAngle={false} />
    </div>
  );
}
