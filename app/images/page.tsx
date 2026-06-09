import { listImages } from "@/lib/content";
import { Card } from "@/components/ui";

export const dynamic = "force-dynamic";

export default function ImagesPage() {
  const images = listImages();
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-ink">Imágenes generadas</h1>
      <p className="text-slate text-sm">
        Portadas, gráficos de dato y carruseles renderizados por el agente image-maker (node + sharp).
      </p>
      {images.length === 0 ? (
        <Card>
          <p className="text-slate text-sm">
            Aún no hay imágenes. Genera una con <code className="px-1 bg-bg-2 rounded">/image-brief</code> en el
            sistema de agentes, luego corre <code className="px-1 bg-bg-2 rounded">npm run sync</code>.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img) => (
            <Card key={img} className="p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/img?path=${encodeURIComponent(img)}`}
                alt={img}
                className="w-full h-auto rounded-md border border-line"
              />
              <p className="text-[11px] text-slate mt-2 truncate">{img.replace("output/", "")}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
