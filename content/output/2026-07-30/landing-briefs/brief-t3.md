# Brief · Third-Party Property Managers

| | |
|---|---|
| **URL en vivo** | `https://www.leasey.ai/resources/leasing-software-for-third-party-property-managers/` |
| **Notion** | https://app.notion.com/p/3a743656a5b381398345e0e6bda25433 |
| **Google Doc** | https://docs.google.com/document/d/1N5j5xCKw9JxEGfPN9SRdTXN-2f3cOzCbEK1Rav17X08/edit |
| **Pilar** | All-in-one, secondary Agent |
| **Audiencia** | third-party property managers |
| **Autor** | **Ninguno.** Las landings no llevan firma (Regla C, decisión de Walter del 30 jul 2026) |

> La plantilla `context/benefits-landing-template.md` gobierna sobre este brief. Los ocho bloques y los cinco H2 de patrón fijo no se discuten aquí: se escriben literales.

---

## 1. Estado real de la página

Medido el 30 de julio de 2026 abriendo la página, no deducido del reporte SEO.

| | |
|---|---|
| HTTP | 200, sin redirección |
| **H1 real** | `Third-Party Property Managers` |
| H2 / H3 / H4 / H5 / H6 | 7 / 19 / 0 / 0 / **6** |
| Firma visible | **Sí, dice `Admin`** |
| Firma en JSON-LD | **sí** |
| Em-dashes | **27** |
| Enlaces externos | 4 |
| `<title>` actual | `Leasing Automation for Third-Party Property Management Companies | Leasey.AI` (76 caracteres) |

**El H1 ya existe.** La Regla B está cumplida y no hay nada que crear. Ojo: el `<title>` de arriba **no es el H1**, son dos cosas distintas y confundirlas fue un error real de la versión anterior de este brief.

**Hay 6 H6 sin ningún H4 ni H5.** Es un salto de nivel. Las diez landings del cluster tienen exactamente el mismo patrón, así que **no es un defecto de esta página sino del bloque de CTA de la plantilla del tema**. Conviene arreglarlo una vez en el tema, no diez veces a mano.

**Hay que eliminar la firma `Admin`**, visible en el cuerpo y presente en el JSON-LD. No se sustituye por nadie.

> Nota de medición: la densidad de marca de la tabla se calcula sobre la página renderizada, que incluye menú y pie. Sobre el cuerpo del artículo el porcentaje es más alto. Al reescribir, la regla operativa es **una mención de "Leasey.AI" por H2 como máximo**.

## 2. Keyword foco

### `leasing software for third-party property managers`

**Measured demand exists on this page.** Search Console, 2026-04-29 a 2026-07-28: **1 queries, 1 impressions, 0 clicks**, best average position **31**.

The queries carrying the most impressions today:

| Query | Impressions | Clicks | Avg position |
|---|---|---|---|
| property management contract ai | 1 | 0 | 31 |

**What this proves:** the page is being served for these queries and Google has a measured position for it.
**What it does not prove:** that `leasing software for third-party property managers` itself has search volume. None of these queries is the focus keyword. Impressions here are evidence about *these* queries only.

## 3. Análisis del top 3

# Landing research: `leasing software for third-party property managers`

Target page: https://www.leasey.ai/resources/leasing-software-for-third-party-property-managers/
Audience: third-party property managers (managing units on behalf of external owners)
Research date: 30 July 2026

### Top-3 analysis

