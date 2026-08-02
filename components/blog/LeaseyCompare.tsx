import { X, Check } from "lucide-react";

interface CompareItem {
  text: string;
}

interface Props {
  title?: string;
  without: CompareItem[];
  withLeasey: CompareItem[];
}

export default function LeaseyCompare({
  title = "The Leasey Difference",
  without,
  withLeasey,
}: Props) {
  return (
    <div className="my-8 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
      {title && (
        <div className="px-5 py-3 bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-mono uppercase tracking-wider">
            {title}
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-zinc-700">
        {/* Without */}
        <div className="p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-3 font-mono">
            Without Leasey
          </p>
          <ul className="space-y-2.5">
            {without.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <X size={15} className="text-red-500 shrink-0 mt-0.5" />
                {item.text}
              </li>
            ))}
          </ul>
        </div>
        {/* With */}
        <div className="p-5 bg-emerald-50/40 dark:bg-emerald-950/20">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-3 font-mono">
            With Leasey
          </p>
          <ul className="space-y-2.5">
            {withLeasey.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                <Check size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                {item.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
