// Hibrido: la generacion con IA vive en Claude Code.
// La web es ahora solo-lectura. Estas acciones devuelven 410 Gone.
// Si en el futuro se reactiva la generacion en la web, restaurar este archivo
// desde el commit anterior a la migracion al hibrido.

export type GenAction =
  | "generate-post"
  | "write-blog"
  | "generate-pr"
  | "refresh-insights"
  | "refresh-directory"
  | "generate-image";

export interface GenResult {
  ok: true;
  path?: string;
  text?: string;
  committed?: boolean;
  summary: string;
}

export async function runGenerator(_action: GenAction, _payload: Record<string, unknown>): Promise<GenResult> {
  throw new Error("Generation lives in Claude Code now. The web dashboard is read-only.");
}
