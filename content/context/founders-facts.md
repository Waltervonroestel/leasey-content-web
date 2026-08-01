# Hechos verificados de los fundadores

**Este archivo es la ÚNICA fuente permitida para cualquier afirmación biográfica o profesional sobre Juan Leal y Carlos Leal.** Funciona igual que `context/testimonials-tracker.md` funciona para las citas de cliente: si no está aquí, no se escribe. No se completa con búsquedas web, ni con LinkedIn, ni con `context/voices.md`, que está en cuarentena precisamente por esto.

Un hecho entra aquí solo cuando **Walter o el propio fundador lo confirma**. La fila lleva quién lo confirmó y cuándo.

## Por qué existe

El 24 de julio de 2026 se produjeron las páginas de autor de Juan y Carlos. El 1 de agosto Walter marcó **28 pasajes como incorrectos**, que es prácticamente toda afirmación profesional específica sobre ambos: cargos anteriores, empresas, años de experiencia, credenciales, y qué construyó cada uno dentro del producto.

Dos cosas hicieron que fuera tan grave.

**Estaba escrito en primera persona.** "I started my career as a CPA, CA at KPMG, where I spent three years auditing financial systems." Eso no es un dato mal citado: es ponerle a una persona real una autobiografía que no escribió, con sus motivaciones internas inventadas, en una página que lleva su nombre y su foto. Juan no puede corregir una cifra que nunca dijo tener; tiene que desmentir su propia historia.

**La fuente del sistema ya estaba mal.** `context/voices.md` decía "CPA-CA y full-stack engineer (KPMG, Wishpond, The DMZ)" y de ahí salieron tres años en KPMG, un cargo concreto en Wishpond, un "aprendí solo full-stack" y una tríada de lecciones aprendidas. Tres nombres de empresa se convirtieron en una carrera narrada. Pero además, los datos de Carlos que sí coincidían literalmente con `voices.md` **también están marcados como incorrectos**, así que el problema no fue solo el relleno: el archivo de origen ya traía datos malos y nadie lo había comprobado con ellos.

## Estado actual: NADA VERIFICADO

Hasta que Walter o los fundadores confirmen, **no hay ningún hecho profesional utilizable sobre ninguno de los dos**.

### Juan Leal

| Hecho | Estado | Confirmado por | Fecha |
|---|---|---|---|
| Co-founder de Leasey.AI | por confirmar | | |
| Cargo actual (CEO y CPO) | por confirmar | | |
| Credencial CPA, CA | **marcado incorrecto** | Walter, doc de author pages | 2026-08-01 |
| Paso por KPMG, Wishpond, The DMZ | **marcado incorrecto** | Walter | 2026-08-01 |
| Qué construyó dentro del producto | **marcado incorrecto** (los 6 puntos de Proof of Work) | Walter | 2026-08-01 |
| Ponencia en Rent Manager Integrations Spotlight | por confirmar | | |
| Aparición en CanadianSME | por confirmar | | |
| Base geográfica | por confirmar | | |

### Carlos Leal

| Hecho | Estado | Confirmado por | Fecha |
|---|---|---|---|
| Co-founder de Leasey.AI | por confirmar | | |
| Cargo actual (COO) | por confirmar | | |
| Licensed Realtor, 15+ años en real estate institucional | **marcado incorrecto** | Walter | 2026-08-01 |
| Paso por EY Consulting, QuadReal, Aquilini | **marcado incorrecto** | Walter | 2026-08-01 |
| Haber asesorado a Oxford Properties y QuadReal | **marcado incorrecto** | Walter | 2026-08-01 |
| Levantamiento de capital e investor relations | **marcado incorrecto** | Walter | 2026-08-01 |
| Base en Bogotá operando empresa canadiense | **marcado incorrecto** | Walter | 2026-08-01 |
| Pitch en Canada House, Londres | por confirmar | | |

## Reglas duras

**1. Ningún agente escribe biografía en primera persona de una persona real.** Nunca "I started my career", "I taught myself", "I kept noticing". El agente entrega una **lista de hechos con su fuente**, y la narrativa la escribe o la aprueba la persona. Una bio en primera persona convierte cada invención en una declaración suya.

**2. Un nombre de empresa no es un cargo, ni una duración, ni una secuencia.** "KPMG" autoriza a escribir "KPMG". No autoriza "tres años", ni "como auditor senior", ni "antes de pasar a".

**3. Ningún superlativo sobre terceros.** "The DMZ, una de las mejores incubadoras del mundo" y "Aquilini, uno de los grupos de inversión privada más grandes del oeste de Canadá" son afirmaciones sobre otras empresas que nadie verificó. Es el mismo error de REW.ca.

**4. Las motivaciones no se infieren.** "Seguía notando el mismo patrón: los negocios que auditaba se ahogaban en procesos manuales" es una explicación inventada de por qué una persona real cambió de carrera. Suena bien y es exactamente por eso que pasa.

**5. Lo interno no va en contenido público. Decidido.** La ronda Seed vía SAFE, el estado post-revenue, los términos comerciales de TEREZ (0,5 meses de renta por lease) y el roadmap de UK y Europa **sí están** en `context/products.md`, así que no son inventados. Pero estaban en una página pública, dichos en primera persona por el COO.

Walter los marcó como **uso interno el 1 de agosto de 2026**. Van marcados con 🔒 en `products.md` y **no pueden aparecer en ningún contenido público**: blog, landing, LinkedIn, Reddit, press release ni bio. No dependen de que un agente lo recuerde: `scripts/qa-briefs.mjs` los detecta y los reporta como hallazgo.

Dos matices que importan:
- **El precio NO es interno.** `context/aeo-faq.md` lo publica como respuesta canónica del SEO Knowledge Base y esa fuente gana. Los rangos por puerta y el flat mensual se escriben sin problema.
- **El modelo de pilot por desempeño se puede mencionar en abstracto.** Lo que no se publica son los términos y el nombre del cliente.

Que un dato sea cierto no decide dónde va.

**6. El dato de producto no se cuela como industria.** La página decía "100% response rate (versus the **industry average** of 30-40%)". El 30-40% es una observación propia de Leasey, y el fact-check del 28 de julio ya lo había corregido por ese mismo motivo. Se repitió cuatro días después.

## Lo que sí se puede escribir hoy

Mientras esta tabla esté vacía: nombre, que son hermanos, que cofundaron Leasey.AI y sus cargos actuales, si Walter los confirma. Nada más.

Una bio corta y verdadera vale más que una extensa que el fundador tiene que desmentir.
