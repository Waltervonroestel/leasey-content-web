import { runClaude, hasToken } from "./claude";
import { systemPrompt } from "./prompt";
import { listInsights, readFileMd, getDraft } from "./content";
import { saveContentFile, today } from "./persist";
import { renderImage, ImageSpec } from "./image";

export type GenAction =
  | "generate-post"
  | "write-blog"
  | "generate-pr"
  | "refresh-insights"
  | "refresh-directory"
  | "generate-image";

export interface GenResult {
  ok: true;
  path?: string;
  text?: string;
  committed?: boolean;
  summary: string;
}

const TOKEN_MSG =
  "Text generation needs CLAUDE_CODE_OAUTH_TOKEN. Add it as an env var in Render (generate it with `claude setup-token`).";

function needsToken(action: GenAction): boolean {
  return action !== "generate-image";
}

const VOICE_GUIDE: Record<string, string> = {
  carlos: "Voice: Carlos Leal (COO). Direct opener, short paragraphs, founder observation. First person.",
  juan: "Voice: Juan Leal (CEO/CPO). Technical precision, ~60 words, lead with a product or industry datapoint.",
  company: "Voice: Leasey.AI company page. Institutional but direct, 'we' not 'I'.",
  blog: "Operator-facing blog post, 400-800 words, hook in first two sentences, one internal link, demo CTA.",
};

function briefFromDraft(body: string, name: string, kind: string): ImageSpec {
  const heroMatch = body.match(/\b(\d{1,3}(?:\.\d+)?%|\+\d{1,3}%|\$\d[\d,]*)/);
  const hero = heroMatch ? heroMatch[1] : undefined;
  const srcMatch = body.match(/(?:according to|per|Source:?)\s+([^.,\n]{3,50})/);
  const source = srcMatch ? `Source: ${srcMatch[1].trim()}` : undefined;
  const firstLine =
    body.split("\n").map((l) => l.trim()).find((l) => l && !l.startsWith("#") && !l.startsWith("---") && !/^[A-Za-z ]+:/.test(l)) || name;
  const eyebrow = /linkedin/i.test(name) ? "LinkedIn" : /blog/i.test(name) ? "Blog" : "Leasey.AI";
  return { kind: (kind as ImageSpec["kind"]) || "hero", title: firstLine.slice(0, 120), eyebrow, heroNumber: hero, source };
}

const slug = (s: string) => String(s).replace(/[^a-z0-9]+/gi, "-").toLowerCase().slice(0, 50);

