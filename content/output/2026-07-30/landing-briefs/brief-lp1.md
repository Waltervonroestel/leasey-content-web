# Brief · Leasing Pipeline Visibility

| | |
|---|---|
| **URL en vivo** | `https://www.leasey.ai/resources/leasing-pipeline-visibility/` |
| **Notion** | https://app.notion.com/p/3a543656a5b381cf93fef3f6b2ba4343 |
| **Google Doc** | https://docs.google.com/document/d/1ZBdxKr72aMJtHcWAixRqRveLDQ5CJAvScPy8NbppKpk/edit |
| **Pilar** | Agent, secondary All-in-one |
| **Audiencia** | leasing managers and regional managers |
| **Autor** | **Ninguno.** Las landings no llevan firma (Regla C, decisión de Walter del 30 jul 2026) |

> La plantilla `context/benefits-landing-template.md` gobierna sobre este brief. Los ocho bloques y los cinco H2 de patrón fijo no se discuten aquí: se escriben literales.

---

## 1. Estado real de la página

Medido el 30 de julio de 2026 abriendo la página, no deducido del reporte SEO.

| | |
|---|---|
| HTTP | 200, sin redirección |
| **H1 real** | `Leasing Pipeline Visibility` |
| H2 / H3 / H4 / H5 / H6 | 6 / 17 / 0 / 0 / **6** |
| Firma visible | **Sí, dice `Admin`** |
| Firma en JSON-LD | **sí** |
| Em-dashes | **17** |
| Enlaces externos | 4 |
| `<title>` actual | `Real-Time Leasing Pipeline Visibility for Property Management Teams | Leasey.AI` (79 caracteres) |

**El H1 ya existe.** La Regla B está cumplida y no hay nada que crear. Ojo: el `<title>` de arriba **no es el H1**, son dos cosas distintas y confundirlas fue un error real de la versión anterior de este brief.

**Hay 6 H6 sin ningún H4 ni H5.** Es un salto de nivel. Las diez landings del cluster tienen exactamente el mismo patrón, así que **no es un defecto de esta página sino del bloque de CTA de la plantilla del tema**. Conviene arreglarlo una vez en el tema, no diez veces a mano.

**Hay que eliminar la firma `Admin`**, visible en el cuerpo y presente en el JSON-LD. No se sustituye por nadie.

> Nota de medición: la densidad de marca de la tabla se calcula sobre la página renderizada, que incluye menú y pie. Sobre el cuerpo del artículo el porcentaje es más alto. Al reescribir, la regla operativa es **una mención de "Leasey.AI" por H2 como máximo**.

## 2. Keyword foco

### `leasing pipeline management software`

**This page has no measured demand.** Search Console, 2026-04-29 a 2026-07-28: **zero queries, zero impressions, zero clicks**.

With no impressions there is no position to report, because Google only computes a position where the page was actually served. Any claim about where this page ranks is unsupported by definition.

**What this proves:** the page has no search presence to protect. Rule A does not apply, so the structure can be rebuilt freely.
**What it does not prove:** that `leasing pipeline management software` has no search volume. Our Semrush and Organic Keywords exports only contain terms the site already ranks for, so a term's absence means we have no data on it, not that demand is zero. Establishing volume needs an external research tool and is Alejandra's call.

## 3. Análisis del top 3

# Landing research: lp1

**Focus keyword:** `leasing pipeline management software`
**Page:** https://www.leasey.ai/resources/leasing-pipeline-visibility/
**Audience:** leasing managers, regional managers, finance teams
**Search Console reality:** zero impressions in 90 days. With zero impressions there is no position, so no ranking claim is made for our page anywhere below.

### Top-3 analysis

