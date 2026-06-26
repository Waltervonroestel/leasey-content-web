"use client";

import { useMemo, useState } from "react";

export type Col<T> = {
  header: string;
  accessor: (row: T) => React.ReactNode;
  raw?: (row: T) => string | number;
  width?: string;
  className?: string;
};
export type Facet<T> = { name: string; getter: (row: T) => string; allLabel?: string };

export default function FilterableTable<T>({
  rows, columns, facets = [], searchableText, emptyText = "No rows.",
}: {
  rows: T[]; columns: Col<T>[]; facets?: Facet<T>[]; searchableText?: (row: T) => string; emptyText?: string;
}) {
  const [q, setQ] = useState("");
  const [picks, setPicks] = useState<Record<string, string>>({});

  const facetValues = useMemo(() => facets.map((f) => {
    const counts = new Map<string, number>();
    for (const r of rows) {
      const v = f.getter(r); if (!v) continue;
      counts.set(v, (counts.get(v) || 0) + 1);
    }
    return { name: f.name, options: [...counts.entries()].sort((a, b) => b[1] - a[1]) };
  }), [rows, facets]);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return rows.filter((r) => {
      for (const f of facets) {
        const pick = picks[f.name]; if (pick && f.getter(r) !== pick) return false;
      }
      if (ql && searchableText && !searchableText(r).toLowerCase().includes(ql)) return false;
      return true;
    });
  }, [rows, facets, picks, q, searchableText]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end gap-3">
        {searchableText && (
          <div className="flex flex-col gap-1">
            <label className="text-[11px] uppercase tracking-wide text-slate">Search</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="title, URL, keyword…"
              className="bg-white border border-line rounded-lg px-2.5 py-1.5 text-sm w-64"
            />
          </div>
        )}
        {facets.map((f, i) => (
          <div key={f.name} className="flex flex-col gap-1">
            <label className="text-[11px] uppercase tracking-wide text-slate">{f.name}</label>
            <select
              value={picks[f.name] ?? ""}
              onChange={(e) => setPicks((p) => ({ ...p, [f.name]: e.target.value }))}
              className="bg-white border border-line rounded-lg px-2 py-1.5 text-sm min-w-[160px]"
            >
              <option value="">{f.allLabel ?? `All ${f.name}`}</option>
              {facetValues[i].options.map(([v, c]) => (
                <option key={v} value={v}>{v} ({c})</option>
              ))}
            </select>
          </div>
        ))}
        <div className="ml-auto text-xs text-slate">
          Showing <span className="text-ink font-medium">{filtered.length}</span> of {rows.length}
        </div>
      </div>

      <div className="overflow-x-auto border border-line rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-bg-soft">
            <tr>
              {columns.map((c, i) => (
                <th key={i} className="text-left px-3 py-2 font-medium text-slate" style={c.width ? { width: c.width } : undefined}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={columns.length} className="text-center text-slate text-sm py-6">{emptyText}</td></tr>
            ) : filtered.map((r, i) => (
              <tr key={i} className="border-t border-line hover:bg-bg-soft/40">
                {columns.map((c, j) => (
                  <td key={j} className={`px-3 py-2 align-top text-ink ${c.className ?? ""}`}>
                    {c.accessor(r)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
