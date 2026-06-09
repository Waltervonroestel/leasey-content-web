import { NextResponse } from "next/server";
import { startJob, getJob, listJobs } from "@/lib/jobs";
import type { GenAction } from "@/lib/generators";

export const runtime = "nodejs";
export const maxDuration = 300;

// POST: lanza un job en background, responde de inmediato con el id.
export async function POST(req: Request) {
  try {
    const { action, label, payload } = await req.json();
    if (!action) return NextResponse.json({ error: "action required" }, { status: 400 });
    const job = startJob(action as GenAction, label || action, payload || {});
    return NextResponse.json({ id: job.id, status: job.status, label: job.label });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// GET ?id=... -> estado de un job. GET sin id -> lista de jobs (para reconciliar).
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  if (id) {
    const job = getJob(id);
    if (!job) return NextResponse.json({ status: "gone" }, { status: 404 });
    return NextResponse.json(job);
  }
  return NextResponse.json({ jobs: listJobs() });
}
