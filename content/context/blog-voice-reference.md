# Análisis de voz: blog.leasey.ai (referencia)

Leído de blog.leasey.ai el 2026-06-08. 12 posts analizados, 2 a fondo verbatim.

## HALLAZGO CLAVE: este blog es renter-facing (B2C), no operator-facing (B2B)
Todo el contenido de blog.leasey.ai son guías de ciudad para INQUILINOS que se mudan:
"mejores barrios", "costo de vida", "qué hacer en Toronto", "mejores universidades".
La audiencia es la persona que busca dónde vivir, NO el property manager.

Esto es distinto del contenido que produce este sistema (operator-facing, ICP = property
managers). Son dos audiencias diferentes:
- Blog renter-facing → audiencia inquilino, voz ingeniosa.
- Contenido operator-facing (este sistema) → audiencia property manager, voz práctica.

Ambos funnels llevan al CTA canónico de Leasey (get-started). NO mezclar las dos voces sin querer.

## Voz observada en blog.leasey.ai (renter-facing)
- Tono: ingenioso, millennial, juguetón, cálido. Mucho humor autoconsciente.
- Punto de vista: segunda persona dominante ("you", "your taste buds"), con "we" ocasional ("we've curated", "let's dive").
- Metáforas extendidas y referencias pop/locales. Ejemplos verbatim:
  - Toronto: "We hope you have your beanie and Leaf's jersey ready because we're about to embark on a wild ride through the 6ix."
  - Vancouver: "Living in Vancouver, it's like living in a city wrapped in a nature-themed gift paper, tied with a bow of diverse food and friendly people."
  - "Vancouver whispers, 'You don't need a snow shovel, just an umbrella.'"
- Estructura: listicles numerados ("10 best", "20 things", "30 fun things"). H2 por sección, H3 por ítem. Frases que alternan punchy corta con descriptiva larga.
- CTA (en el blog original): suave, enmarcado como conveniencia ("It's kinda like online shopping but for apartment showings"). NOTA: en NUESTRO sistema el CTA va al canónico get-started, no copiar destinos del blog original. Tomar de aquí el TONO suave del CTA, no el destino.

## CONFLICTO con las reglas del sistema (importante)
1. EM-DASHES: este blog los usa MUCHO ("Toronto is not cheap—", asides con guion). El sistema los PROHÍBE en todo contenido publicable. Si replicamos este blog tal cual, violamos la regla maestra. Decisión: el operator-facing sigue sin em-dashes. Si se hace renter-facing, definir si se permite el guion ahí (recomendado: tampoco, mantener consistencia de marca y legibilidad).
2. CTA: el blog original apunta a su propio destino. NUESTRO contenido (operator y renter) lleva al CTA canónico get-started. No copiar destinos del blog original.
3. AUDIENCIA: renter vs property manager. El humor pop millennial encaja con el renter; el operator-facing es práctico, escéptico, sin tiempo para fluff (ver clients.md).

## Qué SÍ tomar de este blog para el operator-facing
- La calidez y la apertura directa con una imagen concreta (sin el exceso de metáfora).
- La estructura escaneable (headings claros, listas) para un PM que tiene 5 minutos.
- El CTA suave enmarcado como conveniencia, no como presión (pero apuntando al demo).
- NO tomar: em-dashes, humor pop excesivo, segunda persona juguetona, metáforas extendidas.

## DECISIÓN (resuelta 2026-06-08)
Walter decidió: crear un agente `blog-renter` separado (B2C, voz del blog) que convive con
el operator-facing sin contaminarlo. CTA al canónico get-started (sin marketplace). Em-dashes:
PROHIBIDOS también en renter-facing (la marca los veta, aunque el blog original los use). Este
archivo es la guía de voz ACTIVA del agente `blog-renter` (ver `.claude/agents/blog-renter.md`).