| Position | Page | Format | Angle | Sources | Weakness |
|---|---|---|---|---|---|
| 1 | Buildium, "6 of the best lease management software options for 2026" (buildium.com/blog/best-lease-management-software/) | Vendor listicle plus comparison table and FAQ | Category education leading to a vendor-owned shortlist; leans on speed of filling vacancies | Cites its own 2026 Industry Report and a RealPage renter-tour statistic; no external links verified | Written for property managers generally; owner-side functionality is mentioned only in passing and tenant portals dominate. No section addressing the manager-to-owner accountability relationship |
| 2 | Second Nature, "Best Lease Management Software for Property Managers" (secondnature.com/blog/best-lease-management-software) | Seven-platform comparison plus implementation guidance | Comparison that funnels to Resident Benefits Packages as the differentiator | Weak: one customer anecdote (Hive Real Estate, 40% more on-time payments) and unattributed operational claims such as "200+ doors lose 12-15 hours weekly" | Owner portals are described only as document-access permissions (AppFolio, Propertyware). Nothing on owner statements, reporting cadence or presenting results to a client who is not an employer |
| 3 | AmeriSave, "10 Best Property Management Software Solutions for 2026" (amerisave.com/learn/best-property-management-software-solutions-for-complete-guide) | Long-form buyer's guide, ten vendors, trends and mistakes sections | Neutral buyer's guide from a mortgage lender, ending in a lending CTA | Strongest of the three: Fortune Business Insights, Coherent Market Insights, Mordor Intelligence, SkyQuest, UpGuard | Broad property management software, not leasing specifically. Owner reporting appears as vendor feature bullets (AppFolio owner portal, Propertyware owner-specific reporting, Yardi owner statements) rather than as a workflow problem to solve |

**Buildium H2s (read via WebFetch):**
`What Is Lease Management Software?` · `Why Use Lease Management Software?` · `Key Features of Lease Management Software` · `6 of the Best Lease Management Software Options in 2026` · `What Is the Best Lease Management Software for Your Business?` · `Frequently Asked Questions About Lease Management Software`

**Second Nature H2s (read via WebFetch):**
`What is the best lease management software?` · `Seven best lease management software platforms compared` · `Best lease management software: Key factors to consider` · `Implementation practices for the best lease management software` · `Why the best lease management software includes Resident Benefits Packages` · `Choose the best lease management software for your team and residents` · `FAQ`

**AmeriSave H2s (read via WebFetch):**
`What Makes Great Property Management Software?` · `The Top 10 Property Management Software Solutions` · `How to Choose the Right Property Management Software` · `Recent Industry Trends Affecting Property Management Software` · `Common Mistakes to Avoid` · `How AmeriSave Can Help Your Investment Property Journey`

### Opportunities for Leasey.AI

1. **Own the client-not-boss angle.** None of the three pages I opened (Buildium, Second Nature, AmeriSave) frames the third-party manager's core tension: the owner is a client who can fire you, so leasing performance has to be presentable, not merely tracked. All three treat owner features as permission settings or feature bullets. A page built around "what your owner sees when they open the report" is unclaimed on this keyword.

2. **Leasing-specific owner reporting.** Buildium and Second Nature both stop at document access; AmeriSave lists owner statements as accounting output. Nobody I read connects leasing activity (days on market, showings, lead response time, applications, renewal pipeline) to the monthly owner report. That is the artefact third-party managers actually get judged on.

3. **Multi-owner, multi-portfolio reality.** Second Nature's strongest owner-related lines are about an owner seeing only their own properties. That is a data-partitioning point, not a workflow. Leasey can go further: separate leasing standards, fee structures and approval thresholds per owner, and what the software must do to keep them from bleeding into each other.

4. **Answer-first structure with defensible numbers.** Only AmeriSave cites external research. A page that cites its own leasing benchmarks (response time, lead-to-tour, tour-to-application) would out-evidence Buildium and Second Nature on the same query.

### FAQ questions

These are phrased from the related-question sets returned by the searches listed in Limitations; they are not confirmed as literal Google People Also Ask strings.

- **What is a third-party property manager?** A firm that operates rental properties on behalf of owners it does not employ, paid via a management fee or rent commission.
- **How much do third-party property managers charge?** Commonly 8-12% of collected rent for residential and 3-6% for commercial, plus a leasing fee often equal to 50-100% of one month's rent.
- **How do property managers report to owners?** Through a recurring owner report combining income and expense statements, an owner statement with beginning and ending balances, and performance metrics such as occupancy and cash flow.
- **What is included in a property management report?** Rent and other income, categorised expenses, net profit per asset, reserve balances, and leasing or occupancy activity for the period.
- **How much does property management software cost?** Typically $1-$5 per unit per month, with most vendors setting a $100-$300 monthly minimum and setup fees from $100 to over $1,000.
- **Do property managers have to file 1099s for owner disbursements?** Yes, US managers generally file 1099-MISC or 1099-NEC for owner disbursements and contractor payments above $600.

