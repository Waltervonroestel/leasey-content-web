# Clusterización 2026 — Google Sheet (fuente de keywords por URL)

Sheet maestro de SEO de Alejandra. Es la fuente de verdad de: por qué keywords rankea cada URL, su posición/volumen/intención, la decisión editorial por página (Optimizar / Reescribir / Crear / Purgar), y a qué cluster pertenece. Todo brief lo consulta. No está espejado entero en el repo (cambia seguido); se lee en vivo vía API.

- **ID**: `1g5HW6gK1jfJdlt8U6E13KAQ75z5gax5uw3j1f-ia1dI`
- **Acceso**: Sheets API con `GOOGLE_SHEETS_REFRESH_TOKEN` en `leasey-content-web/.env.local`.
- **Lector reutilizable**: `leasey-content-web/scripts/read-cluster-keywords.mjs <url-substring>`
  - Ej: `node scripts/read-cluster-keywords.mjs comparing-tenant-credit-background-check-services`
  - Devuelve: fila de decisión (GA4/GSC, meta, decisión, trabajo) + keywords de Semrush (kw | pos | vol | KD | intent) + tab Organic Keywords + cluster.

## Pestañas y columnas

- **Organic Keywords**: Keyword · URL · Position · Search Volume · Estimated Traffic · Difficulty · SERP Features · CPC · CPC Competition. (Snapshot GSC/Ahrefs, ~1,350 filas.)
- **Semrush**: URL · Keyword · Position · Search Volume · Keyword Difficulty · Traffic · SERP Features by Keyword · Keyword Intents · Position Type. (La fuente más rica: trae intención y KD. ~2,000 filas.)
- **Optimizacion de contenido**: URL unica · Visitas GA4 · Visitas GSC · Posiciona en Google · Cantidad de keywords · Keywords (lista completa separada por comas) · Contenido (texto completo de la página) · Meta title · Meta description · Acción · Primary pillar (new) · Secondary pillar · **Decisión** · **Trabajo**. (~247 URLs. La columna Decisión/Trabajo es la orden editorial por página.)
- **Optimizacion + Clusters (Daniel)**: igual que arriba + columna final **Cluster (Blog Category)** (Screening & Compliance, Leasing Automation & AI, Product/Landing, etc.).
- Otras: URLs trafico · Semrush · Purga URLs · Redirecciones 301 · No index.

## Cómo se usa en un brief (ver [[brief-template]] y [[content-quality-rules]])

1. Sacar las keywords de la URL con el lector → elegir la keyword foco (la de mayor alineación con el contenido, sin forzar reescritura).
2. Separar secundarias y las cercanas a top 20 (pos ~15-26) para el plan puntual.
3. Leer la columna Keywords para proteger las secciones que sostienen posiciones (regla crítica A de [[content-quality-rules]]).
4. Leer Decisión/Trabajo para el tipo de trabajo (Optimizar add-only vs Reescribir libre) y el cluster para el interlinking.

Nota: los datos de posición de "Organic Keywords" y "Semrush" son snapshots distintos y no siempre coinciden; para intención y KD manda Semrush. Para tendencia real usar GSC en vivo (ver [[seo]] y el pull semanal en [[reference_weekly_gsc_job]]).
