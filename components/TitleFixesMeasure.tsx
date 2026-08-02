"use client";

import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n";
import { Card, Stat } from "@/components/ui";

interface Side {
  title: string;
  ctr: number;
  clicks: number;
  impressions: number;
  position: number;
}
interface Change {
  url: string;
  changedOn: string;
  daysSince: number;
  before: Side;
  after: Side;
  verdict: string;
  readable: boolean;
}
interface Resp {
  ready: boolean;
  snapshots: number;
  reason?: string;
  from?: string;
  to?: string;
  tracked?: number;
  changes?: Change[];
  readable?: number;
  working?: number;
  worse?: number;
}

// La API manda una clave estable, no una frase: así el veredicto se traduce sin
// que contar "los que funcionaron" dependa de la redacción.
const VERDICT: Record<string, string> = {
  "too-early": "too early to read",
  "low-volume": "not enough volume to read the CTR",
  "position-moved": "the page lost position, the CTR cannot be attributed to the title",
  works: "the new title works",
  worse: "the new title performs worse than the old one",
  "no-change": "no appreciable change",
};

const tone = (v: string) =>
  v === "works" ? "text-teal" : v === "worse" ? "text-red-600" : "text-slate";

export default function TitleFixesMeasure() {
  const t = useT();
  const [data, setData] = useState<Resp | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/title-fixes/measure")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (!data) return null;

  if (!data.ready) {
    return (
      <Card>
        <h2 className="text-sm font-semibold text-ink mb-2">{t("Did the titles we already changed work?")}</h2>
        <p className="text-sm text-slate leading-relaxed">{data.reason}</p>
        <p className="text-xs text-slate leading-relaxed mt-2">
          {t("Nobody has to flag anything by hand: each weekly snapshot stores the real title of the pages with the most impressions, so a change detects itself by comparing two weeks.")}
        </p>
      </Card>
    );
  }

  const changes = data.changes || [];

  return (
    <Card>
      <div className="flex items-baseline gap-3 mb-3 flex-wrap">
        <h2 className="text-sm font-semibold text-ink">{t("Did the titles we already changed work?")}</h2>
        <span className="text-[11px] text-slate">
          {data.tracked} {t("pages watched")} · {data.snapshots} {t("weeks, from")} {data.from} {t("to")} {data.to}
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-4 mb-4">
        <Stat label={t("Changes detected")} value={changes.length} accent />
        <Stat label={t("Readable now")} value={data.readable ?? 0} />
        <Stat label={t("Worked")} value={data.working ?? 0} />
        <Stat label={t("Performing worse")} value={data.worse ?? 0} />
      </div>

      {changes.length === 0 ? (
        <p className="text-sm text-slate leading-relaxed">
          {t("No title has changed between the stored snapshots. When you change one, it will show up here on its own.")}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {changes.map((c) => (
            <div key={c.url} className="border-l-2 border-border pl-3">
              <div className="flex items-baseline gap-2 flex-wrap">
                <a
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue hover:text-blue-hover truncate max-w-md"
                >
                  {c.url.replace(/^https?:\/\/[^/]+/, "")}
                </a>
                <span className="text-[11px] text-slate">
                  {t("changed on")} {c.changedOn}, {c.daysSince} {t("days ago")}
                </span>
                <span className={`text-[11px] font-medium ${tone(c.verdict)}`}>
                  {c.verdict === "too-early"
                    ? `${t("too early to read")}: ${c.daysSince}/14 ${t("days")}`
                    : t(VERDICT[c.verdict] || c.verdict)}
                </span>
              </div>

              <div className="mt-1.5 grid gap-1 md:grid-cols-2 text-[11px]">
                <div className="text-slate">
                  <span className="uppercase tracking-wide text-[10px]">{t("Before")}</span>
                  <p className="text-ink leading-snug">{c.before.title}</p>
                  <p className="tabular-nums">
                    CTR {c.before.ctr}% · {c.before.clicks} clicks of {c.before.impressions.toLocaleString()} ·
                    pos {c.before.position}
                  </p>
                </div>
                <div className="text-slate">
                  <span className="uppercase tracking-wide text-[10px]">{t("After")}</span>
                  <p className="text-ink leading-snug">{c.after.title}</p>
                  <p className="tabular-nums">
                    CTR {c.after.ctr}% · {c.after.clicks} clicks of {c.after.impressions.toLocaleString()} · pos{" "}
                    {c.after.position}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-[11px] text-slate leading-relaxed mt-4">
        <strong>{t("If the page also lost position, the CTR is not attributed to the title.")}</strong>{" "}
        {t("A different title and a different position are two changes at once, and there is no way to tell which moved the click. It takes 14 days for Google to reprocess and 200 impressions on each side for the difference to mean anything.")}
      </p>
    </Card>
  );
}
