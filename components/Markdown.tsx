import { marked } from "marked";

export default function Markdown({ md }: { md: string }) {
  const html = marked.parse(md) as string;
  return <div className="prose-leasey" dangerouslySetInnerHTML={{ __html: html }} />;
}
