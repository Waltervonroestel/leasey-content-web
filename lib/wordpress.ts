// WordPress REST API client. Uses Application Passwords (Basic Auth).
// All credentials live in env vars — never imported, never logged.

import { marked } from "marked";

export const hasWordpress = (): boolean =>
  Boolean(process.env.WORDPRESS_URL && process.env.WORDPRESS_USER && process.env.WORDPRESS_APP_PASSWORD);

function baseUrl(): string {
  return (process.env.WORDPRESS_URL || "").replace(/\/$/, "");
}

function authHeader(): string {
  const u = process.env.WORDPRESS_USER || "";
  const p = (process.env.WORDPRESS_APP_PASSWORD || "").replace(/\s+/g, ""); // WP accepts with or without spaces
  return "Basic " + Buffer.from(`${u}:${p}`).toString("base64");
}

async function wp<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${baseUrl()}/wp-json/wp/v2${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "Authorization": authHeader(),
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`WordPress ${res.status}: ${text.slice(0, 300)}`);
  }
  try { return JSON.parse(text) as T; } catch { return text as unknown as T; }
}

export interface WpUser {
  id: number; name: string; slug: string; description: string;
  url: string; link: string;
}

export async function getCurrentUser(): Promise<WpUser> {
  return wp<WpUser>("/users/me?context=edit");
}

export interface WpPost {
  id: number; status: string; link: string;
  title: { rendered: string }; date: string;
}

export interface PublishInput {
  title: string;
  content: string;        // markdown or HTML
  excerpt?: string;
  status?: "draft" | "publish" | "pending";
  isMarkdown?: boolean;   // default true
  categoryIds?: number[];
  tagIds?: number[];
}

export async function publishPost(input: PublishInput): Promise<WpPost> {
  const html = input.isMarkdown !== false ? (marked.parse(input.content) as string) : input.content;
  const body: Record<string, unknown> = {
    title: input.title,
    content: html,
    status: input.status || "draft", // default to draft so user reviews in WP
  };
  if (input.excerpt) body.excerpt = input.excerpt;
  if (input.categoryIds && input.categoryIds.length) body.categories = input.categoryIds;
  if (input.tagIds && input.tagIds.length) body.tags = input.tagIds;
  return wp<WpPost>("/posts", { method: "POST", body: JSON.stringify(body) });
}

export interface WpTerm { id: number; name: string; slug: string }
export async function listCategories(): Promise<WpTerm[]> { return wp<WpTerm[]>("/categories?per_page=100"); }
export async function listTags(): Promise<WpTerm[]> { return wp<WpTerm[]>("/tags?per_page=100"); }

export interface DraftListItem {
  id: number; title: string; status: string;
  link: string; date: string; modified: string;
}
export async function listRecentDrafts(limit = 10): Promise<DraftListItem[]> {
  const posts = await wp<(WpPost & { modified: string })[]>(`/posts?status=draft&per_page=${limit}&context=edit`);
  return posts.map((p) => ({
    id: p.id, title: p.title.rendered, status: p.status,
    link: p.link, date: p.date, modified: p.modified,
  }));
}
