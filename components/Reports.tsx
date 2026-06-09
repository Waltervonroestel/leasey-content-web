"use client";
import { useEffect, useState } from "react";
import { useJobs } from "./JobsProvider";

type Row = { query?: string; clicks: number; impressions: number; ctr: number; position: number };
type Data = { connected: boolean; strikingDistance?: Row[]; untapped?: Row[]; topByClicks?: Row[] };

function WriteBtn({ query }: { query: string }) {
  const { start } = useJobs();
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={async () => { await start("generate-post", `Blog: ${query.slice(0, 40)}`, { topic: query, voice: "blog", channel: "Blog" }); setDone(true); setTimeout(() => setDone(false), 2000); }}
      className="text-xs px-2 py-1 rounded bg-blue text-white hover:bg-blue-hover"
    >
      {done ? "Started" : "Write blog"}
    </button>
  );
}

function Table({ title, subtitle, rows }: { title: string; subtitle: string; rows: Row[] }) {
  return (
    <div className="bg-white border border-line rounded-xl p-4">
      <h3 className="font-semibold text-sm text-ink">{title}</h3>
      <p className="text-xs text-slate mb-2">{subtitle}</p>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate text-xs border-b border-line">
            <th className="py-1">Query</th><th>Impr.</th><th>Clicks</th><th>CTR</th><th>Pos</th><th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-line/50">
              <td className="py-1.5 text-ink">{r.query}</td>
              <td>{r.impressions.toLocaleString()}</td>
              <td>{r.clicks}</td>
              <td>{(r.ctr * 100).toFixed(1)}%</td>
              <td>{r.position.toFixed(1)}</td>
              <td className="text-right"><WriteBtn query={r.query || ""} /></td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan={6} className="py-3 text-slate text-xs">No rows.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

export default function Reports() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/gsc/opportunities?days=90`).then((r) => r.json()).then(setData).catch(() => setData({ connected: false })).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-slate text-sm">Loading...</p>;
  if (data && data.connected === false) {
    return (
      <div className="bg-white border border-line rounded-xl p-6">
        <h2 className="text-lg font-bold text-ink mb-2">Connect Google Search Console</h2>
        <p className="text-slate text-sm">
          With GSC connected, this page surfaces striking-distance queries (position 5 to 20) and untapped queries
          (high impressions, near-zero clicks). One click writes a blog targeting that query. See Analytics for the env vars.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Table title="Striking distance" subtitle="Position 5-20, 20+ impressions. Small wins move these up fast." rows={data?.strikingDistance || []} />
      <Table title="Untapped" subtitle="50+ impressions, 0-1 clicks. Title/meta or a dedicated post." rows={data?.untapped || []} />
      <Table title="Top by clicks" subtitle="What already works. Do not break it; expand the cluster." rows={data?.topByClicks || []} />
    </div>
  );
}
