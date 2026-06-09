import { listDrafts, readFileMd } from "@/lib/content";
import { Card } from "@/components/ui";
import Markdown from "@/components/Markdown";

export const dynamic = "force-dynamic";

export default function CalendarPage() {
  // Toma el calendario más reciente de los borradores.
  const cal = listDrafts().find((d) => /calendar-/i.test(d.name));
  const md = cal ? readFileMd(cal.file) : null;
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-ink">Calendario editorial</h1>
      <p className="text-slate text-sm">Plan de 90 días. Cada slot se ejecuta con su comando en el sistema de agentes.</p>
      <Card>
        {md ? <Markdown md={md} /> : <p className="text-slate">No hay calendario aún. Corre `/content-calendar`.</p>}
      </Card>
    </div>
  );
}
