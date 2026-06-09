"use client";
import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";

export interface TrackedJob {
  id: string;
  label: string;
  status: "running" | "done" | "error";
  summary?: string;
  path?: string;
  error?: string;
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

export default function JobsProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<TrackedJob[]>([]);
  const seeded = useRef(false);

  // Carga jobs guardados (sobreviven recarga de página).
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

  // Persiste en localStorage.
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(jobs.slice(0, 30)));
    } catch {}
  }, [jobs]);

  const notify = useCallback((j: TrackedJob) => {
    try {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(j.status === "done" ? "Task complete" : "Task failed", {
          body: j.status === "done" ? j.summary || j.label : j.error || j.label,
        });
      }
    } catch {}
  }, []);

  // Polling de jobs en running.
  useEffect(() => {
    const running = jobs.filter((j) => j.status === "running");
    if (running.length === 0) return;
    const t = setInterval(async () => {
      for (const j of running) {
        try {
          const res = await fetch(`/api/jobs?id=${j.id}`);
          if (res.status === 404) continue;
          const data = await res.json();
          if (data.status === "done" || data.status === "error") {
            setJobs((prev) =>
              prev.map((p) =>
                p.id === j.id
                  ? { ...p, status: data.status, summary: data.result?.summary, path: data.result?.path, error: data.error }
                  : p
              )
            );
            notify({ ...j, status: data.status, summary: data.result?.summary, path: data.result?.path, error: data.error });
          }
        } catch {}
      }
    }, 4000);
    return () => clearInterval(t);
  }, [jobs, notify]);

  const start = useCallback(async (action: string, label: string, payload: Record<string, unknown>) => {
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, label, payload }),
    });
    const data = await res.json();
    if (!res.ok) {
      setJobs((prev) => [{ id: `err-${Date.now()}`, label, status: "error", error: data.error }, ...prev]);
      return;
    }
    setJobs((prev) => [{ id: data.id, label, status: "running" }, ...prev]);
  }, []);

  const clearDone = useCallback(() => setJobs((prev) => prev.filter((j) => j.status === "running")), []);

  return (
    <JobsContext.Provider value={{ jobs, start, clearDone }}>
      {children}
      <TasksWidget />
    </JobsContext.Provider>
  );
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
                  <span className={
                    j.status === "running" ? "text-blue" : j.status === "done" ? "text-teal" : "text-red-600"
                  }>
                    {j.status === "running" ? "●" : j.status === "done" ? "✓" : "✕"}
                  </span>
                  <span className="text-ink font-medium truncate">{j.label}</span>
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
        <span className={running > 0 ? "animate-pulse" : ""}>
          {running > 0 ? `${running} running` : "Tasks"}
        </span>
      </button>
    </div>
  );
}
