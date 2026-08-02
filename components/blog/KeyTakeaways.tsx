import { ArrowRight } from "lucide-react";

interface Props {
  items: string[];
  ctaText?: string;
  ctaHref?: string;
}

export default function KeyTakeaways({
  items,
  ctaText = "Book a demo",
  ctaHref = "#",
}: Props) {
  return (
    <section className="my-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 p-6">
      <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-4 font-mono">
        Key Takeaways
      </h3>
      <ol className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
            <span className="flex items-center justify-center shrink-0 w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold font-mono">
              {i + 1}
            </span>
            {item}
          </li>
        ))}
      </ol>
      <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-700">
        <a
          href={ctaHref}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 text-white font-semibold text-sm px-5 py-2.5 hover:bg-emerald-700 transition-colors"
        >
          {ctaText} <ArrowRight size={14} />
        </a>
      </div>
    </section>
  );
}
