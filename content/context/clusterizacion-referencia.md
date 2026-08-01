# Clusterización 2026: documento de referencia para escribir briefs

Generado el 2026-07-30. Fuentes: la sheet **en vivo** `1g5HW6gK1jfJdlt8U6E13KAQ75z5gax5uw3j1f-ia1dI` (9 pestañas, leídas por Sheets API), la caché local en `context/clusterizacion-cache/` (8 archivos), **GSC en vivo** (`searchanalytics.query`, `page`, ventana 2026-05-01 → 2026-07-30, 771 páginas, 609.888 impresiones, 1.858 clics) y **483 resoluciones HTTP en vivo** contra el sitio.

Este documento existe para evitar los errores del 30 de julio de 2026: afirmar posiciones y competencia sin medición. Regla número uno del `cluster-sheet-analyst`: **cada fuente prueba una cosa distinta, y siempre hay que decir qué NO prueba.**

---

## 1. Qué prueba y qué no prueba cada pestaña

| Pestaña (filas con datos, en vivo) | Qué SÍ prueba | Qué NO prueba |
|---|---|---|
| **Semrush** (3.039) | Keywords por las que el sitio **ya rankea**, con volumen, posición, KD, intent y tipo de posición | **NO es una base de investigación de keywords.** Que un término no aparezca NO significa volumen cero: significa que no rankeamos por él. Tampoco prueba tráfico: 3.039 filas y la columna `Traffic` es 0 en casi todas |
| **Organic Keywords** (1.354) | **Exactamente la misma naturaleza.** Verificado: las 1.354 filas traen `Position` poblada, y 464 keywords coinciden literalmente con las de Semrush. Es otro export de posiciones, con dos columnas extra (CPC, CPC Competition) y `Estimated Traffic` en vez de `Traffic`. Cubre 168 URLs distintas contra 260 de Semrush | Lo mismo que Semrush. **No es research.** Un término ausente no tiene "volumen cero", tiene "sin dato". Y al cubrir menos URLs que Semrush, su ausencia prueba todavía menos |
| **URLs trafico** (723) | Visitas GA4 y una columna llamada `Visitas GSC` por URL, en la foto en que se tomó | **`Visitas GSC` son CLICS, no impresiones.** Verificado contra GSC en vivo: la home marca 252 en la sheet y tiene 675 clics / 18.371 impresiones. Tráfico tampoco es ranking. Y 31 URLs marcadas 0/0 sí tienen impresiones hoy |
| **Optimizacion de contenido** (242) | La decisión editorial por URL: acción, pilar primario/secundario, decisión, trabajo | Es un **plan**, no una medición. Las cifras que cita el campo `Decisión` en prosa son de la foto vieja, no de GSC hoy |
| **Optimizacion + Clusters (Daniel)** (247) | Lo mismo, más `Meta title`, `Meta description` y `Cluster (Blog Category)` | Igual: plan. Es la versión **más completa** de las dos (5 URLs más y 3 columnas más) |
| **Redirecciones 301** (335) | Qué URL se consolida en cuál **según el plan**, y una columna `Hecho` | **NO prueba que la redirección esté ejecutada.** Eso solo lo dice resolver la URL. Ver sección 4: `Hecho` resultó fiable, pero 68 URLs con `Hecho` vacío YA redirigen a otro destino distinto del planeado |
| **Purga URLs** (728) | Es la **lista maestra**: las 728 URLs con su acción (301: 363, 410: 127, index/Index: 238) | Plan, no medición. Y el nombre engaña: no es solo "purga" |
| **No index** (8) | 8 URLs marcadas noindex, todas con `Hecho = Si` | Plan. No comprueba que la etiqueta esté en el HTML |
| **410** (132) | Páginas eliminadas deliberadamente, con `Hecho` y `Eliminados` | Ver sección 7. Aquí `Hecho` sí es fiable al 100%, pero el campo URL tiene un defecto de datos serio |
| GSC en vivo | Impresiones, clics y posición **reales** de los últimos 90 días | Sin impresiones no hay posición. Cero impresiones no distingue entre "nadie lo busca" y "no aparecemos". Y no da volumen de búsqueda |

**Si te preguntan por el volumen de una keyword por la que el sitio no rankea, la respuesta correcta es "no tenemos ese dato, hace falta una herramienta de investigación externa".** No es "volumen cero".

---

## 2. Las 20 URLs con más impresiones (GSC en vivo)

La consigna pedía "las 20 URLs con más impresiones GSC según `urls-trafico.json`". **Ese archivo no contiene impresiones.** Su columna `Visitas GSC` son clics. Así que doy las dos tablas y digo cuál gana.

### 2A. Las 20 con más impresiones reales (GSC en vivo, 90 días). Esta es la buena.

