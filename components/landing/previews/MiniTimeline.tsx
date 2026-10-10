import type { EventType } from "@/lib/api";
import { EXAMPLE_DURATION_S, EXAMPLE_EVENTS } from "@/lib/example";
import { EVENT_STYLE } from "@/lib/format";

const LANES: EventType[] = ["stop", "circle", "door_open", "approach", "alert", "unattended_exit"];

export default function MiniTimeline() {
  const pct = (t: number) => (t / EXAMPLE_DURATION_S) * 100;
  return (
    <figure className="space-y-1.5" aria-label="Example event timeline">
      {LANES.map((type) => {
        const st = EVENT_STYLE[type];
        return (
          <div key={type} className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-3">
            <span className="truncate text-[11px] text-muted">{st.label}</span>
            <div className="relative h-5 rounded-[4px] bg-white/[0.03]">
              {EXAMPLE_EVENTS.filter((e) => e.type === type).map((e, i) => (
                <span
                  key={i}
                  className="absolute inset-y-0 rounded-[3px]"
                  style={{
                    left: `${pct(e.t_start)}%`,
                    width: `max(${pct(e.t_end) - pct(e.t_start)}%, 6px)`,
                    background: st.color,
                    opacity: 0.85,
                  }}
                />
              ))}
              {/* Playhead, frozen at the moment the alert fired. */}
              <span className="absolute -inset-y-1 w-px bg-fg/80" style={{ left: `${pct(247)}%` }} />
            </div>
          </div>
        );
      })}
      <figcaption className="flex justify-between pt-1 pl-[7.25rem] font-mono text-[10px] text-muted tabular-nums">
        <span>0:00</span>
        <span>2:36</span>
        <span>5:12</span>
      </figcaption>
    </figure>
  );
}
