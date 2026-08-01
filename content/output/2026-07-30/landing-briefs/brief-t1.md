# Brief · Consistent Tenant Experience

| | |
|---|---|
| **URL en vivo** | `https://www.leasey.ai/resources/consistent-tenant-experience/` |
| **Notion** | https://app.notion.com/p/3a743656a5b38111ace1d597d31ab12f |
| **Google Doc** | https://docs.google.com/document/d/1cDEo1G14MngcrLPW2jp5OsEJjFxo9SXbjEYhqcgJR68/edit |
| **Pilar** | Compliance, secondary Agent |
| **Audiencia** | leasing directors and marketing directors |
| **Autor** | **Ninguno.** Las landings no llevan firma (Regla C, decisión de Walter del 30 jul 2026) |

> La plantilla `context/benefits-landing-template.md` gobierna sobre este brief. Los ocho bloques y los cinco H2 de patrón fijo no se discuten aquí: se escriben literales.

---

## 1. Estado real de la página

Medido el 30 de julio de 2026 abriendo la página, no deducido del reporte SEO.

| | |
|---|---|
| HTTP | 200, sin redirección |
| **H1 real** | `Consistent Tenant Experience` |
| H2 / H3 / H4 / H5 / H6 | 6 / 17 / 0 / 0 / **6** |
| Firma visible | **Sí, dice `Admin`** |
| Firma en JSON-LD | **sí** |
| Em-dashes | **25** |
| Enlaces externos | 4 |
| `<title>` actual | `How Leasey.AI Delivers a Consistent Leasing Experience for Every Prospective Tenant` (83 caracteres) |

**El H1 ya existe.** La Regla B está cumplida y no hay nada que crear. Ojo: el `<title>` de arriba **no es el H1**, son dos cosas distintas y confundirlas fue un error real de la versión anterior de este brief.

**Hay 6 H6 sin ningún H4 ni H5.** Es un salto de nivel. Las diez landings del cluster tienen exactamente el mismo patrón, así que **no es un defecto de esta página sino del bloque de CTA de la plantilla del tema**. Conviene arreglarlo una vez en el tema, no diez veces a mano.

**Hay que eliminar la firma `Admin`**, visible en el cuerpo y presente en el JSON-LD. No se sustituye por nadie.

> Nota de medición: la densidad de marca de la tabla se calcula sobre la página renderizada, que incluye menú y pie. Sobre el cuerpo del artículo el porcentaje es más alto. Al reescribir, la regla operativa es **una mención de "Leasey.AI" por H2 como máximo**.

## 2. Keyword foco

### `consistent tenant experience`

**This page has no measured demand.** Search Console, 2026-04-29 a 2026-07-28: **zero queries, zero impressions, zero clicks**.

With no impressions there is no position to report, because Google only computes a position where the page was actually served. Any claim about where this page ranks is unsupported by definition.

**What this proves:** the page has no search presence to protect. Rule A does not apply, so the structure can be rebuilt freely.
**What it does not prove:** that `consistent tenant experience` has no search volume. Our Semrush and Organic Keywords exports only contain terms the site already ranks for, so a term's absence means we have no data on it, not that demand is zero. Establishing volume needs an external research tool and is Alejandra's call.

## 3. Análisis del top 3

# T1 landing research: `consistent tenant experience`

Focus keyword: consistent tenant experience
Our page: https://www.leasey.ai/resources/consistent-tenant-experience/
Audience: leasing directors and marketing directors
Research date: 30 July 2026

### Top-3 analysis

