"use client";

import { useEffect, useState } from "react";
import { Card, Badge } from "@/components/ui";

interface Match {
  date: string;
  title: string;
  channel: string;
  track: string;
  docLink: string;
  best: { outlet: string; tier: string; score: number; why: string[] }[];
  note: string | null;
}
interface Idea {
  topic: string;
  outlets: string[];
  queries: { q: string; impressions: number; position: number }[];
}
interface Outlet {
  name: string;
  tier: string;
  error: string | null;
  total: number;
  topics: { topic: string; n: number }[];
}
interface Resp {
  connected: boolean;
  outlets?: Outlet[];
  matches?: Match[];
  ideas?: Idea[];
}

export default function PRMatchView() {
  const [data, setData] = useState<Resp | null>(null);
  const [tab, setTab] = useState<"match" | "write">("match");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pr/match")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-slate">Cruzando calendario y medios…</p>;
  if (!data?.connected)
    return (
      <Card>
        <p className="text-sm text-slate">
          Todavía no hay instantánea de medios. El cron la genera cada lunes.
        </p>
      </Card>
    );

  const matches = data.matches || [];
  const ideas = data.ideas || [];
  const readable = (data.outlets || []).filter((o) => !o.error);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setTab("match")}
          className={`text-xs px-3 py-1.5 rounded border ${tab === "match" ? "border-blue text-blue" : "border-border text-slate"}`}
        >
          A qué medio va cada anuncio ({matches.length})
        </button>
        <button
          onClick={() => setTab("write")}
          className={`text-xs px-3 py-1.5 rounded border ${tab === "write" ? "border-blue text-blue" : "border-border text-slate"}`}
        >
          Qué deberíamos escribir ({ideas.length})
        </button>
      </div>

      {tab === "match" && (
        <>
          <Card>
            <h3 className="text-sm font-semibold text-ink mb-2">De qué viene hablando cada medio</h3>
            <p className="text-xs text-slate mb-3 leading-relaxed">
              Deducido de sus propias URLs recientes, no de una taxonomía nuestra. Es el dato que falta cuando se
              escribe un pitch: se manda el mismo texto a los cinco medios y no entra en ninguno.
            </p>
            {readable.map((o) => (
              <div key={o.name} className="flex items-baseline gap-2 flex-wrap py-1 border-b border-border/40">
                <span className="text-xs font-medium text-ink w-40">{o.name}</span>
                <span className="text-[11px] text-slate">
                  {o.topics.map((t) => `${t.topic} (${t.n})`).join(" · ")}
                </span>
              </div>
            ))}
            {(data.outlets || []).filter((o) => o.error).length > 0 && (
              <p className="text-[11px] text-slate mt-3 leading-relaxed">
                {(data.outlets || []).filter((o) => o.error).map((o) => o.name).join(", ")} bloquean el acceso
                automatizado. No se pudo leer, que no es lo mismo que no publicar.
              </p>
            )}
          </Card>

          <div className="flex flex-col gap-2">
            {matches.map((m) => (
              <Card key={`${m.date}-${m.title}`}>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-[11px] text-slate tabular-nums">{m.date}</span>
                  <span className="text-[11px] text-slate">{m.channel}</span>
                  <a
                    href={m.docLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-ink hover:text-blue flex-1 min-w-0"
                  >
                    {m.title}
                  </a>
                </div>
                {m.note ? (
                  <p className="text-[11px] text-yellow-700 mt-1 leading-relaxed">{m.note}</p>
                ) : (
                  <div className="flex gap-2 flex-wrap mt-1.5">
                    {m.best.map((b) => (
                      <span key={b.outlet} className="text-[11px] text-slate">
                        <span className="text-teal font-medium">{b.outlet}</span> · {b.why.join(", ")}
                      </span>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </>
      )}

      {tab === "write" && (
        <>
          <Card>
            <div className="flex items-baseline gap-2 mb-2">
              <h3 className="text-sm font-semibold text-ink">Qué deberíamos escribir</h3>
              <Badge label="dos señales a la vez" />
            </div>
            <p className="text-xs text-slate leading-relaxed">
              Solo aparecen los temas donde <strong>coinciden dos cosas</strong>: un medio viene publicando sobre
              ello, y la gente lo busca con demanda medida en Search Console. Una sola de las dos no basta. Que un
              medio trate un tema no lo convierte en tema nuestro, y una consulta con volumen donde nadie del
              sector escribe suele ser una consulta de otra categoría.
            </p>
          </Card>

          {ideas.length === 0 ? (
            <Card>
              <p className="text-sm text-slate leading-relaxed">
                Ningún tema cumple las dos condiciones ahora mismo. Con una sola instantánea de medios el perfil
                temático es pobre; mejora en cuanto haya varias semanas.
              </p>
            </Card>
          ) : (
            ideas.map((i) => (
              <Card key={i.topic}>
                <div className="flex items-baseline gap-2 flex-wrap mb-2">
                  <span className="text-sm font-medium text-ink">{i.topic}</span>
                  <span className="text-[11px] text-slate">publican: {i.outlets.join(", ")}</span>
                </div>
                <table className="w-full text-[11px] tabular-nums">
                  <thead>
                    <tr className="text-slate border-b border-border">
                      <th className="text-left font-medium py-1">Consulta con demanda</th>
                      <th className="text-right font-medium">Impr.</th>
                      <th className="text-right font-medium">Pos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {i.queries.map((q) => (
                      <tr key={q.q} className="border-b border-border/40">
                        <td className="py-1 text-ink">{q.q}</td>
                        <td className="text-right text-slate">{q.impressions.toLocaleString()}</td>
                        <td className="text-right text-slate">{q.position}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            ))
          )}
        </>
      )}
    </div>
  );
}
