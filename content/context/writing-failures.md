# Cómo falla el contenido de Leasey.AI (casos reales)

Este archivo existe porque los agentes de verificación aprendieron de sus errores y los de escritura no. Cada agente de revisión lleva dentro los casos concretos que lo hicieron fallar, y por eso mejoraron. Los escritores nunca recibieron esa corrección: producían el borrador, alguien más encontraba el problema, y la lección se quedaba en el revisor.

Todo lo que sigue **pasó de verdad**, entre el 27 y el 30 de julio de 2026, en contenido que estuvo a punto de publicarse o que se publicó. Ninguno es hipotético.

Lo lee todo agente escritor antes de entregar un borrador.

---

## El patrón: el formato impecable es lo que deja pasar el error

Los seis casos de abajo tienen algo en común. Ninguno se detecta leyendo el texto. Todos se ven bien: la frase fluye, la fuente suena creíble, la cifra es plausible. El error solo aparece cuando alguien abre la fuente.

Un revisor de estilo no los caza. Un revisor de formato tampoco. **El único filtro que funciona es no escribirlos.**

---

## Caso 1: la cifra correcta del informe equivocado

Se escribió que, según el Consumer Housing Trends Report de Zillow, **el 76% de los inquilinos espera respuesta en 24 horas**. La cifra real de ese informe es **69%**.

El 76% no salía de la nada: era un número recordado, no leído. La fuente nombrada era real, el informe existía, el tema era el correcto. Solo el número estaba mal.

**Qué aprender:** nombrar una fuente real no valida la cifra que le cuelgas. Si no la leíste en el documento hoy, no la escribas.

## Caso 2: el marcador que se publicó como texto

En un borrador quedó la frase:

> "40-60% of leads go unanswered (source to verify)"

Ese paréntesis viajó dentro de la prosa hasta la revisión final. La cifra no tenía fuente en ningún lado y terminó eliminada, sustituida por un dato propio de Leasey (30-40% de consultas contestadas manualmente) declarado como observación nuestra y no como estadística de industria.

**Qué aprender:** un `[VERIFICAR]` dentro de una frase que suena bien es más peligroso que una frase incompleta. Si no tienes el dato, **no escribas la frase**. Escribe la que sí puedes sostener.

## Caso 3: la cifra propia que sonaba a estadística

Se publicó: **"Roughly 90% of routine leasing tasks stop being manual."**

No tiene fuente. No está en `products.md`. No es un dato propio declarado. Es una estimación redactada con la cadencia de una estadística, que es exactamente lo que la hace pasar.

**Qué aprender:** "roughly", "up to", "as much as" delante de un número no lo convierten en aproximación honesta. Lo disfrazan. O el número está en `context/products.md` como dato propio y se declara como tal, o sale.

## Caso 4: la coma que se volvió punto

Se citó a una clienta real, Robyn Lockhart de Aquilini Investment Group, terminando así:

> "...we've already signed several leases through Leasey."

El original del tracker seguía: **"...through Leasey, and the platform has kept our team consistently busy"**.

Cortar en la coma y poner punto produce una cita textual palabra por palabra que **le atribuye a una persona real una frase que no dijo**. Es la más fácil de cometer de toda esta lista y la más difícil de defender ante la clienta.

**Qué aprender:** las citas de cliente salen de `context/testimonials-tracker.md` y tienen que ser **subcadena literal y contigua**. Se puede recortar solo en un final de frase real.

## Caso 5: seis cifras inventadas sobre la empresa del socio

Un press release sobre la alianza con REW.ca llevaba seis afirmaciones sobre REW. Al verificarlas contra fuentes reales, **ninguna sobrevivió**:

