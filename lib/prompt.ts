import { readFileMd } from "./content";

// Ensambla el system prompt de generación con las reglas del sistema de contenido.
// Así la generación desde la web respeta las mismas reglas que los agentes.
export function systemPrompt(extra = ""): string {
  const parts = [
    readFileMd("CLAUDE.md"),
    readFileMd("context/b2b-voice-reference.md"),
    readFileMd("context/products.md"),
    readFileMd("context/positioning.md"),
    readFileMd("context/clients.md"),
    readFileMd("context/voices.md"),
    readFileMd("context/style-rules.md"),
  ].filter(Boolean);

  return [
    "You are a writer in the Leasey.AI content system. Follow these rules exactly.",
    "ALWAYS write publishable content in ENGLISH (British English: neighbourhood, organised, centralise). Use Oxford commas. Stylize the brand as 'Leasey.AI'.",
    "No em-dashes (use commas, parentheses, periods).",
    "FRESHNESS IS PRIORITY #1. Prefer the most recent datapoint available in context/signals.md (look at the 'date:' field of each insight). Do NOT cite data older than 90 days if a more recent insight exists. If all available data on a topic is older than 90 days, note this in your draft and recommend a fresh search before publishing.",
    "Insight-led: open with a real datapoint and name its source in the text. Connect to a positioning pillar.",
    "Connect to Leasey.AI and drive to the demo (https://www.leasey.ai/get-started/) per the channel rules.",
    extra,
    "--- SYSTEM CONTEXT ---",
    parts.join("\n\n---\n\n"),
  ].filter(Boolean).join("\n\n");
}
