"use client";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import AnalysisSummary from "@/components/AnalysisSummary";

const PALETTE = ["#1f6feb", "#0ea5a4", "#2563eb", "#14b8a6", "#3b82f6", "#0891b2", "#60a5fa", "#5b6b7f", "#1659c7", "#0f766e"];
const RANGES = [7, 14, 28, 90];

type PageRow = { page: string; clicks: number; impressions: number; position: number };
type Cluster = { name: string; clicks: number; impressions: number; queryCount: number; avgPosition: number };

function shortenPath(p: string) {
  if (!p) return "(unknown)";
  const clean = p.replace(/^https?:\/\/[^/]+/, "").replace(/\/$/, "");
  if (clean === "") return "/ (home)";
  return clean.length > 26 ? clean.slice(0, 24) + "…" : clean;
}

function Donut({ data }: { data: { name: string; value: number }[] }) {
  if (data.length === 0)
    return <div className="h-full flex items-center justify-center text-xs text-slate">No data</div>;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2}>
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v) => (typeof v === "number" ? v.toLocaleString() : String(v))} contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid rgba(0,0,0,0.1)" }} />
        <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" layout="vertical" align="right" verticalAlign="middle" />
      </PieChart>
    </ResponsiveContainer>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="border border-line bg-white rounded-xl p-4 shadow-sm">
      <h3 className="font-semibold text-sm text-ink">{title}</h3>
      <p className="text-xs text-slate mb-2">{subtitle}</p>
      <div className="h-64">{children}</div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-line rounded-xl p-4">
      <div className="text-xs uppercase tracking-wide text-slate">{label}</div>
      <div className="text-2xl font-bold text-ink mt-1">{value}</div>
    </div>
  );
}

