import type { ReactNode } from "react";

interface Props {
  toc?: ReactNode;
  sidebar?: ReactNode;
  children: ReactNode;
}

export default function BlogLayout({ toc, sidebar, children }: Props) {
  return (
    <div className="relative max-w-7xl mx-auto px-4 py-8 flex gap-8">
      {/* Left: TOC */}
      {toc && <aside className="hidden lg:block shrink-0">{toc}</aside>}

      {/* Center: content */}
      <article className="flex-1 min-w-0 max-w-3xl mx-auto prose-zinc dark:prose-invert text-zinc-800 dark:text-zinc-200 leading-relaxed">
        {children}
      </article>

      {/* Right: data rail */}
      {sidebar && (
        <aside className="hidden xl:block w-60 shrink-0 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
          {sidebar}
        </aside>
      )}
    </div>
  );
}