| Position | Page | Format | Angle | Sources | Weakness |
|---|---|---|---|---|---|
| Organic result (SERP order not verified) | Yardi Deal Manager, https://www.yardi.com/product/deal-manager/ (read via WebFetch) | Product page, roughly 2,200 words | H1 `Improve deal-making with powerful workflows`. H2s `Features`, `Close deals faster with intuitive workflows`, `Make stronger decisions with advanced reports`, `Streamline operations with real-time insights`, `Accelerate lease execution with automation`, `Testimonials`, `Resources`, `Deal Manager is trusted by`, `FAQ`, `We're here to help` | Own product claims plus customer testimonials. No external data cited | Commercial real estate, not residential. Reporting language stops at "customizable pipeline reports" and tracking "deals from lead to execution". Zero time-in-stage, stage duration, bottleneck detection or intervention logic. Workflow-and-approvals framing, not diagnosis |
| Organic result (SERP order not verified) | VTS Lease, https://www.vts.com/vts-lease (read in a real browser earlier today; my own WebFetch returned HTTP 403) | Product page, roughly 710 words | H1 `AI-driven end-to-end leasing`. H2s include `Your system of action, your source of truth`, `What VTS Lease Offers`, `Agency Brokers`, `Asset Managers`, `Leasing Teams`, `Frequently asked questions` | Own product claims | Commercial real estate, aimed at agency brokers and asset managers. Very thin at roughly 710 words. Zero mentions of time-in-stage or stage-level diagnosis |
| Organic result (SERP order not verified) | Buildium, https://www.buildium.com/blog/best-lease-management-software/ (re-read via WebFetch today, confirms the earlier browser read) | Listicle comparing six tools | H1 `6 of the best lease management software options for 2026`. H2s `What Is Lease Management Software?`, `Why Use Lease Management Software?`, `Key Features of Lease Management Software`, `6 of the Best Lease Management Software Options in 2026`, then one H2 per vendor (Buildium, Propertyware, Landlord Studio, ResMan, Re-Leased, Docusign), `What Is the Best Lease Management Software for Your Business?`, `Frequently Asked Questions About Lease Management Software` | Vendor descriptions, self-published by a vendor that ranks itself first | Vendor-owned comparison with an obvious conflict. Analytics is generic: "advanced analytics features to provide property managers with data that helps them make informed decisions", broken out only as financial analytics, occupancy rate analysis and lease expiration tracking. No time-in-stage, no stage-level diagnosis |

Note on positions: I read the three pages, but I did not verify their exact rank order on the live SERP, so the numeric top-3 ordering is **NOT VERIFIABLE**. See Limitations.

### Opportunities for Leasey.AI

1. **Stage-level diagnosis is confirmed as the gap.** All three read pages sell visibility and workflow, none sell interpretation. Yardi's strongest analytics language is "customizable pipeline reports"; Buildium's is generic "advanced analytics"; VTS says nothing about stage duration at all. Nobody teaches the reader to read time-in-stage and pick an intervention from it. Own that: a named table mapping each stage to a healthy duration band, the likely cause when a deal overruns it, and the specific action (re-screen, re-price, chase documents, re-tour).
2. **Residential multifamily, not commercial.** Yardi Deal Manager and VTS Lease are both commercial real estate, pitched at brokers and asset managers. Buildium is residential but is a vendor listicle, not a pipeline page. There is no strong residential pipeline page written for a leasing manager and their regional manager. Write to that pair explicitly.
3. **The finance-team view is unclaimed.** None of the three read pages addresses the finance audience directly. Connect stage timing to forecast reliability: what a stalled stage does to projected move-in revenue and occupancy forecasts.
4. **Answer-engine format.** Several of our real Search Console queries are conversational, the shape an AI assistant produces. Yardi is the only one of the three with a real FAQ block, and its questions are all about its own product ("What is Deal Manager?"). A question-led FAQ in natural language, answering category questions rather than product questions, is open ground.

### FAQ questions

Taken verbatim from `context/gsc-questions.md`, section `lp1`.

1. **can you suggest a management platform that offers comprehensive reporting and insights for short-term rentals?** (625 impressions, pos 10), Say plainly that Leasey.AI is built for residential leasing pipelines rather than short-term rental stays, and point short-term rental readers elsewhere.
2. **who provides ai tools that improve lead-to-lease conversion rates?** (283 impressions, pos 5.8), Name the mechanism: AI that flags which stage a lead is stalling in, so the team intervenes before the lead goes cold.
3. **what property management software has the best analytics?** (50 impressions, pos 6.5), Distinguish reporting (what happened) from diagnosis (why it happened and what to do), and show the time-in-stage view as the example.
4. **what are the best ai tools for improving lease conversion rates?** (30 impressions, pos 9.8), List the categories that actually move conversion: response time, tour-to-application, application-to-approval, each with its stage timing.
5. **which software tracks key metrics like rent payment delinquency rates?** (20 impressions, pos 6.6), State which metrics we track in the leasing pipeline and where delinquency sits relative to that scope.
6. **what metrics prove leasing automation is working** (11 impressions, pos 7.2), Give the short list: time in each stage, stage-to-stage conversion, and days to lease, measured before and after.

