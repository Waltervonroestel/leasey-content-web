# SEO: metodología y datos (fase 1)

El blog de Leasey se prioriza con datos de búsqueda, no a ojo. Esta es la misma metodología del sistema SEO de FastStrat, traída a la capa de agentes mientras no haya app en vivo.

## Dónde van los datos GSC
GSC está **conectado en vivo** vía OAuth de la cuenta walter@leasey.ai. Cubre tres propiedades:
- `https://www.leasey.ai/` (operator-facing, default)
- `https://blog.leasey.ai/` (renter-facing)
- `https://www.silverhomes.ai/`

Scripts en `scripts/`:
- `node scripts/get-refresh-token.mjs` — solo una vez (ya hecho), guarda el `GOOGLE_REFRESH_TOKEN` en `.env.local`.
- `node scripts/list-sites.mjs` — lista propiedades accesibles.
- `node scripts/gsc-snapshot.mjs [days] [site]` — muestra snapshot en consola.
- `node scripts/gsc-to-context.mjs [days]` — escribe `context/gsc-opportunities.md` con striking-distance, untapped, low-CTR pages, top pages (filtrando ruido como 1031 exchange y scraper queries).

`context/gsc-opportunities.md` es la fuente de verdad de datos GSC. El `seo-strategist` y los writers la leen para priorizar contenido.

## Metodología de priorización (la de FastStrat)
1. Striking distance: posición 5 a 20, >=20 impresiones. Lo que sube más rápido. Prioridad alta.
2. Sin explotar: >=50 impresiones y <=1 click. Problema de title/meta o de contenido. Oportunidad de CTR.
3. Top por clicks/impresiones: lo que ya funciona, base para clusters.
4. Clusters de tema por intención: agrupa queries en pilares de contenido.
5. Intención comercial primero: las queries que llevan a demo ganan a las informacionales puras.

## Clicks vs queries (decisión heredada de FastStrat)
- Clicks = métrica de resultado, para el reporte mensual.
- Queries = métrica de oportunidad, para decidir qué escribir/optimizar cada semana.
- En fase de crecimiento y era GEO/zero-click, las queries pesan más estratégicamente.

## Nota de Ivan sobre meta descriptions
No escribir meta en masa (Google las reescribe). Solo para páginas con muchas impresiones y CTR bajo, de intención comercial.

## Enlazado interno
Cada blog enlaza al menos a una página de servicio/herramienta. El seo-strategist propone el mapa de enlaces por brief. Páginas ancla típicas: features de `context/products.md` (Liza, syndication, screening, smart leases), case study de Goldwynn, recursos de research (Fair Housing), y get-started como CTA.

## GEO/AEO (igual que FastStrat)
Escribir también para motores de respuesta (ChatGPT, Perplexity): intro con respuesta extractable, datos con fuente, estructura clara. La atribución de fuentes (regla del sistema) además ayuda a ser citado por IA.
