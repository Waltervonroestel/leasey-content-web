import { listInsights, readFileMd, signalsMeta } from "@/lib/content";
import { Card } from "@/components/ui";
import Markdown from "@/components/Markdown";
import ActionButton from "@/components/ActionButton";

export const dynamic = "force-dynamic";

const COLORS: Record<string, string> = {
  fresh: "bg-teal/15 text-teal",
  aging: "bg-yellow-100 text-yellow-800",
  stale: "bg-red-100 text-red-700",
  undated: "bg-slate/10 text-slate",
};

function FreshnessBadge({ kind, ageDays }: { kind: string; ageDays?: number }) {
  const label =
    kind === "fresh" ? `Fresh${ageDays != null ? ` · ${ageDays}d` : ""}`
      : kind === "aging" ? `Aging${ageDays != null ? ` · ${ageDays}d` : ""}`
      : kind === "stale" ? `Stale${ageDays != null ? ` · ${ageDays}d` : ""}`
      : "No date";
  return <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${COLORS[kind]}`}>{label}</span>;
}

export default function InsightsPage() {
  const insights = listInsights();
  const positioning = readFileMd("context/positioning.md");
  const meta = signalsMeta();
  const counts = insights.reduce<Record<string, number>>((acc, i) => {
    acc[i.freshness] = (acc[i.freshness] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Insights</h1>
          <p className="text-slate text-sm mt-1">
            Live research feeding the content. <strong>Freshness is the #1 priority of the system.</strong> Refresh runs from Claude Code; new insights commit straight to this repo.
          </p>
        </div>
      </div>

      <Card className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <FreshnessBadge kind={meta.freshness} ageDays={meta.lastRefreshedAgeDays} />
          <span className="text-sm text-ink">Last refreshed: <code className="text-xs">{meta.lastRefreshed || "unknown"}</code></span>
        </div>
        <div className="flex gap-2 text-xs">
          {(["fresh", "aging", "stale", "undated"] as const).map((k) =>
            counts[k] ? (
              <span key={k} className="flex items-center gap-1">
                <FreshnessBadge kind={k} /> <span className="text-slate">{counts[k]}</span>
              </span>
            ) : null
          )}
        </div>
      </Card>

      <div className="grid gap-3">
        {insights.map((ins) => (
          <Card key={ins.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-semibold text-blue">{ins.id} · {ins.section}</span>
                  <FreshnessBadge kind={ins.freshness} ageDays={ins.ageDays} />
                  {ins.date && <span className="text-[11px] text-slate">{ins.date}</span>}
                </div>
                <h3 className="text-base font-bold text-ink mt-1">{ins.title}</h3>
              </div>
            </div>
            <div className="mt-2 text-sm">
              <Markdown md={ins.body.trim()} />
            </div>
          </Card>
        ))}
        {insights.length === 0 && <p className="text-slate text-sm">No insights yet. Click "Search fresh insights".</p>}
      </div>

      <div>
        <h2 className="text-lg font-bold text-ink mb-2">Positioning pillars</h2>
        <Card>{positioning ? <Markdown md={positioning} /> : <p className="text-slate">No data.</p>}</Card>
      </div>
    </div>
  );
}
