"use client";
import { createContext, useContext } from "react";

// Hibrido: la generacion vive en Claude Code. El JobsProvider queda como stub
// para no romper imports; no muestra widget de tareas ni hace polling.

interface Ctx {
  jobs: never[];
  start: (action: string, label: string, payload: Record<string, unknown>) => Promise<void>;
  clearDone: () => void;
}

const JobsContext = createContext<Ctx>({
  jobs: [],
  start: async () => {},
  clearDone: () => {},
});

export const useJobs = () => useContext(JobsContext);

export default function JobsProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