| Position | Page | Format | Angle | Sources | Weakness |
|---|---|---|---|---|---|
| 1 | Visitt, "From Data to Delight: AI's Role in Elevating Tenant Experience" (visitt.io/blog/from-data-to-delight-ais-role-in-elevating-tenant-experience) | Blog post, roughly 1,450 words, TL;DR plus bullets plus FAQ block | Thought leadership: AI moves building teams from reactive manual work to proactive data-driven tenant service | None cited; entirely the vendor's own perspective and examples | No third-party data at all, commercial building operations rather than leasing, and nothing about the pre-lease funnel where leasing directors actually lose consistency |
| 2 | Grace Hill, "What You Don't Know About Tenant Satisfaction May Be Costing You" (gracehill.com/blog/what-you-dont-know-about-tenant-satisfaction-may-be-costing-you/) | Long blog post, roughly 2,200 words, jump-to-section nav, embedded amenities infographic, callout boxes | Advisory: tenant satisfaction is a financial imperative, built on seven expectation drivers, resolved by Grace Hill surveys | Heavily sourced: Building Engines, JLL, CBRE, KingsleySurveys, Cushman and Wakefield, Harvard T.H. Chan School of Public Health, Partners Real Estate | Diagnostic only. It tells you to measure satisfaction but never gets to the operational mechanics of delivering the same experience twice, and it is office/CRE weighted |
| 3 | TenantCloud, "How to Create a Positive Tenant Experience" (tenantcloud.com/blog/how-to-create-a-positive-tenant-experience) | NO VERIFIABLE | NO VERIFIABLE | NO VERIFIABLE | NO VERIFIABLE |

**Visitt, real H2s:**
`Understanding Tenant Needs`
`The Role of AI in Building Operations`
`AI and Tenant Satisfaction`
`Excelling Tenant Communications with AI`

**Grace Hill, real H2s:**
`What is tenant experience?`
`What do tenants expect?`
`Why does tenant satisfaction matter?`
`How do you know what your tenants really want?`
`Keep Your Finger on the Pulse of Tenant Satisfaction with Grace Hill`
H3s inside "What do tenants expect?": `Flexibility and Customization`, `Tenant Amenities`, `Sustainability`, `Technology Integration`, `Maintenance and Cleanliness`, `Tenant Engagement`, `Communication and Responsiveness`

**TenantCloud: NO VERIFIABLE.** WebFetch returned HTTP 503 with `Retry-After: 3600`. Raw curl with a desktop Chrome user agent, on both `/blog/how-to-create-a-positive-tenant-experience` and the alternate `/property-management/how-to-create-a-positive-tenant-experience`, also returned HTTP 503 with a Wordfence block page (`Your access to this site has been limited by the site owner`). No headings, angle, sources or weaknesses can be claimed for this page. It is firewall-blocked, not thin.

### Opportunities for Leasey.AI

1. **Own the pre-lease funnel, which is where consistency actually breaks.** Visitt's four H2s are all building operations and tenant communications after move-in; Grace Hill's seven drivers are amenities, sustainability, cleanliness and engagement. Neither of the two pages I could read covers tour scheduling, application response time or screening as consistency surfaces. That is the whole leasing director problem and it is unclaimed by the two pages I opened.

2. **Make consistency measurable per-prospect, not per-building.** Grace Hill's page is entirely diagnostic: it sells surveys as the way to find out what tenants want, and its final H2 is a product CTA. Leasey.AI can go one level further and define the operational metrics a leasing director can actually run a portfolio on: response time to first enquiry, tour-to-application rate variance between sites, screening criteria applied identically.

3. **Answer the marketing director's question the two readable pages skip: brand consistency at portfolio scale.** Visitt frames AI as an operations tool and cites nothing; Grace Hill frames satisfaction as a finance issue. Neither of the two I could read connects a repeatable leasing workflow to brand reputation across multiple properties, which is the marketing director's version of this keyword.

4. **Out-source Visitt without out-sourcing Grace Hill.** Visitt appears first in the search I ran, and carries zero external citations. That is a weak footing, though the search result order is not a measured ranking. Grace Hill sets the real evidence bar with seven named sources. Leasey.AI should carry named third-party data, plus first-party Leasey benchmarks that neither page has, to beat both on trust.

### FAQ questions