### Limitations

- The three competitor pages were read through WebFetch only, which returns a model-processed reading of the page. Heading lists above reflect that reading; I did not separately diff them against raw HTML, so minor wording differences in headings are possible.
- I could not confirm a genuine Google People Also Ask box. The WebSearch tool returns result links, not SERP features, so the FAQ block is reconstructed from related-question result titles (LinkedIn, DoorLoop, Second Nature, Rentec Direct, Baselane, Rentvine, Propertese) rather than scraped from the SERP. Treat the exact phrasing as unverified.
- Result ordering is from the WebSearch tool, not a clean incognito SERP, so "position 1-3" is approximate and ads could not be distinguished.
- I did not open the Leasey.AI target page, so this file makes no claim about what our page currently covers or lacks.
- LetHub's third-party management page (lethub.co/third-party-mgmt-and-brokerage) appeared in results and looks directly on-audience, but it fell outside the top three so I did not open it. NOT VERIFIABLE as a competitor; worth a separate pass.

## 4. Estructura a publicar

Los ocho bloques de la plantilla. Los H2 marcados FIJO se escriben literales.

**BLOQUE 1 · Hero**
- [FIJO] Eyebrow con breadcrumb al hub. ⚠️ `/benefits/` da 404, así que el breadcrumb queda pendiente de que exista el hub.
- [DINÁMICO] H1: `Third-Party Property Managers` se mantiene.
- [DINÁMICO] Intro de 3 líneas, responde la intención en la primera frase, contiene la keyword foco.
- [FIJO] CTA primario y secundario. ⚠️ Sin destino hasta que se decida el CTA canónico.

**BLOQUE 2 · Qué es**
- [FIJO] H2: `What is a leasing software for third-party property managers?`
- [DINÁMICO] Definición directa en el primer párrafo, keyword foco en la primera oración.

**BLOQUE 3 · El problema que resuelve**
- [FIJO] H2: `Why third-party property managers need leasing software for third-party property managers`
- [DINÁMICO] El dolor operativo concreto, anclado a una situación real de operador.
- [DINÁMICO H3] 1 o 2 subsecciones.

**BLOQUE 4 · Cómo funciona**
- [FIJO] H2 con patrón de capacidades.
- [DINÁMICO] 3 o 4 capacidades reales de producto. El diferenciador sale del análisis del top 3.
- [DINÁMICO H3] Subsecciones diagnósticas.
- [FIJO specs] Un diagrama SVG, 1200 × 630, exportado a WebP, sin cifras inventadas.

**BLOQUE 5 · Métricas**
- [FIJO] H2: `Key property managers metrics to track` o equivalente.
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

**Meta title (53 caracteres):**
`Leasing Software for Third-Party Managers | Leasey.AI`

**Meta description (135 caracteres):**
`Run leasing for every owner you manage from one system, and give each of them the reporting they ask for without rebuilding it by hand.`

El `<title>` actual mide 76 caracteres, **21 por encima del límite de 55**.

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

**Enlaces internos que la página sirve hoy:** 41. Hay que resolverlos uno a uno antes de publicar y quitar los que devuelvan 404 o 410.

Y una comprobación que se olvida: **ningún enlace puede redirigir a esta misma página**. Un enlace que vuelve a sí mismo devuelve 200 y pasa cualquier revisión superficial.

## 8. Reglas de escritura

- Inglés británico, coma de Oxford, "Leasey.AI" con esa capitalización. Vigilar terminaciones **-ize** y **-ization**.
- **Cero em-dashes.** Hoy hay **27**.
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
