import { listInsights, readFileMd } from "@/lib/content";
import { Card } from "@/components/ui";
import Markdown from "@/components/Markdown";
import ActionButton from "@/components/ActionButton";

export const dynamic = "force-dynamic";

export default function InsightsPage() {
  const insights = listInsights();
  const positioning = readFileMd("context/positioning.md");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Insights</h1>
          <p className="text-slate text-sm mt-1">Live research feeding the content. Keep it fresh, then turn an insight into a blog.</p>
        </div>
        <ActionButton action="refresh-insights" label="Search fresh insights" taskLabel="Search fresh insights" />
      </div>

      <div className="grid gap-3">
        {insights.map((ins) => (
          <Card key={ins.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-semibold text-blue">{ins.id} · {ins.section}</span>
                <h3 className="text-base font-bold text-ink">{ins.title}</h3>
              </div>
              <ActionButton action="write-blog" payload={{ insightId: ins.id }} label="Write blog" taskLabel={`Blog: ${ins.title.slice(0, 40)}`} variant="ghost" />
            </div>
            <div className="mt-2 text-sm">
              <Markdown md={ins.body.trim()} />
            </div>
          </Card>
        ))}
        {insights.length === 0 && <p className="text-slate text-sm">No insights yet. Click “Search fresh insights”.</p>}
      </div>

      <div>
        <h2 className="text-lg font-bold text-ink mb-2">Positioning pillars</h2>
        <Card>{positioning ? <Markdown md={positioning} /> : <p className="text-slate">No data.</p>}</Card>
      </div>
    </div>
  );
}
