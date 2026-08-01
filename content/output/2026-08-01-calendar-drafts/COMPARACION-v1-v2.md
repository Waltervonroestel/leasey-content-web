# Los 91 contenidos del calendario: versión 1 contra versión 2

Comparación del 1 de agosto de 2026. La v1 es lo que había en los documentos al abrirlos. La v2 es lo que hay ahora.

Todo se midió leyendo los documentos por API. Las cifras de la v1 salen de las pasadas de QA guardadas.

---

## En números

| | v1 | v2 |
|---|---|---|
| Enlaces a las fuentes citadas | **0** | **167** |
| Enlaces internos a leasey.ai | 28 | **84** |
| Documentos con testimonio de cliente con nombre | 8 | **30** |
| Hallazgos de estructura y voz | 87 | **0** |
| Cifras sin fuente enlazada | 204 | 101 |
| Documentos con palabras prohibidas | 31 | 2 |
| Citas de cliente alteradas | 2 | 0 |
| Atribuciones falsas | 4 | 0 |
| "49+ marketplaces" (el sitio dice 48+) | 20 | 0 |
| Descripción boilerplate de producto | 69 | 0 |
| Frases de hoja de ruta | 6 | 0 |
| Títulos desincronizados con la hoja | 87 | 0 |
| Aperturas que arrancan con una estadística | 15 | 0 |

---

## 1. Verificabilidad: de cero a 167 enlaces

Los 91 documentos nombraban fuentes reales con convicción y **no había una sola URL entre los tres**. Sin enlaces, el verificador no tiene nada que verificar: la ausencia no los hacía sospechosos, los hacía invisibles. Es el fallo del 30 de julio repetido a escala.

Al abrir las nueve fuentes citadas, **cuatro no decían lo que el texto afirmaba**:

| Afirmación | Qué pasaba |
|---|---|
| 85% de mejora en lead-to-lease, atribuido a AppFolio | No está en ese informe. Es de Frontdesk Research. Mal atribuido en 27 sitios |
| 8,3% de intentos de creación de cuenta fraudulentos (TransUnion) | No existe en el informe citado. Borrado |
| 70% de las consultas llegan fuera de horario (ShowMojo) | La fuente mide "prospects buscando online", no consultas. ShowMojo publica 61% para consultas |
| 80% de necesidades que la IA puede resolver (Propmodo) | Ni es de Propmodo ni es un dato: es la estimación de Julia Lambert, de RET Ventures, recogida por Insights by Blueprint |

Más una sobreafirmación: el texto decía que la vacancia subió "en todos los principales metros canadienses". CMHC dice que la nacional subió a 3,1% y que **Calgary se mantuvo estable**.

---

## 2. Cómo se citan las fuentes

**v1:** el nombre de la fuente, sin enlace.

**Paso intermedio (mío, y era peor):** la URL cruda pegada en mitad de la frase.

**v2:** el nombre de la fuente enlazado.

> CMHC's 2025 Rental Market Report (published December 2025) puts the national vacancy rate at 3.1% in 2025...

El lector ve una cita normal. El enlace existe. Y resuelve el choque entre dos reglas nuestras: CLAUDE.md pide abrir con un dato y su fuente, el brief-template prohíbe enlaces en la intro. Una atribución enlazada no saca al lector; una URL cruda sí.

---

## 3. Las aperturas

Quince piezas abrían con "According to [informe completo], X%...". Eso avisa al lector de que está leyendo marketing antes de la segunda línea.

| v1 | v2 |
|---|---|
| "CMHC's 2025 Rental Market Report puts the national vacancy rate at 3.1%..." | "Every day a unit sits empty in Vancouver costs more than the rent it is not collecting." |
| "According to TransUnion's research, US lenders faced $3.3 billion..." | "The application looks clean. Name, employer, income, references, all consistent. The person does not exist." |
| "AppFolio's 2025 Benchmark Report shows AI adoption rising from 21% to 34%..." | "A prospect enquires at 21:40 on a Sunday. If nobody answers until Monday morning, that lead has already toured somewhere else." |
| "Frontdesk Research found that 94% of operators..." | "A leasing agent handling 80 showings a week does not have a technology problem. They have an hours problem." |

El dato no se pierde: abre el párrafo dos, donde prueba lo que el gancho plantea. Los ganchos usan las anclas operativas que `clients.md` marca como verificadas.

