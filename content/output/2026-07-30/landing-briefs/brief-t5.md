# Brief · Post-Showing Pricing Intelligence

| | |
|---|---|
| **URL en vivo** | `https://www.leasey.ai/resources/post-showing-feedback-rental-pricing-intelligence/` |
| **Notion** | https://app.notion.com/p/3a743656a5b381deab21c50ec21ee981 |
| **Google Doc** | https://docs.google.com/document/d/1zTwf9DM8H--LrdDMCj-Dh-McR_kXYaciYfvn81eXRqY/edit |
| **Pilar** | Agent, secondary Speed |
| **Audiencia** | revenue and pricing managers |
| **Autor** | **Ninguno.** Las landings no llevan firma (Regla C, decisión de Walter del 30 jul 2026) |

> La plantilla `context/benefits-landing-template.md` gobierna sobre este brief. Los ocho bloques y los cinco H2 de patrón fijo no se discuten aquí: se escriben literales.

---

## 1. Estado real de la página

Medido el 30 de julio de 2026 abriendo la página, no deducido del reporte SEO.

| | |
|---|---|
| HTTP | 200, **redirige** al slug final |
| **H1 real** | `Post-Showing Pricing Intelligence` |
| H2 / H3 / H4 / H5 / H6 | 6 / 17 / 0 / 0 / **6** |
| Firma visible | **Sí, dice `Admin`** |
| Firma en JSON-LD | **sí** |
| Em-dashes | **25** |
| Enlaces externos | 4 |
| `<title>` actual | `Post-Showing Feedback Analysis for Smarter Rental Pricing Decisions | Leasey.AI` (79 caracteres) |

**El H1 ya existe.** La Regla B está cumplida y no hay nada que crear. Ojo: el `<title>` de arriba **no es el H1**, son dos cosas distintas y confundirlas fue un error real de la versión anterior de este brief.

**Hay 6 H6 sin ningún H4 ni H5.** Es un salto de nivel. Las diez landings del cluster tienen exactamente el mismo patrón, así que **no es un defecto de esta página sino del bloque de CTA de la plantilla del tema**. Conviene arreglarlo una vez en el tema, no diez veces a mano.

**Hay que eliminar la firma `Admin`**, visible en el cuerpo y presente en el JSON-LD. No se sustituye por nadie.

> Nota de medición: la densidad de marca de la tabla se calcula sobre la página renderizada, que incluye menú y pie. Sobre el cuerpo del artículo el porcentaje es más alto. Al reescribir, la regla operativa es **una mención de "Leasey.AI" por H2 como máximo**.

## 2. Keyword foco

### `post-showing feedback`

**This page has no measured demand.** Search Console, 2026-04-29 a 2026-07-28: **zero queries, zero impressions, zero clicks**.

With no impressions there is no position to report, because Google only computes a position where the page was actually served. Any claim about where this page ranks is unsupported by definition.

**What this proves:** the page has no search presence to protect. Rule A does not apply, so the structure can be rebuilt freely.
**What it does not prove:** that `post-showing feedback` has no search volume. Our Semrush and Organic Keywords exports only contain terms the site already ranks for, so a term's absence means we have no data on it, not that demand is zero. Establishing volume needs an external research tool and is Alejandra's call.

## 3. Análisis del top 3

# t5 landing research: `post-showing feedback`

Page: https://www.leasey.ai/resources/post-showing-feedback-rental-pricing-intelligence/
Audience: revenue and pricing managers

**Sector warning.** A plain Google search for `post-showing feedback` does not return our sector at all. The organic top 3 were reviews.io (post-review customer surveys), Post-it Brand (team feedback articles) and A Happy PhD (academic supervision feedback). None of them relate to rental, real estate or showings. I did not open those three, because they are off-topic by title and URL, so nothing here is asserted about their contents.

Per the instructions I ran a second search, `rental showing feedback software`, and analysed its top 3 organic results instead. That is the set below.

### Top-3 analysis

