# Reddit voice reference — patrones reales de los 4 subs externos

Fuente: top mensual de cada sub al **2026-06-17**, fetched por `scripts/reddit-top-fetch.mjs` (98 posts).
Raw data en `data/reddit/2026-06-17/` (no se sincroniza al web público).
Refrescar semanal via cron del mismo script. Los patrones de fondo cambian poco; los temas calientes sí.

Este file es de lectura **obligatoria** para `community-engager` (responde hilos en estos subs) y **referencia útil** para `reddit-changelog` (r/LeaseyAI propio, pero el patrón "I built X" de r/RealEstateTechnology aplica). Leerlo antes de escribir cualquier cosa para Reddit.

---

## Regla universal a los 4 subs

Reddit es allérgico a marketing. Lo que muere instantáneo:
- "Excited to announce", "game-changer", "revolutionary"
- CTAs duros: "book a demo", "DM me"
- Stats sin fuente
- Posts que abren con la marca antes que con el problema
- Cuentas nuevas posteando productos
- Cualquier cosa que se lea como copy de website

Lo que sobrevive:
- Dolor real del autor en primera persona
- Números concretos (precio, días, %, ubicación)
- Reconocer límites o "what am I missing"
- Preguntas genuinas que invitan respuesta
- Una idea por post

CTA de Leasey en TODOS los subs externos: nunca en el cuerpo. Si interesa el producto, el link vive en el perfil (`u/<username>`) o en flair. Salvo r/RealEstateTechnology, donde un link al final está culturalmente aceptado para "I built X" posts.

---

## r/Landlord (1.0M+ members)

Audiencia: landlords (mayormente small/mid: 1-20 unidades) + tenants pidiendo perspectiva de landlord. Geográfica: 70% US, 20% Canada, 10% otros. Mayoría son owner-operators, NO Leasey's ICP directo (Leasey arranca en 100+ doors). Pero hay third-party PMs y SFR portfolios que sí cuadran.

### Patrón de título (no opcional)
Casi todos los top usan **bracket prefix** que identifica rol + jurisdicción:
- `[Landlord US-AZ]`, `[Landlord US-TX]`, `[Landlord-NJ ]`, `[Landlord SC-US]`
- `[Tenant US-CA]`, `[Tenant-Montana-USA]`
- `[LANDLORD-QC-Canada]`, `[Landlord-NC-US]`
- `[General US-NY]`, `[Landlord - US] [news headline]`

Sin bracket → menos engagement, riesgo de remoción. La regla no escrita: **identificarse como landlord o tenant y decir la jurisdicción** antes de pedir consejo, porque el caso depende de la ley local.

### Formato del cuerpo (verbatim del top)
1. Una o dos frases setup ("Tenant has been lying and allowing unauthorized pets")
2. Detalles específicos en orden cronológico (fecha, monto, lo que dijo cada parte)
3. Pregunta abierta al cierre: "How would you handle?", "What should I do?", "Anyone else?", "Am I being paranoid?"
4. Updates aparecen como `Update #1:`, `ETA:`, `EDIT:` cuando hay nueva info
5. Longitud: 150 a 400 palabras suele bastar. >500 solo si el caso es complicado y necesita contexto legal.

### Voz
- Primera persona, plain-spoken
- Específico siempre (no "a lot of money" sino "$25,000 in security + pet deposit")
- Ocasional frustración OK, pero sin ofender al inquilino o landlord opuesto
- Cita el estatuto si lo sabe: "deposit letter in accordance with statutes"

### Cómo encaja Leasey acá
Engagement, no posting. **NO publicar promo en r/Landlord** (es tierra de small landlords y Leasey no les sirve a la mayoría). Walter o Carlos pueden responder hilos cuando alguien pregunta sobre:
- Fair Housing / ESA / Section 8 — aporta perspectiva, link a research de leasey.ai/resources/research solo si la pregunta lo merece
- Vacancy speed en mercados blandos — Carlos puede aportar perspectiva institucional sin nombrar el producto
- Volumen de inquiries / response time — útil sin pitch

Mención de Leasey máximo 1 vez por hilo, y solo si una persona pregunta "what tools..." o el contexto la pide.

---

## r/PropertyManagement (~150K members)

**Esta es la community core de Leasey.** Audiencia: property managers de carrera (Leasing Agent, APM, PM, RM), de complejos chicos a portfolios grandes. Mucho contenido sobre career path, burnout, owners difíciles, residents demanding, herramientas. Es donde el ICP de Leasey vive de verdad.

