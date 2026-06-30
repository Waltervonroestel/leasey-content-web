// Internal linking suggestions: for each URL, suggest up to N other URLs in
// the same cluster (preferring high-impression pages — they're more valuable
// as link targets and as link sources).

import type { OptRow } from "@/lib/sheets";

export interface LinkSuggestion {
  url: string;
  reason: string;
}

export function suggestInternalLinks(rows: OptRow[], target: OptRow, max = 3): LinkSuggestion[] {
  if (!target.cluster) return [];
  const sameCluster = rows.filter((r) => r.cluster === target.cluster && r.url !== target.url);
  if (sameCluster.length === 0) return [];

  // Prefer pages that already get traffic (better link equity to flow from/to).
  const ranked = [...sameCluster].sort((a, b) => b.gsc - a.gsc);
  return ranked.slice(0, max).map((r) => ({
    url: r.url,
    reason: r.gsc > 0
      ? `mismo cluster, ${r.gsc} clic${r.gsc === 1 ? "" : "s"} GSC`
      : `mismo cluster, refuerza profundidad temática`,
  }));
}

export function buildLinkMap(rows: OptRow[]): Record<string, LinkSuggestion[]> {
  const map: Record<string, LinkSuggestion[]> = {};
  for (const r of rows) {
    map[r.url] = suggestInternalLinks(rows, r, 3);
  }
  return map;
}