| # | URL | Impres. | Clics | Pos. media | Acción del plan | Decisión (resumen) |
|---|---|---|---|---|---|---|
| 1 | `/blog/whats-the-best-property-management-software-4-popular-options/` | 77.772 | 74 | 16,0 | index | INTOCABLE. 172 kw, 16 en top 10. Destino de 19 consolidaciones |
| 2 | `/blog/frequently-asked-questions-about-facebook-marketplace-for-rental-properties/` | 19.150 | 58 | 5,7 | index | De las páginas con más tráfico real del sitio |
| 3 | `/` (home) | 18.371 | 675 | 11,5 | index | LA HOME. No tenía trabajo asignado. Pos 1 en marca |
| 4 | `/resources/find-hidden-gems-facebook-marketplace-rentals/` | 16.312 | 58 | 6,7 | index | Excelente ratio. Escrita para inquilinos, no para PMs |
| 5 | `/resources/tools/tenant-income-qualification-calculator/` | 9.909 | 37 | 7,5 | index | Tool fuerte. La sheet corrige su propia decisión previa |
| 6 | `/resources/1031-exchange-rental-investment-portfolios/` | 9.687 | 0 | 80,0 | index | 141 kw, vol 23.250, pos media 80. **Cero clics** |
| 7 | `/blog/the-property-managers-complete-guide-to-facebook-marketplace-for-rental-properties/` | 8.810 | 39 | 10,8 | index | PILAR del cluster FB. Destino de 9 consolidaciones |
| 8 | `/resources/tools/security-deposit-calculator-free-tool/` | 8.074 | 64 | 12,0 | index | La tool más fuerte del sitio |
| 9 | `/resources/comparing-tenant-credit-background-check-services/` | 7.663 | 8 | 25,3 | index | PILAR del cluster SCREENING. Destino de 19 consolidaciones |
| 10 | `/resources/top-property-management-software-for-commercial-real-estate/` | 6.944 | 0 | 37,4 | index | Destino de 7 consolidaciones. **Cero clics** |
| 11 | `/resources/complete-guide-property-lease-takeover/` | 6.717 | 18 | 19,0 | index | PILAR de lease takeover. Kw ancla `lease takeover` (vol 4.400) |
| 12 | `/resources/landlords-avoiding-facebook-marketplace-rentals/` | 6.132 | 10 | 9,3 | index | INTOCABLE. `facebook marketplace rentals by owner` pos 1 |
| 13 | `/resources/navigating-the-galaxy-of-property-management-software.../` | 5.874 | 0 | 26,2 | index | Corrección: estaba marcada "Ninguno" |
| 14 | `/resources/listing-guides/new-york-city-rental-property/` | 5.861 | 2 | 18,9 | index | Plantilla Listing Guides. 41 kw head |
| 15 | `/resources/listing-guides/san-antonio-rental-property/` | 5.809 | 1 | 14,5 | index | Canibaliza a LA |
| 16 | `/resources/toronto-lease-takeover-navigation/` | 5.567 | 61 | 11,4 | index | Mejor ratio de conversión del sitio. NO fusionar |
| 17 | `/resources/advertise-rental-property-for-free-strategies/` | 5.486 | 1 | 37,8 | index | Superviviente del cluster advertising |
| 18 | `/resources/average-property-management-fees-region-pricing-structure-analysis/` | 5.427 | 5 | 11,9 | **301** | 0 kw en la sheet → superviviente de PM fees. **Contradicción, ver abajo** |
| 19 | `/blog/how-to-post-a-rental-property-on-facebook-marketplace/` | 5.285 | 14 | 11,7 | index | Tutorial del cluster FB |
| 20 | `/resources/property-lease-transfer-key-steps-options/` | 5.284 | 12 | 20,8 | index | Segundo activo más fuerte. NO redirigir |

**Contradicción crítica (fila 18).** La sheet dice "0 kw" y la marca para redirección 301. GSC en vivo mide **5.427 impresiones, 5 clics, posición media 11,9 en 90 días**. Gana GSC. Redirigirla se lleva por delante una página que sí está apareciendo.

**Otra lectura obligatoria:** las filas 6, 10, 13, 14, 15 y 17 suman **39.761 impresiones y 4 clics**. Alta impresión con posición media 26 a 80 no es "casi rankeando": es aparecer en la cola de resultados que nadie mira. No escribas un brief que diga "ya rankeamos bien" apoyado en impresiones.

### 2B. Las 20 con más `Visitas GSC` según la sheet, y su contraste con GSC vivo

| # | URL | Sheet `Visitas GSC` | Clics reales | Impres. reales | Acción |
|---|---|---|---|---|---|
| 1 | `/` | 252 | 675 | 18.371 | index |
| 2 | `/blog/whats-the-best-property-management-software-4-popular-options/` | 44 | 74 | 77.772 | index |
| 3 | `/resources/toronto-lease-takeover-navigation/` | 27 | 61 | 5.567 | index |
| 4 | `/blog/frequently-asked-questions-about-facebook-marketplace.../` | 25 | 58 | 19.150 | index |
| 5 | `/resources/tools/security-deposit-calculator-free-tool/` | 20 | 64 | 8.074 | index |
| 6 | `/resources/find-hidden-gems-facebook-marketplace-rentals/` | 17 | 58 | 16.312 | index |
| 7 | `/resources/tools/tenant-income-qualification-calculator/` | 12 | 37 | 9.909 | index |
| 8 | `/blog/the-property-managers-complete-guide-to-facebook-marketplace.../` | 12 | 39 | 8.810 | index |
| 9 | `/resources/proof-income-requirements-rentals-documentation.../` | 8 | 16 | 3.647 | index |
| 10 | `/resources/property-management-accepts-evictions-tenant-screening.../` | 7 | 14 | 643 | index |
| 11 | `/resources/facebook-marketplace-vs-zillow-for-rentals/` | 7 | 14 | 3.338 | index |
| 12 | `/facebook-marketplace-syndication-for-property-managers/` | 7 | 12 | 456 | **410** |
| 13 | `/resources/property-lease-transfer-key-steps-options/` | 6 | 12 | 5.284 | index |
| 14 | `/resources/news/bcfsa-strict-penalties-unlicensed-property-management/` | 6 | 22 | 2.689 | index |
| 15 | `/resources/managing-problematic-neighbors-apartment-buildings/` | 5 | 10 | 3.586 | index |
| 16 | `/resources/types-of-rental-listings-facebook-marketplace/` | 5 | 16 | 2.903 | **301** |
| 17 | `/resources/value-property-management-company-business-valuation.../` | 5 | 6 | 5.113 | index |
| 18 | `/resources/security-deposit-deduction-letter-templates.../` | 5 | 18 | 2.581 | index |
| 19 | `/resources/report-property-management-company-complaint-process.../` | 5 | 8 | 2.777 | index |
| 20 | `/blog/facebook-marketplace-rules-for-sellers-landlords-and-property-managers/` | 5 | 15 | 3.276 | index |

