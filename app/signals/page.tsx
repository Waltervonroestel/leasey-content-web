import { readFileMd } from "@/lib/content";
import { Card } from "@/components/ui";
import Markdown from "@/components/Markdown";

export const dynamic = "force-dynamic";

export default function SignalsPage() {
  const signals = readFileMd("context/signals.md");
  const positioning = readFileMd("context/positioning.md");
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-ink">Señales y posicionamiento</h1>
      <div>
        <h2 className="text-lg font-bold text-ink mb-2">Posicionamiento (5 pilares + datos)</h2>
        <Card>{positioning ? <Markdown md={positioning} /> : <p className="text-slate">Sin datos.</p>}</Card>
      </div>
      <div>
        <h2 className="text-lg font-bold text-ink mb-2">Señales (research vivo)</h2>
        <Card>{signals ? <Markdown md={signals} /> : <p className="text-slate">Sin datos.</p>}</Card>
      </div>
    </div>
  );
}
