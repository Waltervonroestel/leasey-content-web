# Fase 2: migración a app Next.js (clon del sistema SEO de FastStrat)

La fase 1 (capa de agentes en markdown) ya da las capacidades: SEO por GSC, tracker de estado, medición, briefs visuales, press release. La fase 2 las lleva a una app web con dashboard y publicación automática, replicando el sistema SEO de FastStrat (`faststrat-seo/`).

Se dispara cuando Walter tenga las credenciales de Leasey (abajo). Nada de esto bloquea la operación de la fase 1.

## Qué se construye (paridad con FastStrat SEO)
App standalone `leasey-content/` (Next.js 16 + Tailwind v4 + React 19), puerto propio (ej. 3200), separada del repo de contenido o dentro de él.

- `/` Dashboard SEO: clicks/impresiones/CTR/posición por página desde GSC (`/api/gsc`), selector 7/14/28/90 días, tabla filtrable, pie charts (recharts): clicks por página, demanda por tema (clusters), oportunidad de temas nuevos.
- `/ideas`: tanda semanal de briefs (lo que hoy hace `seo-strategist` + `calendar-planner`), priorizados por GSC, con outline. Data en `data/ideas/*.json`.
- `/blogs`: lista `content/blog/*.md`, publica/actualiza en WordPress (`/api/wordpress/publish`, idempotente por slug), edición con el Agent SDK ("Editar con IA"), portada por post.
- `/reports`: queries striking-distance y sin explotar, botones "Generar" (escribe blog borrador desde keyword) y "+ Idea".
- `/status`: el tablero de `output/STATUS.md` como vista web.
- `/performance`: el loop de medición con datos de GSC + métricas pegadas.
- Portadas: `lib/cover.ts` (SVG a PNG con sharp) con la paleta de Leasey (ver `context/brand.md`), subidas a WP como featured_media.
- Cron semanal: GitHub Actions POST a `/api/weekly` (Render free no corre cron), igual que FastStrat.
- Deploy: Render free + git-as-storage para persistencia, Basic Auth en proxy.ts, health check sin auth.

## Estado: las páginas Analytics y Reports ya están construidas (esperan credenciales)
El dashboard ya tiene `/analytics` (stat cards + donuts recharts: clicks por página, demanda por tema, clicks por tema + tabla de temas) y `/reports` (striking-distance, untapped, top-by-clicks con botón "Write blog"). Hoy muestran "Connect GSC". Apenas se pongan las env vars de GSC en Render, cargan datos reales en vivo. Env vars: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, GOOGLE_REFRESH_TOKEN, GSC_SITE_URL=sc-domain:leasey.ai.

## Credenciales necesarias (lo que falta)
- GSC: OAuth2 (NO service account), propiedad `sc-domain:leasey.ai` (y/o `blog.leasey.ai`). Refresh token vía `scripts/get-refresh-token.mjs`.
- WordPress de Leasey: `WP_URL`, `WP_USER`, `WP_APP_PASSWORD` (Application Password, NO la de login). Confirmar que el blog corre en WordPress.
- Agent SDK: `CLAUDE_CODE_OAUTH_TOKEN` (`claude setup-token`).
- Email (opcional, aviso semanal): Resend API key.
- Deploy: cuenta Render + repo en el GitHub de Walter.

## Reutilizable de FastStrat (no reinventar)
La arquitectura, los gotchas de Next 16 (proxy.ts, params Promise, borrar `.next`), `lib/wordpress.ts`, `lib/cover.ts`, `lib/gsc`, el cron de GitHub Actions y el patrón git-as-storage ya están resueltos en `faststrat-seo/`. Fase 2 es adaptar, no empezar de cero. Cambian: marca (paleta Leasey), dominio GSC, WordPress destino, y que el contenido respeta las reglas de ESTE sistema (dos funnels, insight-led, atribución, sin em-dashes, inglés).

## Orden sugerido
1. Conseguir credenciales GSC + WP de Leasey.
2. Clonar la estructura de faststrat-seo, recolorar a marca Leasey.
3. Conectar GSC en vivo (reemplaza `data/gsc/` manual).
4. Conectar WordPress (reemplaza el copy-paste manual).
5. Portadas con sharp en paleta Leasey.
6. Dashboard + reports + ideas + status + performance.
7. Deploy + cron semanal.