**Regla que sale de aquí:** los clics reales son consistentemente 2 a 3 veces los de la sheet. La foto de la sheet subestima. Nunca cites una cifra de `Visitas GSC` en un brief sin decir que es un snapshot y sin contrastar con GSC.

### 2C. URLs que la sheet declara 0 GA4 / 0 GSC y que HOY tienen impresiones: **31**

Las 15 mayores:

| URL | Impres. | Clics |
|---|---|---|
| `/resources/report-rent-payments-credit-bureaus-tenant-history-building/` | 4.647 | 0 |
| `/resources/apartment-screening-process-timeline-how-long-background-checks/` | 1.638 | 2 |
| `/resources/research/fair-housing-act-algorithmic-screening-constraints/` | 677 | 1 |
| `/resources/leasing-productivity-metrics-per-door-determine-staffing-500-unit-communities/` | 202 | 0 |
| `/resources/vancouver-west-end-studio-apartments/` | 175 | 0 |
| `/benefits/student-housing-leasing-automation/` | 142 | 1 |
| `/benefits/lease-up-software-new-construction-acquisitions/` | 108 | 0 |
| `/resources/tech-innovations-ottawa-property-managers/` | 89 | 0 |
| `/benefits/scale-leasing-operations-without-hiring/` | 82 | 0 |
| `/resources/listing-guides/san-jose-rental-property/` | 61 | 0 |
| `/benefits/post-showing-feedback-rental-pricing-intelligence/` | 58 | 0 |
| `/resources/research/centralized-leasing-platforms-reduce-cost-per-lease-significantly-above-500-units/` | 46 | 0 |
| `/resources/workflow-automation-reduces-vacancy-periods-streamlining-responses/` | 44 | 0 |
| `/resources/research/e-signature-lease-document-automation-errors/` | 43 | 0 |
| `/resources/drag-drop-report-builders-property-management-analytics-features/` | 42 | 0 |

Nota: `/resources/vancouver-west-end-studio-apartments/` tiene 175 impresiones y **resuelve 404 hoy** (ver sección 4). Está siendo servida en resultados y devuelve error.

---

## 3. Mapa de consolidaciones

De la pestaña **Redirecciones 301 en vivo** (335 filas, 0 sin `URL final`): **58 destinos distintos**.

**Destinos con 10 o más orígenes (4):**

| Orígenes | Destino | `Hecho = Si` |
|---|---|---|
| **128** | `/resources/centralized-leasing/` | **0** |
| **19** | `/blog/whats-the-best-property-management-software-4-popular-options/` | 19 |
| **19** | `/resources/comparing-tenant-credit-background-check-services/` | 19 |
| **11** | `/resources/ach-payment-processing-rental-income/` | 11 |

**Resto del top 15:**

| Orígenes | Destino | `Hecho = Si` |
|---|---|---|
| 9 | `/blog/the-property-managers-complete-guide-to-facebook-marketplace-for-rental-properties/` | 9 |
| 9 | `/resources/leasing-pipeline-visibility/` | 9 |
| 8 | `/resources/toronto-rental-property/` | 8 |
| 8 | `/resources/value-property-management-company-business-valuation-methods-explained/` | 8 |
| 7 | `/press/web-summit-vancouver/` | 7 |
| 7 | `/resources/top-property-management-software-for-commercial-real-estate/` | 7 |
| 6 | `/resources/marketing-strategies-ottawa-apartments/` | 6 |
| 6 | `/resources/key-features-of-purpose-built-rentals/` | 6 |
| 6 | `/resources/multi-property-listing-consistency/` | 6 |
| 6 | `/resources/role-mobile-apps-maintenance-request-management/` | 6 |
| 5 | `/resources/landlords-avoiding-facebook-marketplace-rentals/` | 5 |

Cola larga: 43 destinos más, casi todos con 1 a 4 orígenes. Dos filas tienen como destino un texto en vez de una URL (`(hub de comparativas — a crear bajo /compare/)` y `(hub de comparativas — a crear)`): son placeholders, no destinos resolubles.

**`/resources/centralized-leasing/` concentra el 38% de todas las consolidaciones del plan.** Es la apuesta más grande de la Clusterización y la única de las cuatro grandes que no se ha tocado.

---

## 4. Estado real de las consolidaciones

