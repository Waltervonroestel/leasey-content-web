# Brief · Student Housing Leasing Automation

| | |
|---|---|
| **URL en vivo** | `https://www.leasey.ai/resources/student-housing-leasing-automation/` |
| **Notion** | https://app.notion.com/p/3a743656a5b38178b246f8830ccf520f |
| **Google Doc** | https://docs.google.com/document/d/1X6tb8Gjg7y7NfStaUba1N1x7N9652htY_UWN-2IkM54/edit |
| **Pilar** | Speed, secondary Agent |
| **Audiencia** | student housing operators |
| **Autor** | **Ninguno.** Las landings no llevan firma (Regla C, decisión de Walter del 30 jul 2026) |

> La plantilla `context/benefits-landing-template.md` gobierna sobre este brief. Los ocho bloques y los cinco H2 de patrón fijo no se discuten aquí: se escriben literales.

---

## 1. Estado real de la página

Medido el 30 de julio de 2026 abriendo la página, no deducido del reporte SEO.

| | |
|---|---|
| HTTP | 200, sin redirección |
| **H1 real** | `Student Housing and Seasonal Leasing` |
| H2 / H3 / H4 / H5 / H6 | 6 / 17 / 0 / 0 / **6** |
| Firma visible | **Sí, dice `Admin`** |
| Firma en JSON-LD | **sí** |
| Em-dashes | **20** |
| Enlaces externos | 4 |
| `<title>` actual | `Student Housing Leasing Automation for Operators Managing 100 or More Beds | Leasey.AI` (86 caracteres) |

**El H1 ya existe.** La Regla B está cumplida y no hay nada que crear. Ojo: el `<title>` de arriba **no es el H1**, son dos cosas distintas y confundirlas fue un error real de la versión anterior de este brief.

**Hay 6 H6 sin ningún H4 ni H5.** Es un salto de nivel. Las diez landings del cluster tienen exactamente el mismo patrón, así que **no es un defecto de esta página sino del bloque de CTA de la plantilla del tema**. Conviene arreglarlo una vez en el tema, no diez veces a mano.

**Hay que eliminar la firma `Admin`**, visible en el cuerpo y presente en el JSON-LD. No se sustituye por nadie.

> Nota de medición: la densidad de marca de la tabla se calcula sobre la página renderizada, que incluye menú y pie. Sobre el cuerpo del artículo el porcentaje es más alto. Al reescribir, la regla operativa es **una mención de "Leasey.AI" por H2 como máximo**.

## 2. Keyword foco

### `student housing leasing automation`

**Measured demand exists on this page.** Search Console, 2026-04-29 a 2026-07-28: **10 queries, 40 impressions, 0 clicks**, best average position **1**.

The queries carrying the most impressions today:

| Query | Impressions | Clicks | Avg position |
|---|---|---|---|
| best ai solutions for student housing leasing and operations | 12 | 0 | 16.8 |
| student housing peak leasing season automation strategies | 10 | 0 | 3.1 |
| ai automation for student housing leasing and inquiries | 5 | 0 | 4.4 |
| ai for student housing leads | 5 | 0 | 15.4 |
| leading ai platforms for student housing leasing. | 2 | 0 | 9.5 |
| what’s the leading platform for pre-leasing and early demand capture? | 2 | 0 | 2.5 |

**What this proves:** the page is being served for these queries and Google has a measured position for it.
**What it does not prove:** that `student housing leasing automation` itself has search volume. None of these queries is the focus keyword. Impressions here are evidence about *these* queries only.

## 3. Análisis del top 3

# t7, student housing leasing automation

**Target page:** https://www.leasey.ai/resources/student-housing-leasing-automation/
**Focus keyword:** `student housing leasing automation`
**Audience:** student housing operators
**GSC reality:** 40 impressions in 90 days. Top query by impressions is `best ai solutions for student housing leasing and operations`, 12 impressions at position 16.8. That is a conversational, assistant-style query, not a head term.

### Top-3 analysis

Search run on the exact keyword, ads and leasey.ai excluded. All three were opened and read via WebFetch.

