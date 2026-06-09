import { runGenerator, GenAction } from "./generators";

export type JobStatus = "running" | "done" | "error";
export interface Job {
  id: string;
  action: GenAction;
  label: string;
  status: JobStatus;
  result?: { path?: string; text?: string; committed?: boolean; summary: string };
  error?: string;
  startedAt: number;
  finishedAt?: number;
}

// Almacén en memoria. Render corre un Node persistente (next start), así que
// los jobs sobreviven la navegación entre tabs. Si la instancia se reinicia se
// pierden, pero el resultado ya se persiste a GitHub, así que el draft no se pierde.
const jobs = new Map<string, Job>();

// Limpieza: descarta jobs terminados de hace más de 1 hora.
function gc() {
  const cutoff = Date.now() - 60 * 60 * 1000;
  for (const [id, j] of jobs) if (j.finishedAt && j.finishedAt < cutoff) jobs.delete(id);
}

export function startJob(action: GenAction, label: string, payload: Record<string, unknown>): Job {
  gc();
  const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const job: Job = { id, action, label, status: "running", startedAt: Date.now() };
  jobs.set(id, job);
  // Fire-and-forget: corre fuera del ciclo de la request.
  (async () => {
    try {
      const res = await runGenerator(action, payload);
      job.status = "done";
      job.result = { path: res.path, text: res.text, committed: res.committed, summary: res.summary };
    } catch (e) {
      job.status = "error";
      job.error = String(e instanceof Error ? e.message : e);
    } finally {
      job.finishedAt = Date.now();
    }
  })();
  return job;
}

export function getJob(id: string): Job | undefined {
  return jobs.get(id);
}

export function listJobs(): Job[] {
  return Array.from(jobs.values()).sort((a, b) => b.startedAt - a.startedAt);
}
