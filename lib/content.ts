import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

// Raíz del contenido del sistema. Por defecto la copia vendida en ./content
// (sincronizada con scripts/sync-content.mjs desde ../leasey-content-system).
// Override con CONTENT_DIR para apuntar a otra ruta en desarrollo.
const CONTENT_ROOT =
  process.env.CONTENT_DIR || path.join(process.cwd(), "content");

export function contentRoot() {
  return CONTENT_ROOT;
}

function safeRead(rel: string): string | null {
  try {
    return fs.readFileSync(path.join(CONTENT_ROOT, rel), "utf8");
  } catch {
    return null;
  }
}

export async function mdToHtml(md: string): Promise<string> {
  return marked.parse(md) as Promise<string> as unknown as string;
}

export function readFileMd(rel: string): string | null {
  return safeRead(rel);
}

// --- Borradores en output/ ---
export interface Draft {
  file: string; // ruta relativa desde la raíz de contenido
  name: string;
  dateFolder: string;
  channel: string;
  body: string;
  meta: Record<string, unknown>;
}

const CHANNEL_HINTS: [RegExp, string][] = [
  [/linkedin-carlos/i, "LinkedIn · Carlos"],
  [/linkedin-juan/i, "LinkedIn · Juan"],
  [/linkedin-company/i, "LinkedIn · Empresa"],
  [/^blog-renter|blog-renter/i, "Blog · Renter"],
  [/blog-/i, "Blog"],
  [/reddit-/i, "Reddit"],
  [/community-/i, "Comunidad"],
  [/press-release/i, "Press Release"],
  [/calendar-/i, "Calendario"],
  [/seo-briefs/i, "SEO Briefs"],
  [/image-brief/i, "Brief Visual"],
  [/performance-report/i, "Desempeño"],
  [/editor-qa/i, "QA"],
];

function channelFor(name: string): string {
  for (const [re, label] of CHANNEL_HINTS) if (re.test(name)) return label;
  return "Otro";
}

function walk(dir: string, base: string, acc: string[]) {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    const rel = path.join(base, e.name);
    if (e.isDirectory()) walk(full, rel, acc);
    else if (e.name.endsWith(".md")) acc.push(rel);
  }
}

export function listDrafts(): Draft[] {
  const outRoot = path.join(CONTENT_ROOT, "output");
  const files: string[] = [];
  walk(outRoot, "output", files);
  const drafts: Draft[] = [];
  for (const rel of files) {
    if (rel.endsWith("STATUS.md")) continue;
    const raw = safeRead(rel);
    if (raw == null) continue;
    const parts = rel.split(/[\\/]/);
    const dateFolder = parts[1] || "";
    const name = parts[parts.length - 1];
    const parsed = matter(raw);
    drafts.push({
      file: rel.replace(/\\/g, "/"),
      name,
      dateFolder,
      channel: channelFor(name),
      body: parsed.content,
      meta: parsed.data,
    });
  }
  // Más recientes primero por carpeta de fecha, luego por nombre.
  drafts.sort((a, b) =>
    b.dateFolder.localeCompare(a.dateFolder) || a.name.localeCompare(b.name)
  );
  return drafts;
}

export function getDraft(file: string): Draft | null {
  const all = listDrafts();
  return all.find((d) => d.file === file) || null;
}

// --- Imágenes generadas en output/**/img/*.png ---
export function listImages(): string[] {
  const outRoot = path.join(CONTENT_ROOT, "output");
  const imgs: string[] = [];
  function walkImg(dir: string, base: string) {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const full = path.join(dir, e.name);
      const rel = path.join(base, e.name);
      if (e.isDirectory()) walkImg(full, rel);
      else if (/\.(png|jpe?g|svg)$/i.test(e.name)) imgs.push(rel.replace(/\\/g, "/"));
    }
  }
  walkImg(outRoot, "output");
  return imgs.sort((a, b) => b.localeCompare(a));
}

export interface StatusCount {
  status: string;
  count: number;
}

export function statusSummary(): { total: number; counts: StatusCount[] } {
  const status = safeRead("output/STATUS.md") || "";
  const labels = ["BORRADOR", "QA-OK", "APROBADO", "PUBLICADO"];
  const counts = labels.map((s) => ({
    status: s,
    // Cuenta apariciones en celdas de tabla (| ESTADO |).
    count: (status.match(new RegExp(`\\|\\s*${s}\\s*\\|`, "g")) || []).length,
  }));
  return { total: counts.reduce((a, c) => a + c.count, 0), counts };
}