| Position | Page | Format | Angle | Sources | Weakness |
|---|---|---|---|---|---|
| 1 | eliseai.com/asset/student (EliseAI, AI for Student Housing) | Vendor solution page, feature-led | Product pillars (LeasingAI, ResidentAI, EliseCRM) reduce operational overhead while keeping service quality. H2s read: `AI-Automation for Student Housing`, `Year-Round student housing support`, `AI-Automation for Student Housing` (repeated), `Powering Your Student Housing Operations with AI Automation` | No statistics and no external citations. One named testimonial from an SVP, Ashly Poyer | Sells capability, not the cycle. Tours and `guarantor policies` are named, and per-bed pricing appears only inside a feature list. No cohort turnover, no compressed pre-leasing window, no turn day, no roommate matching. `Year-Round` is actually the counter-message to the cycle |
| 2 | gitnux.org/best/student-housing-software/ | Ranked listicle, 10 vendor reviews plus buyer's guide | Operational efficiency and workflow consolidation, centralising room assignments, billing and resident engagement. H2s: `Editor's top 3 picks`, `Related reading`, `Comparison Table`, `Jump to Review`, `Conclusion`, `How to Choose the Right Student Housing Software`, `What Is Student Housing Software?`, `Key Features to Look For`, `Who Needs Student Housing Software?`, `Common Mistakes to Avoid`, `How We Selected and Ranked These Tools`, `Frequently Asked Questions About Student Housing Software`, `Tools reviewed` | No external statistics or research. Rankings come from its own stated 4-step methodology, weighted 40% features, 30% ease of use, 30% value | Treats student housing as multifamily with a different label. No cohort concentration, no pre-leasing peak, no turn day, no guarantor workflow, no roommate matching, no bed-level versus unit-level leasing, no academic calendar |
| 3 | zipdo.co/best/student-housing-software/ | Ranked listicle, near-identical template to position 2 | Unified platform consolidating leasing, residents, payments and maintenance. H2s: `Editor's top 3 picks`, `Comparison Table`, `Conclusion`, `Our verdict`, `How to Choose the Right Student Housing Software`, `What Is Student Housing Software?`, `Key Features to Look For`, `Who Needs Student Housing Software?`, `Common Mistakes to Avoid`, `How We Selected and Ranked These Tools`, `FAQ`, `Frequently Asked Questions About Student Housing Software`, `Tools Reviewed`, `Keep exploring`, `Related reading`, `Methodology`, `How we ranked these tools`, `For Software Vendors` | No statistics, citations or external market research. Same weighted internal scoring | Mentions `high-turnover` generically but never the lease-year calendar. Same six gaps as position 2. Duplicated section headings (two FAQ blocks, two methodology blocks) suggest a templated page rather than sector expertise |

**Cycle check (step 3).** None of the three pages I read treats student housing as a cohort business. Across all three, the compressed pre-leasing peak, cohort-wide turn day, academic calendar sync and bed-level inventory are absent as strategic framing. EliseAI is the closest, because it names guarantors and per-bed pricing, but it frames them as features and its own headline promise is `Year-Round student housing support`, which flattens the seasonality rather than owning it. Within these three pages, the cycle angle is unclaimed.

### Opportunities for Leasey.AI

1. **Own the compressed pre-leasing peak as the whole thesis.** From all three pages read: none organises its content around the fact that a full cohort signs inside a narrow window and turns over on one date. Leasey can structure the page as a calendar (pre-lease window, renewal window, turn day, tail-end fill) instead of a feature list, which is what every one of the three does.
2. **Bed-level leasing as a first-class concept, not a bullet.** From EliseAI: per-bed pricing appears only inside a feature list, and neither listicle mentions bed-level versus unit-level leasing at all. Explaining why bed-level inventory breaks unit-level automation logic is a differentiator none of the three claims.
3. **Answer the actual measured query directly.** GSC shows `best ai solutions for student housing leasing and operations` at position 16.8. Both listicles I read own that comparison intent with zero data behind their rankings, and neither cites a single external source. A comparison section with stated criteria and real operator context is a defensible wedge against thin, templated listicles.
4. **Guarantor and roommate workflows as the operational tax of the sector.** From all three: guarantors appear once as a capability on EliseAI and nowhere in either listicle. Roommate matching is absent from all three pages I read. This is concrete, sector-specific ground that is currently open.

### FAQ questions

**Option chosen: (a).** There is only one measured question in `context/gsc-questions.md` under `t7` and it is off-topic, so the FAQ below is **derived**, not measured. Each item is derived from a gap or a claim in the three competitor pages I actually opened.

