"use client";
import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";

export interface TrackedJob {
  id: string;
  label: string;
  status: "running" | "done" | "error";
  summary?: string;
  path?: string;
  error?: string;
  startedAt: number;
  misses?: number;
}

interface Ctx {
  jobs: TrackedJob[];
  start: (action: string, label: string, payload: Record<string, unknown>) => Promise<void>;
  clearDone: () => void;
}

const JobsContext = createContext<Ctx | null>(null);
export const useJobs = () => {
  const c = useContext(JobsContext);
  if (!c) throw new Error("useJobs must be used within JobsProvider");
  return c;
};

const LS_KEY = "leasey_jobs";
const MAX_MISSES = 6; // ~18s de 404 seguidos => asumimos reinicio de instancia

export default function JobsProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<TrackedJob[]>([]);
  const [, force] = useState(0);
  const seeded = useRef(false);

  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setJobs(JSON.parse(raw));
    } catch {}
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(jobs.slice(0, 30)));
    } catch {}
  }, [jobs]);

  const notify = useCallback((title: string, body: string) => {
    try {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, { body });
      }
    } catch {}
  }, []);

  // Tick para el contador de tiempo transcurrido.
  useEffect(() => {
    const hasRunning = jobs.some((j) => j.status === "running");
    if (!hasRunning) return;
    const t = setInterval(() => force((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, [jobs]);

  // Polling de jobs en running.
  useEffect(() => {
    const running = jobs.filter((j) => j.status === "running");
    if (running.length === 0) return;

    let cancelled = false;
    async function pollOnce() {
      for (const j of running) {
        try {
          const res = await fetch(`/api/jobs?id=${j.id}`, { cache: "no-store" });
          if (res.status === 404) {
            setJobs((prev) =>
              prev.map((p) => {
                if (p.id !== j.id) return p;
                const misses = (p.misses || 0) + 1;
                if (misses >= MAX_MISSES) {
                  notify("Task interrupted", "The server restarted. Check Drafts, and retry if needed.");
                  return { ...p, status: "error", error: "Server restarted during the task. Check Drafts, or retry.", misses };
                }
                return { ...p, misses };
              })
            );
            continue;
          }
          const data = await res.json();
          if (data.status === "done" || data.status === "error") {
            if (cancelled) return;
            setJobs((prev) =>
              prev.map((p) =>
                p.id === j.id
                  ? { ...p, status: data.status, summary: data.result?.summary, path: data.result?.path, error: data.error, misses: 0 }
                  : p
              )
            );
            notify(
              data.status === "done" ? "Task complete" : "Task failed",
              data.status === "done" ? data.result?.summary || j.label : data.error || j.label
            );
          }
        } catch {}
      }
    }
    pollOnce(); // poll inmediato
    const t = setInterval(pollOnce, 3000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [jobs, notify]);

  const start = useCallback(async (action: string, label: string, payload: Record<string, unknown>) => {
    const optimistic: TrackedJob = { id: `tmp-${Date.now()}`, label, status: "running", startedAt: Date.now() };
    setJobs((prev) => [optimistic, ...prev]);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, label, payload }),
      });
      const data = await res.json();
      if (!res.ok) {
        setJobs((prev) => prev.map((p) => (p.id === optimistic.id ? { ...p, status: "error", error: data.error } : p)));
        return;
      }
      setJobs((prev) => prev.map((p) => (p.id === optimistic.id ? { ...p, id: data.id } : p)));
    } catch (e) {
      setJobs((prev) => prev.map((p) => (p.id === optimistic.id ? { ...p, status: "error", error: String(e) } : p)));
    }
  }, []);

  const clearDone = useCallback(() => setJobs((prev) => prev.filter((j) => j.status === "running")), []);

  return (
    <JobsContext.Provider value={{ jobs, start, clearDone }}>
      {children}
      <TasksWidget />
    </JobsContext.Provider>
  );
}

function elapsed(startedAt: number): string {
  const s = Math.floor((Date.now() - startedAt) / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function TasksWidget() {
  const { jobs, clearDone } = useJobs();
  const [open, setOpen] = useState(false);
  const running = jobs.filter((j) => j.status === "running").length;
  if (jobs.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div className="mb-2 w-80 max-h-96 overflow-auto bg-white border border-line rounded-xl shadow-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-ink">Tasks</span>
            <button onClick={clearDone} className="text-xs text-blue hover:text-blue-hover">Clear done</button>
          </div>
          <div className="flex flex-col gap-2">
            {jobs.map((j) => (
              <div key={j.id} className="text-xs border border-line rounded-md p-2">
                <div className="flex items-center gap-2">
                  <span className={j.status === "running" ? "text-blue" : j.status === "done" ? "text-teal" : "text-red-600"}>
                    {j.status === "running" ? "●" : j.status === "done" ? "✓" : "✕"}
                  </span>
                  <span className="text-ink font-medium truncate flex-1">{j.label}</span>
                  {j.status === "running" && <span className="text-slate tabular-nums">{elapsed(j.startedAt)}</span>}
                </div>
                {j.status === "done" && j.path && <div className="text-slate mt-1 truncate">Saved: {j.path}</div>}
                {j.status === "done" && !j.path && j.summary && <div className="text-slate mt-1">{j.summary}</div>}
                {j.status === "error" && <div className="text-red-600 mt-1">{j.error}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="bg-ink text-white text-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
      >
        <span className={running > 0 ? "animate-pulse" : ""}>{running > 0 ? `${running} running` : "Tasks"}</span>
      </button>
    </div>
  );
}