| Position | Page | Format | Angle | Sources | Weakness |
|---|---|---|---|---|---|
| 1 | showdigs.com (homepage) | Product landing page, carousels, testimonials, FAQ | Leasing automation plus on-demand showing agents for property managers | None cited. Testimonials and case studies only | Operational, not financial. No pricing content, and no explanation of what post-showing feedback is actually used for |
| 2 | tenantturner.com (homepage) | Product landing page, feature blocks, logos, CTAs | All-in-one leasing automation, time saved and leads converted | None cited. Product claims and internal metrics only | Mentions collecting feedback in the follow-up step, but never connects it to rent pricing or revenue management |
| 3 | ustechautomations.com blog, best showing automation tools 2026 | Long ranked listicle plus implementation guide, tables, FAQ, checklists | Educational buyer guide, ROI of showing automation | NAA 2024 Apartment Industry Report, NMHC 2024 Renter Preferences Survey, IREM 2024 Management Compensation Survey | Says non-conversion data should inform pricing and marketing decisions, then stops. No method for turning feedback into a rent decision |

**H2s actually read**

Showdigs: `Ready for a tour?`, `AI-Powered Leasing and Scheduling CRM for Property Managers`, `Trusted by dedication property managers.`, `Showdigs Features`, `What Our Customers Say`, `Don't just take our word for it!`, `solutions`, `Leasing Automation Platform`, `Tired of all the hustle?`, `On-Demand Agent Services`, `Features`, `Listing, showing, & leasing will never be the same.`, `Optimize conversions.`, `Automate scheduling.`, `Show properties your way.`, `Instantly get the best tenants.`, `Get started now.`, `FAQS`, `Questions? We have answers.`, `Our latest news`, `Ready to Simplify Your Property Management?`

Tenant Turner: `Market Leading Leasing Automation, Now with AI`, `All-In-One Tool`, `Reliable Integration`, `Make Leasing Easy`, `List On 20+ Sites Instantly`, `Pre-qualify leads effortlessly.`, `Discover the benefits of Tenant Turner.`, `Enable flexible showings, even when you're not around.`, `Instantly follow up with leads, and fill units faster.`, `Smarter Access. Smaller Price Tag.`, `Discover the Benefits of Tenant Turner.`

US Tech Automations: `Key Takeaways`, `TL;DR`, `Who This Is For`, `Why Manual Showing Coordination Is a Revenue Problem`, `The 5 Best Showing Automation Tools for Rental Properties`, `Head-to-Head Comparison: Key Metrics`, `Platform Comparison: AppFolio vs. Buildium for Showing Automation`, `Post-Showing Follow-Up Sequence`, `How to Choose the Right Showing Automation Tool`, `Frequently Asked Questions`, `Benchmarks: What Good Looks Like After Implementing Showing Automation`, `Common Mistakes When Deploying Showing Automation`, `Decision Checklist`

Not read: the three organic results from the plain `post-showing feedback` search. NOT VERIFIABLE, because they are outside our sector and I did not open them, so I make no claim about their content either way.

### Opportunities for Leasey.AI

1. **Own the feedback-to-price loop, which none of the three pages I read closes.** Showdigs and Tenant Turner both collect feedback as an operational step and stop there. US Tech Automations gets one sentence closer, saying non-conversion data should inform pricing decisions, then never shows how. A page that shows the actual mechanic, objection captured at showing, signal aggregated across tours, rent adjusted, is unclaimed ground in this set.
2. **Speak to revenue and pricing managers, which none of the three addresses.** All three, in the versions I read, are written for property managers and leasing operations. The vocabulary is vacancy days, scheduling and time saved. Nothing in the three I opened is pitched at someone who owns rent roll or a pricing model.
3. **Bring credible data, which two of the three lack.** Showdigs and Tenant Turner cited no external sources at all on the pages I read. US Tech Automations is the only one with real citations, NAA, NMHC and IREM 2024. Matching or beating that citation depth is cheap differentiation against the two product pages.
4. **Give a decision framework, not a tool list.** The only long-form competitor in this set, US Tech Automations, is structured as a ranked tools listicle. A page structured as a pricing decision method, what a given volume of showings without applications should trigger, competes on a different axis than a comparison table.

