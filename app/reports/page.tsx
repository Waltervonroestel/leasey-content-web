import Reports from "@/components/Reports";

export const dynamic = "force-dynamic";

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-2xl font-bold text-ink">Reports</h1>
      <p className="text-slate text-sm">
        Search opportunities from Google Search Console. Each row can become a blog with one click.
      </p>
      <Reports />
    </div>
  );
}