Resolví **las 254 URLs origen de los 15 destinos con más redirecciones**, con `curl -L` y User-Agent de navegador. Sin el UA el sitio responde 403 a todo. Los 12 fallos de conexión de la primera pasada se reintentaron uno por uno hasta obtener respuesta: **no hay ninguna URL sin resolver.**

| Estado real | Cuántas | Qué significa |
|---|---|---|
| **Ejecutada** (redirige al destino planeado) | **121** | Ya corrió. Nada que hacer |
| **Pendiente** (200, sin redirección, resuelve a sí misma) | **52** | Sigue viva y compitiendo |
| **Redirige a OTRO destino** | **68** | Ya redirige, pero a una página distinta de la que dice el plan |
| **Bucle de redirección** (`num_redirects = 50`) | **5** | Roto. Ni el usuario ni el crawler llegan |
| **El origen devuelve 410** | **3** | Se eliminó en vez de redirigirse |
| **El origen devuelve 404** | **5** | Desapareció sin 301 ni 410 |

**Titular: 121 de 254 ya están ejecutadas (48%), y solo 52 (20%) están genuinamente pendientes.** Las 133 restantes están en algún estado que el plan no describe.

**Por destino:**

| Destino | Total | Ejecutadas | Pendientes | Otro estado |
|---|---|---|---|---|
| `/resources/centralized-leasing/` | 128 | **0** | 52 | 68 a otro destino, 5 bucles, 3 en 410 |
| `/blog/whats-the-best-property-management-software.../` | 19 | 19 | 0 | 0 |
| `/resources/comparing-tenant-credit-background-check-services/` | 19 | 19 | 0 | 0 |
| `/resources/ach-payment-processing-rental-income/` | 11 | 11 | 0 | 0 |
| `/blog/the-property-managers-complete-guide-to-facebook-marketplace.../` | 9 | 9 | 0 | 0 |
| `/resources/leasing-pipeline-visibility/` | 9 | 9 | 0 | 0 |
| `/resources/toronto-rental-property/` | 8 | 8 | 0 | 0 |
| `/resources/value-property-management-company-business-valuation.../` | 8 | 8 | 0 | 0 |
| `/press/web-summit-vancouver/` | 7 | 2 | 0 | **5 en 404** |
| `/resources/top-property-management-software-for-commercial-real-estate/` | 7 | 7 | 0 | 0 |
| `/resources/marketing-strategies-ottawa-apartments/` | 6 | 6 | 0 | 0 |
| `/resources/key-features-of-purpose-built-rentals/` | 6 | 6 | 0 | 0 |
| `/resources/multi-property-listing-consistency/` | 6 | 6 | 0 | 0 |
| `/resources/role-mobile-apps-maintenance-request-management/` | 6 | 6 | 0 | 0 |
| `/resources/landlords-avoiding-facebook-marketplace-rentals/` | 5 | 5 | 0 | 0 |

**Los 14 destinos que no son `centralized-leasing` están ejecutados al 100%, salvo los 5 casos 404.** El plan dice "reforzar antes de ejecutar"; para esos 126 orígenes ese momento ya pasó.

**Sobre la columna `Hecho`:** 126 de las 254 filas la traen en `Si`. De esas, 121 están ejecutadas y 5 son los 404. Ninguna fila con `Hecho` vacío redirige a su destino planeado. **La columna es fiable para lo que afirma, pero no captura los otros estados:** los 68 "a otro destino" y los 5 bucles tienen `Hecho` vacío y sin embargo la URL ya no es alcanzable en su forma original.

**Los 5 bucles infinitos** (todos planeados hacia `/resources/centralized-leasing/`, `Hecho` vacío, `num_redirects = 50`):

- `/resources/research/multi-market-property-management-centralized-leasing/`
- `/resources/institutional-portfolios-standardize-workflows-50-properties-reduce-training/`
- `/resources/multi-market-operators-manage-east-coast-west-coast-portfolios/`
- `/resources/national-operators-100-locations-require-cloud-based-leasing-coordination-systems/`
- `/resources/expanding-single-market-to-multi-market-requires-centralized-leasing-technology/`

**Los 5 que devuelven 404** (planeados hacia `/press/web-summit-vancouver/`, todos con `Hecho = Si`):

- `/resources/burnaby-vs-vancouver-apartment-guide/`
- `/resources/kitsilano-vancouver-rental-overview/`
- `/resources/vancouver-purpose-built-rental-strategy/`
- `/resources/vancouver-west-end-studio-apartments/` (175 impresiones vivas en GSC)
- `/resources/vancouver-apartment-sites-guide/`

Además, `/press/web-summit-vancouver/` **no es el destino final**: redirige a `/resources/web-summit-vancouver/`. Toda cita del destino con la ruta `/press/` está desactualizada.

**Los 68 "a otro destino"** son todos orígenes que el plan manda a `centralized-leasing` y que ya redirigen a supervivientes de una ronda anterior. Ejemplos verificados:

| Origen | Plan dice | En vivo llega a |
|---|---|---|
| `/resources/twenty-four-seven-ai-inquiry-response-increases-lead-lease/` | `/resources/centralized-leasing/` | `/resources/ai-virtual-assistants-property-managers/` |
| `/resources/manual-application-processing-bottleneck-150-units-8-day-delays/` | `/resources/centralized-leasing/` | `/resources/comparing-tenant-credit-background-check-services/` |
| `/resources/adding-leasing-automation-layer-yardi-realpage-faster-roi/` | `/resources/centralized-leasing/` | `/resources/property-management-software-integration/` |
| `/resources/minimize-condo-vacancy-period/` | `/resources/centralized-leasing/` | `/resources/scale-leasing-operations-without-hiring/` |

