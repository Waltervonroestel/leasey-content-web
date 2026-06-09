# Cómo arrancar el sistema de contenido de Leasey.AI

## Lo más importante
Claude Code lee los agentes y comandos de la carpeta DONDE lo lanzas.
Tienes que lanzarlo DENTRO de `leasey-content-system`, no desde la carpeta de arriba.

## Pasos (PowerShell en Windows)

1. Abre PowerShell.

2. Métete en la carpeta del sistema:
   ```powershell
   cd "C:\Users\wally\claude code app\leasey-content-system"
   ```

3. Lanza Claude Code desde ahí:
   ```powershell
   claude
   ```

4. Confirma que estás en el lugar correcto: escribe `/` y deberías ver en la lista:
   `linkedin-week`, `publish-repressed`, `reddit-post`, `community-reply`, `content-calendar`.
   Si aparecen, todo bien. Si no, no estás dentro de la carpeta correcta (repite el paso 2).

## Comandos disponibles

- `/content-calendar` — Investiga noticias + competidores y arma el calendario de 90 días.
- `/linkedin-week` — Genera los 3 posts de LinkedIn de la semana (lun/mié/vie).
- `/publish-repressed [tema]` — Toma un anuncio del backlog y genera blog + LinkedIn.
- `/reddit-post [feature]` — Genera el siguiente post changelog para r/LeaseyAI.
- `/community-reply [hilo]` — Redacta una respuesta de valor para un hilo de comunidad.

## Dónde sale todo
Todos los borradores van a `output/AAAA-MM-DD/`. El sistema NO publica nada.
Walter revisa, ajusta y sube a mano.

## Flujo recomendado del trimestre
1. `/content-calendar` para tener el plan de 90 días y las señales frescas.
2. Cada semana, ejecutar los slots del calendario con su comando.
3. Carlos/Juan corrigen los primeros borradores de LinkedIn. Esas versiones aprobadas
   se pegan en `context/voices.md` como ejemplos few-shot para afinar el tono.

## Regla de oro
Ningún borrador se da por terminado sin pasar por el agente `editor-qa`.
Nunca em-dashes. Nunca cifras inventadas (van como `[VERIFICAR]`).
