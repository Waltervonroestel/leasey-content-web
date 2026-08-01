# Leasey.AI Content Calendar — Month 1 (Jun 8 → Jul 3, 2026)

Generated: 2026-06-17.
Window: 4 weeks, ends one publishing day after the Jun 30 deadline of the Onboarding Guide.
Channels included: LinkedIn Founder (Carlos, Juan), LinkedIn Company, Blog (operator), Blog Renter (B2C), Reddit r/LeaseyAI (changelog), Reddit r/RealEstateTechnology (external), Press Release, Image Briefs.

Companion CSV ready to import: `calendar-month-1.csv` (same folder).

## Cómo subir a Google Sheets

1. Abrí Google Sheets → "Blank" o creá un Sheet vacío llamado "Leasey Content Calendar — Month 1".
2. **File → Import → Upload** → arrastrá `calendar-month-1.csv`.
3. En "Import location" elegí **"Replace current sheet"**; separador: detectar automático (es coma).
4. Marcá "Convert text to numbers, dates, and formulas" → SÍ.
5. Click Import data.
6. Una vez cargado, ajustá:
   - Fila 1: freeze (View → Freeze → 1 row).
   - Columna K (Status): Data → Data validation → List of items: `PLANNED, DRAFT, QA-OK, APPROVED, SCHEDULED, PUBLISHED, KILLED`.
   - Columna N (Approval Date): Format → Number → Date.
   - Conditional formatting en Status: PLANNED gris, DRAFT amarillo, QA-OK celeste, APPROVED verde, PUBLISHED verde oscuro.
7. Share con Juan y Carlos como **commenter** (no editor; ellos aprueban y vos movés a APPROVED).

## Ritmo del mes

- **22 piezas a publicar** + **4 image briefs** = 26 filas total.
- Promedio ~5.5 piezas publicables/semana, sostenible.
- **9 piezas ya en QA-OK o DRAFT** (35%): tres de la Semana 1 vienen del 2026-06-08; seis de las Semanas 2 y 3 las dejé en QA-OK hoy.
- **17 piezas en PLANNED** (65%): faltan redactar; las dos blog launches del backlog (FB Marketplace ya hecho; Centralised messaging para W4) son las inversiones grandes.

## Reparto por canal en el mes

| Canal | Conteo | Cadencia |
|---|---|---|
| LinkedIn Founder (Carlos) | 4 | 1/semana |
| LinkedIn Founder (Juan) | 3 | ~1/semana |
| LinkedIn Company | 6 | ~1.5/semana (Tue + Thu) |
| Blog (operator) | 4 | 1/semana (Wed) |
| Blog Renter (B2C) | 1 | 1/mes (estreno del canal este trimestre) |
| Reddit r/LeaseyAI (changelog) | 1 | Calendar v2.0 (Ivan draft) |
| Reddit r/RealEstateTechnology | 1 | Crosspost FB Marketplace (Juan, "I built X") |
| Press Release | 1 | SingleKey partnership |
| Image Brief | 4 | 1 por blog |

## Vista por semana

### Semana 1 (Jun 8 → Jun 12) — Tema: vacancia canadiense y leasing speed

| Día | Canal | Voz | Título | Status |
|---|---|---|---|---|
| Mon Jun 8 | LinkedIn | Carlos | Vacancy up in Canada: the lever you control is leasing speed | DRAFT |
| Tue Jun 9 | LinkedIn Company | Company | Calgary at 7.3% vacancy: what changes inside the leasing team | PLANNED |
| Wed Jun 10 | Blog | Company/Carlos | What to do when vacancy rises and rents fall: the lever you do control | PLANNED |
| Wed Jun 10 | Image Brief | (art direction) | Hero: 5.1% Canada vacancy + Calgary 7.3% (Yardi Q1 2026) | PLANNED |
| Thu Jun 11 | LinkedIn Company | Company | Operators are consolidating to centralised leasing teams | PLANNED |
| Fri Jun 12 | LinkedIn | Carlos | Founder reflection: building for a cooling market | DRAFT |

### Semana 2 (Jun 15 → Jun 19) — Tema: agente real vs widget + FB Marketplace launch

| Día | Canal | Voz | Título | Status |
|---|---|---|---|---|
| Mon Jun 15 | LinkedIn | Juan | 80% of what a prospect asks before booking a tour is predictable | QA-OK |
| Tue Jun 16 | LinkedIn Company | Company | 94% of operators adopt AI in 2026 (Frontdesk Research) | PLANNED |
| Wed Jun 17 | Blog | Company/Juan | Direct Facebook Marketplace syndication: stop posting one listing at a time | QA-OK |
| Wed Jun 17 | Image Brief | (art direction) | Hero + LinkedIn carousel: FB syndication | PLANNED |
| Thu Jun 18 | LinkedIn Company | Company | 70% of rental prospects search after hours (ShowMojo) | PLANNED |
| Fri Jun 19 | Reddit r/RealEstateTechnology | Juan | I built direct FB Marketplace syndication | PLANNED |
| Fri Jun 19 | LinkedIn | Carlos | Handle Facebook Marketplace volume without opening Facebook | QA-OK |

