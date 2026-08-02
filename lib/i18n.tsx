"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Selector de idioma para el panel.
//
// El inglés es la base y la clave del diccionario es la propia frase en inglés,
// no un identificador tipo "signals.nearMiss.title". Dos razones:
//
//   1. Una clave inventada obliga a mantener dos sitios sincronizados y a que
//      quien lee el JSX no sepa qué dice la pantalla.
//   2. Si falta la traducción, se ve la frase en inglés y no "signals.title",
//      que es lo que ocurre en la mitad de los paneles con i18n a medio migrar.
//
// Migrar es incremental: una cadena sin entrada en el diccionario simplemente
// sale en inglés, que es un estado correcto y no un error visible.

export type Locale = "en" | "es";

const ES: Record<string, string> = {
  // Signals
  "What moved": "Qué se movió",
  "30-day window": "Ventana de 30 días",
  "Compared with the snapshot from": "Comparado con la instantánea del",
  "No previous week to compare against.": "Sin semana anterior con la que comparar.",
  "Close, and getting no clicks": "Cerca y sin clics",
  "most actionable": "lo más accionable",
  "Position 5 to 20, over 100 impressions, two clicks or fewer. Google is already showing us and nobody clicks: that is a title and meta problem, not a content one.":
    "Posición 5 a 20, más de 100 impresiones, dos clics o menos. Google ya nos muestra y nadie entra: es problema de título y meta, no de contenido.",
  "Dropped three places or more": "Bajaron tres puestos o más",
  "Start here. A drop with volume behind it usually has a concrete cause, and sometimes it is us: a consolidation, a title change, a deleted page.":
    "Por aquí conviene empezar. Una caída con volumen suele tener causa concreta, y a veces somos nosotros: una consolidación, un cambio de título, una página borrada.",
  "Rose three places or more": "Subieron tres puestos o más",
  "New queries": "Consultas nuevas",
  "Appearing for the first time with 30 impressions or more. Google is testing us on something it was not before.":
    "Aparecen por primera vez con 30 impresiones o más. Google nos prueba en algo que antes no.",
  "Stopped appearing": "Dejaron de aparecer",
  "They had 50 impressions or more and now do not show. Could be seasonality, could be that we lost the page.":
    "Tenían 50 impresiones o más y ahora no salen. Puede ser estacionalidad, puede ser que perdimos la página.",
  "What competitors published": "Qué publicaron los competidores",
  "How to read this": "Cómo leer esto",
  "Loading signals…": "Cargando señales…",
  "Could not load signals.": "No se pudieron cargar las señales.",
  "No snapshots yet.": "Todavía no hay instantáneas.",
  Week: "Semana",
  "(latest)": "(última)",
  "weeks stored": "semanas guardadas",
  Clicks: "Clics",
  Impressions: "Impresiones",
  Queries: "Consultas",
  "Clicks vs previous week": "Clics vs semana anterior",
  Query: "Consulta",
  Movement: "Movimiento",
  "Nothing in this category this week.": "Nada en esta categoría esta semana.",
  "This is the oldest snapshot there is, so there is nothing to compare it with. A total says nothing on its own: what matters is the movement, and movement needs two photos.":
    "Esta es la instantánea más antigua que hay, así que no tiene con qué compararse. Un total no dice nada por sí solo: lo que sirve es el movimiento, y el movimiento necesita dos fotos.",

  // Watch
  Snapshot: "Instantánea",
  stored: "guardadas",
  "New pieces": "Piezas nuevas",
  "Compared with": "Comparado con",
  "Could not read": "Sin poder leer",
  "URLs recorded": "URLs registradas",
  new: "nuevas",
  updated: "actualizadas",
  "in total": "en total",
  "Updated: reoptimising something that already ranks for them":
    "Actualizadas: están reoptimizando algo que ya les rankea",
  "Loading…": "Cargando…",
  "no date": "sin fecha",
  "We could not read it, which is not the same as them not publishing. Worth a manual check.":
    "No se pudo leer, que no es lo mismo que no haber publicado. Habría que revisarlo a mano.",
  "This is the oldest snapshot, so there is nothing to compare it with. What you see are the recorded totals, not new publications.":
    "Esta es la instantánea más antigua, así que no hay con qué compararla. Lo que ves son los totales registrados, no publicaciones nuevas.",

  // PR
  "Which outlet fits each announcement": "A qué medio va cada anuncio",
  "What we should write": "Qué deberíamos escribir",
  "What each outlet has been covering": "De qué viene hablando cada medio",
  "two signals at once": "dos señales a la vez",
  "publishing on it:": "publican:",
  "Query with demand": "Consulta con demanda",
  "Cross-referencing calendar and outlets…": "Cruzando calendario y medios…",
  "No outlet snapshot yet. The weekly cron generates it every Monday.":
    "Todavía no hay instantánea de medios. El cron la genera cada lunes.",
  "Derived from their own recent URLs, not from a taxonomy we imposed. This is the fact missing when someone writes a pitch: the same text goes to all five outlets and lands nowhere.":
    "Deducido de sus propias URLs recientes, no de una taxonomía nuestra. Es el dato que falta cuando se escribe un pitch: se manda el mismo texto a los cinco medios y no entra en ninguno.",
  "Only topics where two things agree: an outlet is publishing on it, and people search for it with measured demand in Search Console. Either one alone is not enough. An outlet covering a topic does not make it ours, and a query with volume that nobody in the sector writes about is usually a query from another category.":
    "Solo aparecen los temas donde coinciden dos cosas: un medio viene publicando sobre ello, y la gente lo busca con demanda medida en Search Console. Una sola de las dos no basta. Que un medio trate un tema no lo convierte en tema nuestro, y una consulta con volumen donde nadie del sector escribe suele ser una consulta de otra categoría.",
  "No topic meets both conditions right now. With a single outlet snapshot the topic profile is thin; it improves once there are several weeks.":
    "Ningún tema cumple las dos condiciones ahora mismo. Con una sola instantánea de medios el perfil temático es pobre; mejora en cuanto haya varias semanas.",
  "block automated access. We could not read them, which is not the same as them not publishing.":
    "bloquean el acceso automatizado. No se pudo leer, que no es lo mismo que no publicar.",

  // WordPress
  "→ Draft in WordPress": "→ Borrador en WordPress",
  "Publish live": "Publicar en directo",
  "Creating…": "Creando…",
  "Publishing…": "Publicando…",
  Publish: "Publicar",
  Cancel: "Cancelar",
  "Paste the title here": "Pega el título aquí",
  "Draft created": "Borrador creado",
  Published: "Publicado",
  "open in WordPress": "abrir en WordPress",
  "With open warnings:": "Con avisos abiertos:",
  "Still manual": "Sigue siendo manual",
  "No Google Doc linked: nothing to publish.": "Sin Google Doc enlazado: no hay qué publicar.",
  "Publishing live does not undo. Type the title to confirm:":
    "Publicar en directo no se deshace. Escribe el título para confirmar:",

  // Title fixes
  "Did the titles we already changed work?": "¿Funcionaron los títulos que ya cambiamos?",
  "Changes detected": "Cambios detectados",
  "Readable now": "Ya legibles",
  Worked: "Funcionaron",
  "Performing worse": "Rinden peor",
  "pages watched": "páginas vigiladas",
  Before: "Antes",
  After: "Después",
  "changed on": "cambió el",
  "days ago": "días atrás",
  "clicks of": "clics de",
  "Nobody has to flag anything by hand: each weekly snapshot stores the real title of the pages with the most impressions, so a change detects itself by comparing two weeks.":
    "Nadie tiene que marcar nada a mano: cada instantánea semanal guarda el título real de las páginas con más impresiones, así que un cambio se detecta solo comparando dos semanas.",
  "No title has changed between the stored snapshots. When you change one, it will show up here on its own.":
    "Ningún título ha cambiado entre las instantáneas guardadas. Cuando cambies uno, aparecerá aquí solo.",
  "If the page also lost position, the CTR is not attributed to the title.":
    "Si la página perdió posición, el CTR no se atribuye al título.",
  "A different title and a different position are two changes at once, and there is no way to tell which moved the click. It takes 14 days for Google to reprocess and 200 impressions on each side for the difference to mean anything.":
    "Un título distinto y una posición distinta son dos cambios a la vez, y no se puede saber cuál movió el clic. Hacen falta 14 días para que Google reprocese y 200 impresiones en cada lado para que la diferencia signifique algo.",
  "weeks, from": "semanas, de",
  to: "a",
  days: "días",
  "too early to read": "demasiado pronto para leerlo",
  "not enough volume to read the CTR": "sin volumen suficiente para leer el CTR",
  "the page lost position, the CTR cannot be attributed to the title":
    "la página perdió posición, el CTR no se puede atribuir al título",
  "the new title works": "el título nuevo funciona",
  "the new title performs worse than the old one": "el título nuevo rinde peor que el anterior",
  "no appreciable change": "sin cambio apreciable",

  // Segunda pasada
  " (latest)": " (última)",
  "first snapshot, nothing to compare": "primera instantánea, sin comparación",
  "No impressions means no position.": "Sin impresiones no hay posición.",
  "Google only calculates it where the page appeared, so a missing query is not in a bad position: it is a query we do not show up for at all.":
    "Google solo la calcula donde la página apareció, así que una consulta ausente no está en mala posición: es una consulta donde no salimos.",
  "A drop is not necessarily our fault.": "Una caída no es necesariamente culpa nuestra.",
  "Before looking for the explanation in something we changed, check whether the whole block of similar queries dropped: that points at the market or the algorithm, not at the page.":
    "Antes de buscar la explicación en un cambio propio, mira si cayó todo el bloque de consultas parecidas: eso apunta al mercado o al algoritmo, no a la página.",
  "A competitor's new URL is not a signal that it works for them.":
    "Una URL nueva de un competidor no es una señal de que le funcione.",
  "It says what they decided to talk about, which is a resource decision and does tell us something. Whether it pays off for them only shows with time.":
    "Dice de qué han decidido hablar, que es una decisión de recursos y sí informa. Si les rinde, solo se sabe con tiempo.",

  // Alerts
  Spike: "Subida",
  Drop: "Caída",
  Drops: "Caídas",
  Action: "Acción",
  "Detecting anomalies…": "Detectando anomalías…",
  "Weekly detection of searches that rose or fell abnormally against the recent average.":
    "Detección semanal de búsquedas que subieron o cayeron de forma anormal frente al promedio reciente.",
  "No history yet — the first weekly snapshot runs every Monday at 12:00 UTC. For now you see a placeholder with the most visible queries.":
    "Aún no hay historial — el primer snapshot semanal corre cada lunes 12:00 UTC. Por ahora ves un placeholder con las queries más visibles.",
  "Average position": "Posición media",
  "Impressions over time": "Evolución de impresiones",
  last: "últimos",
  "No significant anomalies this week.": "No hay anomalías significativas esta semana.",

  // Analysis
  "What it means": "Qué significa",
  "What to do": "Qué hacer",
  Why: "Por qué",
  "Analysing the search data…": "Analizando los datos de búsqueda…",
  "Reading for the period": "Lectura del período",
  "Fixing titles": "Arreglando títulos",
  "What to do with these numbers, in priority order":
    "Qué hacer con estos números, en orden de prioridad",

  // Competitors
  "What are competitors and outlets publishing?": "¿Qué publican competidores y medios?",
  "Latest posts from competitors (TurboTenant, Rent Manager, Zumper, RentCafe/Yardi) and proptech, PM trade press and Canadian RE outlets. Feeds are cached for one hour; use Search now to force a fresh fetch. Some competitors (AppFolio, Buildium, DoorLoop) no longer expose a public RSS feed.":
    "Últimas publicaciones de competidores (TurboTenant, Rent Manager, Zumper, RentCafe/Yardi) y medios proptech, PM trade press y Canadian RE. Los feeds se cachean una hora; usa Buscar ahora para forzar fetch fresco. Algunos competidores (AppFolio, Buildium, DoorLoop) ya no exponen RSS público.",
  "Search by title, content or outlet…": "Buscar por título, contenido o medio…",
  "Sources being read": "Fuentes que se están leyendo",

  // Optimise
  "with their decision, work type and cluster. Source: the Clusterización 2026 sheet, the one the team maintains.":
    "con su decisión, tipo de trabajo y cluster. Fuente: la hoja de Clusterización 2026, la que mantiene el equipo.",
  "pages to rewrite, ordered by the clicks they already bring":
    "páginas para reescribir, ordenadas por clics que ya traen",

  // PR / Insights
  "Find new publication sites": "Buscar nuevos sitios de publicación",
  "New publication sites found with AI and saved to the PR Log.":
    "Nuevos sitios de publicación encontrados con IA y guardados en el PR Log.",
  "Task added to the Writing Queue. To generate in-page without a script, add ANTHROPIC_API_KEY in Render. Run it in Claude Code:":
    "Tarea añadida a la Writing Queue. Para generar in-page sin script, agrega ANTHROPIC_API_KEY en Render. Corre en Claude Code:",

  // Publish
  "WordPress is not configured in this environment.":
    "WordPress no está configurado en este entorno.",
  "Posts are always published as a draft — you review them in WP-admin before making them public.":
    "Los posts se publican siempre como borrador — los revisas en WP-admin antes de hacerlos públicos.",
  "Copy the doc content and paste it into the composer.":
    "Copia el contenido del doc y pégalo en el composer.",
  Title: "Título",
  "It stays as a draft in WP. Nothing goes public from here.":
    "Quedará como draft en WP. No se publica al público desde acá.",
  "(untitled)": "(sin título)",

  // Title fixes (sugerencias)
  Reason: "Razón",
  "Generating title suggestions…": "Generando sugerencias de título…",
  "Title suggestions (CTR fixes)": "Sugerencias de título (CTR fixes)",
  "Pages that already rank on page 1 but lose the click. For each one, 3 titles suggested from proven SEO templates — copy and paste.":
    "Páginas que ya rankean en página 1 pero pierden el clic. Para cada una, 3 títulos sugeridos por plantillas SEO probadas — copia y pega.",
  "No AI: these are deterministic rules (intent + position + year + power prefix). Zero cost.":
    "Sin IA: son reglas determinísticas (intent + posición + año + power-prefix). Cero costo.",
  "No queries with a detected CTR fix in the last 90 days.":
    "No hay queries con CTR-fix detectado en los últimos 90 días.",
  copy: "copiar",
  copied: "copiado",
  "Download CSV": "Descargar CSV",

  // Encolar por rango (QueueRange)
  "Write new content": "Escribir contenidos nuevos",
  "Queues the pieces in that range so Claude Code writes them.":
    "Encola las piezas de ese rango para que Claude Code las escriba.",
  "This week": "Esta semana",
  "Next week": "La semana que viene",
  "This month": "Este mes",
  "Next month": "El mes que viene",
  "See what would be queued": "Ver qué se encolaría",
  "Checking…": "Comprobando…",
  "Queueing…": "Encolando…",
  "Queue these": "Encolar estas",
  "pieces would be queued": "piezas se encolarían",
  "pieces queued.": "piezas encoladas.",
  "skipped, and why": "saltadas, y por qué",
  "already has a Google Doc": "ya tiene Google Doc",
  "already in the queue": "ya está en la cola",
  "the row has no title": "la fila no tiene título",
  "The app does not write. Run this in Claude Code to produce the drafts:":
    "La app no escribe. Corre esto en Claude Code para producir los borradores:",
  "Could not reach the server.": "No se pudo contactar el servidor.",
  "Include pieces that already have a doc (rewrite them)":
    "Incluir piezas que ya tienen doc (reescribirlas)",

  // Extender el calendario (ExtendCalendar)
  "Plan beyond the calendar (propose new pieces)":
    "Planear más allá del calendario (proponer piezas nuevas)",
  "Plan beyond the calendar": "Planear más allá del calendario",
  "Topics come from Search Console demand and from what competitors and outlets published. Never invented.":
    "Los temas salen de la demanda en Search Console y de lo que publicaron competidores y medios. Nunca inventados.",
  sector: "sector",
  sources: "fuentes",
  "Weeks to add": "Semanas a añadir",
  "Propose pieces": "Proponer piezas",
  "The calendar ends on": "El calendario termina el",
  "this starts on": "esto arranca el",
  "Cadence inherited from the last four weeks": "Cadencia heredada de las últimas cuatro semanas",
  "pieces proposed": "piezas propuestas",
  "topics with demand available": "temas con demanda disponibles",
  "Add to the calendar": "Añadir al calendario",
  "Adding…": "Añadiendo…",
  "rows added to the calendar.": "filas añadidas al calendario.",
  "They land as Idea with a working title: the headline is decided by whoever writes the piece, with the brief in front of them.":
    "Entran como Idea con título de trabajo: el titular lo decide quien escriba la pieza, con el brief delante.",
  Written: "Escrito",
  Scheduled: "Programado",
  Work: "Trabajo",
  "Suggested internal links": "Internal links sugeridos",
  "To rewrite": "Para reescribir",
  "To optimise": "Para optimizar",
  "Not one single click": "Sin un solo clic",
  "Unmeasured (NA)": "Sin medir (NA)",

  // Tooltips del nav (lib/navMeta.ts)
  "Overall system state: how fresh the data is, how many drafts exist, calendar slots and insights tracked.":
    "Estado general del sistema: frescura de los datos, cantidad de drafts, slots del calendario e insights tracked.",
  "The 90-day editorial calendar with its 95 pieces, mapped to the 6 positioning pillars. Set the status of each piece (Idea / Written / Scheduled / Published).":
    "El calendario editorial de 90 días con las 95 piezas, mapeadas a los 6 pilares de posicionamiento. Marca el status de cada pieza (Idea / Escrito / Programado / Publicado).",
  "New content ideas based on real GSC demand plus pillar gaps. Button to queue them into the internal system and see what is already queued.":
    "Ideas de contenido nuevo basadas en demanda real de GSC + gaps de pilar. Botón para encolar al sistema interno y ver lo que ya está en cola.",
  "A structured report of what to write next. Takes each Search Console query, classifies it by intent and opportunity, and turns it into a concrete recommendation.":
    "Reporte estructurado de qué escribir próximo. Toma cada query de Search Console, la clasifica por intent y oportunidad, y la convierte en una recomendación concreta.",
  "How Leasey content fails and what stops it: the eight real cases in the failure catalogue, the founder facts tracker, the delivery gate and the roster of verification agents.":
    "Cómo falla el contenido de Leasey y qué lo impide: los ocho casos reales del catálogo de errores, el tracker de hechos de fundadores, la compuerta de entrega y el roster de agentes de verificación.",
  "What moved from one week to the next: new queries, drops with volume behind them, what is close and getting no clicks, and what competitors published. With a week selector for the history.":
    "Qué se movió de una semana a otra: consultas nuevas, caídas con volumen, lo que está cerca sin clics, y qué publicaron los competidores. Con selector de semana para ver el histórico.",
  "The 723 published URLs, classified by cluster and mapped to their pillar, with a suggested action, owner and internal links from the same cluster.":
    "Los 723 URLs ya publicados, clasificados por cluster y mapeados al pilar correspondiente, con acción sugerida, owner e internal links del mismo cluster.",
  "Title and meta rewrite suggestions for pages that rank on page 1 but lose the click. No AI: deterministic SEO rules, free.":
    "Sugerencias de reescritura de título y meta para las páginas que rankean en página 1 pero pierden el clic. Sin IA: reglas SEO determinísticas, gratis.",
  "Market insights generated from GSC and the 6 pillars — to inform content strategy and the angle of each piece.":
    "Insights de mercado generados desde GSC + los 6 pilares — para informar la estrategia de contenido y el ángulo de cada pieza.",
  "Publication sites (proptech, PM trade press, Canadian RE, US Sun Belt) where Leasey.AI can place press releases or guest posts. Includes the history.":
    "Sitios de publicación (proptech, PM trade press, Canadian RE, US Sun Belt) donde Leasey.AI puede publicar press releases o guest posts. Incluye el historial.",
  "Search performance in GSC (clicks, impressions, CTR, position) with an interpreted analysis: what the numbers mean, what to do and why.":
    "Performance de búsqueda en GSC (clics, impresiones, CTR, posición) con análisis interpretado: qué significan los números, qué hacer y por qué.",
  "Week-over-week anomaly detection. Queries that rose or fell more than 30% against the recent average, each with a recommended action.":
    "Detección de anomalías semana a semana. Queries que subieron o cayeron más de 30% vs el promedio reciente, con una acción recomendada para cada una.",
  "Latest posts from competitors (TurboTenant, Rent Manager, Zumper, RentCafe/Yardi) and proptech, PM trade press and Canadian RE outlets. Includes free search and a manual refresh button.":
    "Últimas publicaciones de competidores (TurboTenant, Rent Manager, Zumper, RentCafe/Yardi) y medios proptech, PM trade press y Canadian RE. Incluye búsqueda libre y botón de refresh manual.",
  "Composer to create a draft straight into WordPress (leasey.ai). Supports markdown. Posts are always published as a draft — you review them in WP-admin before they go public.":
    "Composer para crear un borrador directo en WordPress (leasey.ai). Soporta markdown. Los posts se publican siempre como draft — los revisas en WP-admin antes de salir al público.",
  "The master AEO playbook — the 5 non-negotiable rules (direct answer, hook with a figure or entity, cite sources, 40-60 word FAQ, canonical KB), per-channel templates, pillar alignment and the pre-publication checklist.":
    "El playbook maestro de AEO — las 5 reglas no negociables (respuesta directa, hook con dato/entidad, cita fuentes, FAQ 40-60 palabras, KB canónica), templates por canal, alineación de pilares y checklist pre-publicación.",
};

const Ctx = createContext<{ locale: Locale; setLocale: (l: Locale) => void }>({
  locale: "en",
  setLocale: () => {},
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("locale") : null;
    if (saved === "es" || saved === "en") setLocaleState(saved);
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    if (typeof window !== "undefined") window.localStorage.setItem("locale", l);
  };

  return <Ctx.Provider value={{ locale, setLocale }}>{children}</Ctx.Provider>;
}

/** Devuelve la frase traducida, o la original si no hay entrada. */
export function useT() {
  const { locale } = useContext(Ctx);
  return (s: string) => (locale === "es" ? ES[s] || s : s);
}

export function useLocale() {
  return useContext(Ctx);
}

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();
  return (
    <div className="flex items-center gap-1 text-[11px]">
      {(["en", "es"] as Locale[]).map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          className={`px-1.5 py-0.5 rounded ${
            locale === l ? "bg-bg-soft text-ink font-medium" : "text-slate hover:text-ink"
          }`}
          aria-pressed={locale === l}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