**Consecuencia directa para los briefs:** contar "N páginas nuestras canibalizan esta keyword" leyendo la sheet infla el problema. De las 254 muestreadas, **181 ya no son alcanzables como página independiente**. Resuelve cada URL antes de contarla.

---

## 5. Trampas conocidas

### 5.1 Las rutas `/benefits/` migraron a `/resources/`

En la sheet **en vivo**, filas con al menos una URL que contiene `/benefits/`:

| Pestaña | Filas con `/benefits/` | Total |
|---|---|---|
| Optimizacion de contenido | **12** | 242 |
| Optimizacion + Clusters (Daniel) | **12** | 247 |
| URLs trafico | **11** | 723 |
| Purga URLs | **42** | 728 |
| Redirecciones 301 | 0 | 335 |
| 410, No index, Semrush, Organic Keywords | 0 | — |

**Total: 77 filas con rutas obsoletas en la sheet en vivo.**

Detalle importante: la pestaña **Redirecciones 301 ya fue actualizada** (0 rutas `/benefits/`; sus destinos usan `/resources/`), pero la **caché local todavía tiene 83 de 329 filas con `/benefits/`**, incluidos destinos de consolidación como `/benefits/leasing-pipeline-visibility/` (28 orígenes en la caché) y `/benefits/property-management-software-integration/` (14). En la sheet viva esos destinos son `/resources/leasing-pipeline-visibility/` (9 orígenes). **Si escribes un brief leyendo la caché de redirecciones, citarás destinos con la ruta muerta y un conteo de orígenes equivocado.**

GSC en vivo: 11 páginas `/benefits/` tienen impresiones, contra 668 páginas `/resources/`. Existen pero son residuales.

### 5.2 El campo URL de la pestaña 410 tiene los subdirectorios recortados

30 de las 132 filas de la pestaña 410 traen la URL **sin su subcarpeta** (`/news/`, `/insights/`, `/testimonials/`). Ejemplos verificados:

- La sheet dice `/resources/appfolio-property-management-strategies-2024/`. La URL real es `/resources/news/appfolio-property-management-strategies-2024/`.
- La sheet dice `/resources/some-property-managers-use-artificial-scarcity-tactics.../`. La real lleva `/insights/`.
- La sheet dice `/resources/how-goldwynn-adopted-leasey-ai.../`. La real lleva `/testimonials/`.

La caché local **sí tiene las rutas correctas** en este punto. Varias filas traen además un espacio en blanco al final de la URL.

### 5.3 Rutas `/press/` que ya no son el destino final

`/press/web-summit-vancouver/` redirige a `/resources/web-summit-vancouver/`. Aparece como destino de 7 consolidaciones en la sheet.

### 5.4 De las 80 páginas con más impresiones, 26 no devuelven 200

Resolví las 80 primeras por impresiones de GSC: **54 devuelven 200, 22 devuelven 301, 2 devuelven 404 y 2 devuelven 410.** Google todavía sirve en resultados páginas que ya no existen. Las dos 404 son `/blog/whats-the-best-property-management-software-4-popular-options3/` (nótese el `3` final, es un duplicado) y `/resources/vancouver-apartment-sites-guide/`.

---

## 6. Keywords con volumen real

Las 30 con más `Search Volume` de **Semrush** (pestaña en vivo). Son candidatas a keyword foco porque el volumen viene medido, no estimado. Ojo: **casi todas están en posición 45 a 90**, es decir, el sitio aparece pero fuera de las primeras cinco páginas.

