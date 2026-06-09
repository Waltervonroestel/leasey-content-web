// Copia un snapshot del sistema de contenido (markdown + imágenes + output)
// desde ../leasey-content-system a ./content, para que la app sea self-contained
// en Render. Correr: npm run sync
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = process.env.SOURCE_DIR || path.join(__dirname, "..", "..", "leasey-content-system");
const DEST = path.join(__dirname, "..", "content");

// Qué copiamos (lo que la app necesita leer).
const INCLUDE = ["CLAUDE.md", "context", "output", "PHASE-2-APP-PLAN.md", "START.md"];

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      if (entry === "node_modules" || entry === ".git") continue;
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

if (!fs.existsSync(SRC)) {
  console.error(`No se encontró el sistema de contenido en: ${SRC}`);
  console.error("Setea SOURCE_DIR o coloca leasey-content-system como carpeta hermana.");
  process.exit(1);
}

// Limpia y recrea ./content
fs.rmSync(DEST, { recursive: true, force: true });
fs.mkdirSync(DEST, { recursive: true });

let count = 0;
for (const item of INCLUDE) {
  const s = path.join(SRC, item);
  if (!fs.existsSync(s)) continue;
  copyRecursive(s, path.join(DEST, item));
  count++;
}

console.log(`Sync OK: ${count} items copiados de ${SRC} a ${DEST}`);
