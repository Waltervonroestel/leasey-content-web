"use client";

import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n";
import { Card, Stat } from "@/components/ui";

interface Page {
  url: string;
  lastmod: string;
}
interface Row {
  name: string;
  kind: string;
  tier: string;
  error: string | null;
  total: number;
  newCount: number | null;
  updatedCount: number | null;
  newPages: Page[];
  updatedPages: Page[];
}
interface Resp {
  available: string[];
  date?: string;
  comparedWith?: string | null;
  isBaseline?: boolean;
  empty?: boolean;
  reason?: string;
  rows?: Row[];
  blocked?: string[];
  totalNew?: number;
}

export default function WatchView({ kind, title, blurb }: { kind?: string; title: string; blurb: string }) {
  const t = useT();
  const [data, setData] = useState<Resp | null>(null);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = new URLSearchParams();
    if (kind) q.set("kind", kind);
    if (date) q.set("date", date);
    setLoading(true);
    fetch(`/api/watch?${q}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [kind, date]);

  if (loading && !data) return <p className="text-sm text-slate">Cargando…</p>;
  if (!data) return null;

  if (data.empty) {
    return (
      <Card>
        <h2 className="text-sm font-semibold text-ink mb-2">{title}</h2>
        <p className="text-sm text-slate leading-relaxed">{data.reason}</p>
      </Card>
    );
  }

  const rows = data.rows || [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">{title}</h2>
          <p className="text-xs text-slate mt-0.5 max-w-2xl leading-relaxed">{blurb}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <label className="text-xs text-slate">{t("Snapshot")}</label>
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
          <span className="text-[11px] text-slate">{data.available.length} {t("stored")}</span>
        </div>
      </div>

      {data.isBaseline ? (
        <Card>
          <p className="text-sm text-slate leading-relaxed">
            {t("This is the oldest snapshot, so there is nothing to compare it with. What you see are the recorded totals, not new publications.")}
          </p>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-3">
          <Stat label="New pieces" value={data.totalNew ?? 0} accent />
          <Stat label={t("Compared with")} value={data.comparedWith || "—"} />
          <Stat label="Could not read" value={(data.blocked || []).length} />
        </div>
      )}

      <div className="flex flex-col gap-3">
        {rows.map((r) => (
          <Card key={r.name}>
            <div className="flex items-baseline gap-2 flex-wrap mb-2">
              <span className="text-sm font-medium text-ink">{r.name}</span>
              <span className="text-[11px] text-slate">{r.tier}</span>
              {r.error ? (
                <span className="text-[11px] text-yellow-700">{r.error}</span>
              ) : (
                <span className="text-[11px] text-slate">
                  {r.newCount === null
                    ? `${r.total.toLocaleString()} URLs recorded`
                    : `${r.newCount} ${t("new")}${r.updatedCount ? `, ${r.updatedCount} ${t("updated")}` : ""} · ${r.total.toLocaleString()} ${t("in total")}`}
                </span>
              )}
            </div>

            {r.error && (
              <p className="text-[11px] text-slate leading-relaxed">
                {t("We could not read it, which is not the same as them not publishing. Worth a manual check.")}
              </p>
            )}

            {r.newPages.map((p) => (
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

            {r.updatedPages.length > 0 && (
              <div className="mt-2 pt-2 border-t border-border/50">
                <p className="text-[10px] uppercase tracking-wide text-slate mb-1">
                  Updated: reoptimising something that already ranks for them
                </p>
                {r.updatedPages.map((p) => (
                  <a
                    key={p.url}
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-[11px] text-slate hover:text-ink truncate"
                  >
                    {p.lastmod} · {p.url}
                  </a>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