| # | Keyword | Vol. | Pos. | KD | Intent | URL |
|---|---|---|---|---|---|---|
| 1 | lease takeover | 4.400 | 48 | 16 | informational | `/resources/complete-guide-property-lease-takeover/` |
| 2 | lease takeover (2.ª fila) | 4.400 | 49 | 16 | informational | `/resources/complete-guide-property-lease-takeover/` |
| 3 | proof of income | 4.400 | 65 | 36 | informational | `/resources/effective-methods-proof-of-income-for-renters/` |
| 4 | certified property manager | 3.600 | 79 | 49 | informational | `/resources/property-management-certifications-training-programs/` |
| 5 | rent control | 3.600 | 82 | 49 | informational | `/resources/rent-control-regulations/` |
| 6 | lien on property | 2.900 | 72 | 50 | informational | `/resources/property-lien/` |
| 7 | experian rentbureau | 2.900 | 86 | 41 | navigational, transactional | `/resources/report-rent-payments-credit-bureaus-tenant-history-building/` |
| 8 | estoppel agreement | 2.400 | 81 | 24 | informational | `/resources/tenant-estoppel-certificates-purpose-requirements.../` |
| 9 | workforce housing management software features | 1.900 | 46 | **12** | informational | `/resources/affordable-housing-property-management-software-features.../` |
| 10 | take over lease | 1.900 | 52 | **8** | **commercial** | `/resources/complete-guide-property-lease-takeover/` |
| 11 | property lien | 1.900 | 63 | 50 | informational | `/resources/property-lien/` |
| 12 | right to quiet enojoynment constitution | 1.900 | 69 | 25 | informational | `/resources/tenants-right-to-quiet-enjoyment/` |
| 13 | property management fees | 1.900 | 80 | 25 | informational | `/resources/understanding-property-management-fees-costs/` |
| 14 | 1031 exchanges | 1.900 | 86 | 54 | informational | `/resources/1031-exchange-rental-investment-portfolios/` |
| 15 | what is rent control | 1.900 | 87 | 53 | informational | `/resources/rent-control-regulations/` |
| 16 | nnn rent | 1.600 | 59 | 44 | informational | `/resources/single-tenant-triple-net-lease-guide/` |
| 17 | what is a lien on a property | 1.600 | 78 | 50 | informational | `/resources/property-lien/` |
| 18 | what is a lien on a property (2.ª fila) | 1.600 | 83 | 50 | informational | `/resources/property-lien/` |
| 19 | property manager certification | 1.600 | 84 | 47 | informational | `/resources/property-management-certifications-training-programs/` |
| 20 | tenant estoppel certificate | 1.600 | 90 | 16 | informational | `/resources/tenant-estoppel-certificates-purpose-requirements.../` |
| 21 | real estate management softwares | 1.300 | **22** | 46 | **commercial**, informational | `/blog/whats-the-best-property-management-software-4-popular-options/` |
| 22 | lease transfer | 1.300 | 45 | 32 | informational | `/resources/property-lease-transfer-key-steps-options/` |
| 23 | not renewing lease letter | 1.300 | 54 | 23 | informational | `/resources/non-renewal-lease-letter-templates-notice-requirements.../` |
| 24 | property management license | 1.300 | 58 | 31 | informational | `/resources/become-property-manager-california-licensing-requirements.../` |
| 25 | property management courses | 1.300 | 70 | 44 | informational | `/resources/property-management-certifications-training-programs/` |
| 26 | certified property manager certification | 1.300 | 72 | 34 | informational | `/resources/property-management-certifications-training-programs/` |
| 27 | property management license (2.ª fila) | 1.300 | 73 | 31 | informational | `/resources/become-property-manager-california-licensing-requirements.../` |
| 28 | property management classes | 1.300 | 81 | 37 | informational | `/resources/property-management-certifications-training-programs/` |
| 29 | resaleai login | 1.000 | 31 | 3 | navigational, transactional | `https://login.leasey.ai/` |
| 30 | difference between transunion and equifax | 1.000 | **34** | 25 | **commercial** | `/resources/comparing-tenant-credit-background-check-services/` |

**Cómo usar esta tabla, y cómo no.**

- Las cuatro únicas con intención **comercial** son `take over lease` (1.900, KD 8), `real estate management softwares` (1.300, pos 22), `difference between transunion and equifax` (1.000, pos 34) y `resaleai login`. Las demás son informacionales: sirven para phase 2, no para los briefs de decisión donde se mueven los demos.
- `workforce housing management software features` (vol 1.900, KD 12) y `take over lease` (vol 1.900, KD 8) son las de mejor ratio volumen/dificultad de toda la lista.
- Hay **keywords duplicadas con dos posiciones distintas** (`lease takeover`, `what is a lien on a property`) contra la misma URL. Es un artefacto del export, no dos páginas compitiendo. No lo cites como canibalización.
- **Ninguna de estas 30 keywords prueba oportunidad de mercado.** Prueban que rankeamos por ellas. Lo que NO está en esta lista no tiene volumen cero: no tiene dato.
- Alto volumen con posición 80 no es "casi lo tenemos". La posición 80 no genera clics.

---

## 7. Pestaña 410: las 132 páginas eliminadas

No existe en la caché local. Es la explicación de los enlaces muertos que aparecieron hoy.

**Estructura:** 15 columnas. Las 132 filas tienen `Acción = 410`. `Hecho = Si` en 109, vacío en 23. `Eliminados` replica exactamente a `Hecho`.

**Verificación en vivo de las 132 URLs (con la ruta corregida donde la sheet la trae recortada):**

| Estado | Filas |
|---|---|
| Devuelve **410** (eliminada de verdad) | **109** |
| Devuelve **200** (todavía viva) | **23** |

**La columna `Hecho` de esta pestaña coincide con la realidad en 132 de 132 filas.** Es la única columna de estado de toda la sheet que verifiqué sin una sola discrepancia.

### 7.1 Las 5 URLs muertas que dispararon esto: todas están aquí, y todas ejecutadas

| URL | En la pestaña 410 | `Hecho` | `Eliminados` |
|---|---|---|---|
| `/team-collaboration/` | Sí | Si | Si |
| `/smart-route-planner/` | Sí | Si | Si |
| `/lead-prequalification/` | Sí | Si | Si |
| `/learn-more-integrations/` | Sí | Si | Si |
| `/advanced-reporting/` | Sí | Si | Si |

No son un bug del sitio: son eliminaciones deliberadas, ya ejecutadas, que nadie propagó a los enlaces internos ni a los briefs.

### 7.2 Las 23 que todavía están vivas, el trabajo pendiente

Ordenadas por impresiones reales en GSC. **Al ejecutarlas se pierden 21.955 impresiones de 90 días.**

