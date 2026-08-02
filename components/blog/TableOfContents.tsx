"use client";

import { useEffect, useRef, useState } from "react";

export interface TocItem {
  id: string;
  label: string;
  level: number;
}

interface Props {
  items: TocItem[];
}

export default function TableOfContents({ items }: Props) {
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current?.disconnect();
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 }
    );
    observerRef.current = obs;
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="Table of contents"
      className="sticky top-20 hidden lg:block w-56 shrink-0 max-h-[calc(100vh-6rem)] overflow-y-auto pr-4"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3 font-mono">
        Contents
      </p>
      <ul className="space-y-1 border-l border-zinc-200 dark:border-zinc-700">
        {items.map(({ id, label, level }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={`block py-1 text-sm leading-snug transition-colors border-l-2 -ml-px ${
                level > 2 ? "pl-6" : "pl-3"
              } ${
                activeId === id
                  ? "border-emerald-600 text-emerald-700 dark:text-emerald-400 font-medium"
                  : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