---

## 4. La descripción de producto

Aparecía 69 veces entre sus variantes y era la frase más generada del corpus.

| v1 | v2 |
|---|---|
| "cloud-based residential leasing automation platform that simplifies the end-to-end lease lifecycle for organisations that manage recurring leases" | "answers the enquiry, qualifies the lead, books the showing, runs the screening and gets the lease signed" |
| "front-office leasing automation and CRM layer that sits on top of existing PMS tools, or runs standalone" | "handles the front of the funnel. It runs on top of Yardi, Buildium or Rent Manager, or on its own if you have no PMS" |

Los mismos hechos, en verbos. La primera describe una categoría de software. La segunda describe lo que pasa.

---

## 5. Las citas de cliente

Contrastadas contra `testimonials-tracker.md`, cuatro estaban alteradas:

| Cliente | v1 | v2 |
|---|---|---|
| Robyn Lockhart, Aquilini | "...no-shows. We're now seeing..." | "...no-shows, **but** we're now seeing..." |
| Justin Rogers, Rockingham | "**We are** saving hours" | "**We're** saving hours" |
| Tarun Chopra, 847 Ray LLC | "step change for me" | "**game changer** for me" |
| Jaycy Pierre, AEDN | "greatly **simplified** the process" | "greatly **streamlined** the process" |

**Las dos últimas las rompí yo.** La limpieza automática de muletillas cambió "game changer" y "streamlined" dentro de citas textuales, y dos personas reales pasaron a decir algo que no dijeron. De ahí salió el caso 8 del catálogo y la regla que ahora está en la herramienta: ninguna regla de estilo entra dentro de unas comillas.

**Y de 8 documentos con testimonio a 30.** Lo importante es dónde van: cada cita se inserta detrás del párrafo que hace la afirmación que prueba, no pegada al final. Con tope de cuatro usos por cita para que ninguna se gaste, y solo en blogs, porque una cita de sesenta palabras dentro de un post de LinkedIn de doscientas se come un tercio del post.

---

## 6. Estructura

Setenta y dos párrafos partidos en límite de frase, sin perder una palabra. Quince intros devueltas a tres frases. Ochenta y cuatro enlaces internos añadidos, todos a páginas con tráfico medido en Search Console. Seis frases de hoja de ruta borradas ("This post explains what the integration does, why we chose...", que se puede quitar entera sin perder nada).

---

## 7. Press releases

No inventaban nada sobre el socio, que es lo importante. Pero les faltaba el "About" del socio y no llevaban placeholder, así que salían incompletos o alguien los rellenaba con una búsqueda web, que es exactamente como nació el error de REW.ca. Los dos llevan ahora el bloque marcado con la instrucción de que lo suministra el socio. Y se quitó el titular duplicado, que había causado yo con la sincronización de títulos.

---

## Lo que NO cambió, y es deliberado

**El argumento de ninguna pieza.** No se reescribió un solo ángulo ni enfoque. Los 91 dicen lo mismo que decían. Lo que cambió es que ahora se sostiene y se lee.

**Los ejemplos numéricos hipotéticos.** Las rentas de 2.200 dólares y las cuentas de "Opción A contra Opción B" son ilustraciones, no afirmaciones sobre el mundo.

**Los datos propios de producto** que Walter confirmó: el 0,2% de rechazo del liveness detection y el confirmation rate.

---

## Lo que sigue abierto

**101 cifras siguen marcadas por el QA**, pero ninguna es una afirmación desnuda: 39 repiten una fuente ya enlazada más arriba en el mismo documento, 21 son ejemplos hipotéticos, 20 son datos propios de `products.md` y unas 20 son descriptores de cartera ("50 a 1.000 puertas") que no son estadísticas.

**Falta storytelling real.** Los testimonios dan prueba, no narrativa. Para eso hace falta un caso contado por quien estuvo: qué pasó de verdad en el lease-up de TEREZ, qué dijo el coordinador de Rockingham la primera semana.

**La sección de casos del sitio está caída.** `/case-studies/` devuelve 410 con 163 impresiones en posición 10, y las cuatro páginas de testimonios devuelven 410 o 404. El contenido no está en WordPress, ni siquiera en la papelera. Las referencias a esas URLs ya están marcadas como muertas en `clients.md` y en `blog-writer` para que ningún contenido las enlace.
