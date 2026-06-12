import { readFileMd } from "@/lib/content";
import { Card } from "@/components/ui";
import Markdown from "@/components/Markdown";
import ActionButton from "@/components/ActionButton";

export const dynamic = "force-dynamic";

export default function RedditPage() {
  const directory = readFileMd("context/distribution/subreddits.md");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Reddit</h1>
          <p className="text-slate text-sm mt-1">Mapped subreddits and what to write in each. Value first, never a hard pitch. The map refreshes from Claude Code.</p>
        </div>
      </div>
      <Card>
        {directory ? <Markdown md={directory} /> : <p className="text-slate">No subreddit map yet. Click “Search subreddits”.</p>}
      </Card>
    </div>
  );
}
