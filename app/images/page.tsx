import { listImages } from "@/lib/content";
import { Card } from "@/components/ui";

export const dynamic = "force-dynamic";

export default function ImagesPage() {
  const images = listImages();
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-ink">Generated images</h1>
      <p className="text-slate text-sm">
        Covers, data cards and carousel slides rendered on the page (node + sharp). The brief is built
        internally from each draft. Generate them from any draft’s page.
      </p>
      {images.length === 0 ? (
        <Card>
          <p className="text-slate text-sm">
            No images yet. Open a draft and click a “Generate image” button.
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
