// Tercera pasada: las vistas antiguas.
//
// Los app/*/page.tsx son server components, así que su texto se traduce a
// inglés fijo y no pasa por t(): un hook de contexto no corre en el servidor.
// El selector solo cambia lo que renderiza el cliente, que es donde vive
// prácticamente toda la prosa del panel.
import fs from "node:fs";

const T = (s) => "{t(" + JSON.stringify(s) + ")}";

// AlertsView ya usa `t` para la tendencia (t.history, t.current), así que ahí
// el hook se llama `tr`: reusar el nombre habría dado un error de compilación
// silencioso en el mejor caso y un dato mal leído en el peor.
const ALERTS = {
  "components/AlertsView.tsx": [
    ['{isSpike ? "Subida" : "Caída"}', '{isSpike ? tr("Spike") : tr("Drop")}'],
    ['font-medium">Acción: </span>', 'font-medium">{tr("Action")}: </span>'],
    ["Detectando anomalías…", "{tr(\"Detecting anomalies…\")}"],
    [
      "Detección semanal de búsquedas que subieron o cayeron de forma anormal frente al promedio reciente.",
      "{tr(\"Weekly detection of searches that rose or fell abnormally against the recent average.\")}",
    ],
    [
      "Aún no hay historial — el primer snapshot semanal corre cada lunes 12:00 UTC. Por ahora ves un placeholder con las queries más visibles.",
      "{tr(\"No history yet — the first weekly snapshot runs every Monday at 12:00 UTC. For now you see a placeholder with the most visible queries.\")}",
    ],
    ['label="Posición media"', 'label={tr("Average position")}'],
    [
      "Evolución de impresiones · últimos {t.history.length} snapshots",
      "{tr(\"Impressions over time\")} · {tr(\"last\")} {t.history.length} snapshots",
    ],
    ["Caídas ({drops.length})", "{tr(\"Drops\")} ({drops.length})"],
    [
      "No hay anomalías significativas esta semana.",
      "{tr(\"No significant anomalies this week.\")}",
    ],
  ],
};

