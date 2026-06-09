import Link from "next/link";

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-card border border-line rounded-xl p-5 shadow-sm ${className}`}>{children}</div>
  );
}

export function Stat({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <Card className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wide text-slate">{label}</span>
      <span className={`text-3xl font-bold ${accent ? "text-blue" : "text-ink"}`}>{value}</span>
    </Card>
  );
}

const STATUS_STYLES: Record<string, string> = {
  BORRADOR: "bg-slate/10 text-slate",
  "QA-OK": "bg-teal/15 text-teal",
  APROBADO: "bg-blue/10 text-blue",
  PUBLICADO: "bg-green-100 text-green-700",
  VIGENTE: "bg-teal/15 text-teal",
};

export function Badge({ label }: { label: string }) {
  const cls = STATUS_STYLES[label] || "bg-bg-2 text-slate";
  return <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${cls}`}>{label}</span>;
}

export function SectionTitle({ children, href, cta }: { children: React.ReactNode; href?: string; cta?: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-lg font-bold text-ink">{children}</h2>
      {href && cta && (
        <Link href={href} className="text-sm text-blue hover:text-blue-hover">
          {cta} →
        </Link>
      )}
    </div>
  );
}
