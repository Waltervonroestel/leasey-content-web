import { NextResponse } from "next/server";
import { getDraft } from "@/lib/content";
import { renderImage, ImageSpec } from "@/lib/image";
import { saveContentFile, today } from "@/lib/persist";

export const runtime = "nodejs";

// Arma un brief interno desde el borrador (sin pedir nada al usuario) y
// devuelve el PNG. kind: cover | hero | carousel-slide.
function briefFromDraft(body: string, name: string, kind: string): ImageSpec {
  // Hero number: primer porcentaje o cifra grande del texto.
  const heroMatch = body.match(/\b(\d{1,3}(?:\.\d+)?%|\+\d{1,3}%|\$\d[\d,]*)/);
  const hero = heroMatch ? heroMatch[1] : undefined;
  // Fuente: busca "Source"/"according to"/"per X".
  const srcMatch = body.match(/(?:according to|per|Source:?)\s+([^.,\n]{3,50})/);
  const source = srcMatch ? `Source: ${srcMatch[1].trim()}` : undefined;
  // Título: primera línea no vacía del cuerpo.
  const firstLine = body.split("\n").map((l) => l.trim()).find((l) => l && !l.startsWith("#") && !l.startsWith("---") && !/^[A-Za-z ]+:/.test(l)) || name;
  const eyebrow = /linkedin/i.test(name) ? "LinkedIn" : /blog/i.test(name) ? "Blog" : "Leasey.AI";
  return {
    kind: (kind as ImageSpec["kind"]) || "hero",
    title: firstLine.slice(0, 120),
    eyebrow,
    heroNumber: hero,
    source,
  };
}

export async function POST(req: Request) {
  try {
    const { file, kind = "hero", title, heroNumber, source, eyebrow, subtitle } = await req.json();
    let spec: ImageSpec;
    if (file) {
      const draft = getDraft(file);
      if (!draft) return NextResponse.json({ error: "draft not found" }, { status: 404 });
      spec = briefFromDraft(draft.body, draft.name, kind);
    } else {
      spec = { kind, title: title || "Leasey.AI", heroNumber, source, eyebrow, subtitle };
    }
    const png = await renderImage(spec);
    const slugBase = (file ? file.split(/[\\/]/).pop()!.replace(/\.md$/, "") : (title || "image")).replace(/[^a-z0-9]+/gi, "-").toLowerCase().slice(0, 50);
    const rel = `output/${today()}/img/${slugBase}-${kind}.png`;
    const res = await saveContentFile(rel, png);
    return NextResponse.json({ ok: true, path: rel, committed: res.committed, brief: spec });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
