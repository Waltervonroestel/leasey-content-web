// Pasa a inglés el texto VISIBLE de la interfaz, y solo ese.
//
// El panel lo usa el equipo entero y la app ya estaba en inglés antes de que yo
// añadiera pestañas: dejarla mitad y mitad es peor que cualquiera de las dos.
//
// Dos cosas que NO se tocan, a propósito:
//   - Los comentarios del código. Explican por qué existe cada decisión y
//     CLAUDE.md permite el español como idioma de trabajo.
//   - Los archivos de context/.
//
// Por eso se salta cualquier línea que sea comentario. Un reemplazo masivo sin
// esa guarda es el caso 8 del catálogo aplicado al código: una regla de formato
// entrando donde no debe.
import fs from "node:fs";

const FILES = [
  "components/SignalsView.tsx",
  "components/WatchView.tsx",
  "components/PRMatchView.tsx",
  "components/PublishToWordPress.tsx",
  "components/TitleFixesMeasure.tsx",
  "app/api/signals/route.ts",
  "app/api/watch/route.ts",
  "app/api/pr/match/route.ts",
  "app/api/wordpress/from-calendar/route.ts",
  "app/api/ga4/route.ts",
  "app/competitors/page.tsx",
  "app/pr/page.tsx",
];

// Solo cadenas largas y sin ambigüedad. Nada de palabras sueltas: "hace" o
// "Antes" aparecen en comentarios y en prosa, y sustituirlas a ciegas rompe
// tanto el código como la explicación.
const MAP = [
  ["Qué se movió", "What moved"],
  ["Ventana de 30 días", "30-day window"],
  ["Comparado con la instantánea del", "Compared with the snapshot from"],
  ["Sin semana anterior con la que comparar.", "No previous week to compare against."],
  ["Cerca y sin clics", "Close, and getting no clicks"],
  ["lo más accionable", "most actionable"],
  ["Bajaron tres puestos o más", "Dropped three places or more"],
  ["Subieron tres puestos o más", "Rose three places or more"],
  ["Consultas nuevas", "New queries"],
  ["Dejaron de aparecer", "Stopped appearing"],
  ["Qué publicaron los competidores", "What competitors published"],
  ["Cómo leer esto", "How to read this"],
  ["Cargando señales…", "Loading signals…"],
  ["No se pudieron cargar las señales.", "Could not load signals."],
  ["Todavía no hay instantáneas.", "No snapshots yet."],
  ["semanas guardadas", "weeks stored"],
  ["Clics vs semana anterior", "Clicks vs previous week"],
  ["Nada en esta categoría esta semana.", "Nothing in this category this week."],
  ["Piezas nuevas", "New pieces"],
  ["Sin poder leer", "Could not read"],
  ["URLs registradas", "URLs recorded"],
  ["Actualizadas: están reoptimizando algo que ya les rankea", "Updated: reoptimising something that already ranks for them"],
  ["A qué medio va cada anuncio", "Which outlet fits each announcement"],
  ["Qué deberíamos escribir", "What we should write"],
  ["De qué viene hablando cada medio", "What each outlet has been covering"],
  ["dos señales a la vez", "two signals at once"],
  ["Consulta con demanda", "Query with demand"],
  ["Cruzando calendario y medios…", "Cross-referencing calendar and outlets…"],
  ["→ Borrador en WordPress", "→ Draft in WordPress"],
  ["Publicar en directo", "Publish live"],
  ["Pega el título aquí", "Paste the title here"],
  ["Borrador creado", "Draft created"],
  ["abrir en WordPress", "open in WordPress"],
  ["Con avisos abiertos:", "With open warnings:"],
  ["Sigue siendo manual", "Still manual"],
  ["Sin Google Doc enlazado: no hay qué publicar.", "No Google Doc linked: nothing to publish."],
  ["¿Funcionaron los títulos que ya cambiamos?", "Did the titles we already changed work?"],
  ["Cambios detectados", "Changes detected"],
  ["Ya legibles", "Readable now"],
  ["páginas vigiladas", "pages watched"],
];

const isComment = (l) => /^\s*(\/\/|\*|\/\*)/.test(l);

let files = 0, hits = 0;
for (const f of FILES) {
  if (!fs.existsSync(f)) continue;
  const lines = fs.readFileSync(f, "utf8").split("\n");
  let changed = false;
  const out = lines.map((l) => {
    if (isComment(l)) return l;
    let r = l;
    for (const [es, en] of MAP) {
      if (r.includes(es)) { r = r.split(es).join(en); hits++; changed = true; }
    }
    return r;
  });
  if (changed) { fs.writeFileSync(f, out.join("\n")); files++; console.log("  " + f); }
}
console.log(`\n${files} archivo(s), ${hits} cadena(s). Comentarios intactos.`);
