"use client";

import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n";
import { Card, Stat, Badge } from "@/components/ui";

type Row = { key: string; clicks: number; impressions: number; position: number; was?: number; delta?: number };
type Competitor = {
  name: string;
  tier: string;
  error: string | null;
  total: number;
  newCount: number | null;
  newPages: { url: string; lastmod: string }[];
};

interface Resp {
  available: string[];
  date?: string;
  window?: string;
  empty?: boolean;
  reason?: string;
  error?: string;
  isBaseline?: boolean;
  totals?: { clicks: number; impressions: number; queries: number };
  nearMiss?: Row[];
  diff?: {
    comparedWith: string;
    newQueries: Row[];
    lost: Row[];
    up: Row[];
    down: Row[];
    deltaClicks: number;
    deltaImpressions: number;
  } | null;
  competitors?: { date: string; comparedWith: string | null; byCompetitor: Competitor[] } | null;
}

function QueryTable({ rows, showDelta }: { rows: Row[]; showDelta?: boolean }) {
  if (!rows.length) return <p className="text-xs text-slate">Nothing in this category this week.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-slate border-b border-border">
            <th className="text-left font-medium py-1.5">Consulta</th>
            {showDelta && <th className="text-right font-medium">Movimiento</th>}
            <th className="text-right font-medium">Impr.</th>
            <th className="text-right font-medium">Clics</th>
            <th className="text-right font-medium">Pos</th>
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {rows.map((r) => (
            <tr key={r.key} className="border-b border-border/50">
              <td className="py-1.5 pr-3 text-ink">{r.key}</td>
              {showDelta && (
                <td className={`text-right ${(r.delta ?? 0) > 0 ? "text-teal" : "text-red-600"}`}>
                  {r.was} → {r.position} ({(r.delta ?? 0) > 0 ? "+" : ""}
                  {r.delta})
                </td>
              )}
              <td className="text-right text-slate">{r.impressions.toLocaleString()}</td>
              <td className="text-right text-slate">{r.clicks}</td>
              <td className="text-right text-slate">{r.position}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SignalsView() {
  const t = useT();
  const [data, setData] = useState<Resp | null>(null);
  const [date, setDate] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/signals${date ? `?date=${date}` : ""}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [date]);

  if (loading && !data) return <p className="text-sm text-slate">Loading signals…</p>;
  if (!data) return <p className="text-sm text-slate">Could not load signals.</p>;

  if (data.empty || !data.available.length) {
    return (
      <Card>
        <p className="text-sm text-slate leading-relaxed">{data.reason || "No snapshots yet."}</p>
      </Card>
    );
  }

  const d = data.diff;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">What moved</h1>
          <p className="text-slate text-sm mt-1">
            30-day window{data.window ? `, ${data.window}` : ""}.{" "}
            {d ? `Compared with the snapshot from ${d.comparedWith}.` : "No previous week to compare against."}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <label className="text-xs text-slate">Semana</label>
          <select
            value={date || data.available[0]}
            onChange={(e) => setDate(e.target.value)}
            className="text-xs bg-bg-soft border border-border rounded px-2 py-1.5 text-ink"
          >
            {data.available.map((w, i) => (
              <option key={w} value={w}>
                {w}
                {i === 0 ? t(" (latest)") : ""}
              </option>
            ))}
          </select>
          {data.available.length > 1 && (
            <span className="text-[11px] text-slate">{data.available.length} weeks stored</span>
          )}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <Stat label="Clics" value={data.totals?.clicks.toLocaleString() ?? "0"} accent />
        <Stat label="Impresiones" value={data.totals?.impressions.toLocaleString() ?? "0"} />
        <Stat label="Consultas" value={data.totals?.queries.toLocaleString() ?? "0"} />
        <Stat
          label="Clicks vs previous week"
          value={d ? `${d.deltaClicks > 0 ? "+" : ""}${d.deltaClicks}` : "—"}
        />
      </div>

      {data.isBaseline && (
        <Card>
          <p className="text-sm text-slate leading-relaxed">
            {t("This is the oldest snapshot there is, so there is nothing to compare it with. A total says nothing on its own: what matters is the movement, and movement needs two photos.")}
          </p>
        </Card>
      )}

      <Card>
        <div className="flex items-baseline gap-3 mb-2">
          <h2 className="text-sm font-semibold text-ink">Close, and getting no clicks</h2>
          <Badge label="most actionable" />
        </div>
        <p className="text-xs text-slate mb-3 leading-relaxed">
          {t("Position 5 to 20, over 100 impressions, two clicks or fewer. Google is already showing us and nobody clicks: that is a title and meta problem, not a content one.")}
        </p>
        <QueryTable rows={data.nearMiss || []} />
      </Card>

      {d && (
        <>
          <Card>
            <h2 className="text-sm font-semibold text-ink mb-2">Dropped three places or more</h2>
            <p className="text-xs text-slate mb-3 leading-relaxed">
              {t("Start here. A drop with volume behind it usually has a concrete cause, and sometimes it is us: a consolidation, a title change, a deleted page.")}
            </p>
            <QueryTable rows={d.down} showDelta />
          </Card>

          <Card>
            <h2 className="text-sm font-semibold text-ink mb-3">Rose three places or more</h2>
            <QueryTable rows={d.up} showDelta />
          </Card>

          <Card>
            <h2 className="text-sm font-semibold text-ink mb-2">New queries</h2>
            <p className="text-xs text-slate mb-3">
              {t("Appearing for the first time with 30 impressions or more. Google is testing us on something it was not before.")}
            </p>
            <QueryTable rows={d.newQueries} />
          </Card>

          <Card>
            <h2 className="text-sm font-semibold text-ink mb-2">Stopped appearing</h2>
            <p className="text-xs text-slate mb-3">
              {t("They had 50 impressions or more and now do not show. Could be seasonality, could be that we lost the page.")}
            </p>
            <QueryTable rows={d.lost} />
          </Card>
        </>
      )}

      {data.competitors && (
        <Card>
          <div className="flex items-baseline gap-3 mb-3">
            <h2 className="text-sm font-semibold text-ink">What competitors published</h2>
            <span className="text-[11px] text-slate">
              {data.competitors.comparedWith
                ? `desde el ${data.competitors.comparedWith}`
                : t("first snapshot, nothing to compare")}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {data.competitors.byCompetitor.map((c) => (
              <div key={c.name} className="border-l-2 border-border pl-3">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-sm font-medium text-ink">{c.name}</span>
                  <span className="text-[11px] text-slate">{c.tier}</span>
                  {c.error ? (
                    <span className="text-[11px] text-yellow-700">no se pudo leer su sitemap</span>
                  ) : (
                    <span className="text-[11px] text-slate">
                      {c.newCount === null
                        ? `${c.total} URLs recorded`
                        : `${c.newCount} nueva(s) de ${c.total}`}
                    </span>
                  )}
                </div>
                {c.newPages.slice(0, 5).map((p) => (
                  <a
                    key={p.url}
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-[11px] text-blue hover:text-blue-hover truncate"
                  >
                    {p.lastmod || t("no date")} · {p.url}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <h2 className="text-sm font-semibold text-ink mb-2">How to read this</h2>
        <p className="text-xs text-slate leading-relaxed">
          <strong>{t("No impressions means no position.")}</strong>{" "}
          {t("Google only calculates it where the page appeared, so a missing query is not in a bad position: it is a query we do not show up for at all.")}
        </p>
        <p className="text-xs text-slate leading-relaxed mt-2">
          <strong>{t("A drop is not necessarily our fault.")}</strong>{" "}
          {t("Before looking for the explanation in something we changed, check whether the whole block of similar queries dropped: that points at the market or the algorithm, not at the page.")}
        </p>
        <p className="text-xs text-slate leading-relaxed mt-2">
          <strong>{t("A competitor's new URL is not a signal that it works for them.")}</strong>{" "}
          {t("It says what they decided to talk about, which is a resource decision and does tell us something. Whether it pays off for them only shows with time.")}
        </p>
      </Card>
    </div>
  );
}