const CLIENT = {
  "components/AnalysisSummary.tsx": [
    [">Qué significa<", ">" + T("What it means") + "<"],
    [">Qué hacer<", ">" + T("What to do") + "<"],
    [">Por qué<", ">" + T("Why") + "<"],
    ["Analizando los datos de búsqueda…", "{t(\"Analysing the search data…\")}"],
    ["Lectura del período · {data.days} días", "{t(\"Reading for the period\")} · {data.days} {t(\"days\")}"],
    [">Arreglando títulos<", ">" + T("Fixing titles") + "<"],
    [
      "Qué hacer con estos números, en orden de prioridad",
      "{t(\"What to do with these numbers, in priority order\")}",
    ],
  ],
  "components/CalendarView.tsx": [
    [
      "Sin Google Doc enlazado: no hay qué publicar.",
      "{t(\"No Google Doc linked: nothing to publish.\")}",
    ],
  ],
  "components/CompetitorsView.tsx": [
    [
      "¿Qué publican competidores y medios?",
      "{t(\"What are competitors and outlets publishing?\")}",
    ],
    [
      "Últimas publicaciones de competidores (TurboTenant, Rent Manager, Zumper, RentCafe/Yardi) y medios\n            proptech, PM trade press y Canadian RE. Los feeds se cachean 1 hora; usa <span className=\"text-ink font-medium\">Buscar ahora</span> para forzar fetch fresco. Algunos competidores (AppFolio, Buildium, DoorLoop) ya no exponen RSS público.",
      T("Latest posts from competitors (TurboTenant, Rent Manager, Zumper, RentCafe/Yardi) and proptech, PM trade press and Canadian RE outlets. Feeds are cached for one hour; use Search now to force a fresh fetch. Some competitors (AppFolio, Buildium, DoorLoop) no longer expose a public RSS feed."),
    ],
    ['placeholder="Buscar por título, contenido o medio…"', 'placeholder={t("Search by title, content or outlet…")}'],
    [
      "Fuentes que se están leyendo ({sources.length})",
      "{t(\"Sources being read\")} ({sources.length})",
    ],
  ],
  "components/InsightsView.tsx": [
    [
      "Tarea añadida a la Writing Queue. (Para generar in-page sin script, agrega <code className=\"font-mono text-xs\">ANTHROPIC_API_KEY</code> en Render.) Corre en Claude Code:",
      T("Task added to the Writing Queue. To generate in-page without a script, add ANTHROPIC_API_KEY in Render. Run it in Claude Code:"),
    ],
  ],
  "components/OptimiseView.tsx": [
    [
      "con su decisión, tipo de trabajo y cluster. Fuente: la hoja de Clusterización 2026, la que mantiene el equipo.",
      "{t(\"with their decision, work type and cluster. Source: the Clusterización 2026 sheet, the one the team maintains.\")}",
    ],
    [
      "{highImpact.length} páginas para reescribir, ordenadas por clics que ya traen",
      "{highImpact.length} {t(\"pages to rewrite, ordered by the clicks they already bring\")}",
    ],
  ],
  "components/PRView.tsx": [
    [
      "Buscar nuevos sitios de publicación",
      "{t(\"Find new publication sites\")}",
    ],
    [
      "✓ Nuevos sitios de publicación encontrados con IA y guardados en el PR Log.",
      "✓ {t(\"New publication sites found with AI and saved to the PR Log.\")}",
    ],
    [
      "Tarea añadida a la Writing Queue. (Para generar in-page sin script, agrega <code className=\"font-mono text-xs\">ANTHROPIC_API_KEY</code> en Render.) Corre en Claude Code:",
      T("Task added to the Writing Queue. To generate in-page without a script, add ANTHROPIC_API_KEY in Render. Run it in Claude Code:"),
    ],
  ],
  "components/PublishView.tsx": [
    [
      "WordPress no está configurado en este entorno.",
      "{t(\"WordPress is not configured in this environment.\")}",
    ],
    [
      "Los posts se publican siempre como <span className=\"text-ink font-medium\">borrador</span> — los revisas en WP-admin antes de hacerlos públicos.",
      T("Posts are always published as a draft — you review them in WP-admin before making them public."),
    ],
    [
      "Copia el contenido del doc y pégalo en el composer.",
      "{t(\"Copy the doc content and paste it into the composer.\")}",
    ],
    [">Título<", ">" + T("Title") + "<"],
    [
      "Quedará como draft en WP. No se publica al público desde acá.",
      "{t(\"It stays as a draft in WP. Nothing goes public from here.\")}",
    ],
    ['"(sin título)"', 't("(untitled)")'],
  ],
  "components/TitleFixesView.tsx": [
    ["Razón: {s.rationale}", "{t(\"Reason\")}: {s.rationale}"],
    ["Generando sugerencias de título…", "{t(\"Generating title suggestions…\")}"],
    ["Sugerencias de título (CTR fixes)", "{t(\"Title suggestions (CTR fixes)\")}"],
    [
      "Páginas que ya rankean en página 1 pero pierden el clic. Para cada una, 3 títulos sugeridos por plantillas SEO probadas — copia y pega.",
      T("Pages that already rank on page 1 but lose the click. For each one, 3 titles suggested from proven SEO templates — copy and paste."),
    ],
    [
      "Sin IA: son reglas determinísticas (intent + posición + año + power-prefix). Cero costo.",
      T("No AI: these are deterministic rules (intent + position + year + power prefix). Zero cost."),
    ],
    [
      "No hay queries con CTR-fix detectado en los últimos 90 días.",
      "{t(\"No queries with a detected CTR fix in the last 90 days.\")}",
    ],
  ],
};