| URL | Impres. GSC | Decisión de la sheet |
|---|---|---|
| `/ai-chatbot/` | 3.563 | Feature page de chatbot AI. Eliminar |
| `/marketplace-syndication/` | 3.539 | Feature page de sindicación (4 kw). Eliminar |
| `/resources/insights/short-term-rentals-like-airbnb-can-sometimes-benefit-local-economies.../` | 1.960 | Ensayo de economía urbana. Sin destino compatible |
| `/multifamily-property-management/` | 1.821 | Feature page multifamily (3 kw). Eliminar |
| `/rental-property-advertising/` | 1.349 | Feature page de advertising (3 kw). Eliminar |
| `/tenant-screening/` | 1.339 | Feature page de screening (1 kw). Eliminar |
| **`/pricing/`** | **1.216** | **"Página de pricing. Eliminar."** |
| `/smart-rent-pricing/` | 1.187 | Feature page de pricing inteligente. Eliminar |
| `/rent-estimate-calculator/` | 985 | Calculadora de estimación de renta (4 kw). Eliminar |
| `/property-management-automation/` | 970 | Feature page de automatización. Eliminar |
| `/resources/safety-security-short-term-rentals/` | 818 | Hardware + vertical vacacional. Fuera del producto |
| `/showing-scheduler/` | 805 | Feature page de agendamiento. Eliminar |
| `/ai-agent-page/` | 588 | Feature page de agente AI. Eliminar |
| `/resources/effective-winter-property-management-strategies/` | 547 | Mantenimiento de edificio. Fuera del producto |
| `/smart-documents/` | 450 | Feature page de documentos. Eliminar |
| `/a-integrations-dark-version/` | 315 | Cuerpo completamente vacío |
| `/resources/property-tax-management-software/` | 245 | Fuera del producto |
| `/resources/augmented-reality-property-repairs/` | 199 | Off-product total |
| `/resources/virtual-tours-revolutionizing-property-viewing/` | 59 | Fuera del producto, 0 kw |
| `/resources/news/pod-system-transforming-property-management/` | 0 | Contenedores de mudanza PODS, no el producto |
| `/resources/news/appfolio-property-management-strategies-2024/` | 0 | Nota sobre el competidor AppFolio |
| `/resources/news/top-suburbs-property-investment-perth/` | 0 | Perth, Australia. Off-geo |
| `/resources/news/rising-property-management-market-outcomes/` | 0 | 0 kw. Genérica |

**`/pricing/` está marcada para eliminación y hoy tiene 1.216 impresiones, 13 clics y posición media 9,0.** Está en el top 20 de clics del sitio. Antes de ejecutar ese 410 hay que decidir esto explícitamente.

### 7.3 Cuáles siguen enlazadas desde páginas vivas

Descargué el HTML de las **80 páginas con más impresiones** y busqué enlaces a las 132 URLs de la pestaña 410. **42 de las 132 siguen enlazadas.** Las más graves:

| URL 410 | Páginas que la enlazan | Estado en vivo |
|---|---|---|
| `/llm-info/` | **56** | **410** |
| `/contact-us/` | **56** | **410** |
| `/privacy/` | **56** | **410** |
| `/terms/` | **56** | **410** |
| `/video-page/` | **56** | **410** |
| `/resources/appfolio-property-management-strategies-2024/` | 50 | 200 (aún viva) |
| `/smart-rent-pricing/` | 7 | 200 |
| `/advanced-reporting/` | 4 | **410** |
| `/multifamily-property-management/` | 4 | 200 |
| `/single-family-property-management/` | 4 | 410 |
| `/tenant-screening/` | 4 | 200 |
| `/ai-chatbot/` | 3 | 200 |
| `/lead-prequalification/` | 3 | **410** |
| `/property-management-automation/` | 3 | 200 |
| `/marketplace-syndication/` | 2 | 200 |
| `/pricing/` | 2 | 200 |
| `/team-collaboration/` | 1 | **410** |
| `/showing-scheduler/` | 1 | 200 |
| `/smart-documents/` | 1 | 200 |

**Hallazgo más serio del documento:** `/contact-us/`, `/privacy/`, `/terms/`, `/llm-info/` y `/video-page/` devuelven **410** y siguen enlazadas desde el **pie de página** de 56 de las 80 páginas con más impresiones del sitio. Son cinco enlaces muertos en cada página del sitio, incluidas política de privacidad y términos.

Cobertura de esta comprobación: solo las 80 páginas top por impresiones, de 771 con impresiones. **Es un piso, no un total.** El número real de enlaces internos rotos es mayor.

---

## 8. Caché contra vivo

| Pestaña | Vivo | Caché | Estado |
|---|---|---|---|
| **410** | **132** | **AUSENTE** | La caché no tiene esta pestaña. Es la que explica los enlaces muertos |
| URLs trafico | 723 | 723 | Idéntica. 0 diferencias de URL |
| Organic Keywords | 1.354 | 1.354 | Idéntica |
| Semrush | 3.039 | 3.039 | Idéntica |
| **Purga URLs** | **728** | **130** | La caché contiene **solo el subconjunto `Acción = 410`**. Las 130 están todas en la pestaña viva. En vivo la pestaña es la lista maestra: 301 (363), 410 (127), index/Index (238). Falta el 82% |
| **Redirecciones 301** | **335** | **329** | 9 URLs solo en vivo, 3 solo en caché. Y la caché usa destinos `/benefits/` que en vivo ya son `/resources/`, con conteos distintos por destino |
| No index | 8 | 8 | Idéntica |
| **Optimizacion de contenido** | **242** | **247** | La caché **no es esta pestaña**: sus 247 filas coinciden fila por fila con `Optimizacion + Clusters (Daniel)` menos la columna `Cluster (Blog Category)`. Es un duplicado mal etiquetado |
| Optimizacion + Clusters (Daniel) | 247 | 247 | Idéntica |

