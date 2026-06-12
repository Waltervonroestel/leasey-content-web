"use client";

// Hibrido: las acciones de generacion viven en Claude Code.
// Este componente queda como NO-OP visible (oculto) para no romper paginas
// que aun lo importen. Si la generacion regresa a la web, restaurar este archivo
// desde el commit previo a la migracion al hibrido.

interface Props {
  action?: string;
  payload?: Record<string, unknown>;
  label?: string;
  taskLabel?: string;
  variant?: "primary" | "ghost";
}

export default function ActionButton(_props: Props) {
  return null;
}
