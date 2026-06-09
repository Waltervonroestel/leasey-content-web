import { listDrafts } from "@/lib/content";
import { Card } from "@/components/ui";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function DraftsPage() {
  const drafts = listDrafts();
  const groups = drafts.reduce<Record<string, typeof drafts>>((acc, d) => {
    (acc[d.dateFolder] ||= []).push(d);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Drafts</h1>
        <p className="text-slate text-sm mt-1">{drafts.length} pieces in output/. Not auto-published.</p>
      </div>
      {Object.entries(groups).map(([date, items]) => (
        <div key={date}>
          <h2 className="text-sm font-semibold text-slate mb-2">{date}</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {items.map((d) => (
              <Link key={d.file} href={`/drafts/${encodeURIComponent(d.file)}`}>
                <Card className="hover:border-blue/40 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-ink truncate">{d.name}</span>
                    <span className="text-[11px] text-blue whitespace-nowrap">{d.channel}</span>
                  </div>
                  <p className="text-xs text-slate mt-1.5 line-clamp-2">{d.body.trim().slice(0, 160)}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
