// Health check para Render, sin auth.
export function GET() {
  return new Response("ok", { status: 200 });
}
