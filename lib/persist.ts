import fs from "fs";
import path from "path";
import { contentRoot } from "./content";

// Guarda un archivo dentro de content/. En local persiste en disco.
// En Render (FS efímero), si GIT_PERSIST_TOKEN + GIT_PERSIST_REPO están seteados,
// además commitea el archivo al repo vía GitHub API para que sobreviva el redeploy.
export async function saveContentFile(relPath: string, data: Buffer | string): Promise<{ saved: boolean; committed: boolean; path: string }> {
  const full = path.join(contentRoot(), relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, data);

  let committed = false;
  const token = process.env.GIT_PERSIST_TOKEN;
  const repo = process.env.GIT_PERSIST_REPO; // ej. "Waltervonroestel/leasey-content-web"
  const branch = process.env.GIT_PERSIST_BRANCH || "main";
  if (token && repo) {
    try {
      committed = await commitToGitHub(token, repo, branch, `content/${relPath}`, data);
    } catch (e) {
      console.error("git persist failed:", e);
    }
  }
  return { saved: true, committed, path: relPath };
}

async function commitToGitHub(token: string, repo: string, branch: string, repoPath: string, data: Buffer | string): Promise<boolean> {
  const apiBase = `https://api.github.com/repos/${repo}/contents/${repoPath}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "leasey-content-web",
  };
  // ¿Existe ya? necesitamos el sha para actualizar.
  let sha: string | undefined;
  const getRes = await fetch(`${apiBase}?ref=${branch}`, { headers });
  if (getRes.ok) {
    const j = (await getRes.json()) as { sha?: string };
    sha = j.sha;
  }
  const content = Buffer.isBuffer(data) ? data.toString("base64") : Buffer.from(data, "utf8").toString("base64");
  const putRes = await fetch(apiBase, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    // "[skip render]" evita que el commit dispare un redeploy en Render,
    // que reiniciaría la instancia y borraría los jobs en memoria en curso.
    body: JSON.stringify({ message: `[auto][skip render] update ${repoPath}`, content, branch, sha }),
  });
  return putRes.ok;
}

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}
