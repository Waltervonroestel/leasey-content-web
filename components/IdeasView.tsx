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

type QueueRow = [string, string, string, string, string, string, string]; // date, title, angle, pillar, cluster, status, notes
type QueueResp = { connected: boolean; rows: QueueRow[] };
type QState = "idle" | "queuing" | "done" | "error";

const INTENT_COLOUR: Record<string, string> = {
  comparison: "bg-purple-50 text-purple-700 border-purple-200",
  question: "bg-blue-50 text-blue-700 border-blue-200",
  commercial: "bg-amber-50 text-amber-700 border-amber-200",
  local: "bg-green-50 text-green-700 border-green-200",
  branded: "bg-pink-50 text-pink-700 border-pink-200",
  informational: "bg-bg-soft text-slate border-line",
};

function IdeaCard({ q, qState, onQueue }: { q: IdeaQuery; qState: QState; onQueue: (q: IdeaQuery) => void }) {
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
      {!q.alreadyInCalendar && (
        <button
          onClick={() => onQueue(q)}
          disabled={qState === "queuing" || qState === "done"}
          className={`self-start text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
            qState === "done"
              ? "border-emerald-300 bg-emerald-50 text-emerald-700"
              : qState === "error"
              ? "border-red-300 bg-red-50 text-red-700"
              : "border-line bg-white text-ink hover:border-ink/40"
          }`}
        >
          {qState === "queuing" ? "Encolando…" : qState === "done" ? "En cola ✓" : qState === "error" ? "Error — reintentar" : "✍ Escribir en el sistema"}
        </button>
      )}
    </div>
  );
}

function Section({ title, rows, hint, max = 10, queueState, onQueue }: { title: string; rows: IdeaQuery[]; hint?: string; max?: number; queueState: Record<string, QState>; onQueue: (q: IdeaQuery) => void }) {
  if (!rows || rows.length === 0) return null;
  return (
    <Card>
      <SectionTitle>{title}</SectionTitle>
      {hint && <p className="text-xs text-slate mb-2">{hint}</p>}
      <div className="flex flex-col gap-2">
        {rows.slice(0, max).map((q, i) => <IdeaCard key={i} q={q} qState={queueState[q.query || ""] || "idle"} onQueue={onQueue} />)}
      </div>
    </Card>
  );
}

export default function IdeasView() {
  const [days, setDays] = useState<28 | 90>(90);
  const [data, setData] = useState<Resp | null>(null);
  const [queue, setQueue] = useState<QueueRow[]>([]);
  const [queueState, setQueueState] = useState<Record<string, QState>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/ideas?days=${days}`).then((r) => r.json()),
      fetch(`/api/drafts/queue`).then((r) => r.json()).catch(() => ({ rows: [] })),
    ]).then(([ideas, q]: [Resp, QueueResp]) => {
      setData(ideas);
      setQueue(q.rows || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [days]);

  async function queueItem(q: IdeaQuery) {
    const key = q.query || "";
    if (!key) return;
    setQueueState((s) => ({ ...s, [key]: "queuing" }));
    try {
      const r = await fetch("/api/drafts/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: q.query, angle: q.angle || "", pillar: "", cluster: q.bucket || "", notes: `${q.opp} · ${q.impressions} impr · pos ${q.position.toFixed(1)}` }),
      });
      if (!r.ok) throw new Error();
      const updated: QueueResp = await fetch("/api/drafts/queue").then((r) => r.json());
      setQueue(updated.rows || []);
      setQueueState((s) => ({ ...s, [key]: "done" }));
    } catch {
      setQueueState((s) => ({ ...s, [key]: "error" }));
    }
  }

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
          <p className="text-slate text-sm mt-1">
            Generadas desde la demanda real de GSC + gaps de pilar + solapamiento con el calendario. Dale a <span className="text-ink font-medium">Escribir en el sistema</span> para encolar una idea; luego corre <code className="text-[11px] bg-bg-soft px-1 py-0.5 rounded">node scripts/process-content-queue.mjs</code> en Claude Code.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-bg-soft rounded-lg p-0.5">
            {[28, 90].map((d) => (
              <button key={d} onClick={() => setDays(d as 28 | 90)} className={`text-xs px-2.5 py-1 rounded-md ${days === d ? "bg-white text-ink shadow-sm" : "text-slate"}`}>
                {d}d
              </button>
            ))}
          </div>
          <a href={`/api/export/ideas?days=${days}`} className="text-xs px-3 py-1.5 rounded-lg border border-line text-slate hover:text-ink hover:border-ink/40 transition-colors whitespace-nowrap">
            ⬇ CSV
          </a>
        </div>
      </div>

      {/* Cola de escritura */}
      {queue.length > 0 && (
        <Card>
          <SectionTitle>En cola para escribir ({queue.length})</SectionTitle>
          <p className="text-xs text-slate mb-2">Ideas que mandaste al sistema interno. Estado se actualiza al correr el script.</p>
          <div className="flex flex-col gap-1.5">
            {[...queue].reverse().slice(0, 12).map((r, i) => (
              <div key={i} className="flex items-center gap-3 flex-wrap text-xs border border-line rounded-lg px-3 py-2 bg-white">
                <span className="font-mono text-slate text-[10px]">{r[0]}</span>
                <span className="text-ink font-medium flex-1 min-w-0 truncate">{r[1]}</span>
                {r[4] && <span className="text-[10px] px-1.5 py-0.5 rounded bg-bg-soft text-slate">{r[4]}</span>}
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${(r[5] || "").toLowerCase() === "queued" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>{r[5] || "Queued"}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

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

      <Section title="Write these next (prioritised)" rows={data.writeNext || []} hint="Queries with real demand on the site and a clear pillar fit. Items marked “In calendar ✓” are already covered." max={12} queueState={queueState} onQueue={queueItem} />
      <Section title="Questions people ask (AEO opportunities)" rows={data.questions || []} hint="Question-shaped queries. Each becomes a research/answer post." max={10} queueState={queueState} onQueue={queueItem} />
      <Section title="Comparison & competitor queries" rows={data.comparisons || []} hint="Demand on vs-competitor terms. Decision-stage pieces." max={10} queueState={queueState} onQueue={queueItem} />
      <Section title="Untapped (high impressions, near-zero clicks)" rows={data.untapped || []} hint="Demand exists, but the site does not capture it. New piece OR title/meta rewrite of the existing page." max={10} queueState={queueState} onQueue={queueItem} />
    </div>
  );
}
