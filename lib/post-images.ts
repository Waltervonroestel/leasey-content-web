import fs from "fs";
import path from "path";
import { uploadMedia, setFeaturedMedia } from "@/lib/wordpress";
import { contentRoot } from "@/lib/content";

// Sube a WordPress las imágenes que make-post-images.mjs generó para una fila
// del calendario y las mete DENTRO del cuerpo del post, no solo como destacada.
//
// El generador nombra los archivos `NNN-slug-header.png`, `-flow.png` y
// `-before-after.png`, donde NNN es la fila de la hoja con tres dígitos. Ese
// prefijo es lo que ata una imagen a su pieza; el slug del título puede haber
// cambiado desde que se generó y no sirve para emparejar.

const DIR = () => path.join(contentRoot(), "output", "images");

/** Nombre de archivo legible: el que se ve en la URL de la imagen en WordPress. */
const filenameFor = (title: string, kind: string) =>
  `${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60)}-${kind}.png`;

const ALT: Record<string, (t: string) => string> = {
  header: (t) => t,
  flow: (t) => `Diagram of the process described in "${t}"`,
  "before-after": (t) => `Before and after comparison for "${t}"`,
};

export interface EmbedResult {
  html: string;
  featuredId: number | null;
  uploaded: string[];
  missing: boolean;
}

/**
 * Devuelve el HTML con las imágenes de cuerpo insertadas y el id de la
 * destacada. Si no hay imágenes generadas para esa fila, devuelve el HTML
 * intacto: publicar sin imagen es peor que no publicar, pero fallar la
 * publicación entera por una imagen ausente lo es más.
 */
export async function embedImages(
  sheetRow: number,
  title: string,
  html: string,
): Promise<EmbedResult> {
  const prefix = String(sheetRow).padStart(3, "0") + "-";
  let files: string[] = [];
  try {
    files = fs.readdirSync(DIR()).filter((f) => f.startsWith(prefix) && f.endsWith(".png"));
  } catch {
    return { html, featuredId: null, uploaded: [], missing: true };
  }
  if (!files.length) return { html, featuredId: null, uploaded: [], missing: true };

  const kindOf = (f: string) => (f.match(/-(header|flow|before-after)\.png$/) || [, ""])[1];

  let featuredId: number | null = null;
  const uploaded: string[] = [];
  const bodyFigures: string[] = [];

  for (const file of files.sort()) {
    const kind = kindOf(file);
    if (!kind) continue;
    const alt = (ALT[kind] || ((t: string) => t))(title);
    const media = await uploadMedia({
      bytes: fs.readFileSync(path.join(DIR(), file)),
      filename: filenameFor(title, kind),
      mimeType: "image/png",
      altText: alt,
      title: alt,
    });
    uploaded.push(`${kind} → ${media.source_url}`);

    if (kind === "header") {
      featuredId = media.id;
      continue;
    }
    bodyFigures.push(
      `<figure class="wp-block-image size-large"><img src="${media.source_url}" alt="${alt.replace(/"/g, "&quot;")}" /></figure>`,
    );
  }

  // Se reparten entre los H2: una imagen pegada a la sección que explica es lo
  // que la hace útil, y amontonarlas al final es lo mismo que no ponerlas.
  if (bodyFigures.length) {
    const parts = html.split(/(?=<h2)/i);
    if (parts.length > 1) {
      // Antes del segundo H2, del tercero, etc. — nunca antes del primero, que
      // dejaría la imagen por encima de la introducción.
      let placed = 0;
      const out: string[] = [];
      for (let i = 0; i < parts.length; i++) {
        if (i > 0 && i % 2 === 0 && placed < bodyFigures.length) out.push(bodyFigures[placed++]);
        out.push(parts[i]);
      }
      while (placed < bodyFigures.length) out.push(bodyFigures[placed++]);
      html = out.join("");
    } else {
      html += bodyFigures.join("");
    }
  }

  return { html, featuredId, uploaded, missing: false };
}

/** La destacada solo se puede asignar cuando el post ya existe. */
export async function applyFeatured(postId: number, featuredId: number | null) {
  if (featuredId) await setFeaturedMedia(postId, featuredId);
}