Questions 1, 2 and 4 are conversational in register, the phrasing an AI assistant generates. Answering them literally, in the first sentence under the heading, is the AEO opportunity.

### Limitations

- **SERP rank order not verified.** I read three competitor pages, but I did not confirm which is first, second or third for `leasing pipeline management software`. The search tool returns results without reliable rank positions, so the ordering in the table is **NOT VERIFIABLE**. Other pages surfaced for the query and were **not** opened: AppFolio marketing-and-leasing, AppFolio leasing-management, MRI Lease Flow, RentPost's top-10 listicle, GetApp's category page, Occupier's blog post. Nothing is claimed about any of them.
- **VTS Lease not re-read by me.** My WebFetch returned HTTP 403 Forbidden. Everything stated about VTS above comes from the earlier real-browser read supplied to me, not from my own retrieval. I could not independently re-confirm its H2s or word count.
- **Our own page not opened.** I did not fetch https://www.leasey.ai/resources/leasing-pipeline-visibility/, so I make no claim about its current headings, length or content. Note also that the search tool surfaced a Leasey.AI URL at `/benefits/leasing-pipeline-visibility/` rather than `/resources/`; whether these are the same page, a redirect or two separate pages is **NOT VERIFIABLE** without opening both.
- **No competitor traffic or ranking data.** Word counts are the fetch tool's estimates, not measured. No backlink, traffic or difficulty data was available.
- **Search Console figures** in the FAQ section are copied from `context/gsc-questions.md` as given; I did not query Search Console directly.

## 4. Estructura a publicar

Los ocho bloques de la plantilla. Los H2 marcados FIJO se escriben literales.

**BLOQUE 1 · Hero**
- [FIJO] Eyebrow con breadcrumb al hub. ⚠️ `/benefits/` da 404, así que el breadcrumb queda pendiente de que exista el hub.
- [DINÁMICO] H1: `Leasing Pipeline Visibility` se mantiene.
- [DINÁMICO] Intro de 3 líneas, responde la intención en la primera frase, contiene la keyword foco.
- [FIJO] CTA primario y secundario. ⚠️ Sin destino hasta que se decida el CTA canónico.

**BLOQUE 2 · Qué es**
- [FIJO] H2: `What is a leasing pipeline management software?`
- [DINÁMICO] Definición directa en el primer párrafo, keyword foco en la primera oración.

**BLOQUE 3 · El problema que resuelve**
- [FIJO] H2: `Why leasing managers and regional managers need leasing pipeline management software`
- [DINÁMICO] El dolor operativo concreto, anclado a una situación real de operador.
- [DINÁMICO H3] 1 o 2 subsecciones.

**BLOQUE 4 · Cómo funciona**
- [FIJO] H2 con patrón de capacidades.
- [DINÁMICO] 3 o 4 capacidades reales de producto. El diferenciador sale del análisis del top 3.
- [DINÁMICO H3] Subsecciones diagnósticas.
- [FIJO specs] Un diagrama SVG, 1200 × 630, exportado a WebP, sin cifras inventadas.

**BLOQUE 5 · Métricas**
- [FIJO] H2: `Key management software metrics to track` o equivalente.
- [DINÁMICO] Métricas específicas del beneficio, adaptadas a leasing residencial.

**BLOQUE 6 · FAQ**
- [FIJO] H2: `Frequently Asked Questions`
- [DINÁMICO] De 4 a 6 preguntas exact-match. Ver la sección de investigación.

**BLOQUE 7 · Related content**
- [FIJO] H2: `Related content`
- [DINÁMICO] El redactor propone los enlaces del cluster y verifica que cada uno devuelva 200 sin redirección.

**BLOQUE 8 · CTA final**
- [FIJO] Fondo oscuro, H2 fijo, CTAs. ⚠️ No publicar sin CTA funcional.

## 5. Meta

**Meta title (48 caracteres):**
`Leasing Pipeline Management Software | Leasey.AI`

**Meta description (152 caracteres):**
`See every lead, showing, and application across your portfolio in one live dashboard. Find the stage where deals stall, and coach the team that owns it.`

El `<title>` actual mide 79 caracteres, **24 por encima del límite de 55**.

## 6. Cifras y fuentes (Regla D)

**Esta página no tiene ninguna cifra hoy.** El bloque de prueba se construye desde cero, que es la condición en la que aparecen los datos inventados. Regla dura: **una cifra sin URL directa al recurso exacto no se publica.**