- **What is a consistent tenant experience?** It is the same standard of response, information and process for every prospect and resident, regardless of which property or team member they reach.
- **Why does tenant experience matter in property management?** It drives renewals and referrals, so it lowers vacancy, turnover cost and re-marketing spend.
- **How do you improve tenant experience without increasing operating costs?** Standardise and automate the repeatable touchpoints, so quality stops depending on individual staff effort.
- **What do tenants expect from property management?** Fast and clear communication, reliable maintenance, transparent terms and technology that lets them self-serve.
- **How do you measure tenant satisfaction?** Structured surveys at defined lifecycle moments, tracked alongside renewal and response-time data rather than in isolation.
- **How do you keep tenant screening consistent and compliant?** Apply identical criteria and the same documented process to every applicant, which protects the experience and Fair Housing compliance at once.

### Limitations

- **TenantCloud, position 3: not read.** WebFetch HTTP 503, then raw curl HTTP 503 on two URL variants, both served a Wordfence block page. Its headings, format, angle, sources and weaknesses are unverified. Every "none of them" claim above is deliberately scoped to the two pages I opened.
- **People Also Ask, not scraped directly.** WebSearch returns organic results, not the live PAA module. The six FAQ questions are drawn from the recurring question-form titles and query phrasings across three searches, so they reflect real search intent but are not confirmed verbatim PAA strings.
- **Our own page not audited.** I did not open https://www.leasey.ai/resources/consistent-tenant-experience/, so I cannot say which of the four opportunities it already covers or already ranks for.
- **Ranking positions are approximate.** WebSearch returns an ordered result list, not a verified SERP snapshot with ad and feature placement, so position numbers are indicative.
- **Word counts and source lists** for Visitt and Grace Hill come from the fetched page content and are approximate for word count, exact for named sources.

## 4. Estructura a publicar

Los ocho bloques de la plantilla. Los H2 marcados FIJO se escriben literales.

**BLOQUE 1 · Hero**
- [FIJO] Eyebrow con breadcrumb al hub. ⚠️ `/benefits/` da 404, así que el breadcrumb queda pendiente de que exista el hub.
- [DINÁMICO] H1: `Consistent Tenant Experience` se mantiene.
- [DINÁMICO] Intro de 3 líneas, responde la intención en la primera frase, contiene la keyword foco.
- [FIJO] CTA primario y secundario. ⚠️ Sin destino hasta que se decida el CTA canónico.

**BLOQUE 2 · Qué es**
- [FIJO] H2: `What is a consistent tenant experience?`
- [DINÁMICO] Definición directa en el primer párrafo, keyword foco en la primera oración.

**BLOQUE 3 · El problema que resuelve**
- [FIJO] H2: `Why leasing directors and marketing directors need consistent tenant experience`
- [DINÁMICO] El dolor operativo concreto, anclado a una situación real de operador.
- [DINÁMICO H3] 1 o 2 subsecciones.

**BLOQUE 4 · Cómo funciona**
- [FIJO] H2 con patrón de capacidades.
- [DINÁMICO] 3 o 4 capacidades reales de producto. El diferenciador sale del análisis del top 3.
- [DINÁMICO H3] Subsecciones diagnósticas.
- [FIJO specs] Un diagrama SVG, 1200 × 630, exportado a WebP, sin cifras inventadas.

**BLOQUE 5 · Métricas**
- [FIJO] H2: `Key tenant experience metrics to track` o equivalente.
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

**Meta title (40 caracteres):**
`Consistent Tenant Experience | Leasey.AI`

**Meta description (139 caracteres):**
`Give every prospect the same answer, the same speed, and the same paperwork, whichever property they enquire about and whoever is on shift.`

El `<title>` actual mide 83 caracteres, **28 por encima del límite de 55**.

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

**Enlaces internos que la página sirve hoy:** 42. Hay que resolverlos uno a uno antes de publicar y quitar los que devuelvan 404 o 410.

Y una comprobación que se olvida: **ningún enlace puede redirigir a esta misma página**. Un enlace que vuelve a sí mismo devuelve 200 y pasa cualquier revisión superficial.

## 8. Reglas de escritura

- Inglés británico, coma de Oxford, "Leasey.AI" con esa capitalización. Vigilar terminaciones **-ize** y **-ization**.
- **Cero em-dashes.** Hoy hay **25**.
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
