import { readFileMd } from "@/lib/content";
import { Card } from "@/components/ui";
import Markdown from "@/components/Markdown";

export const dynamic = "force-dynamic";

export default function GuidelinesPage() {
  const md = readFileMd("context/aeo-guidelines.md");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">AEO Content Guidelines</h1>
        <p className="text-slate text-sm mt-1">
          El playbook maestro. Todo contenido de Leasey.AI publicado a partir del 30 de junio de 2026 sigue estas reglas.
          Fuente canónica: <code className="text-[11px] bg-bg-soft px-1 py-0.5 rounded">context/aeo-guidelines.md</code> en <code className="text-[11px] bg-bg-soft px-1 py-0.5 rounded">leasey-content-system</code>.
        </p>
      </div>

      {md ? (
        <Card className="prose prose-sm max-w-none">
          <Markdown md={md} />
        </Card>
      ) : (
        <Card>
          <p className="text-sm text-slate">
            Documento no encontrado. Sincroniza el contenido corriendo{" "}
            <code className="text-xs bg-bg-soft px-1 py-0.5 rounded">node scripts/sync-content.mjs</code> desde{" "}
            <code className="text-xs bg-bg-soft px-1 py-0.5 rounded">leasey-content-web</code>.
          </p>
        </Card>
      )}
    </div>
  );
}