**Fuentes externas verificadas el 30 de julio de 2026**, leyendo el documento original:

| Dato | Fuente | Enlace |
|---|---|---|
| Los 50 mayores gestores de apartamentos de EE. UU. administran el **23,7%** del parque | 2026 NMHC 50 Survey | https://www.nmhc.org/research-insight/the-nmhc-50/faqs-about-the-nmhc-50/ |
| Greystar administra **más de 1 millón de unidades** (1.014.091) | 2026 NMHC 50, Top Managers | https://www.nmhc.org/research-insight/the-nmhc-50/top-50-lists/2026-top-managers/ |

⚠️ **No citar la edición de 2025**, que dice 21,4% y 946.742. Mezclar el porcentaje de un año con las unidades de otro produce una frase donde cada mitad es defendible y el conjunto es falso.

**Datos propios de producto** (autofuente, se declaran como tales): sindicación a 48+ marketplaces, 100% de tasa de respuesta, Liza como agente de teléfono, los PMS integrados.

**Prohibido:** cualquier porcentaje de mejora, ahorro de tiempo o plazo de implementación sin fuente abierta. Si la única fuente de una cifra es otra página de leasey.ai, es autocita circular y es bloqueo.

## 7. Interlinking

**Verificados en vivo el 30 de julio de 2026, devuelven 200 sin redirección:**

- `/showing-scheduler/`
- `/tenant-screening/`
- `/smart-rent-pricing/`
- `/marketplace-syndication/`
- `/ai-agent-page/`

**No enlazar, comprobados rotos:**

| Ruta | Estado | Nota |
|---|---|---|
| `/benefits/` | **404** | el hub del cluster no existe |
| `/get-started/` | **301 a la homepage** | el CTA canónico no tiene destino propio |
| `/integrations/` | **404** | aparece en el menú del sitio |
| `/learn-more-integrations/` | **410** | borrada |
| `/team-collaboration/` | **410** | borrada |
| `/lead-prequalification/` | **410** | borrada |
| `/smart-route-planner/` | **410** | borrada |
| `/advanced-reporting/` | **410** | borrada, y sigue en el sitemap |

**Enlaces internos que la página sirve hoy:** 40. Hay que resolverlos uno a uno antes de publicar y quitar los que devuelvan 404 o 410.

Y una comprobación que se olvida: **ningún enlace puede redirigir a esta misma página**. Un enlace que vuelve a sí mismo devuelve 200 y pasa cualquier revisión superficial.

## 8. Reglas de escritura

- Inglés británico, coma de Oxford, "Leasey.AI" con esa capitalización. Vigilar terminaciones **-ize** y **-ization**.
- **Cero em-dashes.** Hoy hay **17**.
- Máximo una mención de "Leasey.AI" por sección H2.
- Párrafos de 4 líneas como máximo, una idea cada uno, voz activa.
- Negrillas solo en la frase clave, 2 o 3 por H2.
- Intro de 3 líneas, cero enlaces, responde la intención en la primera frase.
- La regla 18 de longitud **no aplica**: es landing, manda la conversión.
- Palabras prohibidas: streamline, seamless, unlock, empower, robust, transform, game-changer.

## 9. Bloqueos

| Bloqueo | Efecto |
|---|---|
| `/benefits/` da **404** | El breadcrumb del bloque 1 y el hub del cluster no se pueden completar. El hub está escrito y sin publicar en `output/2026-07-24/hubs/benefits-hub.md` |
| `/get-started/` da **301** a la homepage | Los CTA de los bloques 1 y 8 no tienen destino. Afecta a las diez landings |
| Volumen de la keyword foco | Nuestros exports son de posiciones, no de research. Necesita herramienta externa |
| Los 6 H6 sin H4 ni H5 | Es del bloque de CTA del tema, común a las diez. Se arregla en el tema |

## 10. Criterio de terminado

- [ ] Cero em-dashes
- [ ] Un solo H1 en la página renderizada
- [ ] Firma `Admin` eliminada, ninguna en su lugar
- [ ] Los ocho bloques de la plantilla, con los cinco H2 de patrón literales
- [ ] Bloque FAQ presente con 4 a 6 preguntas de intención real
- [ ] Cada cifra con enlace directo al recurso exacto, abierto y leído
- [ ] Cada enlace interno devuelve 200 sin redirección y ninguno apunta a esta página
- [ ] Metas dentro de límite, con el conteo verificado
- [ ] `node scripts/precheck-delivery.mjs` sin hallazgos
