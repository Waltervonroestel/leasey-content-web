import { Clock, BookOpen, Users } from "lucide-react";

interface Props {
  title: string;
  subtitle?: string;
  readingTime: number;
  topics: string[];
  bestFor: string[];
  date: string;
  author?: string;
}

export default function ExecutiveSummary({
  title,
  subtitle,
  readingTime,
  topics,
  bestFor,
  date,
  author = "Leasey.AI",
}: Props) {
  return (
    <header className="mb-10">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-lg text-zinc-500 dark:text-zinc-400">{subtitle}</p>
      )}

      <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-zinc-500 dark:text-zinc-400 font-mono">
        <span className="flex items-center gap-1.5">
          <Clock size={14} /> {readingTime} min read
        </span>
        <span className="flex items-center gap-1.5">
          <BookOpen size={14} /> {date}
        </span>
        <span className="flex items-center gap-1.5">
          <Users size={14} /> {author}
        </span>
      </div>

      <div className="mt-6 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 p-5 space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-2 font-mono">
            In this article
          </p>
          <ul className="space-y-1">
            {topics.map((t) => (
              <li key={t} className="text-sm text-zinc-700 dark:text-zinc-300 flex items-start gap-2">
                <span className="text-emerald-600 mt-0.5">&#8226;</span> {t}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-2 font-mono">
            Best for
          </p>
          <div className="flex flex-wrap gap-2">
            {bestFor.map((b) => (
              <span
                key={b}
                className="inline-block rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs px-3 py-1 font-medium"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
