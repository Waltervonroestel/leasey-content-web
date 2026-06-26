import { listDrafts, signalsMeta, listInsights, listCalendarSlots } from "@/lib/content";
import { Card, Stat, SectionTitle } from "@/components/ui";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function Dashboard() {
  const drafts = listDrafts();
  const calendar = listCalendarSlots();
  const byChannel = drafts.reduce<Record<string, number>>((acc, d) => {
    acc[d.channel] = (acc[d.channel] || 0) + 1;
    return acc;
  }, {});
  const recent = drafts.slice(0, 6);
  const meta = signalsMeta();
  const insights = listInsights();
  const insightCounts = insights.reduce<Record<string, number>>((a, i) => { a[i.freshness] = (a[i.freshness] || 0) + 1; return a; }, {});
  const freshLabel = meta.freshness === "fresh" ? "Fresh" : meta.freshness === "aging" ? "Aging" : meta.freshness === "stale" ? "STALE" : "No date";
  const freshColor = meta.freshness === "fresh" ? "text-teal" : meta.freshness === "aging" ? "text-yellow-700" : meta.freshness === "stale" ? "text-red-600" : "text-slate";

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-ink">Content Dashboard</h1>
        <p className="text-slate text-sm mt-1">
          State of the Leasey.AI content system. Reads drafts, the calendar and insights from the repo. It does
          not publish: drafts are uploaded by hand.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Calendar slots" value={calendar.length} accent />
        <Stat label="Drafts in output" value={drafts.length} />
        <Stat label="Active channels" value={Object.keys(byChannel).length} />
        <Stat label="Insights tracked" value={listInsights().length} />
      </div>

      <Card className="flex items-center justify-between flex-wrap gap-3 border-l-4 border-l-blue">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wide text-slate">Data freshness · priority #1</span>
          <span className="text-sm text-ink mt-1">
            Signals last refreshed <strong>{meta.lastRefreshed || "unknown"}</strong>
            {meta.lastRefreshedAgeDays != null && <> · <span className={freshColor}>{freshLabel}</span> ({meta.lastRefreshedAgeDays}d ago)</>}
          </span>
          <span className="text-xs text-slate mt-1">
            Insights: <span className="text-teal">{insightCounts.fresh || 0} fresh</span> · <span className="text-yellow-700">{insightCounts.aging || 0} aging</span> · <span className="text-red-600">{insightCounts.stale || 0} stale</span> · <span className="text-slate">{insightCounts.undated || 0} undated</span>
          </span>
        </div>
        <Link href="/insights" className="text-sm text-blue hover:text-blue-hover whitespace-nowrap">Review insights →</Link>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <SectionTitle href="/calendar" cta="Open">Editorial calendar</SectionTitle>
          <p className="text-sm text-slate">The 95-piece calendar across 90 days, mapped to pillars, phases and Google Docs.</p>
        </Card>
        <Card>
          <SectionTitle href="/optimise" cta="Open">Optimise old content</SectionTitle>
          <p className="text-sm text-slate">723 published URLs with cluster, target pillar, suggested action and owner. Read-only.</p>
        </Card>
        <Card>
          <SectionTitle href="/ideas" cta="Open">New content ideas</SectionTitle>
          <p className="text-sm text-slate">GSC demand + pillar gaps turned into briefs. Suggestions only.</p>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <SectionTitle href="/reports" cta="View reports">What to write next</SectionTitle>
          <p className="text-sm text-slate">
            Reports reads every Search Console query, classifies it by intent and opportunity, and turns it into a
            concrete content recommendation. Start there to decide the next blog.
          </p>
        </Card>

        <Card>
          <SectionTitle href="/drafts" cta="View drafts">By channel</SectionTitle>
          <div className="flex flex-col gap-1.5 text-sm">
            {Object.entries(byChannel)
              .sort((a, b) => b[1] - a[1])
              .map(([ch, n]) => (
                <div key={ch} className="flex items-center justify-between">
                  <span className="text-ink">{ch}</span>
                  <span className="text-slate">{n}</span>
                </div>
              ))}
          </div>
        </Card>
      </div>

      <div>
        <SectionTitle href="/drafts" cta="All">Recent drafts</SectionTitle>
        <div className="grid md:grid-cols-2 gap-3">
          {recent.map((d) => (
            <Link key={d.file} href={`/drafts/${encodeURIComponent(d.file)}`}>
              <Card className="hover:border-blue/40 transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-ink truncate">{d.name}</span>
                  <span className="text-[11px] text-blue whitespace-nowrap">{d.channel}</span>
                </div>
                <p className="text-xs text-slate mt-1.5 line-clamp-2">{d.body.trim().slice(0, 140)}</p>
                <span className="text-[11px] text-slate mt-2 block">{d.dateFolder}</span>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
