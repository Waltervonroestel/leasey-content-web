// Catálogo único de tabs del content system. Se usa en el nav (BrandHeader)
// para mostrar el tooltip al pasar el cursor, y en el Dashboard home para el
// grid de cards que explica cada sección.

export interface NavTab {
  href: string;
  label: string;
  icon: string;      // emoji corto, no se usa para semántica
  description: string;
  group: "Plan" | "Build" | "Analyse" | "Publish";
}

export const NAV_TABS: NavTab[] = [
  {
    href: "/",
    label: "Dashboard",
    icon: "🏠",
    description: "Estado general del sistema: frescura de los datos, cantidad de drafts, slots del calendario e insights tracked.",
    group: "Plan",
  },
  {
    href: "/calendar",
    label: "Calendar",
    icon: "📅",
    description: "El calendario editorial de 90 días con las 95 piezas, mapeadas a los 6 pilares de posicionamiento. Marca el status de cada pieza (Idea / Escrito / Programado / Publicado).",
    group: "Plan",
  },
  {
    href: "/ideas",
    label: "Ideas",
    icon: "💡",
    description: "Ideas de contenido nuevo basadas en demanda real de GSC + gaps de pilar. Botón para encolar al sistema interno y ver lo que ya está en cola.",
    group: "Plan",
  },
  {
    href: "/reports",
    label: "Reports",
    icon: "📋",
    description: "Reporte estructurado de qué escribir próximo. Toma cada query de Search Console, la clasifica por intent y oportunidad, y la convierte en una recomendación concreta.",
    group: "Plan",
  },

  {
    href: "/optimise",
    label: "Optimise",
    icon: "🛠",
    description: "Los 723 URLs ya publicados, clasificados por cluster y mapeados al pilar correspondiente, con acción sugerida, owner e internal links del mismo cluster.",
    group: "Build",
  },
  {
    href: "/title-fixes",
    label: "Title fixes",
    icon: "✏️",
    description: "Sugerencias de reescritura de título y meta para las páginas que rankean en página 1 pero pierden el clic. Sin IA: reglas SEO determinísticas, gratis.",
    group: "Build",
  },
  {
    href: "/insights",
    label: "Insights",
    icon: "🔍",
    description: "Insights de mercado generados desde GSC + los 6 pilares — para informar la estrategia de contenido y el ángulo de cada pieza.",
    group: "Analyse",
  },
  {
    href: "/pr",
    label: "PR",
    icon: "📰",
    description: "Sitios de publicación (proptech, PM trade press, Canadian RE, US Sun Belt) donde Leasey.AI puede publicar press releases o guest posts. Incluye el historial.",
    group: "Build",
  },

  {
    href: "/analytics",
    label: "Analytics",
    icon: "📈",
    description: "Performance de búsqueda en GSC (clics, impresiones, CTR, posición) con análisis interpretado: qué significan los números, qué hacer y por qué.",
    group: "Analyse",
  },
  {
    href: "/alerts",
    label: "Alerts",
    icon: "⚠️",
    description: "Detección de anomalías semana a semana. Queries que subieron o cayeron más de 30% vs el promedio reciente, con una acción recomendada para cada una.",
    group: "Analyse",
  },
  {
    href: "/competitors",
    label: "Competitors",
    icon: "🏢",
    description: "Últimas publicaciones de competidores (TurboTenant, Rent Manager, Zumper, RentCafe/Yardi) y medios proptech, PM trade press y Canadian RE. Incluye búsqueda libre y botón de refresh manual.",
    group: "Analyse",
  },

  {
    href: "/publish",
    label: "Publish",
    icon: "📝",
    description: "Composer para crear un borrador directo en WordPress (leasey.ai). Soporta markdown. Los posts se publican siempre como draft — los revisas en WP-admin antes de salir al público.",
    group: "Publish",
  },
];

// Orden de aparición en el nav: respeta el array de arriba.
// Orden de grupos en el Dashboard home:
export const GROUP_ORDER: NavTab["group"][] = ["Plan", "Build", "Analyse", "Publish"];

export const GROUP_LABELS: Record<NavTab["group"], string> = {
  Plan: "Planear",
  Build: "Construir",
  Analyse: "Analizar",
  Publish: "Publicar",
};
