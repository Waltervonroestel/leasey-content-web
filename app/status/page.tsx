import { readFileMd } from "@/lib/content";
import { Card } from "@/components/ui";
import Markdown from "@/components/Markdown";

export const dynamic = "force-dynamic";

export default function StatusPage() {
  const md = readFileMd("output/STATUS.md");
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-ink">Status board</h1>
      <p className="text-slate text-sm">
        BORRADOR → QA-OK → APROBADO → PUBLICADO. Maintained from the agent system with the
        <code className="mx-1 px-1 bg-bg-2 rounded">/status</code> command.
      </p>
      <Card>
        {md ? <Markdown md={md} /> : <p className="text-slate">output/STATUS.md not found. Run `npm run sync`.</p>}
      </Card>
    </div>
  );
}
