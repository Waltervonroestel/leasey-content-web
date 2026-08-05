"use client";

import { useEffect, useState } from "react";

// Avisa una sola vez, arriba del panel, cuando el acceso a Google está caído.
//
// Sin esto, una credencial muerta se veía como quince pestañas rotas: cada
// vista fallaba por su cuenta, unas quedándose en "Cargando…" para siempre y
// otras con botones que no hacían nada. La causa era una sola y no aparecía en
// ninguna pantalla.
//
// Va en el layout y no dentro de cada vista a propósito: el mensaje es sobre la
// conexión, no sobre la pestaña que tengas abierta, y repetirlo quince veces lo
// convertiría en ruido que se ignora.

interface Health {
  connected?: boolean;
  kind?: string;
  action?: string;
  error?: string;
}

export default function GoogleAccessBanner() {
  const [state, setState] = useState<Health | null>(null);

  useEffect(() => {
    // El calendario es la lectura más barata que toca Sheets: si esa pasa, el
    // acceso está vivo.
    fetch("/api/calendar/full")
      .then((r) => r.json())
      .then((j) => setState(j))
      .catch(() => setState({ connected: false, error: "Could not reach the server." }));
  }, []);

  if (!state || state.connected !== false) return null;

  const isAuth = state.kind === "auth" || /invalid_grant|deleted|revoked/i.test(state.error || "");

  return (
    <div
      role="alert"
      className="border-b border-amber-300 bg-amber-50 text-amber-900 px-5 py-2.5 text-[13px] leading-relaxed"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-0.5">
        <strong>
          {isAuth
            ? "Google access is down, so everything that reads a sheet is empty right now."
            : "Google data could not be loaded."}
        </strong>
        <span className="text-amber-800">
          {isAuth
            ? "The account that issued the tokens no longer has access. Calendar, Ideas, Optimise, PR and the publish buttons will stay empty until GOOGLE_SHEETS_REFRESH_TOKEN and GOOGLE_REFRESH_TOKEN are reissued, here and in Render. This is not a bug in the pages."
            : state.error}
        </span>
      </div>
    </div>
  );
}
