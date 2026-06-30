import { listDrafts, signalsMeta, listInsights, listCalendarSlots } from "@/lib/content";
import { Card, Stat } from "@/components/ui";
import Link from "next/link";
import { NAV_TABS, GROUP_ORDER, GROUP_LABELS } from "@/lib/navMeta";

export const dynamic = "force-dynamic";

const GROUP_BLURB: Record<string, string> = {
  Plan: "Decidir qué se va a escribir y mantener la vista del 90-day window.",
  Build: "Escribir, optimizar y dar forma a las piezas.",
  Analyse: "Medir, detectar oportunidades y seguir tendencias.",
  Publish: "Sacar el contenido al mundo.",
};

export default function Dashboard() {
  const drafts = listDrafts();
  const calendar = listCalendarSlots();
  const byChannel = drafts.reduce<Record<string, number>>((acc, d) => {
    acc[d.channel] = (acc[d.channel] || 0) + 1;
    return acc;
  }, {});
  const meta = signalsMeta();
  const insights = listInsights();
  const insightCounts = insights.reduce<Record<string, number>>((a, i) => { a[i.freshness] = (a[i.freshness] || 0) + 1; return a; }, {});
  const freshLabel = meta.freshness === "fresh" ? "Fresh" : meta.freshness === "aging" ? "Aging" : meta.freshness === "stale" ? "STALE" : "No date";
  const freshColor = meta.freshness === "fresh" ? "text-teal" : meta.freshness === "aging" ? "text-yellow-700" : meta.freshness === "stale" ? "text-red-600" : "text-slate";

  // Tabs por grupo, sin incluir el propio Dashboard
  const tabsByGroup = GROUP_ORDER.map((g) => ({
    group: g,
    tabs: NAV_TABS.filter((t) => t.group === g && t.href !== "/"),
  })).filter((g) => g.tabs.length > 0);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-ink">Content Dashboard</h1>
        <p className="text-slate text-sm mt-1">
          Estado general del sistema de contenido de Leasey.AI. Lee drafts, calendario, GSC y los publica/encola desde acá.
          Las tabs de abajo cubren las cuatro fases: planear, construir, analizar y publicar.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Calendar slots" value={calendar.length} accent />
        <Stat label="Drafts in output" value={drafts.length} />
        <Stat label="Active channels" value={Object.keys(byChannel).length} />
        <Stat label="Insights tracked" value={insights.length} />
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

      {/* Mapa del sistema: una card por cada tab, agrupadas por fase */}
      <div className="flex flex-col gap-6">
        {tabsByGroup.map(({ group, tabs }) => (
          <section key={group}>
            <div className="flex items-baseline gap-3 mb-3">
              <h2 className="text-sm font-semibold text-ink uppercase tracking-wide">{GROUP_LABELS[group]}</h2>
              <span className="text-xs text-slate">{GROUP_BLURB[group]}</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {tabs.map((t) => (
                <Link key={t.href} href={t.href} className="block group">
                  <div className="rounded-xl border border-line bg-white p-4 h-full flex flex-col gap-2 hover:border-ink/30 hover:shadow-sm transition-all">
                    <div className="flex items-center gap-2">
                      <span aria-hidden className="text-base">{t.icon}</span>
                      <h3 className="text-sm font-semibold text-ink">{t.label}</h3>
                      <span className="ml-auto text-xs text-slate group-hover:text-blue transition-colors">Abrir →</span>
                    </div>
                    <p className="text-xs text-slate leading-relaxed">{t.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Drafts by channel (mini-resumen) */}
      {Object.keys(byChannel).length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-ink mb-2">Drafts por canal</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5 text-sm">
            {Object.entries(byChannel)
              .sort((a, b) => b[1] - a[1])
              .map(([ch, n]) => (
                <div key={ch} className="flex items-center justify-between border-b border-line/50 py-1">
                  <span className="text-ink truncate">{ch}</span>
                  <span className="text-slate tabular-nums">{n}</span>
                </div>
              ))}
          </div>
        </Card>
      )}
    </div>
  );
}
