# Brief · Lease-Up Software

| | |
|---|---|
| **URL en vivo** | `https://www.leasey.ai/resources/lease-up-software-new-construction-acquisitions/` |
| **Notion** | https://app.notion.com/p/3a743656a5b381a7a7a9de88ff432c02 |
| **Google Doc** | https://docs.google.com/document/d/1zN3gn0MMBSNc_dOT7FGFnAJU5nmzMcE4hTiataiLbQ4/edit |
| **Pilar** | Speed |
| **Audiencia** | developers and operators in lease-up |
| **Autor** | **Ninguno.** Las landings no llevan firma (Regla C, decisión de Walter del 30 jul 2026) |

> La plantilla `context/benefits-landing-template.md` gobierna sobre este brief. Los ocho bloques y los cinco H2 de patrón fijo no se discuten aquí: se escriben literales.

---

## 1. Estado real de la página

Medido el 30 de julio de 2026 abriendo la página, no deducido del reporte SEO.

| | |
|---|---|
| HTTP | 200, **redirige** al slug final |
| **H1 real** | `Faster Lease-Ups for New Construction and Acquisitions` |
| H2 / H3 / H4 / H5 / H6 | 6 / 17 / 0 / 0 / **6** |
| Firma visible | **Sí, dice `Admin`** |
| Firma en JSON-LD | **sí** |
| Em-dashes | **19** |
| Enlaces externos | 4 |
| `<title>` actual | `Lease-Up Software for New Construction and Portfolio Acquisitions | Leasey.AI` (77 caracteres) |

**El H1 ya existe.** La Regla B está cumplida y no hay nada que crear. Ojo: el `<title>` de arriba **no es el H1**, son dos cosas distintas y confundirlas fue un error real de la versión anterior de este brief.

**Hay 6 H6 sin ningún H4 ni H5.** Es un salto de nivel. Las diez landings del cluster tienen exactamente el mismo patrón, así que **no es un defecto de esta página sino del bloque de CTA de la plantilla del tema**. Conviene arreglarlo una vez en el tema, no diez veces a mano.

**Hay que eliminar la firma `Admin`**, visible en el cuerpo y presente en el JSON-LD. No se sustituye por nadie.

> Nota de medición: la densidad de marca de la tabla se calcula sobre la página renderizada, que incluye menú y pie. Sobre el cuerpo del artículo el porcentaje es más alto. Al reescribir, la regla operativa es **una mención de "Leasey.AI" por H2 como máximo**.

## 2. Keyword foco

### `lease-up software`

**Measured demand exists on this page.** Search Console, 2026-04-29 a 2026-07-28: **6 queries, 31 impressions, 0 clicks**, best average position **1**.

The queries carrying the most impressions today:

| Query | Impressions | Clicks | Avg position |
|---|---|---|---|
| what’s the leading platform for pre-leasing and early demand capture? | 9 | 0 | 2.2 |
| leasing automation software for high volume lease ups | 7 | 0 | 5.7 |
| leading platform pre-leasing early demand capture | 6 | 0 | 4.2 |
| how to get buy-in from leasing agents for new software | 5 | 0 | 45.8 |
| "pre-leasing" "early demand capture" platform | 2 | 0 | 2 |
| "pre-leasing" platform or software "early demand" or "demand capture" real estate | 2 | 0 | 1 |

**What this proves:** the page is being served for these queries and Google has a measured position for it.
**What it does not prove:** that `lease-up software` itself has search volume. None of these queries is the focus keyword. Impressions here are evidence about *these* queries only.

## 3. Análisis del top 3

# t8, `lease-up software`

Target page: https://www.leasey.ai/resources/lease-up-software-new-construction-acquisitions/
Audience: developers and operators in the lease-up phase of new construction or acquisitions.
Research date: 30 July 2026. Top-3 organic taken from WebSearch, ads and leasey.ai excluded.

### Top-3 analysis

| Position | Page | Format | Angle | Sources | Weakness |
| --- | --- | --- | --- | --- | --- |
| 1 | leaseup.co (LeaseUp, The CRE Deal Platform) | Product landing page. H2s read: `The best client experience`, `An Ai enabled broker workflow`, `What customers are saying`, `Full control over market data`, `Work the way you want`, `Measureable value`, `Flexible pricing`, `Get working with LeaseUp` | Brand-name coincidence. Deal platform for commercial tenant rep brokers, not multifamily lease-up at all | None. Testimonials only, no third-party data | Ranks on brand-name collision. Says nothing about absorption, pre-leasing or stabilisation. Only speed claim found is "Create Surveys In Minutes, Not Hours", unsourced and about survey production, not leasing |
| 2 | hemlane.com/resources/best-lease-management-software (10 Best Lease Management Software Options for 2026) | Vendor-authored listicle with per-product Features/Pros/Cons/Pricing | Lease *management* and administration comparison, self-favouring (Hemlane is the author) | None cited. Competitor descriptions carry no attribution | Wrong lifecycle stage: it covers ongoing lease admin, renewals and escalations, not the concentrated inquiry surge of a lease-up. Speed language is vague and unsourced: "Faster lead-to-lease", "Faster collections", "move prospects from inquiry to move-in quickly" | 
| 3 | leaseup.us (LeaseUp US) | Thin landing page with a contact form. H2s read: `Lease up is coming soon` and `Supporting lease-ups from momentum to stabilization, without burnout.` | Service company, not software. Positioned around staff burnout during lease-up | None | Effectively a pre-launch holding page. Almost no body content, no methodology, no product detail. Makes no timeframe or occupancy claim at all |

