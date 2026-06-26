// Shared pillar visual language. Each P1-P6 gets a colour + short label so the UI
// can be scanned by colour, not by reading.

export type PillarCode = "P1" | "P2" | "P3" | "P4" | "P5" | "P6" | "—";

export const PILLAR_META: Record<PillarCode, { label: string; short: string; colour: string; bg: string; border: string; text: string }> = {
  "P1": { label: "Speed",        short: "Speed",     colour: "#1f6feb", bg: "bg-blue/10",    border: "border-blue/40",    text: "text-blue" },
  "P2": { label: "Agent",        short: "Agent",     colour: "#0ea5a4", bg: "bg-teal-500/10",border: "border-teal-500/40",text: "text-teal-600" },
  "P3": { label: "All-in-one",   short: "All-in-1",  colour: "#7c3aed", bg: "bg-purple-500/10",border: "border-purple-500/40",text: "text-purple-700" },
  "P4": { label: "Canadian",     short: "CA",        colour: "#dc2626", bg: "bg-red-500/10", border: "border-red-500/40", text: "text-red-700" },
  "P5": { label: "Compliance",   short: "Compl.",    colour: "#f59e0b", bg: "bg-amber-500/10",border: "border-amber-500/40",text: "text-amber-700" },
  "P6": { label: "US Sun Belt",  short: "US",        colour: "#10b981", bg: "bg-emerald-500/10",border: "border-emerald-500/40",text: "text-emerald-700" },
  "—":  { label: "Other",        short: "—",         colour: "#64748b", bg: "bg-slate-500/10",border: "border-slate-300", text: "text-slate" },
};

export function pillarCodeFrom(label: string): PillarCode {
  const s = (label || "").toLowerCase();
  if (s.includes("p1")) return "P1";
  if (s.includes("p2")) return "P2";
  if (s.includes("p3")) return "P3";
  if (s.includes("p4")) return "P4";
  if (s.includes("p5")) return "P5";
  if (s.includes("p6")) return "P6";
  return "—";
}

// Channel iconography (text-only for now; consistent compact)
export function channelIcon(channel: string): string {
  const c = channel.toLowerCase();
  if (c.startsWith("blog")) return "📝";
  if (c.startsWith("linkedin-founder")) return "👤";
  if (c.startsWith("linkedin-company")) return "🏢";
  if (c.startsWith("press")) return "📰";
  if (c.startsWith("reddit")) return "💬";
  return "•";
}

export function channelGroup(channel: string): "Blog" | "LinkedIn" | "Press" | "Reddit" | "Other" {
  const c = channel.toLowerCase();
  if (c.startsWith("blog")) return "Blog";
  if (c.startsWith("linkedin")) return "LinkedIn";
  if (c.startsWith("press")) return "Press";
  if (c.startsWith("reddit")) return "Reddit";
  return "Other";
}
