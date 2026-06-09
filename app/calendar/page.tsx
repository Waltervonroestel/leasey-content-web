import { listCalendarSlots } from "@/lib/content";
import { Card, Badge } from "@/components/ui";
import ActionButton from "@/components/ActionButton";

export const dynamic = "force-dynamic";

function voiceKey(voice: string): string {
  const v = voice.toLowerCase();
  if (v.includes("carlos")) return "carlos";
  if (v.includes("juan")) return "juan";
  if (v.includes("empresa") || v.includes("company")) return "company";
  if (v.includes("changelog")) return "company";
  return "blog";
}

export default function CalendarPage() {
  const slots = listCalendarSlots();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold text-ink">Editorial Calendar</h1>
        <p className="text-slate text-sm mt-1">90-day plan. Click “Generate” to draft any slot. Drafts land in output and are not auto-published.</p>
      </div>

      {slots.length === 0 ? (
        <Card><p className="text-slate text-sm">No calendar slots parsed. Run /content-calendar in the agent system.</p></Card>
      ) : (
        <div className="grid gap-2">
          {slots.map((s, i) => (
            <Card key={i} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge label={s.channel} />
                  <span className="text-xs text-slate">{s.date}</span>
                  <span className="text-xs text-blue">{s.voice}</span>
                </div>
                <p className="text-sm text-ink mt-1 truncate">{s.topic}</p>
              </div>
              <ActionButton
                endpoint="/api/generate-post"
                payload={{ topic: s.topic, voice: voiceKey(s.voice), channel: s.channel }}
                label="Generate"
                busyLabel="Writing..."
              />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
