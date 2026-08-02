"use client";

import { useEffect, useState } from "react";
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

const tone = (v: string) =>
  v === "el título nuevo funciona"
    ? "text-teal"
    : v.startsWith("el título nuevo rinde peor")
      ? "text-red-600"
      : "text-slate";

export default function TitleFixesMeasure() {
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
        <h2 className="text-sm font-semibold text-ink mb-2">¿Funcionaron los títulos que ya cambiamos?</h2>
        <p className="text-sm text-slate leading-relaxed">{data.reason}</p>
        <p className="text-xs text-slate leading-relaxed mt-2">
          Nadie tiene que marcar nada a mano: cada instantánea semanal guarda el título real de las páginas con
          más impresiones, así que un cambio se detecta solo comparando dos semanas.
        </p>
      </Card>
    );
  }

  const changes = data.changes || [];

  return (
    <Card>
      <div className="flex items-baseline gap-3 mb-3 flex-wrap">
        <h2 className="text-sm font-semibold text-ink">¿Funcionaron los títulos que ya cambiamos?</h2>
        <span className="text-[11px] text-slate">
          {data.tracked} páginas vigiladas · {data.snapshots} semanas, de {data.from} a {data.to}
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-4 mb-4">
        <Stat label="Cambios detectados" value={changes.length} accent />
        <Stat label="Ya legibles" value={data.readable ?? 0} />
        <Stat label="Funcionaron" value={data.working ?? 0} />
        <Stat label="Rinden peor" value={data.worse ?? 0} />
      </div>

      {changes.length === 0 ? (
        <p className="text-sm text-slate leading-relaxed">
          Ningún título ha cambiado entre las instantáneas guardadas. Cuando cambies uno, aparecerá aquí solo.
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
                  cambió el {c.changedOn}, hace {c.daysSince} días
                </span>
                <span className={`text-[11px] font-medium ${tone(c.verdict)}`}>{c.verdict}</span>
              </div>

              <div className="mt-1.5 grid gap-1 md:grid-cols-2 text-[11px]">
                <div className="text-slate">
                  <span className="uppercase tracking-wide text-[10px]">Antes</span>
                  <p className="text-ink leading-snug">{c.before.title}</p>
                  <p className="tabular-nums">
                    CTR {c.before.ctr}% · {c.before.clicks} clics de {c.before.impressions.toLocaleString()} ·
                    pos {c.before.position}
                  </p>
                </div>
                <div className="text-slate">
                  <span className="uppercase tracking-wide text-[10px]">Después</span>
                  <p className="text-ink leading-snug">{c.after.title}</p>
                  <p className="tabular-nums">
                    CTR {c.after.ctr}% · {c.after.clicks} clics de {c.after.impressions.toLocaleString()} · pos{" "}
                    {c.after.position}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-[11px] text-slate leading-relaxed mt-4">
        <strong>Si la página perdió posición, el CTR no se atribuye al título.</strong> Un título distinto y una
        posición distinta son dos cambios a la vez, y no se puede saber cuál movió el clic. Hacen falta 14 días
        para que Google reprocese y 200 impresiones en cada lado para que la diferencia signifique algo.
      </p>
    </Card>
  );
}
