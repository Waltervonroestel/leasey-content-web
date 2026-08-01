# Brief · Compliance and Risk Reduction

| | |
|---|---|
| **URL en vivo** | `https://www.leasey.ai/resources/leasing-compliance-risk-reduction/` |
| **Notion** | https://app.notion.com/p/3a743656a5b3813fb18dcc56284ecdea |
| **Google Doc** | https://docs.google.com/document/d/1KEWwzWSLTFLGLCIrayk3haroW9mHAggZ5r147Z1hZmY/edit |
| **Pilar** | Compliance |
| **Audiencia** | compliance and operations leads |
| **Autor** | **Ninguno.** Las landings no llevan firma (Regla C, decisión de Walter del 30 jul 2026) |

> La plantilla `context/benefits-landing-template.md` gobierna sobre este brief. Los ocho bloques y los cinco H2 de patrón fijo no se discuten aquí: se escriben literales.

---

## 1. Estado real de la página

Medido el 30 de julio de 2026 abriendo la página, no deducido del reporte SEO.

| | |
|---|---|
| HTTP | 200, sin redirección |
| **H1 real** | `Compliance and Risk Reduction` |
| H2 / H3 / H4 / H5 / H6 | 6 / 17 / 0 / 0 / **6** |
| Firma visible | **Sí, dice `Admin`** |
| Firma en JSON-LD | **sí** |
| Em-dashes | **19** |
| Enlaces externos | 4 |
| `<title>` actual | `Leasing Compliance and Risk Reduction for Property Managers | Leasey.AI` (71 caracteres) |

**El H1 ya existe.** La Regla B está cumplida y no hay nada que crear. Ojo: el `<title>` de arriba **no es el H1**, son dos cosas distintas y confundirlas fue un error real de la versión anterior de este brief.

**Hay 6 H6 sin ningún H4 ni H5.** Es un salto de nivel. Las diez landings del cluster tienen exactamente el mismo patrón, así que **no es un defecto de esta página sino del bloque de CTA de la plantilla del tema**. Conviene arreglarlo una vez en el tema, no diez veces a mano.

**Hay que eliminar la firma `Admin`**, visible en el cuerpo y presente en el JSON-LD. No se sustituye por nadie.

> Nota de medición: la densidad de marca de la tabla se calcula sobre la página renderizada, que incluye menú y pie. Sobre el cuerpo del artículo el porcentaje es más alto. Al reescribir, la regla operativa es **una mención de "Leasey.AI" por H2 como máximo**.

## 2. Keyword foco

### `leasing compliance and risk reduction`

**This page has no measured demand.** Search Console, 2026-04-29 a 2026-07-28: **zero queries, zero impressions, zero clicks**.

With no impressions there is no position to report, because Google only computes a position where the page was actually served. Any claim about where this page ranks is unsupported by definition.

**What this proves:** the page has no search presence to protect. Rule A does not apply, so the structure can be rebuilt freely.
**What it does not prove:** that `leasing compliance and risk reduction` has no search volume. Our Semrush and Organic Keywords exports only contain terms the site already ranks for, so a term's absence means we have no data on it, not that demand is zero. Establishing volume needs an external research tool and is Alejandra's call.

## 3. Análisis del top 3

# Landing research, `leasing compliance and risk reduction`

Target page: https://www.leasey.ai/resources/leasing-compliance-risk-reduction/
Audience: compliance and operations leads in multifamily
Research date: 30 July 2026

### Top-3 analysis