export async function runGenerator(action: GenAction, payload: Record<string, unknown>): Promise<GenResult> {
  if (needsToken(action) && !hasToken()) throw new Error(TOKEN_MSG);

  switch (action) {
    case "generate-post": {
      const { topic, voice = "company", channel = "LinkedIn" } = payload as { topic: string; voice?: string; channel?: string };
      const out = await runClaude({
        system: systemPrompt(VOICE_GUIDE[voice] || ""),
        prompt: `Write a ${channel} piece about: ${topic}. Follow all system rules (English, no em-dashes, insight-led with attribution, soft demo CTA). Output only the final piece, no preamble.`,
      });
      const rel = `output/${today()}/generated-${voice}-${slug(topic)}.md`;
      const file = `Generated via dashboard\nVoice: ${voice} | Channel: ${channel}\nStatus: DRAFT, run editor-qa\n\n---\n\n${out}`;
      const res = await saveContentFile(rel, file);
      return { ok: true, path: rel, text: out, committed: res.committed, summary: `Post drafted: ${rel}` };
    }
    case "write-blog": {
      const { insightId } = payload as { insightId: string };
      const insight = listInsights().find((i) => i.id === insightId);
      if (!insight) throw new Error("insight not found");
      const out = await runClaude({
        system: systemPrompt("Operator-facing blog post, 400-800 words, hook in first two sentences, one internal link to a Leasey service/tool page, demo CTA. Insight-led with the source named in the text."),
        prompt: `Write a blog post built on this insight:\n\nTitle: ${insight.title}\n\nDetails:\n${insight.body}\n\nLead with the datapoint and its source, develop the operator problem, connect to a Leasey positioning pillar, end with a demo CTA. Output only the final post in Markdown, starting with an SEO title line.`,
      });
      const rel = `output/${today()}/blog-${insight.id}-${slug(insight.title)}.md`;
      const file = `Generated from insight ${insight.id}\nStatus: DRAFT, run editor-qa\n\n---\n\n${out}`;
      const res = await saveContentFile(rel, file);
      return { ok: true, path: rel, text: out, committed: res.committed, summary: `Blog drafted from ${insight.id}` };
    }
    case "generate-pr": {
      const { topic, outlet } = payload as { topic: string; outlet?: string };
      const out = await runClaude({
        system: systemPrompt("Press release. Inverted pyramid: headline + subhead, dateline (New York/Vancouver/Toronto), lead paragraph, market context with a sourced datapoint, detail anchored to a real client, founder quote (Juan for product/tech, Carlos for strategy), boilerplate About Leasey.AI, press contact [VERIFY]. English, no em-dashes."),
        prompt: `Write a press release about: ${topic}.${outlet ? ` Target outlet: ${outlet}.` : ""} For unconfirmed partnerships, mark [VERIFY partnership status]. Output only the press release.`,
      });
      const rel = `output/${today()}/press-release-${slug(topic)}.md`;
      const file = `Generated press release\nTarget: ${outlet || "general"}\nStatus: DRAFT, run editor-qa\n\n---\n\n${out}`;
      const res = await saveContentFile(rel, file);
      return { ok: true, path: rel, text: out, committed: res.committed, summary: `Press release drafted: ${rel}` };
    }
    case "refresh-insights": {
      const current = readFileMd("context/signals.md") || "";
      const out = await runClaude({
        system: systemPrompt("You are the news-researcher. Find FRESH insights (last 30-60 days) on PropTech, leasing automation, AI in real estate, rent regulation and vacancy in Canada/US, and competitor moves. Each insight: title, source URL + date, why it matters to property managers, suggested content angle, Leasey connection. English. No invented numbers."),
        prompt: `Search the web for fresh, relevant insights for Leasey.AI. Return 3 to 5 NEW insights NOT already covered below, formatted as Markdown sections like '### N9. Title' with source URLs. Do not repeat existing ones.\n\nEXISTING:\n${current.slice(0, 6000)}`,
        allowedTools: ["WebSearch", "WebFetch"],
      });
      const updated = current.includes("## Competitors")
        ? current.replace("## Competitors", `${out.trim()}\n\n## Competitors`)
        : `${current.trim()}\n\n${out.trim()}\n`;
      const res = await saveContentFile("context/signals.md", updated);
      return { ok: true, text: out, committed: res.committed, summary: "Insights refreshed" };
    }
    case "refresh-directory": {
      const { kind } = payload as { kind: string };
      const isPm = kind === "pm";
      const rel = isPm ? "context/distribution/pm-publications.md" : "context/distribution/subreddits.md";
      const current = readFileMd(rel) || "";
      const task = isPm
        ? "Find property management / multifamily publications that accept press releases or guest posts. For each: name, URL, what they accept, and what Leasey should write there (PR vs thought-leadership)."
        : "Find subreddits relevant to property management, landlords, multifamily and real estate investing. For each: name, audience, rules on self-promotion, and what Leasey should write there (value-first, no hard pitch).";
      const out = await runClaude({
        system: systemPrompt("You are the distribution researcher. English, factual, with real URLs. No invented outlets."),
        prompt: `${task}\n\nReturn an updated Markdown directory, keeping useful existing entries and adding new ones with sources. Current file:\n\n${current.slice(0, 6000)}`,
        allowedTools: ["WebSearch", "WebFetch"],
      });
      const res = await saveContentFile(rel, out.trim() + "\n");
      return { ok: true, path: rel, committed: res.committed, summary: `${isPm ? "PM outlets" : "Subreddits"} directory refreshed` };
    }
    case "generate-image": {
      const { file, kind = "hero", title, heroNumber, source, eyebrow, subtitle } = payload as Record<string, string>;
      let spec: ImageSpec;
      if (file) {
        const draft = getDraft(file);
        if (!draft) throw new Error("draft not found");
        spec = briefFromDraft(draft.body, draft.name, kind);
      } else {
        spec = { kind: kind as ImageSpec["kind"], title: title || "Leasey.AI", heroNumber, source, eyebrow, subtitle };
      }
      const png = await renderImage(spec);
      const base = (file ? file.split(/[\\/]/).pop()!.replace(/\.md$/, "") : title || "image");
      const rel = `output/${today()}/img/${slug(base)}-${kind}.png`;
      const res = await saveContentFile(rel, png);
      return { ok: true, path: rel, committed: res.committed, summary: `Image rendered: ${rel}` };
    }
    default:
      throw new Error("unknown action");
  }
}
