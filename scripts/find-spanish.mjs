// Lista el español que llega a la pantalla, no el de los comentarios.
// Los comentarios se quedan en español a propósito: los lee quien mantiene el
// repo, no quien abre el panel.
import fs from "node:fs";
import path from "node:path";

const walk = (d) =>
  fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(d, e.name);
    if (e.isDirectory()) return e.name === "node_modules" || e.name === ".next" ? [] : walk(p);
    return /\.tsx$/.test(e.name) ? [p] : [];
  });

const ACCENT = /[áéíóúñÁÉÍÓÚÑ¿¡]/;

for (const file of [...walk("components"), ...walk("app")]) {
  const lines = fs.readFileSync(file, "utf8").split("\n");
  let block = false;
  const hits = [];
  lines.forEach((raw, i) => {
    const line = raw.trim();
    if (block) {
      if (line.includes("*/")) block = false;
      return;
    }
    if (line.startsWith("/*")) {
      if (!line.includes("*/")) block = true;
      return;
    }
    if (line.startsWith("//") || line.startsWith("*") || line.startsWith("{/*")) return;
    if (ACCENT.test(line)) hits.push(`${i + 1}: ${line.slice(0, 110)}`);
  });
  if (hits.length) console.log(`\n${file}\n  ` + hits.join("\n  "));
}
