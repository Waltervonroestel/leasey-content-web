import { readFileMd } from "@/lib/content";
import { Card } from "@/components/ui";
import Markdown from "@/components/Markdown";
import ActionButton from "@/components/ActionButton";

export const dynamic = "force-dynamic";

export default function PrPage() {
  const directory = readFileMd("context/distribution/pm-publications.md");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Press Releases</h1>
          <p className="text-slate text-sm mt-1">Write press releases and map property management outlets to pitch them.</p>
        </div>
        <div className="flex gap-2">
          <ActionButton endpoint="/api/refresh-directory" payload={{ kind: "pm" }} label="Search PM outlets" busyLabel="Searching..." variant="ghost" />
          <ActionButton endpoint="/api/generate-pr" payload={{ topic: "latest Leasey.AI announcement" }} label="Draft a press release" busyLabel="Writing..." />
        </div>
      </div>
      <Card>
        {directory ? <Markdown md={directory} /> : <p className="text-slate">No outlet directory yet. Click “Search PM outlets”.</p>}
      </Card>
    </div>
  );
}
