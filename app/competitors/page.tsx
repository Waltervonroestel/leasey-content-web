import CompetitorsView from "@/components/CompetitorsView";
import WatchView from "@/components/WatchView";

export const dynamic = "force-dynamic";

export default function CompetitorsPage() {
  return (
    <div className="flex flex-col gap-8">
      <CompetitorsView />
      <WatchView
        kind="competidor"
        title="What they published, week by week"
        blurb="Read from their sitemaps. A new URL says what they decided to talk about, which is a resource decision and does tell us something; it does not say it works for them. An updated URL usually matters more: it means they are reoptimising something that already ranks."
      />
    </div>
  );
}
