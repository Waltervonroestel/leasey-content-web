import fs from "fs";
import path from "path";
import { runGenerator, GenAction } from "./generators";
import { contentRoot } from "./content";

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

// Persistencia ligera del registro del job a disco, para sobrevivir reinicios
// de la instancia (los resultados completados se recuperan tras un restart).
function jobFile(id: string): string {
  return path.join(contentRoot(), ".jobs", `${id}.json`);
}
function persistJob(job: Job) {
  try {
    fs.mkdirSync(path.dirname(jobFile(job.id)), { recursive: true });
    fs.writeFileSync(jobFile(job.id), JSON.stringify(job));
  } catch {}
}
function loadJob(id: string): Job | undefined {
  try {
    return JSON.parse(fs.readFileSync(jobFile(id), "utf8")) as Job;
  } catch {
    return undefined;
  }
}

// Limpieza: descarta jobs terminados de hace más de 1 hora.
function gc() {
  const cutoff = Date.now() - 60 * 60 * 1000;
  for (const [id, j] of jobs) if (j.finishedAt && j.finishedAt < cutoff) jobs.delete(id);
}

// Cola para generaciones pesadas (Agent SDK): una a la vez, para no reventar
// la memoria de la instancia free (OOM => restart). Las imágenes (sin SDK) no encolan.
let chain: Promise<void> = Promise.resolve();

export function startJob(action: GenAction, label: string, payload: Record<string, unknown>): Job {
  gc();
  const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const job: Job = { id, action, label, status: "running", startedAt: Date.now() };
  jobs.set(id, job);
  persistJob(job);

  const work = async () => {
    try {
      const res = await runGenerator(action, payload);
      job.status = "done";
      job.result = { path: res.path, text: res.text, committed: res.committed, summary: res.summary };
    } catch (e) {
      job.status = "error";
      job.error = String(e instanceof Error ? e.message : e);
    } finally {
      job.finishedAt = Date.now();
      persistJob(job);
    }
  };

  if (action === "generate-image") {
    void work(); // ligero, corre de inmediato
  } else {
    chain = chain.then(work, work); // serializa las generaciones con IA
  }
  return job;
}

export function getJob(id: string): Job | undefined {
  return jobs.get(id) || loadJob(id);
}

export function listJobs(): Job[] {
  return Array.from(jobs.values()).sort((a, b) => b.startedAt - a.startedAt);
}
