import PRView from "@/components/PRView";
import WatchView from "@/components/WatchView";
import PRMatchView from "@/components/PRMatchView";

export const dynamic = "force-dynamic";

export default function PrPage() {
  return (
    <div className="flex flex-col gap-8">
      <PRView />
      <PRMatchView />
      <WatchView
        kind="medio"
        title="Qué está publicando la prensa del sector"
        blurb="Los medios de pm-publications.md. Sirve para dos cosas: saber de qué se habla, y ver qué acepta cada medio antes de escribir el pitch. Si un medio lleva tres semanas con historias de datos, un pitch de producto no va a entrar."
      />
    </div>
  );
}