Measured (1, off-topic, do not use as an FAQ heading on this page):
- `do student loans count as income for rental application`, 1 impression, 0 clicks, position 1. Off-topic for this page.

Derived, not measured (from the three pages read):
1. How is student housing leasing automation different from multifamily leasing automation? (derived from the multifamily-equivalence gap in both listicles)
2. Can leasing automation handle bed-level inventory rather than whole units? (derived from EliseAI's per-bed pricing bullet, unaddressed in both listicles)
3. How does automation handle guarantors and co-signers on a student lease? (derived from EliseAI's `guarantor policies` and co-signer payment mentions)
4. What does leasing automation actually do during the pre-leasing peak versus the rest of the year? (derived from EliseAI's `Year-Round student housing support` framing)
5. Can leasing automation support roommate matching and group applications? (derived from the roommate-matching absence across all three)
6. What should an operator look for when comparing student housing leasing tools? (derived from the `Key Features to Look For` and `How to Choose` sections common to both listicles)

### Limitations

- **No measured question demand for this page.** The only `t7` entry in `context/gsc-questions.md` is `do student loans count as income for rental application`, 1 impression, off-topic. Every question in the FAQ section above is derived from competitor content, not from search demand. Do not present them as measured.
- **Ranking order is approximate.** Positions 1 to 3 reflect the order returned by the search tool for the exact keyword with leasey.ai blocked. I could not see a live personalised SERP, so I cannot confirm ad placement, SERP features or the exact organic rank of each URL.
- **Page content was read through a fetch-and-summarise pass**, so heading lists reflect what the fetch returned. Client-side rendered sections, tabs, accordions or content behind interaction may exist and would not appear. Absence claims above are scoped to what the fetch returned, not to the entire site.
- **Only these three URLs were opened.** Other results appeared in the search (usehaven.ai, revela.co, roomchoice.com, mews.com, starrez.com) and were NOT opened, so nothing here can be claimed about them, including whether any of them owns the cycle angle.
- **The Leasey.AI target page itself was not opened** in this pass, so this report says nothing about what the current page already covers or omits.
- **No traffic, conversion or ranking data for the competitors** was retrieved. Weakness assessments are editorial judgements about content coverage, not performance claims.

## 4. Estructura a publicar

Los ocho bloques de la plantilla. Los H2 marcados FIJO se escriben literales.

**BLOQUE 1 · Hero**
- [FIJO] Eyebrow con breadcrumb al hub. ⚠️ `/benefits/` da 404, así que el breadcrumb queda pendiente de que exista el hub.
- [DINÁMICO] H1: `Student Housing and Seasonal Leasing` se mantiene.
- [DINÁMICO] Intro de 3 líneas, responde la intención en la primera frase, contiene la keyword foco.
- [FIJO] CTA primario y secundario. ⚠️ Sin destino hasta que se decida el CTA canónico.

**BLOQUE 2 · Qué es**
- [FIJO] H2: `What is a student housing leasing automation?`
- [DINÁMICO] Definición directa en el primer párrafo, keyword foco en la primera oración.

**BLOQUE 3 · El problema que resuelve**
- [FIJO] H2: `Why student housing operators need student housing leasing automation`
- [DINÁMICO] El dolor operativo concreto, anclado a una situación real de operador.
- [DINÁMICO H3] 1 o 2 subsecciones.

**BLOQUE 4 · Cómo funciona**
- [FIJO] H2 con patrón de capacidades.
- [DINÁMICO] 3 o 4 capacidades reales de producto. El diferenciador sale del análisis del top 3.
- [DINÁMICO H3] Subsecciones diagnósticas.
- [FIJO specs] Un diagrama SVG, 1200 × 630, exportado a WebP, sin cifras inventadas.

**BLOQUE 5 · Métricas**
- [FIJO] H2: `Key leasing automation metrics to track` o equivalente.
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

**Meta title (46 caracteres):**
`Student Housing Leasing Automation | Leasey.AI`

**Meta description (132 caracteres):**
`Handle a whole cohort turning over at once: answer every enquiry, qualify at volume, and book showings through the pre-leasing peak.`

El `<title>` actual mide 86 caracteres, **31 por encima del límite de 55**.

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
- **Cero em-dashes.** Hoy hay **20**.
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