### Patrón de título
Menos brackets de jurisdicción, más conversacional:
- Preguntas/encuestas: "How much do you make in your position?", "What's the most surprising request you've received?", "Anyone else feel like tenants expect PMs to solve literally everything now?"
- Vents/rants: "Burned out?", "Owner just freaked out on me", "Rant: Unhinged tenant.", "Need a little bump in my spirit"
- Career: "Stuck in Assistant Property Manager Role", "Is this considered normal job responsibility?", "New leasing manager Woes?"
- Tool recs (sí permitidas como preguntas, no como posts vendiendo): "Phone system recommendations for a small Property Management company (4 PMs)"

### Formato del cuerpo
1. Hook conversacional ("Hey hey!", "Hi guys!", "Hello everyone")
2. Contexto personal con números (años en la industria, tamaño del portfolio, salario si aplica)
3. Lista de quejas / situación con bullets o párrafos cortos
4. Pregunta al cierre buscando perspectiva o solidaridad
5. Emojis OK con moderación (🥲, 🤔)
6. Longitud: 150 a 500 palabras

### Voz
- Peer-to-peer: PMs hablándole a PMs
- Más informal que r/Landlord
- Acrónimos sin explicar: APM, PM, RM, AM, CAM, CAPS, NAA, BOMA
- Tolerancia a venting alta, siempre que la pregunta esté ahí
- Auto-deprecating bienvenido: "Am I burned out, unrealistic, or just in the wrong roles?"

### Cómo encaja Leasey acá
**Cancha principal para `community-engager`.** Walter o Carlos pueden:
- Responder hilos de burnout con perspectiva de operador ("we see this pattern in 200+door portfolios when leasing manual saturates...")
- Responder threads de "phone system recs" o "leasing tool" con experiencia honesta, mencionando Leasey solo si encaja
- Aportar a "fraudulent renters" con datos de Discrepancy AI (sin pitch)
- NUNCA postear "we built X" tipo r/RealEstateTechnology — acá lo bajan a -50

Cuando Walter pegue un thread de este sub, el `community-engager` debe:
1. Responder primero la pregunta operativa
2. Mencionar Leasey máximo 1 vez si el thread lo demanda
3. Tono: peer-to-peer, no founder importante
4. Sin "feel free to DM", sin "happy to chat" (lectura inmediata de venta)

---

## r/realestateinvesting (~3M members)

Audiencia: investors (single/multi family, BRRRR, syndication, flips). Más amplia que PM. Top contenido es **deal breakdowns** con numbers, strategy questions, market debates. No es el ICP de Leasey pero hay overlap con landlords que crecen a mid-market.

### Patrón de título
- Deal recap: "BRRRR complete", "Single Family Brrr Deal - Details", "Walkthrough- Duplex - New Construction Deal"
- Strategy Q: "How does the BRRR Method really work?", "How many owner occupied loans will a lender let you have?", "What's your actual workflow from 'looks good on Zillow' to making an offer?"
- Meta/discussion: "Do you talk about your investments with non-REI friends?", "Are you undeterred by market trends?"
- `[VENT]` prefix para venting (raro pero válido)

### Formato del cuerpo
Posts de deal:
1. Headline en negritas resumiendo el deal y números
2. Sub-headers en negritas: **The property**, **The buy**, **The rehab**, **How it was financed**
3. Bullets con numbers concretos ($50,500 / $128,500 / $433/mo / 9% interest)
4. Sin moraleja inflada
5. Longitud: 700 a 1500 palabras

