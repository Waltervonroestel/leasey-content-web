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
        title="What the trade press is publishing"
        blurb="The outlets in pm-publications.md. Good for two things: knowing what is being talked about, and seeing what each outlet accepts before writing the pitch. If an outlet has run three weeks of data stories, a product pitch is not getting in."
      />
    </div>
  );
}
