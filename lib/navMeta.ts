// Catálogo único de tabs del content system. Se usa en el nav (BrandHeader)
// para mostrar el tooltip al pasar el cursor, y en el Dashboard home para el
// grid de cards que explica cada sección.
//
// El texto base es inglés. El nav es un client component y pasa cada
// descripción por t(), así que el selector EN/ES lo traduce; el grid del home
// es server component y se queda en inglés.

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
    description: "Overall system state: how fresh the data is, how many drafts exist, calendar slots and insights tracked.",
    group: "Plan",
  },
  {
    href: "/calendar",
    label: "Calendar",
    icon: "📅",
    description: "The 90-day editorial calendar with its 95 pieces, mapped to the 6 positioning pillars. Set the status of each piece (Idea / Written / Scheduled / Published).",
    group: "Plan",
  },
  {
    href: "/ideas",
    label: "Ideas",
    icon: "💡",
    description: "New content ideas based on real GSC demand plus pillar gaps. Button to queue them into the internal system and see what is already queued.",
    group: "Plan",
  },
  {
    href: "/reports",
    label: "Reports",
    icon: "📋",
    description: "A structured report of what to write next. Takes each Search Console query, classifies it by intent and opportunity, and turns it into a concrete recommendation.",
    group: "Plan",
  },

  {
    href: "/rules",
    label: "Rules",
    icon: "🛡️",
    description: "How Leasey content fails and what stops it: the eight real cases in the failure catalogue, the founder facts tracker, the delivery gate and the roster of verification agents.",
    group: "Build",
  },
  {
    href: "/signals",
    label: "Signals",
    icon: "📡",
    description: "What moved from one week to the next: new queries, drops with volume behind them, what is close and getting no clicks, and what competitors published. With a week selector for the history.",
    group: "Analyse",
  },
  {
    href: "/optimise",
    label: "Optimise",
    icon: "🛠",
    description: "The 723 published URLs, classified by cluster and mapped to their pillar, with a suggested action, owner and internal links from the same cluster.",
    group: "Build",
  },
  {
    href: "/title-fixes",
    label: "Title fixes",
    icon: "✏️",
    description: "Title and meta rewrite suggestions for pages that rank on page 1 but lose the click. No AI: deterministic SEO rules, free.",
    group: "Build",
  },
  {
    href: "/insights",
    label: "Insights",
    icon: "🔍",
    description: "Market insights generated from GSC and the 6 pillars — to inform content strategy and the angle of each piece.",
    group: "Analyse",
  },
  {
    href: "/pr",
    label: "PR",
    icon: "📰",
    description: "Publication sites (proptech, PM trade press, Canadian RE, US Sun Belt) where Leasey.AI can place press releases or guest posts. Includes the history.",
    group: "Build",
  },

  {
    href: "/analytics",
    label: "Analytics",
    icon: "📈",
    description: "Search performance in GSC (clicks, impressions, CTR, position) with an interpreted analysis: what the numbers mean, what to do and why.",
    group: "Analyse",
  },
  {
    href: "/alerts",
    label: "Alerts",
    icon: "⚠️",
    description: "Week-over-week anomaly detection. Queries that rose or fell more than 30% against the recent average, each with a recommended action.",
    group: "Analyse",
  },
  {
    href: "/competitors",
    label: "Competitors",
    icon: "🏢",
    description: "Latest posts from competitors (TurboTenant, Rent Manager, Zumper, RentCafe/Yardi) and proptech, PM trade press and Canadian RE outlets. Includes free search and a manual refresh button.",
    group: "Analyse",
  },

  {
    href: "/publish",
    label: "Publish",
    icon: "📝",
    description: "Composer to create a draft straight into WordPress (leasey.ai). Supports markdown. Posts are always published as a draft — you review them in WP-admin before they go public.",
    group: "Publish",
  },
  {
    href: "/guidelines",
    label: "Guidelines",
    icon: "📖",
    description: "The master AEO playbook — the 5 non-negotiable rules (direct answer, hook with a figure or entity, cite sources, 40-60 word FAQ, canonical KB), per-channel templates, pillar alignment and the pre-publication checklist.",
    group: "Plan",
  },
];

// Orden de aparición en el nav: respeta el array de arriba.
// Orden de grupos en el Dashboard home:
export const GROUP_ORDER: NavTab["group"][] = ["Plan", "Build", "Analyse", "Publish"];

export const GROUP_LABELS: Record<NavTab["group"], string> = {
  Plan: "Plan",
  Build: "Build",
  Analyse: "Analyse",
  Publish: "Publish",
};
