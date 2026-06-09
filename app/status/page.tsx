import { readFileMd } from "@/lib/content";
import { Card } from "@/components/ui";
import Markdown from "@/components/Markdown";

export const dynamic = "force-dynamic";

export default function StatusPage() {
  const md = readFileMd("output/STATUS.md");
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-ink">Tablero de estado</h1>
      <p className="text-slate text-sm">
        BORRADOR → QA-OK → APROBADO → PUBLICADO. Se mantiene desde el sistema de agentes con el comando
        <code className="mx-1 px-1 bg-bg-2 rounded">/status</code>.
      </p>
      <Card>
        {md ? <Markdown md={md} /> : <p className="text-slate">No se encontró output/STATUS.md. Corre `npm run sync`.</p>}
      </Card>
    </div>
  );
}
