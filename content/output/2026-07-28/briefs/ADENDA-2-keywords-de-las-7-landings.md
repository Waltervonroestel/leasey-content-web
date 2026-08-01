# ADENDA 2 · Las keywords foco de las 7 landings

Se verificó con datos reales. Esto afecta a las Tareas 1, 3, 4, 5, 6, 7 y 8, y hay que resolverlo antes de que Alejandra apruebe.

## El hallazgo

**Las siete landings no rankean absolutamente nada.** No es que rankeen mal: no tienen ni una impresión.

Comprobado por dos vías independientes:

1. **Search Console, API directa, 90 días.** Consultadas las siete URLs una por una. Las siete devuelven **cero queries**. Ni una impresión, ni un clic.
2. **La sheet de Clusterización.** Las siete marcadas `Cantidad de keywords: 0`, `Visitas GSC: 0`, `Posiciona en Google: No`, `Keywords: Ninguna`.

El tráfico GA4 va de 0 a 2 visitas por página, que es ruido.

## Qué significa para las keywords foco

Las siete keywords foco de los briefs **se eligieron del slug de la URL**, sin volumen verificado:

| Tarea | Keyword foco propuesta |
|---|---|
| 1 | consistent tenant experience |
| 3 | leasing software for third-party property managers |
| 4 | leasing compliance and risk reduction |
| 5 | post-showing feedback |
| 6 | multi-property listing consistency for 100+ doors |
| 7 | student housing leasing automation |
| 8 | lease-up software |

Ninguna se validó contra volumen de búsqueda real, porque **no existe fuente interna que pueda hacerlo**: si la página no rankea, Search Console no reporta nada, y la sheet tampoco trae volumen para términos que la página no tiene.

Varias de estas frases podrían tener volumen cero. "Post-showing feedback" y "multi-property listing consistency" suenan a lenguaje interno de producto, no a como busca un property manager. "Lease-up software" y "student housing leasing automation" son más plausibles como búsqueda real.

**Esto necesita una pasada con herramienta externa** (Ahrefs, Semrush o similar) antes de aprobar. Es de Alejandra, no nuestro: nosotros no tenemos acceso a datos de volumen. Una comprobación de siete términos evita siete correcciones después de escribir.

## La otra cara: hay más libertad de la que los briefs asumen

Como las siete páginas no rankean nada, **la Regla A no aplica a ninguna**. No hay posición que proteger ni sección que preservar por sostener una keyword.

Los briefs se escribieron con la cautela de un Optimize, listando qué headings se mantienen literales. Eso es correcto por prudencia, pero no es obligatorio aquí: si al escribir conviene reordenar o refundir secciones para que la página funcione mejor, se puede hacer sin riesgo de ranking. No hay nada que perder.

Vale la pena decírselo a quien escriba, porque cambia el margen de maniobra.

## Recomendación

1. **Antes de aprobar**: Alejandra valida las siete keywords foco con volumen real. Las que salgan en cero se reemplazan por el término con volumen más cercano a la intención de la página.
2. **Al escribir**: tratar las siete como páginas nuevas, no como optimizaciones. La estructura fija de landing de siete bloques manda sobre lo que hay hoy.
3. **Después de publicar**: medir 30 días antes de ejecutar las consolidaciones 301 que apuntan a T6 (seis), T3 y T7 (tres cada una), T4 y T5 (dos cada una) y T8 (una). Enviar autoridad a una página que aún no rankea nada tiene sentido solo si la página ya está bien construida cuando llega.