Nota sobre el conteo de filas: los "48.964" de Redirecciones 301 y los "729" de Purga URLs que reporta la sheet son el tamaño de la **grilla**, no filas con datos. Con datos reales hay **335** y **728**. La diferencia contra la caché es de 6 y de 598, no de 48.635.

Sobre las URLs solo en un lado de Redirecciones 301: las 3 que están únicamente en la caché (`franchise-management-companies...`, `leasing-agent-turnover-35-percent...`, `regional-companies-standardize-quality...`) hoy figuran en la pestaña **410**. Se movieron de "redirigir" a "eliminar". Un brief que las lea desde la caché las tratará como redirección pendiente cuando son eliminaciones ya ejecutadas.

### Recomendación: sí, hay que regenerar la caché. Es la única de las tres tareas que bloquea todo lo demás.

Cuatro razones, en orden de gravedad:

1. **Falta la pestaña 410 entera.** Sin ella, ningún agente sabe que `/team-collaboration/` y compañía están eliminadas a propósito, y los briefs las siguen enlazando.
2. **`purga-urls.json` está mal recortado.** Tiene 130 de 728 filas y solo la acción 410. Cualquier pregunta del tipo "¿qué acción le toca a esta URL?" contestada contra la caché falla para 598 URLs.
3. **`optimizacion-de-contenido.json` es un duplicado de la pestaña de Daniel.** Hay dos archivos con el mismo contenido y ninguno tiene la pestaña real.
4. **La caché de redirecciones usa destinos `/benefits/` muertos** y conteos por destino desactualizados (28 orígenes hacia `/benefits/leasing-pipeline-visibility/` en caché, 9 hacia `/resources/leasing-pipeline-visibility/` en vivo).

Además, tres cosas que ninguna regeneración arregla y que hay que corregir en la sheet: las 30 URLs con subdirectorio recortado en la pestaña 410, las 77 filas con rutas `/benefits/`, y el nombre de la columna `Visitas GSC`, que son clics.

---

## 9. Lo que estos datos NO permiten concluir

1. **No permiten estimar el volumen de ninguna keyword por la que el sitio no rankee.** Semrush y Organic Keywords son exports de posiciones. La ausencia de un término no es "volumen cero", es "sin dato". Para eso hace falta una herramienta de investigación externa, que hoy no tenemos conectada.
2. **No permiten decir "competimos con X marcas por esta keyword".** No hay datos de competidores en ninguna pestaña. La cuota de SERP, quién más rankea y con qué contenido: nada de eso está aquí.
3. **No permiten afirmar posición para una URL sin impresiones.** La posición solo se calcula donde hubo impresiones. Ese fue el error del 30 de julio y sigue siendo posible cometerlo leyendo la columna `Posiciona en Google` de la sheet, que es un texto del plan, no una medición.
4. **Los datos GSC son de propiedad, no de página.** GSC devuelve datos agregados por URL, pero la API impone umbrales de privacidad: consultas con muy pocas impresiones se omiten. Una URL con 0 impresiones en mi consulta puede tener tráfico residual no reportado.
5. **No sé qué enlaza a las 90 URLs 410 restantes.** Solo rastreé las 80 páginas con más impresiones, de 771. El inventario de enlaces internos rotos es un piso, no un total. Para el total hace falta un crawl completo del sitio.
6. **No verifiqué si el noindex está realmente en el HTML.** La pestaña No index dice `Hecho = Si` en las 8, pero eso es la sheet declarándolo. No inspeccioné la metaetiqueta.
7. **No verifiqué las 81 consolidaciones fuera del top 15 de destinos.** Muestreé 254 de 335 filas de Redirecciones 301. El 48% de ejecución medido aplica a la muestra; extrapolarlo al resto es una suposición.
8. **No sé cuándo se tomó la foto de la sheet.** Ninguna pestaña trae fecha de extracción. La divergencia contra GSC (clics 2 a 3 veces mayores hoy) sugiere semanas o meses, pero es inferencia, no dato.
9. **Los campos `Decisión` son juicio editorial, no medición.** Muchos contienen sus propias correcciones ("CORRECCIÓN:", "estaba marcada Ninguno") y afirmaciones sobre volumen y posición que vienen de la misma foto vieja. Citar un `Decisión` en un brief es citar una opinión fechada, no un hecho.
10. **No permiten decidir si ejecutar los 410 pendientes.** Sé que se pierden 21.955 impresiones y que `/pricing/` está entre ellas, pero no sé qué convierte. GA4 conversiones y datos de demo no están en ninguna de estas fuentes.
11. **El bucle de redirección de las 5 URLs no tiene causa diagnosticada aquí.** Sé que `num_redirects` llega a 50 y que el destino planeado es `centralized-leasing`. Por qué, es trabajo de servidor.
12. **La comprobación de enlaces internos se hizo por coincidencia de texto en el HTML.** Un enlace inyectado por JavaScript después de la carga no aparece en mi conteo.
