import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { readFileMd, contentRoot } from "@/lib/content";
import { Card } from "@/components/ui";
import Markdown from "@/components/Markdown";

export const dynamic = "force-dynamic";

type Agent = { name: string; description: string; lines: number };

// Los agentes SON el sistema de reglas: cada definición lleva dentro los casos
// reales que la hicieron fallar. Se listan desde el snapshot sincronizado.
function listAgents(): Agent[] {
  const dir = path.join(contentRoot(), ".claude", "agents");
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => {
        const raw = fs.readFileSync(path.join(dir, f), "utf8");
        const { data } = matter(raw);
        return {
          name: String(data.name || f.replace(/\.md$/, "")),
          description: String(data.description || ""),
          lines: raw.split("\n").length,
        };
      })
      .sort((a, b) => b.lines - a.lines);
  } catch {
    return [];
  }
}

const VERIFIERS = new Set([
  "link-verifier", "source-verifier", "brief-compliance", "editor-qa",
  "brief-reviewer", "brief-editor", "audit-reviewer", "cluster-sheet-analyst",
]);

export default function RulesPage() {
  const failures = readFileMd("context/writing-failures.md");
  const founders = readFileMd("context/founders-facts.md");
  const quality = readFileMd("context/content-quality-rules.md");
  const agents = listAgents();

  const verifiers = agents.filter((a) => VERIFIERS.has(a.name));
  const rest = agents.filter((a) => !VERIFIERS.has(a.name));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Reglas del sistema</h1>
        <p className="text-slate text-sm mt-1">
          Cómo falla el contenido de Leasey.AI y qué impide que vuelva a pasar. Todo lo de esta página
          viene de casos reales, no de teoría. Fuente canónica:{" "}
          <code className="text-[11px] bg-bg-soft px-1 py-0.5 rounded">leasey-content-system</code>.
        </p>
      </div>

      <Card>
        <h2 className="text-sm font-semibold text-ink mb-3">La compuerta de entrega</h2>
        <p className="text-sm text-slate leading-relaxed">
          Un hook <code className="text-[11px] bg-bg-soft px-1 py-0.5 rounded">PreToolUse</code> abre el
          script que está a punto de correr y mira si habla con Drive, Docs, Sheets, WordPress o Notion.
          Si empuja trabajo hacia afuera, revisa los archivos que ese script sube y bloquea la subida
          cuando el documento afirma algo sin respaldo.
        </p>
        <p className="text-sm text-slate leading-relaxed mt-2">
          No tiene lista blanca de scripts: un script escrito mañana queda protegido el día que se
          escribe. La versión anterior nombraba tres a mano, no incluía el que realmente subía los
          briefs, y nunca llegó a dispararse.
        </p>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold text-ink mb-3">
          Agentes de verificación <span className="text-slate font-normal">({verifiers.length})</span>
        </h2>
        <p className="text-xs text-slate mb-3">
          Los cuatro primeros corren en paralelo. El quinto es la compuerta y sin su visto bueno no se
          entrega. El sexto aplica los hallazgos y nadie toca el documento después de él.
        </p>
        <div className="flex flex-col gap-2">
          {verifiers.map((a) => (
            <div key={a.name} className="border-l-2 border-teal pl-3">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium text-ink">{a.name}</span>
                <span className="text-[11px] text-slate">{a.lines} líneas</span>
              </div>
              <p className="text-xs text-slate leading-relaxed">{a.description}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold text-ink mb-3">
          Resto de agentes <span className="text-slate font-normal">({rest.length})</span>
        </h2>
        <div className="grid gap-2 md:grid-cols-2">
          {rest.map((a) => (
            <div key={a.name} className="text-xs">
              <span className="font-medium text-ink">{a.name}</span>{" "}
              <span className="text-slate">· {a.lines}L</span>
            </div>
          ))}
        </div>
      </Card>

      {failures && (
        <Card className="prose prose-sm max-w-none">
          <Markdown md={failures} />
        </Card>
      )}

      {founders && (
        <Card className="prose prose-sm max-w-none">
          <Markdown md={founders} />
        </Card>
      )}

      {quality && (
        <Card className="prose prose-sm max-w-none">
          <Markdown md={quality} />
        </Card>
      )}

      {!failures && !founders && (
        <Card>
          <p className="text-sm text-slate">
            Contenido no encontrado. Sincroniza corriendo{" "}
            <code className="text-xs bg-bg-soft px-1 py-0.5 rounded">npm run sync</code>.
          </p>
        </Card>
      )}
    </div>
  );
}
