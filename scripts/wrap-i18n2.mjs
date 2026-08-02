// Segunda pasada: lo que quedó suelto tras wrap-i18n.mjs.
import fs from "node:fs";

const T = (s) => "{t(" + JSON.stringify(s) + ")}";

const EDITS = {
  "components/SignalsView.tsx": [
    ['" (última)"', 't(" (latest)")'],
    ['"primera instantánea, sin comparación"', 't("first snapshot, nothing to compare")'],
    ['{p.lastmod || "sin fecha"}', '{p.lastmod || t("no date")}'],
    [
      "<strong>Sin impresiones no hay posición.</strong> Google solo la calcula donde la página apareció, así\n          que una consulta ausente no está en mala posición: es una consulta donde no salimos.",
      "<strong>" + T("No impressions means no position.") + "</strong>{\" \"}\n          " + T("Google only calculates it where the page appeared, so a missing query is not in a bad position: it is a query we do not show up for at all."),
    ],
    [
      "<strong>Una caída no es necesariamente culpa nuestra.</strong> Antes de buscar la explicación en un\n          cambio propio, mira si cayó todo el bloque de consultas parecidas: eso apunta al mercado o al\n          algoritmo, no a la página.",
      "<strong>" + T("A drop is not necessarily our fault.") + "</strong>{\" \"}\n          " + T("Before looking for the explanation in something we changed, check whether the whole block of similar queries dropped: that points at the market or the algorithm, not at the page."),
    ],
    [
      "<strong>Una URL nueva de un competidor no es una señal de que le funcione.</strong> Dice de qué han\n          decidido hablar, que es una decisión de recursos y sí informa. Si les rinde, solo se sabe con tiempo.",
      "<strong>" + T("A competitor's new URL is not a signal that it works for them.") + "</strong>{\" \"}\n          " + T("It says what they decided to talk about, which is a resource decision and does tell us something. Whether it pays off for them only shows with time."),
    ],
  ],
  "components/WatchView.tsx": [
    ['" (última)"', 't(" (latest)")'],
    [
      '`${r.newCount} nueva(s)${r.updatedCount ? `, ${r.updatedCount} actualizada(s)` : ""} · ${r.total.toLocaleString()} en total`',
      '`${r.newCount} ${t("new")}${r.updatedCount ? `, ${r.updatedCount} ${t("updated")}` : ""} · ${r.total.toLocaleString()} ${t("in total")}`',
    ],
  ],
  "components/PublishToWordPress.tsx": [
    ['"Publicado"', 't("Published")'],
    ["With open warnings:", "{t(\"With open warnings:\")}"],
  ],
  "components/TitleFixesMeasure.tsx": [
    [
      "{data.tracked} pages watched · {data.snapshots} semanas, de {data.from} a {data.to}",
      "{data.tracked} {t(\"pages watched\")} · {data.snapshots} {t(\"weeks, from\")} {data.from} {t(\"to\")} {data.to}",
    ],
    ['label="Funcionaron"', 'label={t("Worked")}'],
    ['label="Rinden peor"', 'label={t("Performing worse")}'],
    ['label="Changes detected"', 'label={t("Changes detected")}'],
    ['label="Readable now"', 'label={t("Readable now")}'],
    [">Antes<", ">" + T("Before") + "<"],
    [">Después<", ">" + T("After") + "<"],
    [
      ">Did the titles we already changed work?<",
      ">" + T("Did the titles we already changed work?") + "<",
    ],
  ],
};

let total = 0;
for (const [file, pairs] of Object.entries(EDITS)) {
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  let hits = 0;
  for (const [from, to] of pairs) {
    if (src.includes(from)) {
      src = src.split(from).join(to);
      hits++;
    } else {
      console.log(`  NO ENCONTRADO en ${file}: ${from.slice(0, 50)}`);
    }
  }
  if (hits) {
    fs.writeFileSync(file, src);
    total += hits;
    console.log(`  ${file}  ${hits}`);
  }
}
console.log(`\n${total} cadena(s).`);
