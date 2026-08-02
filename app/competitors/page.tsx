import CompetitorsView from "@/components/CompetitorsView";
import WatchView from "@/components/WatchView";

export const dynamic = "force-dynamic";

export default function CompetitorsPage() {
  return (
    <div className="flex flex-col gap-8">
      <CompetitorsView />
      <WatchView
        kind="competidor"
        title="Qué han publicado, semana a semana"
        blurb="Leído de sus sitemaps. Una URL nueva dice de qué han decidido hablar, que es una decisión de recursos y sí informa; no dice que les funcione. Una URL actualizada suele importar más: significa que reoptimizan algo que ya les rankea."
      />
    </div>
  );
}
