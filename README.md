# Leasey Content Web

Dashboard web del sistema de contenido de Leasey.AI, al estilo del FastStrat SEO Dashboard. Fase 1 (MVP): lee los borradores, el calendario, las señales/posicionamiento y las imágenes generadas del sistema de agentes (`leasey-content-system`) y los muestra en una web. No publica nada todavía. GSC y WordPress se conectan en fase 2.

## Stack
Next.js 16 + React 19 + Tailwind v4. Marca tech de Leasey (azul/teal). Sin base de datos: lee markdown e imágenes de `./content` (snapshot del repo de contenido).

## Páginas
- `/` Dashboard: conteos (tablero, borradores, imágenes, canales) y borradores recientes.
- `/status` Tablero de estado (output/STATUS.md): BORRADOR → QA-OK → APROBADO → PUBLICADO.
- `/calendar` Calendario editorial de 90 días.
- `/drafts` Lista y detalle de todos los borradores de output/.
- `/signals` Señales (research vivo) y los 5 pilares de posicionamiento.
- `/images` Galería de imágenes generadas por el agente image-maker.

## Contenido
La app lee de `./content`, un snapshot del repo `leasey-content-system`. Para actualizar:

```bash
npm run sync   # copia CLAUDE.md, context/, output/ desde ../leasey-content-system
```

Override del origen con `SOURCE_DIR`. En desarrollo se puede apuntar `CONTENT_DIR` a otra ruta.

## Local
```bash
npm install
npm run sync
npm run dev      # http://localhost:3000
```

## Deploy en Render (free)
`render.yaml` incluido (blueprint). Pasos:
1. Subir este repo a GitHub.
2. En Render: New > Blueprint > conectar el repo. Build `npm install && npm run build`, start `npm run start`, health `/api/health`.
3. Env vars opcionales: `DASHBOARD_USER` / `DASHBOARD_PASSWORD` para Basic Auth (proxy.ts).
4. El contenido va vendido en `./content` (committeado), así que el deploy es self-contained. Para refrescar: correr `npm run sync` y commitear, o (fase 2) automatizar.

## Fase 2 (pendiente, requiere credenciales)
GSC en vivo (`sc-domain:leasey.ai`), publish a WordPress, generación de portadas server-side, cron semanal. Ver `PHASE-2-APP-PLAN.md` en el repo de contenido. Se reutiliza la base de `faststrat-seo`.
