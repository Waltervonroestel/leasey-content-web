"use client";
import { useState } from "react";
import { useJobs } from "./JobsProvider";

interface Props {
  // Acción del job (generate-post, write-blog, generate-pr, refresh-insights, refresh-directory, generate-image)
  action: string;
  payload?: Record<string, unknown>;
  label: string;
  taskLabel?: string;
  variant?: "primary" | "ghost";
}

export default function ActionButton({ action, payload, label, taskLabel, variant = "primary" }: Props) {
  const { start } = useJobs();
  const [launched, setLaunched] = useState(false);

  async function run() {
    await start(action, taskLabel || label, payload || {});
    setLaunched(true);
    setTimeout(() => setLaunched(false), 2500);
  }

  const base =
    variant === "primary"
      ? "bg-blue text-white hover:bg-blue-hover"
      : "border border-line text-ink hover:bg-bg-2";

  return (
    <span className="inline-flex items-center gap-2">
      <button onClick={run} className={`text-sm px-3 py-1.5 rounded-md font-medium ${base}`}>
        {label}
      </button>
      {launched && <span className="text-xs text-teal">Started, runs in background</span>}
    </span>
  );
}
