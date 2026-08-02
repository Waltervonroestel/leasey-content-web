"use client";

import { useState } from "react";

interface Result {
  ok?: boolean;
  blocked?: boolean;
  needsConfirm?: boolean;
  expected?: string;
  status?: string;
  message?: string;
  error?: string;
  warnings?: string[];
  pending?: string[];
  post?: { id: number; link: string; status: string };
}

// Dos botones deliberadamente distintos. Borrador es reversible y no pregunta
// nada. Directo escribe en el sitio en vivo, así que pide confirmación
// escribiendo el título: un botón junto a otro se pulsa por error, y publicar
// no se deshace con un clic.
export default function PublishToWordPress({ sheetRow, title }: { sheetRow: number; title: string }) {
  const [busy, setBusy] = useState<"" | "draft" | "live">("");
  const [res, setRes] = useState<Result | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [typed, setTyped] = useState("");

  const send = async (live: boolean, confirm?: string) => {
    setBusy(live ? "live" : "draft");
    setRes(null);
    try {
      const r = await fetch("/api/wordpress/from-calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sheetRow, live, confirm }),
      });
      const j = (await r.json()) as Result;
      setRes(j);
      if (j.ok) setConfirming(false);
    } catch (e) {
      setRes({ error: (e as Error).message });
    } finally {
      setBusy("");
    }
  };

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => send(false)}
          disabled={busy !== ""}
          className="text-[11px] px-2 py-1 rounded border border-border text-slate hover:text-ink disabled:opacity-50"
        >
          {busy === "draft" ? "Creando…" : "→ Borrador en WordPress"}
        </button>
        <button
          onClick={() => setConfirming(true)}
          disabled={busy !== ""}
          className="text-[11px] px-2 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          Publicar en directo
        </button>
      </div>

      {confirming && (
        <div className="mt-2 p-2 rounded border border-red-200 bg-red-50/50">
          <p className="text-[11px] text-red-700 leading-relaxed">
            Publicar en directo no se deshace. Escribe el título para confirmar:
          </p>
          <p className="text-[10px] text-slate mt-1 mb-1 break-words">{title}</p>
          <div className="flex gap-2">
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="Pega el título aquí"
              className="flex-1 text-[11px] border border-border rounded px-2 py-1 bg-white text-ink"
            />
            <button
              onClick={() => send(true, typed)}
              disabled={typed.trim() !== title.trim() || busy !== ""}
              className="text-[11px] px-2 py-1 rounded bg-red-600 text-white disabled:opacity-40"
            >
              {busy === "live" ? "Publicando…" : "Publicar"}
            </button>
            <button
              onClick={() => {
                setConfirming(false);
                setTyped("");
              }}
              className="text-[11px] px-2 py-1 rounded border border-border text-slate"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {res?.blocked && (
        <div className="mt-2 p-2 rounded border border-yellow-300 bg-yellow-50/60">
          <p className="text-[11px] text-yellow-800 leading-relaxed">{res.message}</p>
          <ul className="mt-1">
            {(res.warnings || []).map((w) => (
              <li key={w} className="text-[11px] text-yellow-800">
                · {w}
              </li>
            ))}
          </ul>
        </div>
      )}

      {res?.ok && (
        <div className="mt-2 p-2 rounded border border-teal/40 bg-teal/5">
          <p className="text-[11px] text-ink">
            {res.status === "publish" ? "Publicado" : "Borrador creado"} ·{" "}
            <a href={res.post?.link} target="_blank" rel="noreferrer" className="text-blue hover:text-blue-hover">
              abrir en WordPress
            </a>
          </p>
          {(res.warnings || []).length > 0 && (
            <p className="text-[11px] text-yellow-700 mt-1">
              Con avisos abiertos: {(res.warnings || []).join(" · ")}
            </p>
          )}
          {(res.pending || []).length > 0 && (
            <div className="mt-1">
              <p className="text-[10px] uppercase tracking-wide text-slate">Sigue siendo manual</p>
              {(res.pending || []).map((p) => (
                <p key={p} className="text-[11px] text-slate">
                  · {p}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {res?.error && <p className="mt-2 text-[11px] text-red-600">{res.error}</p>}
    </div>
  );
}