// Server components: inglés fijo, sin t().
const SERVER = {
  "app/competitors/page.tsx": [
    ['title="Qué han publicado, semana a semana"', 'title="What they published, week by week"'],
    [
      'blurb="Leído de sus sitemaps. Una URL nueva dice de qué han decidido hablar, que es una decisión de recursos y sí informa; no dice que les funcione. Una URL actualizada suele importar más: significa que reoptimizan algo que ya les rankea."',
      'blurb="Read from their sitemaps. A new URL says what they decided to talk about, which is a resource decision and does tell us something; it does not say it works for them. An updated URL usually matters more: it means they are reoptimising something that already ranks."',
    ],
  ],
  "app/pr/page.tsx": [
    ['title="Qué está publicando la prensa del sector"', 'title="What the trade press is publishing"'],
    [
      'blurb="Los medios de pm-publications.md. Sirve para dos cosas: saber de qué se habla, y ver qué acepta cada medio antes de escribir el pitch. Si un medio lleva tres semanas con historias de datos, un pitch de producto no va a entrar."',
      'blurb="The outlets in pm-publications.md. Good for two things: knowing what is being talked about, and seeing what each outlet accepts before writing the pitch. If an outlet has run three weeks of data stories, a product pitch is not getting in."',
    ],
  ],
  "app/guidelines/page.tsx": [["Fuente canónica:", "Canonical source:"]],
  "app/page.tsx": [
    [
      'Plan: "Decidir qué se va a escribir y mantener la vista del 90-day window.",',
      'Plan: "Decide what gets written and keep the 90-day window in view.",',
    ],
    [
      "Estado general del sistema de contenido de Leasey.AI. Lee drafts, calendario, GSC y los publica/encola desde acá.",
      "Overall state of the Leasey.AI content system. Reads drafts, calendar and GSC, and publishes or queues from here.",
    ],
  ],
  "app/rules/page.tsx": [
    [
      "Cómo falla el contenido de Leasey.AI y qué impide que vuelva a pasar. Todo lo de esta página\n          viene de casos reales, no de teoría. Fuente canónica:{\" \"}",
      "How Leasey.AI content fails and what stops it happening again. Everything on this page comes\n          from real cases, not theory. Canonical source:{\" \"}",
    ],
    [
      "script que está a punto de correr y mira si habla con Drive, Docs, Sheets, WordPress o Notion.",
      "script about to run and checks whether it talks to Drive, Docs, Sheets, WordPress or Notion.",
    ],
    [
      "No tiene lista blanca de scripts: un script escrito mañana queda protegido el día que se\n          escribe. La versión anterior nombraba tres a mano, no incluía el que realmente subía los\n          briefs, y nunca llegó a dispararse.",
      "There is no script allowlist: a script written tomorrow is covered the day it is written. The\n          previous version named three by hand, missed the one that actually uploaded the briefs, and\n          never fired once.",
    ],
    ["Agentes de verificación", "Verification agents"],
    [
      "entrega. El sexto aplica los hallazgos y nadie toca el documento después de él.",
      "delivery. The sixth applies the findings, and nobody touches the document after it.",
    ],
    ["{a.lines} líneas", "{a.lines} lines"],
  ],
};

const apply = (map, wrap, name = "t") => {
  let total = 0;
  for (const [file, pairs] of Object.entries(map)) {
    if (!fs.existsSync(file)) continue;
    let src = fs.readFileSync(file, "utf8");
    let hits = 0;
    for (const [from, to] of pairs) {
      if (src.includes(from)) {
        src = src.split(from).join(to);
        hits++;
      } else {
        console.log(`  NO ENCONTRADO en ${file}: ${from.slice(0, 55)}`);
      }
    }
    if (hits && wrap && !src.includes("useT()")) {
      src = src.replace(/^(import .*\n)/m, `$1import { useT } from "@/lib/i18n";\n`);
      src = src.replace(
        /(export default function \w+\([^)]*\)[^{]*\{\n)/,
        `$1  const ${name} = useT();\n`,
      );
    }
    if (hits) {
      fs.writeFileSync(file, src);
      total += hits;
      console.log(`  ${file}  ${hits}`);
    }
  }
  return total;
};

console.log("Client:");
const a = apply(ALERTS, true, "tr") + apply(CLIENT, true);
console.log("Server (inglés fijo):");
const b = apply(SERVER, false);
console.log(`\n${a + b} cadena(s).`);