type TrendRow = { query?: string; impressions: number; clicks: number; position: number; imprDelta: number; clickDelta: number; posDelta: number };
function TrendCard({ title, subtitle, rows, positive }: { title: string; subtitle: string; rows: TrendRow[]; positive: boolean }) {
  return (
    <div className="border border-line bg-white rounded-xl p-4 shadow-sm">
      <h3 className="font-semibold text-sm text-ink">{title}</h3>
      <p className="text-xs text-slate mb-2">{subtitle}</p>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate text-xs border-b border-line">
            <th className="py-1">Query</th><th>Impr.</th><th>Δ Impr.</th><th>Pos</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-line/50">
              <td className="py-1.5 text-ink truncate max-w-[180px]">{r.query}</td>
              <td>{r.impressions.toLocaleString()}</td>
              <td className={positive ? "text-emerald-600" : "text-rose-600"}>{r.imprDelta >= 0 ? "+" : ""}{r.imprDelta.toLocaleString()}</td>
              <td>#{r.position.toFixed(1)}</td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan={4} className="py-3 text-slate text-xs">No data.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

type IntentCount = { intent: string; queries: number; impressions: number; clicks: number };

export default function Analytics() {
  const [days, setDays] = useState(28);
  const [data, setData] = useState<{ connected: boolean; rows?: PageRow[]; totals?: { clicks: number; impressions: number; ctr: number; avgPos: number } } | null>(null);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [other, setOther] = useState<{ impressions: number } | null>(null);
  const [intentCounts, setIntentCounts] = useState<IntentCount[]>([]);
  const [trends, setTrends] = useState<{ rising: TrendRow[]; declining: TrendRow[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/gsc?days=${days}`).then((r) => r.json()).then(setData).catch(() => setData({ connected: false })).finally(() => setLoading(false));
    fetch(`/api/gsc/clusters?days=90`).then((r) => r.json()).then((d) => { setClusters(d.clusters || []); setOther(d.other || null); }).catch(() => {});
    fetch(`/api/gsc/intel?days=${days}`).then((r) => r.json()).then((d) => { setIntentCounts(d.intentCounts || []); setTrends(d.trends || null); }).catch(() => {});
  }, [days]);

  if (loading && !data) return <p className="text-slate text-sm">Loading...</p>;

  if (data && data.connected === false) {
    return (
      <div className="bg-white border border-line rounded-xl p-6">
        <h2 className="text-lg font-bold text-ink mb-2">Connect Google Search Console</h2>
        <p className="text-slate text-sm mb-3">
          Once GSC is connected for leasey.ai, this page shows clicks, impressions, CTR and position, plus charts of
          which pages and topics perform best, so you know what content to write next.
        </p>
        <p className="text-slate text-sm">Set these env vars in Render (same OAuth2 flow as FastStrat SEO):</p>
        <ul className="text-xs text-slate mt-2 list-disc pl-5 space-y-1">
          <li><code>GOOGLE_CLIENT_ID</code>, <code>GOOGLE_CLIENT_SECRET</code>, <code>GOOGLE_REDIRECT_URI</code></li>
          <li><code>GOOGLE_REFRESH_TOKEN</code> (one-time OAuth consent)</li>
          <li><code>GSC_SITE_URL</code> = <code>sc-domain:leasey.ai</code> (or blog.leasey.ai)</li>
        </ul>
      </div>
    );
  }

  const rows = data?.rows || [];
  const totals = data?.totals;
  const withClicks = rows.filter((r) => r.clicks > 0).sort((a, b) => b.clicks - a.clicks);
  const topPages = withClicks.slice(0, 7).map((r) => ({ name: shortenPath(r.page), value: r.clicks }));
  const restClicks = withClicks.slice(7).reduce((s, r) => s + r.clicks, 0);
  if (restClicks > 0) topPages.push({ name: "others", value: restClicks });

  const clusterImpr = clusters.map((c) => ({ name: c.name, value: c.impressions }));
  if (other && other.impressions > 0) clusterImpr.push({ name: "other queries", value: other.impressions });
  const clusterClicks = clusters.filter((c) => c.clicks > 0).map((c) => ({ name: c.name, value: c.clicks }));
  const intentData = intentCounts.map((c) => ({ name: c.intent, value: c.impressions }));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-ink">Analytics</h1>
        <div className="flex gap-1">
          {RANGES.map((d) => (
            <button key={d} onClick={() => setDays(d)} className={`text-sm px-3 py-1.5 rounded-md ${days === d ? "bg-blue text-white" : "border border-line text-slate hover:bg-bg-2"}`}>
              {d}d
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Clicks" value={(totals?.clicks || 0).toLocaleString()} />
        <Stat label="Impressions" value={(totals?.impressions || 0).toLocaleString()} />
        <Stat label="CTR" value={`${((totals?.ctr || 0) * 100).toFixed(1)}%`} />
        <Stat label="Avg position" value={(totals?.avgPos || 0).toFixed(1)} />
      </div>

      {/* Análisis: qué significan los números, qué hacer y por qué */}
      <AnalysisSummary days={days} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Clicks by page" subtitle={`Last ${days} days · top pages`}>
          <Donut data={topPages} />
        </ChartCard>
        <ChartCard title="Demand by topic (impressions)" subtitle="Queries grouped by topic · 90 days">
          <Donut data={clusterImpr} />
        </ChartCard>
        <ChartCard title="Search intent mix" subtitle="Impressions by query intent · where the demand sits in the funnel">
          <Donut data={intentData} />
        </ChartCard>
      </div>

      {/* Trends: what is rising and declining */}
      {trends && (trends.rising.length > 0 || trends.declining.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TrendCard title="Rising queries" subtitle={`Impressions up vs the previous ${days} days`} rows={trends.rising} positive />
          <TrendCard title="Declining queries" subtitle={`Impressions down vs the previous ${days} days`} rows={trends.declining} positive={false} />
        </div>
      )}

      <div className="bg-white border border-line rounded-xl p-4">
        <h3 className="font-semibold text-sm text-ink mb-2">Topics by demand</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate text-xs border-b border-line">
              <th className="py-1">Topic</th><th>Impr.</th><th>Clicks</th><th>Queries</th><th>Avg pos</th>
            </tr>
          </thead>
          <tbody>
            {clusters.map((c) => (
              <tr key={c.name} className="border-b border-line/50">
                <td className="py-1.5 text-ink">{c.name}</td>
                <td>{c.impressions.toLocaleString()}</td>
                <td>{c.clicks.toLocaleString()}</td>
                <td>{c.queryCount}</td>
                <td>{c.avgPosition.toFixed(1)}</td>
              </tr>
            ))}
            {clusters.length === 0 && <tr><td colSpan={5} className="py-3 text-slate text-xs">No topic data yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