All three were opened and read via WebFetch. No page in the top three required a curl fallback, and none returned a title-only JavaScript shell.

Timeframe check on the read pages: none of the three publishes a lease-up duration figure. No competitor in the top three states "fill your building in X weeks", so there is no sourced benchmark to borrow and nothing to counter directly.

### Opportunities for Leasey.AI

1. The keyword is contested by pages that are not about lease-up at all. Of the three read, one (leaseup.co) is a commercial brokerage deal tool and one (hemlane.com) is ongoing lease administration. Neither addresses the developer opening a 300-unit building. Leasey.AI can own the literal reading of the term by leading with the lease-up phase itself: pre-leasing before delivery, inquiry surge without headcount, absorption reporting to the investor. That framing appears in none of the three pages read.
2. Nobody read cites a source for anything. leaseup.co, hemlane.com and leaseup.us all carry zero external attribution. A page that attributes its few numbers, and openly declines to promise a timeline it cannot evidence, differentiates on credibility in a SERP with none.
3. leaseup.us is the only page read that names an emotional stake, staff burnout during lease-up, and it is a near-empty holding page that does nothing with it. The operational pressure angle is available and unoccupied: the leasing team absorbing peak inquiry volume in the first ninety days.
4. GSC signal worth designing for: the page already sits at position 2.2 on `what's the leading platform for pre-leasing and early demand capture?` at 31 impressions in 90 days. That is assistant-generated phrasing, not search-box phrasing. Adding one FAQ written in that same conversational register gives an AI answer engine a clean block to lift, on the exact query where the page already shows traction.

### FAQ questions

- **What is a lease-up property?** A newly built, renovated or repositioned property being marketed and leased until it reaches stabilised occupancy.
- **How long does a lease-up take?** It varies widely by asset size, market and marketing, and no figure should be quoted to an investor without the source it came from.
- **What is a lease-up period in apartment investing?** The window between a property becoming available to lease and the point it reaches its stabilisation threshold.
- **What is the difference between lease-up and stabilisation?** Lease-up is the filling phase; stabilisation is the occupancy level at which the property is considered operationally steady.
- **How does pre-leasing work before construction is finished?** Units are marketed and reserved ahead of delivery so inquiry demand exists on day one rather than starting from zero.
- **What's the leading platform for pre-leasing and early demand capture?** Conversational-register entry, added deliberately because Search Console shows the page at average position 2.2 on this exact phrasing; answer should describe the pre-leasing and demand-capture capability in plain terms without a ranking claim.

### Limitations

- The People Also Ask box was not read directly. Google's PAA panel is not retrievable through the tooling available here. The FAQ questions above were assembled from question-form titles and question phrasing surfaced across two WebSearch passes, not from a verified PAA panel. Treat them as strong candidates, not confirmed PAA exact-match strings.
- The lease-up duration ranges circulating in search snippets (six to nine months, five to seven months, six to eighteen months, and a claim that pre-leasing compresses lease-up by three to six months) come from pages I did NOT open: resident360, leaseengine.us, butterflymx, apartment.loans and others. Every one of those figures is NOT VERIFIABLE from this research and none may appear on our page.
- Search results were US-region only and reflect a single query on a single date. Ranking order was not confirmed against a live SERP screenshot, and paid placements above the organic block could not be observed.
- Our own target page was not opened during this pass, so no gap analysis against its current on-page content was performed.
- The 31 impressions / position 2.2 figure is taken as given from the brief. It was not independently re-pulled from GSC here.

## 4. Estructura a publicar

Los ocho bloques de la plantilla. Los H2 marcados FIJO se escriben literales.

**BLOQUE 1 · Hero**
- [FIJO] Eyebrow con breadcrumb al hub. ⚠️ `/benefits/` da 404, así que el breadcrumb queda pendiente de que exista el hub.
- [DINÁMICO] H1: `Faster Lease-Ups for New Construction and Acquisitions` se mantiene.
- [DINÁMICO] Intro de 3 líneas, responde la intención en la primera frase, contiene la keyword foco.
- [FIJO] CTA primario y secundario. ⚠️ Sin destino hasta que se decida el CTA canónico.

**BLOQUE 2 · Qué es**
- [FIJO] H2: `What is a lease-up software?`
- [DINÁMICO] Definición directa en el primer párrafo, keyword foco en la primera oración.

**BLOQUE 3 · El problema que resuelve**
- [FIJO] H2: `Why developers and operators in lease-up need lease-up software`
- [DINÁMICO] El dolor operativo concreto, anclado a una situación real de operador.
- [DINÁMICO H3] 1 o 2 subsecciones.

**BLOQUE 4 · Cómo funciona**
- [FIJO] H2 con patrón de capacidades.
- [DINÁMICO] 3 o 4 capacidades reales de producto. El diferenciador sale del análisis del top 3.
- [DINÁMICO H3] Subsecciones diagnósticas.
- [FIJO specs] Un diagrama SVG, 1200 × 630, exportado a WebP, sin cifras inventadas.

**BLOQUE 5 · Métricas**
- [FIJO] H2: `Key lease-up software metrics to track` o equivalente.
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

**Meta title (50 caracteres):**
`Lease-Up Software for New Construction | Leasey.AI`

**Meta description (139 caracteres):**
`Fill a new building without hiring a temporary team: capture early demand, qualify at volume, and keep the tour calendar full from day one.`

El `<title>` actual mide 77 caracteres, **22 por encima del límite de 55**.

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
- **Cero em-dashes.** Hoy hay **19**.
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
