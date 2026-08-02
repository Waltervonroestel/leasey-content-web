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
  let files: string[];
  try {
    files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  } catch {
    return [];
  }

  // El try va por archivo, no alrededor del bucle. Con un solo try envolviendo
  // todo, un frontmatter mal formado en un agente dejaba la página mostrando
  // "0 agentes" — que se lee como "el sistema no tiene agentes", no como "uno
  // de los 29 no parsea". Un agente ilegible se degrada a su nombre de archivo.
  const out: Agent[] = [];
  for (const f of files) {
    const raw = fs.readFileSync(path.join(dir, f), "utf8");
    const fallback = f.replace(/\.md$/, "");
    try {
      const { data } = matter(raw);
      out.push({
        name: String(data.name || fallback),
        description: String(data.description || ""),
        lines: raw.split("\n").length,
      });
    } catch {
      out.push({ name: fallback, description: "", lines: raw.split("\n").length });
    }
  }
  return out.sort((a, b) => b.lines - a.lines);
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
        <h1 className="text-2xl font-bold text-ink">System rules</h1>
        <p className="text-slate text-sm mt-1">
          How Leasey.AI content fails and what stops it happening again. Everything on this page comes
          from real cases, not theory. Canonical source:{" "}
          <code className="text-[11px] bg-bg-soft px-1 py-0.5 rounded">leasey-content-system</code>.
        </p>
      </div>

      <Card>
        <h2 className="text-sm font-semibold text-ink mb-3">The delivery gate</h2>
        <p className="text-sm text-slate leading-relaxed">
          A <code className="text-[11px] bg-bg-soft px-1 py-0.5 rounded">PreToolUse</code> hook opens the
          script about to run and checks whether it talks to Drive, Docs, Sheets, WordPress or Notion.
          If it pushes work outward, it reads the files that script uploads and blocks the upload when
          the document claims something it cannot back up.
        </p>
        <p className="text-sm text-slate leading-relaxed mt-2">
          There is no script allowlist: a script written tomorrow is covered the day it is written. The
          previous version named three by hand, missed the one that actually uploaded the briefs, and
          never fired once.
        </p>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold text-ink mb-3">
          Verification agents <span className="text-slate font-normal">({verifiers.length})</span>
        </h2>
        <p className="text-xs text-slate mb-3">
          The first four run in parallel. The fifth is the gate, and nothing is delivered without its
          approval. The sixth applies the findings, and nobody touches the document after it.
        </p>
        <div className="flex flex-col gap-2">
          {verifiers.map((a) => (
            <div key={a.name} className="border-l-2 border-teal pl-3">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium text-ink">{a.name}</span>
                <span className="text-[11px] text-slate">{a.lines} lines</span>
              </div>
              <p className="text-xs text-slate leading-relaxed">{a.description}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold text-ink mb-3">
          Other agents <span className="text-slate font-normal">({rest.length})</span>
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
