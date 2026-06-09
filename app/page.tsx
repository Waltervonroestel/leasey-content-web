import { listDrafts, listImages, statusSummary } from "@/lib/content";
import { Card, Stat, Badge, SectionTitle } from "@/components/ui";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function Dashboard() {
  const drafts = listDrafts();
  const images = listImages();
  const { total, counts } = statusSummary();
  const byChannel = drafts.reduce<Record<string, number>>((acc, d) => {
    acc[d.channel] = (acc[d.channel] || 0) + 1;
    return acc;
  }, {});
  const recent = drafts.slice(0, 6);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-ink">Content Dashboard</h1>
        <p className="text-slate text-sm mt-1">
          Estado del sistema de contenido de Leasey.AI. Lee los borradores, el calendario y las señales del
          repo. No publica: los borradores se suben a mano.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Piezas en tablero" value={total} accent />
        <Stat label="Borradores en output" value={drafts.length} />
        <Stat label="Imágenes generadas" value={images.length} />
        <Stat label="Canales activos" value={Object.keys(byChannel).length} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <SectionTitle href="/status" cta="Ver tablero">Estado</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {counts.map((c) => (
              <span key={c.status} className="flex items-center gap-2 text-sm">
                <Badge label={c.status} /> <span className="text-slate">{c.count}</span>
              </span>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle href="/drafts" cta="Ver borradores">Por canal</SectionTitle>
          <div className="flex flex-col gap-1.5 text-sm">
            {Object.entries(byChannel)
              .sort((a, b) => b[1] - a[1])
              .map(([ch, n]) => (
                <div key={ch} className="flex items-center justify-between">
                  <span className="text-ink">{ch}</span>
                  <span className="text-slate">{n}</span>
                </div>
              ))}
          </div>
        </Card>
      </div>

      <div>
        <SectionTitle href="/drafts" cta="Todos">Borradores recientes</SectionTitle>
        <div className="grid md:grid-cols-2 gap-3">
          {recent.map((d) => (
            <Link key={d.file} href={`/drafts/${encodeURIComponent(d.file)}`}>
              <Card className="hover:border-blue/40 transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-ink truncate">{d.name}</span>
                  <span className="text-[11px] text-blue whitespace-nowrap">{d.channel}</span>
                </div>
                <p className="text-xs text-slate mt-1.5 line-clamp-2">{d.body.trim().slice(0, 140)}</p>
                <span className="text-[11px] text-slate mt-2 block">{d.dateFolder}</span>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
