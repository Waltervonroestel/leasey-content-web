import { query } from "@anthropic-ai/claude-agent-sdk";

// Wrapper sobre el Agent SDK. Usa la auth de suscripción vía
// CLAUDE_CODE_OAUTH_TOKEN (generado con `claude setup-token`).
// Si el token no está, hasToken() es false y las rutas devuelven 503 con instrucción.

type Model = "sonnet" | "opus" | "haiku";

export function hasToken(): boolean {
  return Boolean(process.env.CLAUDE_CODE_OAUTH_TOKEN || process.env.ANTHROPIC_API_KEY);
}

interface RunOptions {
  system: string;
  prompt: string;
  model?: Model;
  allowedTools?: string[];
}

export async function runClaude({ system, prompt, model = "sonnet", allowedTools = [] }: RunOptions): Promise<string> {
  const env = { ...process.env };
  delete env.ANTHROPIC_AUTH_TOKEN;

  for await (const message of query({
    prompt,
    options: {
      model,
      systemPrompt: system,
      allowedTools,
      permissionMode: allowedTools.length > 0 ? "acceptEdits" : "default",
      env,
    },
  })) {
    if (message.type === "result") {
      const m = message as { result?: string; subtype?: string; is_error?: boolean };
      if (m.is_error || (m.subtype && m.subtype !== "success")) {
        throw new Error(m.result || m.subtype || "Agent SDK error");
      }
      return m.result ?? "";
    }
  }
  throw new Error("Claude returned no result");
}
