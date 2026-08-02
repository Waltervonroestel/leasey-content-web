import { ArrowRight } from "lucide-react";

interface Props {
  headline: string;
  description?: string;
  buttonText?: string;
  href?: string;
  variant?: "inline" | "banner";
}

export default function ContextualCTA({
  headline,
  description,
  buttonText = "Learn more",
  href = "#",
  variant = "inline",
}: Props) {
  if (variant === "banner") {
    return (
      <div className="my-8 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 text-white">
        <p className="text-lg font-semibold">{headline}</p>
        {description && <p className="mt-1 text-sm text-emerald-100">{description}</p>}
        <a
          href={href}
          className="inline-flex items-center gap-2 mt-4 rounded-lg bg-white text-emerald-700 font-semibold text-sm px-5 py-2.5 hover:bg-emerald-50 transition-colors"
        >
          {buttonText} <ArrowRight size={14} />
        </a>
      </div>
    );
  }

  return (
    <div className="my-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 p-4">
      <div className="flex-1">
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{headline}</p>
        {description && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{description}</p>
        )}
      </div>
      <a
        href={href}
        className="inline-flex items-center gap-1.5 shrink-0 rounded-md bg-emerald-600 text-white text-xs font-semibold px-4 py-2 hover:bg-emerald-700 transition-colors"
      >
        {buttonText} <ArrowRight size={12} />
      </a>
    </div>
  );
}
