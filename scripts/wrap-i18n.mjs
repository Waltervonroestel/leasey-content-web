// Deja el texto visible en inglés (idioma base) y lo envuelve en t(), para que
// el selector EN/ES lo traduzca.
//
// La clave del diccionario es la propia frase en inglés, no un identificador:
// si falta una traducción sale el inglés, que es correcto, y no "signals.title",
// que es lo que se ve en la mitad de los paneles con i18n a medio migrar.
import fs from "node:fs";

const T = (s) => "{t(" + JSON.stringify(s) + ")}";

const EDITS = {
  "components/SignalsView.tsx": [
    [
      "Esta es la instantánea más antigua que hay, así que no tiene con qué compararse. Un total no dice\n            nada por sí solo: lo que sirve es el movimiento, y el movimiento necesita dos fotos.",
      T("This is the oldest snapshot there is, so there is nothing to compare it with. A total says nothing on its own: what matters is the movement, and movement needs two photos."),
    ],
    [
      "Posición 5 a 20, más de 100 impresiones, dos clics o menos. Google ya nos muestra y nadie entra: es\n          problema de título y meta, no de contenido.",
      T("Position 5 to 20, over 100 impressions, two clicks or fewer. Google is already showing us and nobody clicks: that is a title and meta problem, not a content one."),
    ],
    [
      "Por aquí conviene empezar. Una caída con volumen suele tener causa concreta, y a veces somos\n              nosotros: una consolidación, un cambio de título, una página borrada.",
      T("Start here. A drop with volume behind it usually has a concrete cause, and sometimes it is us: a consolidation, a title change, a deleted page."),
    ],
    [
      "Aparecen por primera vez con 30 impresiones o más. Google nos prueba en algo que antes no.",
      T("Appearing for the first time with 30 impressions or more. Google is testing us on something it was not before."),
    ],
    [
      "Tenían 50 impresiones o más y ahora no salen. Puede ser estacionalidad, puede ser que perdimos la\n              página.",
      T("They had 50 impressions or more and now do not show. Could be seasonality, could be that we lost the page."),
    ],
  ],
  "components/WatchView.tsx": [
    ['>Instantánea<', ">" + T("Snapshot") + "<"],
    ['{data.available.length} guardadas', "{data.available.length} " + T("stored")],
    ['label="Comparado con"', "label={t(\"Compared with\")}"],
    [
      "Esta es la instantánea más antigua, así que no hay con qué compararla. Lo que ves son los totales\n            registrados, no publicaciones nuevas.",
      T("This is the oldest snapshot, so there is nothing to compare it with. What you see are the recorded totals, not new publications."),
    ],
    [
      "No se pudo leer, que no es lo mismo que no haber publicado. Habría que revisarlo a mano.",
      T("We could not read it, which is not the same as them not publishing. Worth a manual check."),
    ],
    ['{p.lastmod || "sin fecha"}', '{p.lastmod || t("no date")}'],
  ],
  "components/PRMatchView.tsx": [
    [
      "Todavía no hay instantánea de medios. El cron la genera cada lunes.",
      T("No outlet snapshot yet. The weekly cron generates it every Monday."),
    ],
    [
      "Deducido de sus propias URLs recientes, no de una taxonomía nuestra. Es el dato que falta cuando se\n              escribe un pitch: se manda el mismo texto a los cinco medios y no entra en ninguno.",
      T("Derived from their own recent URLs, not from a taxonomy we imposed. This is the fact missing when someone writes a pitch: the same text goes to all five outlets and lands nowhere."),
    ],
    [
      "bloquean el acceso\n                automatizado. No se pudo leer, que no es lo mismo que no publicar.",
      " " + T("block automated access. We could not read them, which is not the same as them not publishing."),
    ],
    [
      "Solo aparecen los temas donde <strong>coinciden dos cosas</strong>: un medio viene publicando sobre\n              ello, y la gente lo busca con demanda medida en Search Console. Una sola de las dos no basta. Que un\n              medio trate un tema no lo convierte en tema nuestro, y una consulta con volumen donde nadie del\n              sector escribe suele ser una consulta de otra categoría.",
      T("Only topics where two things agree: an outlet is publishing on it, and people search for it with measured demand in Search Console. Either one alone is not enough. An outlet covering a topic does not make it ours, and a query with volume that nobody in the sector writes about is usually a query from another category."),
    ],
    [
      "Ningún tema cumple las dos condiciones ahora mismo. Con una sola instantánea de medios el perfil\n                temático es pobre; mejora en cuanto haya varias semanas.",
      T("No topic meets both conditions right now. With a single outlet snapshot the topic profile is thin; it improves once there are several weeks."),
    ],
    ["publican: {i.outlets.join", T("publishing on it:") + " {i.outlets.join"],
  ],
  "components/PublishToWordPress.tsx": [
    [
      "Publish live no se deshace. Escribe el título para confirmar:",
      T("Publishing live does not undo. Type the title to confirm:"),
    ],
  ],
  "components/TitleFixesMeasure.tsx": [
    [
      "Nadie tiene que marcar nada a mano: cada instantánea semanal guarda el título real de las páginas con\n          más impresiones, así que un cambio se detecta solo comparando dos semanas.",
      T("Nobody has to flag anything by hand: each weekly snapshot stores the real title of the pages with the most impressions, so a change detects itself by comparing two weeks."),
    ],
    [
      "Ningún título ha cambiado entre las instantáneas guardadas. Cuando cambies uno, aparecerá aquí solo.",
      T("No title has changed between the stored snapshots. When you change one, it will show up here on its own."),
    ],
    [
      "cambió el {c.changedOn}, hace {c.daysSince} días",
      T("changed on") + " {c.changedOn}, {c.daysSince} " + T("days ago"),
    ],
    [
      "<strong>Si la página perdió posición, el CTR no se atribuye al título.</strong> Un título distinto y una\n        posición distinta son dos cambios a la vez, y no se puede saber cuál movió el clic. Hacen falta 14 días\n        para que Google reprocese y 200 impresiones en cada lado para que la diferencia signifique algo.",
      "<strong>" + T("If the page also lost position, the CTR is not attributed to the title.") + "</strong>{\" \"}\n        " + T("A different title and a different position are two changes at once, and there is no way to tell which moved the click. It takes 14 days for Google to reprocess and 200 impressions on each side for the difference to mean anything."),
    ],
    ["clics de", "clicks of"],
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
      console.log(`  NO ENCONTRADO en ${file}: ${from.slice(0, 46)}...`);
    }
  }
  if (hits && !src.includes("useT()")) {
    src = src.replace(/^(import .*\n)/m, `$1import { useT } from "@/lib/i18n";\n`);
    src = src.replace(/(export default function \w+\([^)]*\)[^{]*\{\n)/, `$1  const t = useT();\n`);
  }
  if (hits) {
    fs.writeFileSync(file, src);
    total += hits;
    console.log(`  ${file}  ${hits}`);
  }
}
console.log(`\n${total} cadena(s) envueltas.`);
