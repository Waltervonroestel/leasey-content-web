import Analytics from "@/components/Analytics";

export const dynamic = "force-dynamic";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-slate text-sm">
        Search performance for leasey.ai. Use this to decide what content to write next: the topics with high demand
        but low clicks are where new or better content moves the needle.
      </p>
      <Analytics />
    </div>
  );
}
