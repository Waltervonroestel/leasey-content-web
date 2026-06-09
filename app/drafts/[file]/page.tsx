import { getDraft } from "@/lib/content";
import { Card, Badge } from "@/components/ui";
import Markdown from "@/components/Markdown";
import ActionButton from "@/components/ActionButton";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DraftDetail({ params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const decoded = decodeURIComponent(file);
  const draft = getDraft(decoded);
  if (!draft) notFound();

  return (
    <div className="flex flex-col gap-4">
      <Link href="/drafts" className="text-sm text-blue hover:text-blue-hover">← Drafts</Link>
      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="text-xl font-bold text-ink">{draft.name}</h1>
        <Badge label={draft.channel} />
        <span className="text-xs text-slate">{draft.dateFolder}</span>
      </div>

      <Card className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-slate">Generate image:</span>
        <ActionButton action="generate-image" payload={{ file: draft.file, kind: "hero" }} label="Data card" taskLabel={`Image (data card): ${draft.name}`} variant="ghost" />
        <ActionButton action="generate-image" payload={{ file: draft.file, kind: "cover" }} label="Blog cover" taskLabel={`Image (cover): ${draft.name}`} variant="ghost" />
        <ActionButton action="generate-image" payload={{ file: draft.file, kind: "carousel-slide" }} label="Carousel slide" taskLabel={`Image (carousel): ${draft.name}`} variant="ghost" />
        <span className="text-[11px] text-slate w-full">The brief is built internally from this draft. Output is a PNG in Images.</span>
      </Card>

      {Object.keys(draft.meta).length > 0 && (
        <Card className="text-xs text-slate">
          {Object.entries(draft.meta).map(([k, v]) => (
            <div key={k}>
              <span className="font-semibold text-ink">{k}:</span> {String(v)}
            </div>
          ))}
        </Card>
      )}
      <Card>
        <Markdown md={draft.body} />
      </Card>
    </div>
  );
}
