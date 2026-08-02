import { NextResponse } from "next/server";
import { google } from "googleapis";
import { hasWordpress, publishPost } from "@/lib/wordpress";
import { listCalendarRows } from "@/lib/sheets";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

// Publica a WordPress una fila del calendario, trayendo el texto de su Google
// Doc. Dos modos: borrador y directo.
//
// Directo pide confirmación explícita en el cuerpo de la petición. No es
// ceremonia: publicar en el sitio en vivo no se deshace con un clic, y un botón
// junto a otro se pulsa por error.
//
// Antes de publicar EN DIRECTO se pasa una comprobación mínima. No es la cadena
// de revisión entera, que vive en el otro repo, pero sí lo que ya nos ha
// costado caro: cifras sin fuente enlazada y muletillas de tolerancia cero. En
// borrador no bloquea, solo avisa: un borrador existe para arreglarlo.

const BANNED = /\b(streamlin|leverag|seamless|game.?changer|robust|unlock)\w*\b/i;

/** Cifras sin ninguna URL cerca, que es el fallo del 30 de julio. */
function unsourcedFigures(html: string): string[] {
  // Al quitar las etiquetas se pierde el href, así que una fuente correctamente
  // enlazada sobre el nombre (que es como se citan ahora) se veía como ausencia.
  // Se deja una marca visible en el texto antes de limpiar.
  const text = html
    .replace(/<a\s[^>]*href="(https?:\/\/[^"]+)"[^>]*>/gi, " [enlace:$1] ")
    .replace(/<[^>]+>/g, "\n");
  const out: string[] = [];
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const fig = l.match(/\b\d{1,3}(?:[.,]\d+)?%|\b\d{1,3}(?:,\d{3})+\b/);
    if (!fig) continue;
    const near = [lines[i - 1] || "", l, lines[i + 1] || ""].join(" ");
    if (/https?:\/\//.test(near)) continue;
    // Los datos propios declarados como tales no cuentan.
    if (/48\+|100% response/i.test(l)) continue;
    out.push(fig[0]);
  }
  return [...new Set(out)];
}

async function docHtml(docId: string): Promise<string> {
  const o = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
  o.setCredentials({ refresh_token: process.env.GOOGLE_DRIVE_FULL_REFRESH_TOKEN || process.env.GOOGLE_SHEETS_REFRESH_TOKEN });
  const drive = google.drive({ version: "v3", auth: o });
  const r = await drive.files.export({ fileId: docId, mimeType: "text/html" }, { responseType: "text" });
  const raw = String(r.data);

  // La exportación de Docs trae estilos en línea y una envoltura que WordPress
  // no necesita. Se conserva la estructura (encabezados, listas, enlaces), que
  // es justo lo que importa para SEO, y se tira el resto.
  const body = (raw.match(/<body[^>]*>([\s\S]*)<\/body>/i) || [, raw])[1];
  return body
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/ (class|id|style)="[^"]*"/gi, "")
    .replace(/<span>|<\/span>/gi, "")
    .replace(/<p>\s*<\/p>/gi, "")
    .trim();
}

export async function POST(req: Request) {
  if (!hasWordpress()) return NextResponse.json({ error: "WordPress no está configurado" }, { status: 400 });

  const body = (await req.json()) as { sheetRow?: number; live?: boolean; confirm?: string };
  if (!body.sheetRow) return NextResponse.json({ error: "Falta sheetRow" }, { status: 400 });

  const rows = await listCalendarRows();
  const row = rows.find((r) => r.sheetRow === body.sheetRow);
  if (!row) return NextResponse.json({ error: `No hay fila ${body.sheetRow} en el calendario` }, { status: 404 });

  const docId = (String(row.docLink || "").match(/[-\w]{25,}/) || [])[0];
  if (!docId) return NextResponse.json({ error: "Esa fila no tiene un Google Doc enlazado" }, { status: 400 });

  let html: string;
  try {
    html = await docHtml(docId);
  } catch (e) {
    return NextResponse.json({ error: `No se pudo leer el documento: ${(e as Error).message.slice(0, 120)}` }, { status: 502 });
  }

  const figures = unsourcedFigures(html);
  const banned = html.match(BANNED);
  const warnings = [
    ...figures.map((f) => `cifra sin fuente enlazada: ${f}`),
    ...(banned ? [`palabra prohibida: ${banned[0]}`] : []),
  ];

  // Publicar en directo con hallazgos abiertos es exactamente lo que la
  // compuerta de entrega existe para impedir.
  if (body.live && warnings.length) {
    return NextResponse.json(
      {
        blocked: true,
        warnings,
        message:
          "No se publica en directo con hallazgos abiertos. Créalo como borrador, corrígelo y vuelve a intentarlo.",
      },
      { status: 409 }
    );
  }

  if (body.live && body.confirm !== row.title) {
    return NextResponse.json(
      {
        needsConfirm: true,
        expected: row.title,
        message: "Publicar en directo no se deshace. Confirma escribiendo el título de la pieza.",
      },
      { status: 428 }
    );
  }

  try {
    const post = await publishPost({
      title: row.title,
      content: html,
      status: body.live ? "publish" : "draft",
      isMarkdown: false,
    });
    return NextResponse.json({
      ok: true,
      status: body.live ? "publish" : "draft",
      warnings,
      post: { id: post.id, link: post.link, status: post.status },
      // Lo que el sistema NO hace y sigue siendo manual, para que nadie lo dé
      // por hecho: la meta de Rank Math no se expone por el REST estándar y va
      // por el namespace del plugin, y WP Rocket sirve el título viejo hasta
      // que se purga.
      pending: [
        "Meta title y description en Rank Math (namespace propio del plugin)",
        "Nombres de archivo y alt text de las imágenes",
        "Purgar la caché de WP Rocket para que no sirva el título anterior",
        "Comprobar que el slug no cambió",
      ],
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message.slice(0, 200) }, { status: 500 });
  }
}
