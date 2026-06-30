"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui";

interface WpDraft { id: number; title: string; status: string; link: string; date: string; modified: string }
interface Status {
  connected: boolean;
  user?: { name: string; slug: string };
  url?: string;
  drafts?: WpDraft[];
  error?: string;
}

export default function PublishView() {
  const [status, setStatus] = useState<Status | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [isMarkdown, setIsMarkdown] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [result, setResult] = useState<{ link: string; id: number } | null>(null);
  const [error, setError] = useState<string>("");

  const loadStatus = () =>
    fetch("/api/wordpress/status").then((r) => r.json()).then(setStatus).catch((e) => setStatus({ connected: false, error: String(e) }));

  useEffect(() => { loadStatus(); }, []);

  async function publish() {
    if (!title.trim() || !content.trim()) return;
    setPublishing(true); setError(""); setResult(null);
    try {
      const r = await fetch("/api/wordpress/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), content, excerpt: excerpt.trim() || undefined, isMarkdown }),
      });
      const d = await r.json();
      if (d.error) setError(d.error);
      else if (d.post) {
        setResult({ link: d.post.link, id: d.post.id });
        setTitle(""); setContent(""); setExcerpt("");
        await loadStatus();
      }
    } catch (e) { setError(String(e)); } finally { setPublishing(false); }
  }

  if (!status) return <p className="text-slate text-sm">Conectando con WordPress…</p>;
  if (!status.connected) return (
    <Card>
      <p className="text-sm text-slate mb-2">WordPress no está configurado en este entorno.</p>
      <p className="text-xs text-slate">Agrega estas variables en Render para activar:</p>
      <ul className="text-xs text-slate mt-1 list-disc pl-5">
        <li><code>WORDPRESS_URL</code></li>
        <li><code>WORDPRESS_USER</code></li>
        <li><code>WORDPRESS_APP_PASSWORD</code></li>
      </ul>
      {status.error && <p className="text-xs text-rose-600 mt-2">Error: {status.error}</p>}
    </Card>
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Publicar a WordPress</h1>
        <p className="text-slate text-sm mt-1">
          Conectado a <a href={status.url} target="_blank" rel="noreferrer" className="text-blue hover:underline">{status.url}</a> como <span className="text-ink font-medium">{status.user?.name}</span>.
          Los posts se publican siempre como <span className="text-ink font-medium">borrador</span> — los revisas en WP-admin antes de hacerlos públicos.
        </p>
      </div>

      {/* Composer */}
      <Card>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-[10px] uppercase tracking-wide text-slate">Título</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="The Canadian Operator's Guide to Faster Lease-up…"
              className="w-full mt-1 px-3 py-2 border border-line rounded-lg text-sm bg-white placeholder:text-slate focus:outline-none focus:border-ink/40"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wide text-slate">Excerpt (opcional)</label>
            <input
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Una frase para el preview en redes y SEO."
              className="w-full mt-1 px-3 py-2 border border-line rounded-lg text-sm bg-white placeholder:text-slate focus:outline-none focus:border-ink/40"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] uppercase tracking-wide text-slate">Contenido</label>
              <label className="text-[10px] text-slate flex items-center gap-1.5">
                <input type="checkbox" checked={isMarkdown} onChange={(e) => setIsMarkdown(e.target.checked)} className="accent-blue" />
                Markdown ({isMarkdown ? "se convierte a HTML" : "HTML crudo"})
              </label>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={isMarkdown ? "## Intro\n\nWrite the post in markdown — `marked` converts it to HTML before pushing to WordPress." : "<p>HTML crudo si prefieres pegarlo formateado.</p>"}
              rows={16}
              className="w-full mt-1 px-3 py-2 border border-line rounded-lg text-sm font-mono bg-white placeholder:text-slate focus:outline-none focus:border-ink/40 resize-y"
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={publish}
              disabled={!title.trim() || !content.trim() || publishing}
              className="px-4 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:bg-ink/80 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {publishing ? (
                <><span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Publicando…</>
              ) : (
                <>📝 Publicar como borrador</>
              )}
            </button>
            <span className="text-xs text-slate">Quedará como draft en WP. No se publica al público desde acá.</span>
          </div>

          {error && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}
          {result && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 flex items-center justify-between gap-3 flex-wrap">
              <span>✓ Borrador creado en WordPress (id #{result.id}).</span>
              <a href={result.link} target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline font-medium">Abrir en WP-admin →</a>
            </div>
          )}
        </div>
      </Card>

      {/* Recent drafts */}
      {status.drafts && status.drafts.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-ink mb-3">Borradores recientes en WordPress ({status.drafts.length})</h2>
          <div className="grid gap-2">
            {status.drafts.map((d) => (
              <a key={d.id} href={d.link} target="_blank" rel="noreferrer" className="block">
                <div className="rounded-xl border border-line bg-white px-4 py-3 flex items-center gap-3 flex-wrap hover:border-ink/30 transition-colors">
                  <span className="text-[10px] font-mono text-slate">#{d.id}</span>
                  <span className="text-sm text-ink font-medium flex-1 min-w-0 truncate" dangerouslySetInnerHTML={{ __html: d.title || "(sin título)" }} />
                  <span className="text-[10px] text-slate">modificado {d.modified.slice(0, 10)}</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
