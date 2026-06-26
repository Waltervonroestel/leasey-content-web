"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui";
import { PILLAR_META, pillarCodeFrom, type PillarCode } from "@/lib/pillarStyle";

// ── Types ────────────────────────────────────────────────────────────────────
type IdeaItem = {
  query: string;
  impressions: number;
  position?: number;
  alreadyInCalendar?: boolean;
  intent?: string;
  opp?: string;
  angle?: string;
  pillar?: string;
};
type IdeasResp = { writeNext?: IdeaItem[]; comparisons?: IdeaItem[]; questions?: IdeaItem[] };

type QueueRow = [string, string, string, string, string, string, string]; // date, title, angle, pillar, cluster, status, notes
type QueueResp = { connected: boolean; rows: QueueRow[] };

type QueueState = Record<string, "idle" | "queuing" | "done" | "error">;

// ── Pillar badge ─────────────────────────────────────────────────────────────
function PillarBadge({ pillar }: { pillar?: string }) {
  const code = pillarCodeFrom(pillar || "") as PillarCode;
  const m = PILLAR_META[code];
  return <span className={`text-[10px] px-1.5 py-0.5 rounded border ${m.border} ${m.bg} ${m.text} font-medium`}>{code === "—" ? "?" : `${code} ${m.short}`}</span>;
}

// ── Single idea card ─────────────────────────────────────────────────────────
function IdeaCard({ item, onQueue, qState }: { item: IdeaItem; onQueue: (item: IdeaItem) => void; qState: "idle" | "queuing" | "done" | "error" }) {
  return (
    <div className={`relative rounded-xl border bg-white p-4 flex flex-col gap-2 transition-shadow hover:shadow-sm ${item.alreadyInCalendar ? "opacity-60 border-line" : "border-line"}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-ink leading-snug flex-1">{item.query}</p>
        {item.alreadyInCalendar && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium whitespace-nowrap">In calendar ✓</span>
        )}
      </div>
      <div className="flex items-center gap-2 flex-wrap text-[11px]">
        {item.impressions > 0 && <span className="text-slate">{item.impressions.toLocaleString()} impr.</span>}
        {item.position && <span className="text-slate">pos {item.position.toFixed(1)}</span>}
        {item.intent && <span className="bg-slate-100 text-slate px-1.5 py-0.5 rounded">{item.intent}</span>}
        {item.opp && <span className="bg-blue/10 text-blue px-1.5 py-0.5 rounded">{item.opp}</span>}
        <PillarBadge pillar={item.pillar} />
      </div>
      {item.angle && <p className="text-xs text-slate italic leading-snug">{item.angle}</p>}
      {!item.alreadyInCalendar && (
        <button
          onClick={() => onQueue(item)}
          disabled={qState === "queuing" || qState === "done"}
          className={`mt-1 self-start text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
            qState === "done"
              ? "border-emerald-300 bg-emerald-50 text-emerald-700"
              : qState === "error"
              ? "border-red-300 bg-red-50 text-red-700"
              : "border-line bg-white text-ink hover:border-ink/40"
          }`}
        >
          {qState === "queuing" ? "Queuing…" : qState === "done" ? "Queued ✓" : qState === "error" ? "Error — retry" : "Write in content system"}
        </button>
      )}
    </div>
  );
}

// ── Queue history ─────────────────────────────────────────────────────────────
function QueueHistory({ rows }: { rows: QueueRow[] }) {
  if (rows.length === 0) return null;
  return (
    <section>
      <h2 className="text-sm font-semibold text-ink mb-3">Writing queue ({rows.length})</h2>
      <div className="flex flex-col gap-2">
        {[...rows].reverse().map((r, i) => (
          <div key={i} className="rounded-xl border border-line bg-white px-4 py-3 flex items-center gap-3 flex-wrap">
            <span className="text-[10px] font-mono text-slate">{r[0]}</span>
            <span className="text-sm text-ink font-medium flex-1 min-w-0 truncate">{r[1]}</span>
            {r[3] && <PillarBadge pillar={r[3]} />}
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${r[5] === "Queued" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>{r[5]}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function DraftsView() {
  const [ideas, setIdeas] = useState<IdeasResp | null>(null);
  const [queue, setQueue] = useState<QueueRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [queueState, setQueueState] = useState<QueueState>({});

  useEffect(() => {
    Promise.all([
      fetch("/api/ideas?days=90").then((r) => r.json()),
      fetch("/api/drafts/queue").then((r) => r.json()),
    ]).then(([ideasData, queueData]: [IdeasResp, QueueResp]) => {
      setIdeas(ideasData);
      setQueue(queueData.rows || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function queueItem(item: IdeaItem) {
    const key = item.query;
    setQueueState((s) => ({ ...s, [key]: "queuing" }));
    try {
      const r = await fetch("/api/drafts/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: item.query, angle: item.angle || "", pillar: item.pillar || "", cluster: item.intent || "", notes: `impr: ${item.impressions}, pos: ${item.position?.toFixed(1)}` }),
      });
      if (!r.ok) throw new Error();
      const updated: QueueResp = await fetch("/api/drafts/queue").then((r) => r.json());
      setQueue(updated.rows || []);
      setQueueState((s) => ({ ...s, [key]: "done" }));
    } catch {
      setQueueState((s) => ({ ...s, [key]: "error" }));
    }
  }

  const allIdeas = [
    ...(ideas?.writeNext || []),
    ...(ideas?.comparisons || []),
    ...(ideas?.questions || []),
  ];

  const notInCalendar = allIdeas.filter((i) => !i.alreadyInCalendar);
  const inCalendar = allIdeas.filter((i) => i.alreadyInCalendar);

  if (loading) return <p className="text-slate text-sm">Loading…</p>;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-ink">Drafts &amp; Writing Queue</h1>
        <p className="text-slate text-sm mt-1">
          Ideas from GSC that aren't yet in the calendar. Click "Write in content system" to queue them — the queue tab in the Calendar sheet tracks what needs to be written.
        </p>
      </div>

      <QueueHistory rows={queue} />

      {notInCalendar.length > 0 && (
        <section>
          <div className="flex items-baseline gap-3 mb-3">
            <h2 className="text-sm font-semibold text-ink">Ideas ready to write</h2>
            <span className="text-xs text-slate">{notInCalendar.length} not yet in calendar</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {notInCalendar.map((item, i) => (
              <IdeaCard key={i} item={item} onQueue={queueItem} qState={queueState[item.query] || "idle"} />
            ))}
          </div>
        </section>
      )}

      {inCalendar.length > 0 && (
        <section>
          <div className="flex items-baseline gap-3 mb-3">
            <h2 className="text-sm font-semibold text-ink">Already in calendar</h2>
            <span className="text-xs text-slate">{inCalendar.length} covered</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {inCalendar.map((item, i) => (
              <IdeaCard key={i} item={item} onQueue={queueItem} qState={queueState[item.query] || "idle"} />
            ))}
          </div>
        </section>
      )}

      {allIdeas.length === 0 && (
        <Card><p className="text-sm text-slate text-center py-6">No ideas loaded. Make sure GSC and Sheets are connected.</p></Card>
      )}
    </div>
  );
}
