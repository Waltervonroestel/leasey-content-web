# STATUS — Leasey.AI content board

Living index of everything the system produces. Statuses: DRAFT > QA-OK > APPROVED (by Walter/founder) > PUBLISHED. La fuente de verdad detallada para Month 1 y Month 2 son los CSVs del calendario; este file mantiene solo el resumen ejecutivo.

Channel legend: LI-C (LinkedIn Carlos), LI-J (LinkedIn Juan), LI-CO (LinkedIn Company), BLOG (operator), BLOG-R (renter), RED-L (Reddit r/LeaseyAI), RED-X (Reddit r/RealEstateTechnology), COM (community), PR (press release), IMG (image brief), CAL (calendar), SEO (briefs), PERF (performance report).

## Calendars (source of truth)

| File | Window | Rows | Status | Notes |
|---|---|---|---|---|
| `2026-06-08/calendar-90-days.md` | Jun 8 to Sep 6 (Weeks 1-13) | 39 LI + 16 blog + Reddit | APPROVED | Plan macro del trimestre |
| `2026-06-17/calendar-month-1.csv` + `.md` | Jun 8 to Jul 3 (Weeks 1-4) | 26 (22 pubs + 4 IMG) | PROPOSED | All-channels. Listo para Google Sheets import |
| `2026-06-17/calendar-month-2.csv` + `.md` | Jul 6 to Jul 31 (Weeks 5-8) | 26 (22 pubs + 4 IMG) | PROPOSED | All-channels. Listo para Google Sheets import |

## Inventario de borradores producidos al 2026-06-17

| Canal | M1 producidos | M2 producidos | Total |
|---|---|---|---|
| LinkedIn Carlos (LI-C) | 5 | 4 | 9 |
| LinkedIn Juan (LI-J) | 3 | 4 | 7 |
| LinkedIn Company (LI-CO) | 6 | 5 | 11 |
| Blog operator (BLOG) | 4 | 4 | 8 |
| Blog Renter (BLOG-R) | 1 (Calgary) | 1 (Toronto) | 2 |
| Reddit r/LeaseyAI (RED-L) | 1 (Calendar v2) | 3 (Discrepancy AI, ID verif, Showing confirm) | 4 |
| Reddit r/RealEstateTechnology (RED-X) | 1 (FB Marketplace) | 0 | 1 |
| Press Release (PR) | 1 (SingleKey) | 1 (Rental Beast) | 2 |
| Image Brief (IMG) | 4 | 4 | 8 |
| **Total piezas** | **26** | **26** | **52** |

## Ubicación de los borradores

- `2026-06-17/` (raíz, 6 archivos): los 6 borradores de W2-W3 producidos primero hoy (Liza 80%, FB Marketplace blog, FB Carlos, widget vs agent, scheduling vs end-to-end, founder reflection no scheduler).
- `2026-06-17/m1-extra/` (18 archivos): resto del M1 (W1 Tue/Thu + Wed blog, W2 Tue/Thu, W3 Tue, W4 todos los slots faltantes, image briefs, blog renter Calgary, PR SingleKey, Reddit external FB Marketplace, Reddit r/LeaseyAI Calendar v2).
- `2026-06-17/m2/` (26 archivos): todo el M2 (W5-W8 across all channels).
- `2026-06-08/` (4 archivos): los 3 LinkedIn de W1 + 1 LI Juan original (heredados).

## Estado promedio por status

Todas las piezas producidas hoy están en **DRAFT** (las que escribí hoy) o **QA-OK** (las del Jun 8 + las 6 de W2-W3 que dejé en QA-OK al inicio del día).

El próximo movimiento es revisión humana:
- LinkedIn founder posts esperan visto bueno de Carlos o Juan según firma.
- Blog operator + Blog Renter + LI Company + PR esperan revisión de Walter, después marketing/legal donde aplique.
- Reddit r/LeaseyAI changelog: solo Walter.
- Reddit external (r/RealEstateTechnology): valida primero que la cuenta firmante tenga historia previa en el sub.

## Validaciones de producto pendientes (críticas antes de publicar)

- **SingleKey partnership (PR M1-021 + blog M2-015 + LI-CO M2-014 + LI-C M2-013)**: confirmar partnership oficialmente lista para el 30 de junio, obtener quote del partner.
- **Discrepancy AI (blog M2-009 + Reddit M2-011)**: confirmar con producto qué decisiones de screening hoy requieren human review. Si auto-niega aplicaciones, el framing compliance cambia.
- **Rental Beast partnership (PR M2-024 + blog M2-022)**: confirmar partnership oficialmente lista para el 30 de julio.
- **ID verification (LI-J M2-018 + Reddit M2-019)**: confirmar fecha real del launch + soporte de documentos internacionales.
- **Showing confirmation (Reddit M2-026)**: idealmente recuperar el draft que Ivan dejó como referencia.
- **Blog Renter (M1-018 Calgary + M2-017 Toronto)**: confirmar con Alejandra (SEO) que no choca con su territorio de resource pages. También validar todos los rangos de renta marcados `[VERIFICAR]` con Rentals.ca/CMHC.
- **URLs internas `[VERIFICAR URL]` en blogs**: `/features/liza/`, `/features/marketplace-syndication/`, `/resources/research`. Walter confirma las paths exactas con SEO.

## Research / inputs

| File | Type | Status | Date | Notes |
|---|---|---|---|---|
| context/signals.md | Research | CURRENT | 2026-06-08 | N1-N8. Refresh before Week 12 (Aug 24) |
| context/positioning.md | Positioning | CURRENT | 2026-06-08 | 5 pillars with data |
| context/reddit-voice-reference.md | Voice ref | CURRENT | 2026-06-17 | Patterns from top monthly of 4 subs |
| context/ai-tells-do-not-use.md | Anti-patterns | CURRENT | 2026-06-17 | AI muletillas baneadas; lectura obligatoria para todos los escritores y para editor-qa |
| data/reddit/2026-06-17/ | Reddit raw | CURRENT | 2026-06-17 | 98 top posts XML+JSON+digest |

## Convention

Cuando se genera una nueva pieza: agregar fila en el CSV del mes correspondiente con status DRAFT.
Después de editor-qa: mover a QA-OK.
Después de Walter/founder sign-off: APPROVED.
Después de subir a mano: PUBLISHED + fecha de publicación. Métricas a `context/metrics-log.md` para que el `performance-analyst` cierre el loop.