| Position | Page | Format | Angle | Sources | Weakness |
|---|---|---|---|---|---|
| 1 | Yardi Corom, "Minimize Risk and Improve Compliance: How Lease Management Software Keeps You Protected" (yardicorom.com) | NOT VERIFIABLE | NOT VERIFIABLE | NOT VERIFIABLE | NOT VERIFIABLE |
| 2 | LeasePilot, "Compliance and Risk Management in Commercial Leasing" (leasepilot.co) | Blog essay, seven numbered sections, ~2,100 words, dated 6 March 2026 | Risk-first: the exposures that stay invisible until they detonate. Written for CRE legal and lease-drafting teams | One internal claim only ("3 to 4 hours per lease" saved, LeasePilot's own customer data, not hyperlinked). No external data, no linked citations | Entirely commercial leasing and attorney-facing. No residential or multifamily framing, no Fair Housing, no resident ledger, no state deposit law. Unsourced beyond its own product |
| 3 | Vestian, "What Is Lease Administration, and Why It's Critical to CRE Strategy" (vestian.com) | Educational article, numbered sections plus an on-page FAQ block, ~2,200 words | Repositions lease administration from back-office chore to strategic function | No statistics cited and no named sources anywhere in the article | Zero data. Corporate occupier and CRE lens, ASC 842 / IFRS 16 rather than multifamily. Compliance treated as accounting compliance only |

Supplementary read (not top-3, added because it is the closest multifamily-native comparison):
EliseAI, "Mitigate Compliance Risk with Lease Audits by EliseAI" (eliseai.com). Product page dressed as a blog.

**Real H2/H3 of each page actually opened and read**

LeasePilot (read in full):
`The Risks That Don't Show Up Until Something Goes Wrong`, `Multi-State Compliance`, `Key-Person Risk`, `Amendment Risk`, `Critical Date Management`, `The Portfolio Audit`, `Building a Compliance-First Drafting Practice`
H3: `Leasing Across 30 States: The Compliance Problem Nobody Talks About`, `What Happens When Your Best Leasing Attorney Leaves`, `The Lease Audit You've Been Putting Off (And What It Will Reveal)`

Vestian (read in full):
`Understanding the Role of Lease Administration in CRE`, `1. Ensure Regulatory and Financial Compliance`, `2. Maintain Data Integrity Across the Portfolio`, `3. Track the Entire Lease Lifecycle With Precision`, `4. Reduce CRE Risk With Proactive Oversight`, `5. Drive Strategic Decision-Making With Actionable Insights`, `Frequently Asked Questions (FAQ)`, `Elevate Your CRE Strategy With Vestian's Expert Lease Administration`
H3: `Definition and Core Functions`, `Why It Matters`, `Stay Aligned With ASC 842 (U.S. GAAP) and IFRS 16 (Global) Standards`, `Avoid Penalties and Operational Disruption`, `Use Centralized Systems to Avoid Fragmented Records`, `Improve Accuracy With System Integration`, `Automate Notifications for Renewals and Expirations`, `Support Ongoing Modifications and Amendments`, `Minimize Disputes and Legal Exposure`, `Strengthen Controls Around Lease Commitments`, `Use Lease Data to Evaluate Portfolio Performance`, `Align CRE Decisions With Business Objectives`

EliseAI (read in full, supplementary):
`Protecting Your Portfolio`, `What to Know About Lease Audits by EliseAI`, `Seamless Integration`, `Daily Automated Checks`, `Comprehensive Reviews`, `Increased Visibility`, `Measurable ROI`, `How Lease Audits Works`, `Get Started with Lease Audits`

Yardi Corom (position 1): **NOT VERIFIABLE.** WebFetch returned HTTP 403. A curl retry with a full Chrome user agent, Accept and Accept-Language headers and a Google referer also returned 403, and the response body is a Cloudflare JS challenge page (`__cf_chl_rt_tk` token in the markup). The page is blocked to us, which is not the same as the page being thin or absent. No claim is made here about its headings, angle, sources or quality. A claim circulating from search snippets attributes a "30% reduction in compliance-related issues" figure to this page; that figure is unverified, its denominator is unknown, and it must not be reused.

### Opportunities for Leasey.AI

1. **Own the residential lens the top-3 vacate.** Both pages we could read (LeasePilot, Vestian) are commercial-real-estate documents: attorneys, ASC 842, IFRS 16, corporate occupiers. Neither mentions Fair Housing, security deposit statutes or resident ledgers. Among the pages we opened, none address multifamily compliance directly. Leasey.AI can take the keyword with a page written for a regional property manager rather than a lease lawyer.

2. **Be the only page with sourced numbers.** LeasePilot cites exactly one figure and it is its own customer data, unlinked. Vestian cites none. EliseAI's figures ($16k Fair Housing exposure, 40-50% turnover, 4,000 hours to audit 8,000 leases) are all unattributed and unlinked. A page that names each source and hyperlinks it wins on trust in a category where being wrong is expensive.

3. **Turn LeasePilot's risk taxonomy into a multifamily one.** LeasePilot's strongest structural move is naming the failure modes: multi-state divergence, key-person risk, amendment drift, missed critical dates. Those four translate cleanly to multifamily (state deposit and notice law, the one person who knows the concession rules, addenda that never reach the ledger, renewal and deposit-return deadlines) and nobody we read has made that translation.

4. **Separate the two meanings of "lease compliance".** Vestian equates compliance with lease accounting standards; EliseAI equates it with ledger accuracy. Neither reconciles them. A page that distinguishes regulatory compliance, lease-terms compliance and accounting compliance, and says which one the reader's job actually owns, resolves an ambiguity the readable competitors leave open.

**Figure handling note.** Do not import any statistic from these pages. Every number we found is unattributed or self-reported. In particular, the NMHC fraud study must be quoted with its denominator stated: 84.3% is a share of operators who experienced fraud, and that group is itself 93.3% of respondents, so 84.3% is not a share of the total.

### FAQ questions

- **What is lease compliance?** Adherence to every obligation in the lease and in the law that governs it, by both the operator and the resident.
- **How can property managers reduce compliance risk?** Replace memory and manual tracking with systematic, auditable checks that leave a defensible record.
- **What are the most common lease compliance risks?** Missed or incorrect fees, expired concessions still charging, deposit handling and return deadlines, and divergent state rules across a portfolio.
- **What is a lease audit and why does it matter?** A systematic review of executed leases against ledgers and law, which surfaces overcharges and gaps before a regulator or resident does.
- **How does multi-state operation increase compliance risk?** Each state sets its own deposit, notice and disclosure rules, so a single standard process is non-compliant somewhere by default.
- **Does lease management software actually reduce compliance risk?** It reduces the human-error class of risk by automating tracking and alerts; it does not remove the need for legal review.

### Limitations

- **Position 1 (Yardi Corom) was never opened.** WebFetch 403, curl with browser headers 403, body is a Cloudflare challenge. Nothing about its content, structure, sources or weaknesses is asserted above. It may well be strong; we do not know.
- **The FAQ questions are not a scraped People Also Ask box.** No SERP-box scrape was available to us. They were assembled from question-formatted search results and from the on-page FAQ headings we read, so exact-match wording against Google's live PAA is unconfirmed. Verify in a browser before shipping them as PAA targets.
- **No competitor statistic was independently verified.** Every figure encountered (EliseAI's $16k, 40-50%, 4,000 hours; LeasePilot's 3-4 hours per lease) is unattributed or self-reported by the vendor, and we did not trace any to a primary source.
- **The organic top-3 was taken from a single search pass** and reflects one query, one moment and a US-only result set. Ranking order may differ by location and date.
- **Our own target page was not fetched or audited** as part of this task, so no gap analysis against the existing Leasey.AI copy is included.

## 4. Estructura a publicar

Los ocho bloques de la plantilla. Los H2 marcados FIJO se escriben literales.

**BLOQUE 1 · Hero**
- [FIJO] Eyebrow con breadcrumb al hub. ⚠️ `/benefits/` da 404, así que el breadcrumb queda pendiente de que exista el hub.
- [DINÁMICO] H1: `Compliance and Risk Reduction` se mantiene.
- [DINÁMICO] Intro de 3 líneas, responde la intención en la primera frase, contiene la keyword foco.
- [FIJO] CTA primario y secundario. ⚠️ Sin destino hasta que se decida el CTA canónico.

**BLOQUE 2 · Qué es**
- [FIJO] H2: `What is a leasing compliance and risk reduction?`
- [DINÁMICO] Definición directa en el primer párrafo, keyword foco en la primera oración.

**BLOQUE 3 · El problema que resuelve**
- [FIJO] H2: `Why compliance and operations leads need leasing compliance and risk reduction`
- [DINÁMICO] El dolor operativo concreto, anclado a una situación real de operador.
- [DINÁMICO H3] 1 o 2 subsecciones.

**BLOQUE 4 · Cómo funciona**
- [FIJO] H2 con patrón de capacidades.
- [DINÁMICO] 3 o 4 capacidades reales de producto. El diferenciador sale del análisis del top 3.
- [DINÁMICO H3] Subsecciones diagnósticas.
- [FIJO specs] Un diagrama SVG, 1200 × 630, exportado a WebP, sin cifras inventadas.

**BLOQUE 5 · Métricas**
- [FIJO] H2: `Key risk reduction metrics to track` o equivalente.
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

**Meta title (49 caracteres):**
`Leasing Compliance and Risk Reduction | Leasey.AI`

**Meta description (144 caracteres):**
`Apply the same screening criteria to every applicant, keep the audit trail, and cut the exposure that comes from inconsistent leasing decisions.`

El `<title>` actual mide 71 caracteres, **16 por encima del límite de 55**.

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

**Enlaces internos que la página sirve hoy:** 39. Hay que resolverlos uno a uno antes de publicar y quitar los que devuelvan 404 o 410.

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
