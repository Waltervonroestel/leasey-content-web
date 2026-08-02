"use client";

import { useEffect, useState } from "react";
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
  if (!rows.length) return <p className="text-xs text-slate">Nada en esta categoría esta semana.</p>;
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

  if (loading && !data) return <p className="text-sm text-slate">Cargando señales…</p>;
  if (!data) return <p className="text-sm text-slate">No se pudieron cargar las señales.</p>;

  if (data.empty || !data.available.length) {
    return (
      <Card>
        <p className="text-sm text-slate leading-relaxed">{data.reason || "Todavía no hay instantáneas."}</p>
      </Card>
    );
  }

  const d = data.diff;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Qué se movió</h1>
          <p className="text-slate text-sm mt-1">
            Ventana de 30 días{data.window ? `, ${data.window}` : ""}.{" "}
            {d ? `Comparado con la instantánea del ${d.comparedWith}.` : "Sin semana anterior con la que comparar."}
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
                {i === 0 ? " (última)" : ""}
              </option>
            ))}
          </select>
          {data.available.length > 1 && (
            <span className="text-[11px] text-slate">{data.available.length} semanas guardadas</span>
          )}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <Stat label="Clics" value={data.totals?.clicks.toLocaleString() ?? "0"} accent />
        <Stat label="Impresiones" value={data.totals?.impressions.toLocaleString() ?? "0"} />
        <Stat label="Consultas" value={data.totals?.queries.toLocaleString() ?? "0"} />
        <Stat
          label="Clics vs semana anterior"
          value={d ? `${d.deltaClicks > 0 ? "+" : ""}${d.deltaClicks}` : "—"}
        />
      </div>

      {data.isBaseline && (
        <Card>
          <p className="text-sm text-slate leading-relaxed">
            Esta es la instantánea más antigua que hay, así que no tiene con qué compararse. Un total no dice
            nada por sí solo: lo que sirve es el movimiento, y el movimiento necesita dos fotos.
          </p>
        </Card>
      )}

      <Card>
        <div className="flex items-baseline gap-3 mb-2">
          <h2 className="text-sm font-semibold text-ink">Cerca y sin clics</h2>
          <Badge label="lo más accionable" />
        </div>
        <p className="text-xs text-slate mb-3 leading-relaxed">
          Posición 5 a 20, más de 100 impresiones, dos clics o menos. Google ya nos muestra y nadie entra: es
          problema de título y meta, no de contenido.
        </p>
        <QueryTable rows={data.nearMiss || []} />
      </Card>

      {d && (
        <>
          <Card>
            <h2 className="text-sm font-semibold text-ink mb-2">Bajaron tres puestos o más</h2>
            <p className="text-xs text-slate mb-3 leading-relaxed">
              Por aquí conviene empezar. Una caída con volumen suele tener causa concreta, y a veces somos
              nosotros: una consolidación, un cambio de título, una página borrada.
            </p>
            <QueryTable rows={d.down} showDelta />
          </Card>

          <Card>
            <h2 className="text-sm font-semibold text-ink mb-3">Subieron tres puestos o más</h2>
            <QueryTable rows={d.up} showDelta />
          </Card>

          <Card>
            <h2 className="text-sm font-semibold text-ink mb-2">Consultas nuevas</h2>
            <p className="text-xs text-slate mb-3">
              Aparecen por primera vez con 30 impresiones o más. Google nos prueba en algo que antes no.
            </p>
            <QueryTable rows={d.newQueries} />
          </Card>

          <Card>
            <h2 className="text-sm font-semibold text-ink mb-2">Dejaron de aparecer</h2>
            <p className="text-xs text-slate mb-3">
              Tenían 50 impresiones o más y ahora no salen. Puede ser estacionalidad, puede ser que perdimos la
              página.
            </p>
            <QueryTable rows={d.lost} />
          </Card>
        </>
      )}

      {data.competitors && (
        <Card>
          <div className="flex items-baseline gap-3 mb-3">
            <h2 className="text-sm font-semibold text-ink">Qué publicaron los competidores</h2>
            <span className="text-[11px] text-slate">
              {data.competitors.comparedWith
                ? `desde el ${data.competitors.comparedWith}`
                : "primera instantánea, sin comparación"}
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
                        ? `${c.total} URLs registradas`
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
                    {p.lastmod || "sin fecha"} · {p.url}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <h2 className="text-sm font-semibold text-ink mb-2">Cómo leer esto</h2>
        <p className="text-xs text-slate leading-relaxed">
          <strong>Sin impresiones no hay posición.</strong> Google solo la calcula donde la página apareció, así
          que una consulta ausente no está en mala posición: es una consulta donde no salimos.
        </p>
        <p className="text-xs text-slate leading-relaxed mt-2">
          <strong>Una caída no es necesariamente culpa nuestra.</strong> Antes de buscar la explicación en un
          cambio propio, mira si cayó todo el bloque de consultas parecidas: eso apunta al mercado o al
          algoritmo, no a la página.
        </p>
        <p className="text-xs text-slate leading-relaxed mt-2">
          <strong>Una URL nueva de un competidor no es una señal de que le funcione.</strong> Dice de qué han
          decidido hablar, que es una decisión de recursos y sí informa. Si les rinde, solo se sabe con tiempo.
        </p>
      </Card>
    </div>
  );
}
