import { getDraft } from "@/lib/content";
import { Card, Badge } from "@/components/ui";
import Markdown from "@/components/Markdown";
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
      <Link href="/drafts" className="text-sm text-blue hover:text-blue-hover">← Borradores</Link>
      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="text-xl font-bold text-ink">{draft.name}</h1>
        <Badge label={draft.channel} />
        <span className="text-xs text-slate">{draft.dateFolder}</span>
      </div>
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
