"use client";
import { useState } from "react";

interface Props {
  endpoint: string;
  payload?: Record<string, unknown>;
  label: string;
  busyLabel?: string;
  variant?: "primary" | "ghost";
  onDone?: (data: unknown) => void;
}

export default function ActionButton({ endpoint, payload, label, busyLabel = "Working...", variant = "primary", onDone }: Props) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState(false);

  async function run() {
    setBusy(true);
    setMsg(null);
    setErr(false);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload || {}),
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(true);
        setMsg(data.error || `Error ${res.status}`);
      } else {
        setMsg(data.path ? `Saved: ${data.path}${data.committed ? " (committed)" : ""}` : "Done");
        onDone?.(data);
      }
    } catch (e) {
      setErr(true);
      setMsg(String(e));
    } finally {
      setBusy(false);
    }
  }

  const base =
    variant === "primary"
      ? "bg-blue text-white hover:bg-blue-hover"
      : "border border-line text-ink hover:bg-bg-2";

  return (
    <span className="inline-flex items-center gap-2">
      <button onClick={run} disabled={busy} className={`text-sm px-3 py-1.5 rounded-md font-medium disabled:opacity-50 ${base}`}>
        {busy ? busyLabel : label}
      </button>
      {msg && <span className={`text-xs ${err ? "text-red-600" : "text-teal"}`}>{msg}</span>}
    </span>
  );
}
