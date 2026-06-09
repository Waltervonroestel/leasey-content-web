# Identidad de marca Leasey.AI (para briefs visuales)

Base para el agente `image-briefer`. Algunos valores están como `[VERIFICAR]` hasta confirmar con el sitio leasey.ai o el brand kit oficial. Walter: confirmar y fijar.

## Paleta (CONFIRMAR con leasey.ai)
- Color primario de marca: [VERIFICAR hex exacto en leasey.ai]. Leasey usa un azul/teal de tecnología en el sitio.
- Acento: [VERIFICAR].
- Neutros: blanco, gris oscuro para texto, gris claro para fondos.
- Regla mientras se confirma: limpio, profesional, tech. Nada estridente. El público (property managers) es práctico, el visual debe leerse serio y claro.

## Logo y nombre
- "Leasey.AI". Liza es el nombre del agente de IA (puede aparecer como personaje/icono en visuales de producto).
- Incluir el dominio "leasey.ai" en portadas de blog (como FastStrat pone "faststrat.ai").

## Estilo de portada de blog (referencia FastStrat, adaptado)
- 1600x900. Fondo de marca con gradiente sutil.
- Eyebrow (categoría) + título grande con word-wrap + subtítulo.
- Elementos geométricos simples de acento en color de marca.
- Dominio en una esquina.
- Títulos largos con ":" o "(" se recortan a la parte limpia.

## Estilo de data-viz (clave para insight-led)
- Las cifras son protagonistas: hero number grande (ej. "5.1%", "+45%", "94%").
- Siempre con su fuente en el visual (ej. "Source: Yardi Q1 2026").
- Gráficos simples y legibles, no infografías recargadas.

## Tono visual por funnel
- Operator-facing (B2B): serio, data-driven, profesional.
- Renter-facing (B2C): más cálido y vivido, fotos de ciudad/lifestyle, alineado al tono ingenioso del blog renter.

## Nota técnica (heredada de FastStrat)
No hay herramienta de generación de fotos en la sesión. Las portadas se hacen como gráficos diseñados por código (SVG a PNG con sharp) o a mano por Walter. Los briefs de este agente están pensados para cualquiera de las dos vías. En fase 2 (app), se replicaría `lib/cover.ts` con la paleta de Leasey.
