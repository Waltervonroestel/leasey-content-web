import Anthropic from "@anthropic-ai/sdk";

// Llamadas directas a la Messages API de Anthropic (HTTP liviano, sin subproceso).
// Esto reemplaza al Agent SDK, que lanzaba el CLI de Claude como subproceso pesado
// y reventaba la memoria de la instancia free (OOM => 502).

// Modelo por defecto: Opus 4.8 (el más capaz). Override con GEN_MODEL si se quiere
// algo más barato, ej. GEN_MODEL=claude-sonnet-4-6.
const MODEL = process.env.GEN_MODEL || "claude-opus-4-8";

export function hasToken(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_CODE_OAUTH_TOKEN);
}

function getClient(): Anthropic {
  if (process.env.ANTHROPIC_API_KEY) {
    return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  // Fallback: token OAuth de suscripción vía Authorization: Bearer.
  return new Anthropic({ authToken: process.env.CLAUDE_CODE_OAUTH_TOKEN });
}

interface RunOptions {
  system: string;
  prompt: string;
  webSearch?: boolean;
  maxTokens?: number;
}

export async function runClaude({ system, prompt, webSearch = false, maxTokens = 4096 }: RunOptions): Promise<string> {
  const client = getClient();
  const tools = webSearch ? [{ type: "web_search_20260209", name: "web_search" }] : undefined;
  const messages: Anthropic.MessageParam[] = [{ role: "user", content: prompt }];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: any = { model: MODEL, max_tokens: maxTokens, system, messages };
  if (tools) params.tools = tools;

  let response = await client.messages.create(params);

  // Server-side web search puede pausar (pause_turn); reanudar reenviando.
  let guard = 0;
  while (response.stop_reason === "pause_turn" && guard++ < 5) {
    messages.push({ role: "assistant", content: response.content });
    response = await client.messages.create({ ...params, messages });
  }

  return response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
}
