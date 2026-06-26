import Link from "next/link";

const nav = [
  { href: "/", label: "Dashboard" },
  { href: "/calendar", label: "Calendar" },
  { href: "/optimise", label: "Optimise" },
  { href: "/ideas", label: "Ideas" },
  { href: "/analytics", label: "Analytics" },
  { href: "/reports", label: "Reports" },
  { href: "/insights", label: "Insights" },
  { href: "/pr", label: "PR" },
];

export default function BrandHeader() {
  return (
    <header className="w-full border-b border-line bg-white/70 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center gap-6 flex-wrap">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold text-ink">
            Leasey<span className="text-blue">.AI</span>
          </span>
          <span className="text-xs text-slate hidden sm:inline">Content</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm flex-wrap">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="px-3 py-1.5 rounded-md text-slate hover:text-ink hover:bg-bg-2 transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