| Lo que decía el borrador | Lo que dice la realidad |
|---|---|
| "Established in 1996" | El primer prototipo es de octubre de 2011; su LinkedIn dice 1978 por el negocio impreso. 1996 no es nada |
| "over 1 million monthly visitors" | Su propio anuncio decía "casi 4 millones de visitas", y es de 2019. Además "visitas" no es "visitantes" |
| "16 million Canadian home seekers" | Sin fuente en ninguna parte |
| "over 577,000 property listings" | Su propio anuncio decía 70 mil. Ocho veces menos |
| "the number one real estate platform in British Columbia" | Ningún tercero lo corrobora. REW dice algo mucho más débil |
| "49+ marketplaces" | El sitio de Leasey dice 48+. El 49 fue invención del escritor |

Lo peor no es el error: es el destinatario. **Son afirmaciones sobre la empresa del socio, en un documento que lleva su nombre.** Si REW.ca lee su propio boilerplate y encuentra mal el año de fundación, eso cuesta más que una frase vaga.

Fíjate en la última fila. Nadie decidió mentir: alguien subió 48 a 49 porque sonaba mejor y porque "seguro ya son más". Así se inventa una cifra.

**Qué aprender:** cada parte aprueba el párrafo que la describe. El boilerplate y las cifras del socio los suministra el socio, no los redactas tú. Y el dato propio de Leasey no se redondea hacia arriba: `context/products.md` es la fuente de verdad, literal.

## Caso 6: dos artículos con cero enlaces externos

Los dos artículos que llegaron a punto de publicarse el 30 de julio tenían **cero enlaces externos**. Citaban por nombre ("según el NMHC 50 Report", "un estudio de Zillow") sin enlazar a ninguno.

El resultado: `link-verifier` no tuvo nada que verificar y ambos pasaron limpios. Al abrir las ocho fuentes a mano, **cinco no se sostenían**:

- Un 24% del NMHC 50 Report que no existe en ninguna edición. La de 2025 dice 21,4% y la de 2026 dice 23,7%.
- Dos años mezclados en una sola frase: el porcentaje de un año y las unidades de Greystar de otro. Cada dato defendible por separado, la frase falsa.
- Una cita atribuida a Sunny Junjea, que **moderaba** la sesión de la NAA. La dijo David Thomas, de Veritas.
- Una cita, "Keep teams aligned and informed", atribuida a una ejecutiva real de una empresa real, que no aparece en su caso de estudio ni en ningún otro sitio.
- Un umbral propio de "3 a 5 propiedades" respaldado con una atribución a un análisis de Grace Hill que no menciona umbrales.

**Qué aprender:** citar por nombre sin enlazar es la forma más fácil de burlar la revisión, y por eso es la más peligrosa. El enlace no es cortesía editorial: es lo que permite que alguien te corrija antes de publicar.

Y sobre la cuarta viñeta: en paneles, mesas redondas y webinars, **el moderador y el panelista se confunden con una facilidad enorme**. Antes de atribuir una cita de un evento, lee el párrafo anterior de la transcripción.

## Caso 7: la autobiografía que el fundador no escribió (el peor de todos)

El 24 de julio se produjeron las páginas de autor de Juan y Carlos Leal. El 1 de agosto Walter marcó **28 pasajes como incorrectos**: prácticamente toda afirmación profesional específica sobre ambos.

De dónde salió. La fuente del sistema decía, literal:

> "CPA-CA y full-stack engineer (KPMG, Wishpond, The DMZ)"

Tres nombres de empresa. Lo que se escribió a partir de eso:

| Lo que decía la fuente | Lo que se publicó |
|---|---|
| "KPMG" | "**tres años** auditando sistemas financieros para clientes enterprise" |
| "Wishpond" | "**me uní** a Wishpond Technologies **como software engineer**" |
| "full-stack engineer" | "**aprendí solo** desarrollo full-stack" |
| "The DMZ" | "The DMZ, **una de las mejores incubadoras universitarias del mundo**" |
| (nada) | "en KPMG, rigor; en Wishpond, velocidad; en The DMZ, la disciplina de construir con restricciones" |
| (nada) | "seguía notando el mismo patrón: los negocios que auditaba se ahogaban en procesos manuales" |

