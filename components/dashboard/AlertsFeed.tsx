import { CheckCircle, Play } from "@phosphor-icons/react/ssr";
import type { Alert, Zone } from "@/lib/api";
import { mmss } from "@/lib/format";

export default function AlertsFeed({
  alerts, zones, onSeek,
}: { alerts: Alert[]; zones: Zone[]; onSeek: (t: number) => void }) {
  const sorted = [...alerts].sort((a, b) => a.t - b.t);
  return (
    <section className="surface">
      <h2 className="section-title mb-4">Alerts ({alerts.length})</h2>
      {sorted.length === 0 ? (
        <p className="flex items-center gap-2 text-sm text-accent">
          <CheckCircle size={18} aria-hidden />
          No alerts. Every visitor was attended on time.
        </p>
      ) : (
        <ul className="space-y-2">
          {sorted.map((a, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => onSeek(a.t)}
                className="group flex w-full items-start gap-3 rounded-media border border-warn/20 bg-warn/5 p-3 text-left transition duration-200 hover:bg-warn/10 active:scale-[0.99]"
              >
                <span className="shrink-0 rounded-full bg-warn/15 px-2 py-0.5 font-mono text-xs text-warn tabular-nums">{mmss(a.t)}</span>
                <span className="text-sm">
                  {a.message}
                  <span className="mt-1 flex items-center gap-1 text-xs text-muted">
                    {zones.find((z) => z.id === a.zone_id)?.label ?? a.zone_id}
                    <Play size={10} weight="fill" className="ml-1 opacity-60 group-hover:opacity-100" aria-hidden />
                    <span className="sr-only">Watch this moment</span>
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
