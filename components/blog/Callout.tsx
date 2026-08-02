import { Lightbulb, BarChart3, AlertTriangle, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Variant = "tip" | "data" | "warning";

const config: Record<Variant, { icon: LucideIcon; label: string; border: string; bg: string; iconColor: string }> = {
  tip: {
    icon: Lightbulb,
    label: "Operator Tip",
    border: "border-emerald-400 dark:border-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  data: {
    icon: BarChart3,
    label: "Data Point",
    border: "border-blue-400 dark:border-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  warning: {
    icon: AlertTriangle,
    label: "Warning",
    border: "border-amber-400 dark:border-amber-600",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
};

interface Props {
  variant?: Variant;
  title?: string;
  children: ReactNode;
}

export default function Callout({ variant = "tip", title, children }: Props) {
  const c = config[variant];
  const Icon = c.icon;
  return (
    <aside
      className={`rounded-lg border-l-4 ${c.border} ${c.bg} p-4 my-6`}
      role="note"
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon size={16} className={c.iconColor} />
        <span className={`text-xs font-bold uppercase tracking-wider font-mono ${c.iconColor}`}>
          {title ?? c.label}
        </span>
      </div>
      <div className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
        {children}
      </div>
    </aside>
  );
}
