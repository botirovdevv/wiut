"use client";

import { useMemo, useState, type RefObject } from "react";
import type { EventType, JobEvent, Zone } from "@/lib/api";
import { EVENT_STYLE, eventStyle, mmss } from "@/lib/format";

interface Props {
  videoRef: RefObject<HTMLVideoElement | null>;
  src: string | null | undefined;
  poster?: string;
  ready: boolean;
  events: JobEvent[];
  zones: Zone[];
  duration: number;
  currentTime: number;
  onTime: (t: number) => void;
  onSeek: (t: number) => void;
}

const LANE_ORDER = Object.keys(EVENT_STYLE) as EventType[];

export default function VideoWithTimeline({
  videoRef, src, poster, ready, events, zones, duration, currentTime, onTime, onSeek,
}: Props) {
  const [selected, setSelected] = useState<JobEvent | null>(null);
  const zoneLabel = useMemo(() => Object.fromEntries(zones.map((z) => [z.id, z.label])), [zones]);
  const total = duration > 0 ? duration : Math.max(1, ...events.map((e) => e.t_end));

  // One lane per event type keeps overlapping events readable on a narrow phone screen.
  const lanes = useMemo(() => {
    const types = Array.from(new Set(events.map((e) => e.type)));
    const rank = (t: EventType) => {
      const i = LANE_ORDER.indexOf(t);
      return i < 0 ? 99 : i;
    };
    types.sort((a, b) => rank(a) - rank(b));
    return types.map((t) => ({ type: t, events: events.filter((e) => e.type === t) }));
  }, [events]);

  const pct = (t: number) => Math.max(0, Math.min(100, (t / total) * 100));

  return (
    <section className="surface overflow-hidden p-0 sm:p-0">
      <div className="relative aspect-video bg-media">
        {src ? (
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            controls
            playsInline
            preload="metadata"
            className="size-full object-contain"
            onTimeUpdate={(e) => onTime(e.currentTarget.currentTime)}
          />
        ) : (
          ready ? (
            <div className="grid size-full place-items-center p-6 text-center text-sm text-muted">
              Annotated video is not available for this upload.
            </div>
          ) : (
            <div className="skeleton size-full" aria-label="Loading video" />
          )
        )}
      </div>

      <div className="p-4 sm:p-6">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="section-title">Event timeline</h2>
          <span className="font-mono text-xs text-muted tabular-nums">
            {mmss(currentTime)} / {mmss(total)}
          </span>
        </div>

        <div className="space-y-1.5">
          {lanes.map((lane) => {
            const st = eventStyle(lane.type);
            return (
              <div key={lane.type} className="flex items-center gap-2">
                <span className="w-20 shrink-0 truncate text-xs text-muted sm:w-28" title={st.label}>
                  {st.label}
                </span>
                <div className="relative h-7 flex-1 rounded-[4px] bg-panel-2">
                  {lane.events.map((e, i) => {
                    const active = selected === e;
                    return (
                      <button
                        key={i}
                        type="button"
                        title={`${mmss(e.t_start)} · ${e.text}`}
                        aria-label={`${st.label} at ${mmss(e.t_start)}: ${e.text}`}
                        onClick={() => {
                          setSelected(e);
                          onSeek(e.t_start);
                        }}
                        className="group absolute inset-y-0"
                        style={{
                          left: `${pct(e.t_start)}%`,
                          width: `max(${pct(e.t_end) - pct(e.t_start)}%, 10px)`,
                        }}
                      >
                        {/* invisible padding widens the touch target without changing the drawn marker */}
                        <span className="absolute -inset-x-2 -inset-y-1" />
                        <span
                          className={`block h-full rounded-[3px] transition group-hover:brightness-125 ${
                            active ? "ring-2 ring-fg" : ""
                          }`}
                          style={{ background: st.color, opacity: active ? 1 : 0.85 }}
                        />
                      </button>
                    );
                  })}
                  <div
                    className="pointer-events-none absolute -inset-y-1 w-0.5 rounded-full bg-fg"
                    style={{ left: `${pct(currentTime)}%` }}
                  />
                </div>
              </div>
            );
          })}
          {lanes.length === 0 && <p className="text-sm text-muted">No events detected.</p>}
        </div>

        <div className="mt-4 min-h-12 rounded-media bg-panel-2 p-3 text-sm leading-relaxed">
          {selected ? (
            <p>
              <span className="mr-2 font-mono text-muted tabular-nums">
                {mmss(selected.t_start)} - {mmss(selected.t_end)}
              </span>
              <span className="mr-2 font-semibold" style={{ color: eventStyle(selected.type).color }}>
                {zoneLabel[selected.zone_id] ?? selected.zone_id}
              </span>
              {selected.text}
            </p>
          ) : (
            <p className="text-muted">Tap a marker to jump the video to that moment.</p>
          )}
        </div>
      </div>
    </section>
  );
}
