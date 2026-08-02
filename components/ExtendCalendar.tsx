"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n";

// Extiende el calendario más allá de donde termina, proponiendo piezas nuevas
// a partir de demanda medida en Search Console.
//
// Igual que encolar: previa primero, escritura después. Aquí importa más,
// porque esto añade FILAS AL CALENDARIO, que es el documento que el equipo mira
// todos los días; una tanda equivocada no se deshace con un botón.

interface Piece {
  date: string;
  day: string;
  channel: string;
  voice: string;
  title: string;
  pillar: string;
  query: string;
  impressions: number;
  position: number;
  source?: string;
  covers?: string[];
}
interface Resp {
  ok?: boolean;
  error?: string;
  note?: string;
  from?: string;
  lastCalendarDate?: string;
  cadence?: string[];
  proposed?: Piece[];
  availableTopics?: number;
  exhausted?: boolean;
  warnings?: string[];
  written?: number;
  dryRun?: boolean;
}

export default function ExtendCalendar() {
  const t = useT();
  const [weeks, setWeeks] = useState(4);
  const [preview, setPreview] = useState<Resp | null>(null);
  const [done, setDone] = useState<Resp | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  async function call(dryRun: boolean) {
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/calendar/extend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weeks, dryRun }),
      });
      const j = (await r.json()) as Resp;
      if (!r.ok || j.error) setError(j.error || `Error ${r.status}`);
      else if (dryRun) {
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

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-blue hover:text-blue-hover self-start border-t border-line pt-3 w-full text-left"
      >
        + {t("Plan beyond the calendar (propose new pieces)")}
      </button>
    );
  }

  return (
    <div className="border-t border-line pt-3 flex flex-col gap-2">
      <div className="flex items-baseline gap-2 flex-wrap">
        <h3 className="text-sm font-semibold text-ink">{t("Plan beyond the calendar")}</h3>
        <span className="text-[11px] text-slate">
          {t("Topics come from Search Console demand and from what competitors and outlets published. Never invented.")}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap text-xs">
        <label className="text-slate">
          {t("Weeks to add")}:{" "}
          <input
            type="number"
            min={1}
            max={13}
            value={weeks}
            onChange={(e) => {
              setWeeks(Number(e.target.value));
              setPreview(null);
              setDone(null);
            }}
            className="w-14 border border-line rounded px-1.5 py-0.5 tabular-nums"
          />
        </label>
        <button
          onClick={() => call(true)}
          disabled={busy}
          className="text-xs px-3 py-1 rounded-full bg-blue text-white hover:bg-blue-hover disabled:opacity-50"
        >
          {busy ? t("Checking…") : t("Propose pieces")}
        </button>
      </div>

      {error && <p className="text-xs text-rose-600 leading-relaxed">{error}</p>}

      {preview && (
        <div className="flex flex-col gap-2">
          <p className="text-[11px] text-slate">
            {t("The calendar ends on")} {preview.lastCalendarDate} · {t("this starts on")} {preview.from}
          </p>
          {!!preview.cadence?.length && (
            <p className="text-[11px] text-slate">
              {t("Cadence inherited from the last four weeks")}: {preview.cadence.join(" · ")}
            </p>
          )}
          <p className="text-sm text-ink">
            <strong>{preview.proposed?.length ?? 0}</strong> {t("pieces proposed")} ·{" "}
            {preview.availableTopics} {t("topics with demand available")}
          </p>

          {/* Que la demanda se agote es un resultado, no un fallo: se dice en vez
              de rellenar con temas inventados. */}
          {preview.note && (
            <p className="text-[11px] text-amber-700 leading-relaxed">{preview.note}</p>
          )}

          {/* Lo que la vigilancia NO puede afirmar todavía: fuentes sin fecha,
              medios que bloquean el acceso. Callarlo haría pasar una foto
              parcial del sector por la foto completa. */}
          {(preview.warnings || []).map((w) => (
            <p key={w} className="text-[11px] text-amber-700 leading-relaxed">
              ⚠ {w}
            </p>
          ))}

          <ul className="flex flex-col gap-0.5 max-h-56 overflow-y-auto">
            {(preview.proposed || []).map((p) => (
              <li key={p.date + p.query} className="text-[11px] text-slate">
                <span className="font-mono tabular-nums">{p.date}</span> · {p.channel} ·{" "}
                <span className="text-ink">{p.query}</span>{" "}
                {/* De qué fuente sale, porque no significan lo mismo: GSC es una
                    consulta real de gente buscando; el sector es un par de
                    palabras que varias fuentes comparten. */}
                {p.source === "rivals" ? (
                  <span className="text-teal">
                    {t("sector")} · {(p.covers || []).length} {t("sources")}
                  </span>
                ) : (
                  <span className="tabular-nums opacity-70">
                    GSC · {p.impressions} impr · pos {p.position}
                  </span>
                )}
              </li>
            ))}
          </ul>

          {!!preview.proposed?.length && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => call(false)}
                disabled={busy}
                className="text-xs px-3 py-1 rounded-full bg-ink text-white hover:opacity-90 disabled:opacity-50"
              >
                {busy ? t("Adding…") : `${t("Add to the calendar")} (${preview.proposed.length})`}
              </button>
              <button onClick={() => setPreview(null)} className="text-xs text-slate hover:text-ink">
                {t("Cancel")}
              </button>
            </div>
          )}
        </div>
      )}

      {done && (
        <div className="flex flex-col gap-1">
          <p className="text-sm text-ink">
            ✓ <strong>{done.written ?? 0}</strong> {t("rows added to the calendar.")}
          </p>
          <p className="text-[11px] text-slate leading-relaxed">
            {t(
              "They land as Idea with a working title: the headline is decided by whoever writes the piece, with the brief in front of them.",
            )}
          </p>
        </div>
      )}
    </div>
  );
}