**Y todo en primera persona.** "I started my career...", "I taught myself...", "I kept noticing...".

Ahí está la diferencia con los seis casos anteriores. Una cifra mal citada se corrige con una nota al pie. Esto **le atribuye a una persona real una autobiografía que no escribió**, con sus motivaciones internas inventadas, en una página que lleva su nombre y su foto. Juan no puede corregir un dato que él nunca dijo tener: tiene que desmentir su propia historia.

Hay un segundo hallazgo que agrava el primero. Los datos de Carlos que **sí coincidían palabra por palabra con la fuente** (EY Consulting, QuadReal, Aquilini, licensed Realtor, 15+ años) **también están marcados como incorrectos**. O sea que el problema no fue solo el relleno narrativo: el archivo de origen ya traía datos malos, y nadie los había comprobado nunca con los propios fundadores.

Se coló además, cuatro días después de haberlo corregido, el error del caso 3: "100% response rate (versus **the industry average** of 30-40%)". El 30-40% es una observación propia de Leasey.

**Qué aprender:** los hechos sobre personas reales se tratan como las citas de cliente. Existe un tracker, `context/founders-facts.md`, y **lo que no está ahí no se escribe**. Un nombre de empresa autoriza a escribir ese nombre, nada más: ni la duración, ni el cargo, ni la secuencia, ni la lección que esa persona sacó de ahí.

Y la regla que resume el caso: **ningún agente escribe en primera persona por una persona real.** Se entrega una lista de hechos con su fuente; la narrativa la escribe o la aprueba la persona.

## Caso 8: la regla de estilo que entró dentro de una cita

El 1 de agosto de 2026, arreglando los borradores del calendario, una sustitución automática de muletillas cambió "game changer" por "step change" y "streamlined" por "simplified" en los 91 documentos.

Las dos palabras estaban **dentro de citas textuales de clientes reales**. Tarun Chopra, de 847 Ray LLC, había dicho "Leasey has been a game changer for me". Jaycy Pierre, de AEDN, había dicho "It has greatly streamlined the process". Después de la corrección, ninguno de los dos había dicho lo que el documento les atribuía.

Lo llamativo es de dónde vino: **la herramienta que arreglaba el caso 3 cometió el caso 4**. Una limpieza de estilo, que es lo más inocuo que hay, alteró dos declaraciones de personas reales.

**Qué aprender:** ninguna regla de estilo entra dentro de unas comillas. Ni las muletillas, ni el British English, ni los em-dashes, ni la ortografía. **La cita gana siempre**, aunque contenga una palabra prohibida, aunque esté mal escrita, aunque diga "game changer". Si una cita choca con una guía de estilo, se cita igual o no se cita.

Y para las herramientas: toda sustitución masiva se aplica **fuera de las comillas**, o se comprueba contra `context/testimonials-tracker.md` antes de escribir.

---

## Las cinco reglas que salen de todo esto

1. **Sin enlace no es un dato.** Ninguna cifra, ninguna cita. La única excepción son los datos propios de producto de `context/products.md`, que se declaran como propios. Si la única fuente de una cifra es otra página de leasey.ai, es autocita circular y tampoco vale.
2. **Si no lo puedes enlazar, cambia la frase.** No la marques para después. El marcador viaja.
3. **La cifra propia se copia literal.** 48+ es 48+.
4. **Las citas de cliente son subcadena literal y contigua** del tracker.
5. **Lo que dice el socio sobre sí mismo lo escribe el socio.**

## Y una comprobación que no es de fuentes

El CTA de cierre apunta a `/get-started/`, que **responde 301**. Un artículo puede tener todas sus fuentes perfectas y cerrar con un enlace que redirige. Resuelve el destino final antes de escribirlo:

```bash
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
curl -s -o /dev/null -L -A "$UA" "<URL>" -w "%{http_code} -> %{url_effective}\n"
```