### Semana 3 (Jun 22 → Jun 26) — Tema: scheduling alone vs end-to-end + estreno B2C

| Día | Canal | Voz | Título | Status |
|---|---|---|---|---|
| Mon Jun 22 | LinkedIn | Juan | A chat widget is not a leasing agent | QA-OK |
| Tue Jun 23 | LinkedIn Company | Company | Integration is the #1 adoption barrier (Propmodo 2026) | PLANNED |
| Wed Jun 24 | Blog | Company/Juan | Scheduling alone vs end-to-end leasing: where the leaks really happen | QA-OK |
| Wed Jun 24 | Image Brief | (art direction) | Funnel diagram: scheduling-only vs Leasey end-to-end | PLANNED |
| Thu Jun 25 | Blog Renter | Company (renter) | Moving to Calgary in 2026: rents, neighbourhoods, what every newcomer should know | PLANNED |
| Fri Jun 26 | LinkedIn | Carlos | Founder reflection: why we did not build just a scheduler | QA-OK |

### Semana 4 (Jun 29 → Jul 3) — Tema: SingleKey partnership + Centralised messaging launch

| Día | Canal | Voz | Título | Status |
|---|---|---|---|---|
| Mon Jun 29 | LinkedIn | Carlos | 65% of residents prefer digital leasing | PLANNED |
| Tue Jun 30 | Press Release | Press | Leasey.AI integrates SingleKey for Canadian tenant screening | PLANNED |
| Wed Jul 1 | Blog | Company/Juan | Centralised messaging: every lead conversation in one thread | PLANNED |
| Wed Jul 1 | Image Brief | (art direction) | Hero: unified inbox mock | PLANNED |
| Thu Jul 2 | LinkedIn Company | Company | SingleKey is live inside Leasey.AI for Canadian operators | PLANNED |
| Thu Jul 2 | Reddit r/LeaseyAI | Walter (changelog) | Leasey.AI Calendar View v2.0 — split layout + overlap tooltips | PLANNED |
| Fri Jul 3 | LinkedIn | Juan | Product moment: the whole lead conversation in one thread | PLANNED |

## Workflow de aprobación sugerido (para founders)

1. Walter mueve cada fila de PLANNED → DRAFT cuando hay borrador en `output/AAAA-MM-DD/`.
2. Walter aplica el checklist de `editor-qa` mentalmente y mueve a QA-OK.
3. El approver de la columna M revisa el draft (link en columna L) y decide:
   - APPROVED → Walter agenda y publica
   - KILLED → eliminar de calendario y reemplazar
   - Comentario en la celda Notes para ajustes
4. Tras publicar, Walter pone PUBLISHED + fecha en la columna N. Las métricas posteriores van a `context/metrics-log.md` para que el `performance-analyst` cierre el loop.

## Cosas para resolver antes de avanzar la W4

- **Press release SingleKey (M1-021):** confirmar con marketing si la partnership está oficialmente lista para anunciar el Jun 30, y conseguir quote del partner. Si no, mover a W5 y reemplazar el slot Tue Jun 30 con un LI Company adicional.
- **Reddit Calendar v2 (M1-025):** localizar el draft que dejó Ivan; si no está, redactar de cero usando el formato changelog (ya documentado en `reddit-changelog.md` Variant A).
- **Blog Renter Calgary (M1-018):** confirmar con SEO/Alejandra que no choca con su territorio. El onboarding guide aclara que blog operator y press son territorio Walter, resource pages son Alejandra. Blog Renter B2C cae más cerca del lado SEO; vale confirmar antes de publicar.
- **Reddit r/RealEstateTechnology crosspost (M1-012):** la cuenta firmante debería ser la de Juan o Carlos con historia previa en el sub. Si ninguno tiene karma ni posts previos allí, postear desde una cuenta nueva = ban casi seguro. Validar antes de redactar.

## Asunciones que hice (decime si cambio algo)

- "Primer mes" = Jun 8 a Jul 3, alineado al `calendar-90-days.md` ya aprobado.
- Cadencia LinkedIn Company = 2/semana (Tue + Thu). Si querés más o menos, ajustamos.
- Solo 1 blog renter en el mes para estrenar el canal sin saturar.
- Solo 1 PR en el mes (SingleKey). Si DoorInsight o Rental Beast ya están listos, agregamos.
- Reddit external 1/mes. Si la métrica del primer crosspost prueba que funciona, subimos a 2/mes en M2.
