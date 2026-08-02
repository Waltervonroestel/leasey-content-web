"use client";

import { useState } from "react";
import { Download, CheckCircle } from "lucide-react";

interface Props {
  title: string;
  description: string;
  resourceLabel?: string;
  buttonText?: string;
}

export default function LeadMagnet({
  title,
  description,
  resourceLabel = "Free PDF",
  buttonText = "Download now",
}: Props) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="my-8 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-6 text-center">
        <CheckCircle size={32} className="mx-auto text-emerald-600 mb-3" />
        <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Check your inbox</p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          We sent the resource to <strong>{email}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="my-8 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6">
      <div className="flex items-center gap-2 mb-2">
        <Download size={16} className="text-emerald-600" />
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-mono">
          {resourceLabel}
        </span>
      </div>
      <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{title}</p>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 mb-4">{description}</p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="operator@company.com"
          aria-label="Email address"
          className="flex-1 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-emerald-600 text-white font-semibold text-sm px-5 py-2.5 hover:bg-emerald-700 transition-colors"
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
}
