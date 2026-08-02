"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n";
import ExtendCalendar from "@/components/ExtendCalendar";

// Botón para encolar de golpe lo que hay que escribir en una semana o un mes.
//
// Dos pasos a propósito: primero una vista previa que no toca nada, y solo
// después la escritura en la hoja. Encolar treinta piezas es fácil de pedir por
// error y molesto de deshacer a mano, y la vista previa es donde se ve que
// veinte de las treinta ya tenían documento.

type Scope = "this-week" | "next-week" | "this-month" | "next-month";

interface Item {
  title: string;
  date: string;
  channel?: string;
  reason?: string;
}
interface Resp {
  ok?: boolean;
  dryRun?: boolean;
  error?: string;
  note?: string;
  range?: { from: string; to: string; label: string };
  queued?: Item[];
  skipped?: Item[];
  command?: string;
}

const SCOPES: { id: Scope; label: string }[] = [
  { id: "this-week", label: "This week" },
  { id: "next-week", label: "Next week" },
  { id: "this-month", label: "This month" },
  { id: "next-month", label: "Next month" },
];

export default function QueueRange() {
  const t = useT();
  const [scope, setScope] = useState<Scope>("next-week");
  const [includeWritten, setIncludeWritten] = useState(false);
  const [preview, setPreview] = useState<Resp | null>(null);
  const [done, setDone] = useState<Resp | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function call(dryRun: boolean) {
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/calendar/queue-range", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope, dryRun, includeWritten }),
      });
      const j = (await r.json()) as Resp;
      if (!r.ok || j.error) {
        setError(j.error || `Error ${r.status}`);
      } else if (dryRun) {
        setPreview(j);
        setDone(null);
      } else {
        setDone(j);
        setPreview(null);
      }
    } catch {
      setError(t("Could not reach the server."));
    } finally {
      setBusy(false);
    }
  }

  const reset = () => {
    setPreview(null);
    setDone(null);
    setError("");
  };

  return (
    <div className="rounded-xl border border-line bg-white p-4 flex flex-col gap-3">
      <div className="flex items-baseline gap-3 flex-wrap">
        <h2 className="text-sm font-semibold text-ink">{t("Write new content")}</h2>
        <span className="text-[11px] text-slate">
          {t("Queues the pieces in that range so Claude Code writes them.")}
        </span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {SCOPES.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              setScope(s.id);
              reset();
            }}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
              scope === s.id
                ? "bg-ink text-white border-ink"
                : "bg-white text-slate border-line hover:border-ink/30 hover:text-ink"
            }`}
          >
            {t(s.label)}
          </button>
        ))}
        <button
          onClick={() => call(true)}
          disabled={busy}
          className="text-xs px-3 py-1 rounded-full bg-blue text-white hover:bg-blue-hover disabled:opacity-50 ml-1"
        >
          {busy ? t("Checking…") : t("See what would be queued")}
        </button>
      </div>

      {/* Las 91 filas del calendario ya tienen borrador, así que sin esto el
          botón encola cero. Va apagado porque encenderlo reescribe trabajo
          hecho, y eso se pide, no se hereda de la sesión anterior. */}
      <label className="flex items-center gap-1.5 text-[11px] text-slate cursor-pointer">
        <input
          type="checkbox"
          checked={includeWritten}
          onChange={(e) => {
            setIncludeWritten(e.target.checked);
            reset();
          }}
          className="accent-ink"
        />
        {t("Include pieces that already have a doc (rewrite them)")}
      </label>

      {error && <p className="text-xs text-rose-600">{error}</p>}

      {preview && (
        <div className="flex flex-col gap-2 border-t border-line pt-3">
          <p className="text-xs text-slate">
            {preview.range?.from} → {preview.range?.to}
          </p>

          {preview.note && <p className="text-sm text-slate leading-relaxed">{preview.note}</p>}

          {!!preview.queued?.length && (
            <>
              <p className="text-sm text-ink">
                <strong>{preview.queued.length}</strong> {t("pieces would be queued")}
              </p>
              <ul className="flex flex-col gap-0.5 max-h-52 overflow-y-auto">
                {preview.queued.map((q) => (
                  <li key={q.title + q.date} className="text-[11px] text-slate">
                    <span className="font-mono tabular-nums">{q.date}</span> · {q.channel} ·{" "}
                    <span className="text-ink">{q.title}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Lo saltado, con su motivo. Un total menor sin explicación se lee
              como un fallo del botón. */}
          {!!preview.skipped?.length && (
            <details className="text-[11px] text-slate">
              <summary className="cursor-pointer hover:text-ink">
                {preview.skipped.length} {t("skipped, and why")}
              </summary>
              <ul className="flex flex-col gap-0.5 mt-1 max-h-40 overflow-y-auto">
                {preview.skipped.map((s) => (
                  <li key={s.title + s.date}>
                    <span className="font-mono tabular-nums">{s.date}</span> · {s.title} —{" "}
                    <span className="italic">{t(s.reason || "")}</span>
                  </li>
                ))}
              </ul>
            </details>
          )}

          {!!preview.queued?.length && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => call(false)}
                disabled={busy}
                className="text-xs px-3 py-1 rounded-full bg-ink text-white hover:opacity-90 disabled:opacity-50"
              >
                {busy ? t("Queueing…") : `${t("Queue these")} ${preview.queued.length}`}
              </button>
              <button onClick={reset} className="text-xs text-slate hover:text-ink">
                {t("Cancel")}
              </button>
            </div>
          )}
        </div>
      )}

      <ExtendCalendar />

      {done && (
        <div className="flex flex-col gap-1.5 border-t border-line pt-3">
          <p className="text-sm text-ink">
            ✓ <strong>{done.queued?.length ?? 0}</strong> {t("pieces queued.")}
          </p>
          <p className="text-[11px] text-slate leading-relaxed">
            {t("The app does not write. Run this in Claude Code to produce the drafts:")}
          </p>
          <code className="text-[11px] font-mono bg-bg-soft px-2 py-1 rounded self-start">
            {done.command}
          </code>
        </div>
      )}
    </div>
  );
}