### FAQ questions

Selected from `context/gsc-questions.md`, section t5, favouring high impressions with weak positions.

1. **"how to use analytics to optimize rental pricing"** (34 impressions, position 22.1). Feed showing outcomes, tour-to-application rates and prospect objections into a weekly rent review rather than waiting on quarterly comps.
2. **"how do you leverage technology to optimize pricing strategies and maximize occupancy rates for airbnb properties under your management"** (85 impressions, position 10.4). Use demand signals from actual viewings, not just competitor rates, so price moves reflect what prospects rejected this week.
3. **"can software automatically suggest rent prices?"** (43 impressions, position 6.7). Yes, and the suggestions get materially better when the model sees post-showing feedback alongside market comps.
4. **"how can i automate rent price analysis each year?"** (16 impressions, position 4.3). Annual is already too slow. Set a recurring review triggered by showing volume and conversion thresholds instead of a calendar date.
5. **"are transaction fees included in property management software pricing?"** (13 impressions, position 17.4). Usually not, so compare total cost of ownership, including per-transaction and per-unit fees, before judging any platform on headline price.
6. **"how do background check api pricing compare for integration costs"** (10 impressions, position 69). Integration cost is mostly per-check volume pricing plus engineering time, and it belongs in the same budget line as the rest of your leasing stack.

### Limitations

- I did not open the three organic results from the plain `post-showing feedback` search, so I cannot say what they contain. I judged them off-sector from titles and URLs alone, which is a weaker basis than reading them.
- I read the Showdigs and Tenant Turner **homepages** only. Both almost certainly have deeper product, feature and pricing subpages that I did not open. Any claim above about what they lack applies only to the two homepages I could open, not to their sites as a whole.
- Because both product pages hide pricing behind a demo, I could not verify their commercial positioning at all.
- I did not verify our own Leasey.AI page at the target URL, so this research does not tell you what is already on it or which gaps are genuinely new.
- Search result ordering is personalised and time-dependent. The positions in the table reflect one search run on one day, not a stable ranking.
- The GSC questions come from the local `gsc-questions.md` file as supplied. I did not re-pull or date-check them against Search Console.

## 4. Estructura a publicar

Los ocho bloques de la plantilla. Los H2 marcados FIJO se escriben literales.

**BLOQUE 1 · Hero**
- [FIJO] Eyebrow con breadcrumb al hub. ⚠️ `/benefits/` da 404, así que el breadcrumb queda pendiente de que exista el hub.
- [DINÁMICO] H1: `Post-Showing Pricing Intelligence` se mantiene.
- [DINÁMICO] Intro de 3 líneas, responde la intención en la primera frase, contiene la keyword foco.
- [FIJO] CTA primario y secundario. ⚠️ Sin destino hasta que se decida el CTA canónico.

**BLOQUE 2 · Qué es**
- [FIJO] H2: `What is a post-showing feedback?`
- [DINÁMICO] Definición directa en el primer párrafo, keyword foco en la primera oración.

**BLOQUE 3 · El problema que resuelve**
- [FIJO] H2: `Why revenue and pricing managers need post-showing feedback`
- [DINÁMICO] El dolor operativo concreto, anclado a una situación real de operador.
- [DINÁMICO H3] 1 o 2 subsecciones.

**BLOQUE 4 · Cómo funciona**
- [FIJO] H2 con patrón de capacidades.
- [DINÁMICO] 3 o 4 capacidades reales de producto. El diferenciador sale del análisis del top 3.
- [DINÁMICO H3] Subsecciones diagnósticas.
- [FIJO specs] Un diagrama SVG, 1200 × 630, exportado a WebP, sin cifras inventadas.

**BLOQUE 5 · Métricas**
- [FIJO] H2: `Key post-showing feedback metrics to track` o equivalente.
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
`Post-Showing Feedback and Pricing Signals | Leasey.AI`

**Meta description (137 caracteres):**
`Collect what prospects say after a showing and use it to price the unit, instead of guessing why a well-viewed listing is not converting.`

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
