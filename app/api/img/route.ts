import fs from "fs";
import path from "path";
import { contentRoot } from "@/lib/content";

// Sirve imágenes desde la raíz de contenido (output/**/img/*.png).
// Validado contra path traversal: el archivo debe quedar dentro de content root.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const rel = url.searchParams.get("path") || "";
  const root = contentRoot();
  const full = path.normalize(path.join(root, rel));
  if (!full.startsWith(path.normalize(root))) {
    return new Response("forbidden", { status: 403 });
  }
  try {
    const buf = fs.readFileSync(full);
    const ext = path.extname(full).toLowerCase();
    const type =
      ext === ".png" ? "image/png" :
      ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" :
      ext === ".svg" ? "image/svg+xml" : "application/octet-stream";
    return new Response(new Uint8Array(buf), { headers: { "Content-Type": type } });
  } catch {
    return new Response("not found", { status: 404 });
  }
}