Posts de pregunta:
1. Contexto de quién es el autor (años invirtiendo, # propiedades, market)
2. Situación específica con números
3. Pregunta concreta
4. Longitud: 100 a 400 palabras

### Voz
- Investor-to-investor, técnica
- Math over emotion
- Skeptical hard — community odia hype y números sin fuente
- Tolerante a "I made a mistake, here's what I learned"

### Cómo encaja Leasey acá
Engagement ocasional. NO postear promo. Cuando alguien pregunta sobre:
- Lease-up speed en mercados específicos
- PMs vs self-manage
- BRRRR-then-rent volume challenges
- Multifamily acquisition + lease-up de 50-100+ doors

Carlos puede aportar perspectiva institucional (QuadReal, Aquilini) sin nombrar Leasey, o nombrar UNA vez si la pregunta es literalmente "what tool". Tono: investor a investor, no founder pushing.

---

## r/RealEstateTechnology (~50K members)

**El sub más amigable con builders.** Audiencia: agents, brokers, investors que usan tech + founders construyendo herramientas para real estate. Norma cultural: "I built X" posts son **bienvenidos** si siguen el patrón correcto.

### Patrón de título (founder posts)
Top performers literales:
- "I built Affix. It's like Clay, but for property data."
- "I built a free map of what homes are actually worth"
- "A real estate data + site-planning tool I built, would you switch from what you use now?"
- "Built a tool to stop clients asking 'any update' every two days - looking for 5-10 agents to try it"
- "I use AI to stress-test every deal before I make an offer. Here's exactly how."

Patrón: **"I built X" o "Built a tool for [específico]" + pregunta de feedback**.

### Patrón de cuerpo (founder posts, formato canónico)
1. **Por qué lo construí** (personal pain point, no "the market needs this")
   - "I got frustrated trying to find actual home sale prices..."
   - "Most of the deadline pain in a real estate deal isn't the deadlines themselves..."
   - "I'm in commercial real estate development... got tired of three things: paying for multiple..."
2. **Lo que hace** (lista de features con detalle real, NO marketing copy)
   - Específico: "Coverage: zoning for 3,590 mapped jurisdictions and 1.1M council/P&Z records"
   - Honesto sobre lo que no incluye: "I currently don't have Realtor/Zillow data, since that has proven difficult to source"
3. **Free tier u offer concreta** (no obligatoria pero ayuda)
   - "Free tier has 500 property lookups, 500 skip traces"
   - "looking for 5-10 agents to try it"
4. **Una pregunta abierta para feedback**
   - "What am I missing?"
   - "Would you switch from what you use now?"
   - "Which enrichments would actually be useful? which ones are a waste?"
5. Link al producto al final (tolerado, no exigido)
6. Longitud: 200 a 600 palabras

### Voz
- Builder solo o founder pequeño
- Vulnerable, no slick
- Explica trade-offs honestos
- Admite limitaciones ("This isn't our flashiest update, but...")
- Pide feedback genuino, no validación

### Posts que NO son "I built X" pero también funcionan
- Thesis posts: "My Thesis: AI is great for experienced agents, but is eroding the quality of new agents" — opinión clara + razonamiento + link al long form
- Workflow shares: "I use AI to stress-test every deal before I make an offer. Here's exactly how" + detalle del workflow
- Buyer beware: warnings honestos sobre vendors específicos (estos consiguen mucho upvote)
- Pregunta de mercado: "how are you getting leads?" con contexto de lo que ya probaste

### Cómo encaja Leasey acá

**Este es el sub donde el r/LeaseyAI changelog format se puede adaptar para alcance fuera del sub propio.** Cuando Leasey lance un feature significativo:

1. Versión interna en r/LeaseyAI (changelog format existente)
2. Versión externa en r/RealEstateTechnology siguiendo el patrón "I built X":
   - Juan (CPO) o Carlos firma
   - Hook: "We built X because [pain real de PM operator]"
   - Qué hace, números reales, qué NO hace todavía
   - Free trial mention si aplica (paid pilots solo para 100+ doors, decirlo)
   - Pregunta de feedback genuina al equipo
   - Link a feature page o get-started al final (aceptable acá)

Walter NO postea "Here's our new Liza agent that does everything!" — eso muere. La versión que sobrevive es: "I'm one of the founders at Leasey. We rolled out direct Facebook Marketplace syndication this month. Built it because operators we work with were closing their phones at midnight when inquiries kept arriving. Honest limits: only US/Canada Marketplaces right now. What am I missing?"

---

## Mapeo a agentes existentes

| Agente | Subs donde aplica | Cambio recomendado |
|---|---|---|
| `community-engager` | r/PropertyManagement (principal), r/Landlord (light), r/realestateinvesting (ocasional) | Leer este file + adaptar voz al sub específico que Walter le pega |
| `reddit-changelog` | r/LeaseyAI (propio) — formato changelog existente sigue válido | Sin cambio mayor, opcional: agregar variant "external" que sigue el patrón "I built X" de r/RealEstateTechnology para crosspost |

## Checklist universal antes de postear cualquier cosa en estos 4 subs

- [ ] ¿Abro con dolor real, no con marca?
- [ ] ¿Identifiqué jurisdicción si es r/Landlord?
- [ ] ¿Hay números concretos (no "many", "a lot", "significant")?
- [ ] ¿Cierro con pregunta genuina?
- [ ] ¿Mención de Leasey ≤ 1 vez (o cero si es r/Landlord/r/realestateinvesting)?
- [ ] ¿Cero "DM me", cero "happy to chat", cero "book a demo"?
- [ ] ¿Cero em-dashes?
- [ ] ¿Cero "Excited to announce" / "game-changer" / "revolutionary"?
- [ ] ¿Mi cuenta tiene historia previa en el sub o postee algo el mes pasado? (cuentas frescas posteando productos → ban)
