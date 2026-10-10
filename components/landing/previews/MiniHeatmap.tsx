"use client";

import { useEffect, useRef } from "react";
import { EXAMPLE_HEAT } from "@/lib/example";
import { HEAT_LEGEND, paintHeat } from "@/lib/heat";

// Three outlined car zones in a 320x180 frame, matching the hot spots in EXAMPLE_HEAT.
const ZONES = [
  { label: "Camry", points: "30,95 120,86 132,128 36,142" },
  { label: "Tracker", points: "138,70 206,66 216,104 144,110" },
  { label: "Song Plus", points: "222,86 300,83 310,136 230,143" },
];

export default function MiniHeatmap() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (ref.current) paintHeat(ref.current, EXAMPLE_HEAT.grid, EXAMPLE_HEAT.cols, EXAMPLE_HEAT.rows);
  }, []);

  return (
    <figure>
      <div className="relative aspect-video overflow-hidden rounded-media bg-[linear-gradient(180deg,#1d1f25_0%,#121317_45%,#0d0e11_100%)] ring-1 ring-white/[0.06]">
        {/* Floor line gives the frame a sense of a room without pretending to be a photo. */}
        <div className="absolute inset-x-0 top-[38%] h-px bg-white/[0.06]" />
        <canvas ref={ref} className="absolute inset-0 size-full opacity-90" aria-hidden />
        <svg viewBox="0 0 320 180" className="absolute inset-0 size-full" aria-hidden>
          {ZONES.map((z) => {
            const pts = z.points.split(" ").map((p) => p.split(",").map(Number));
            const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
            const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
            return (
              <g key={z.label}>
                <polygon points={z.points} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.85)" strokeWidth="1" />
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="9"
                  fontWeight="600"
                  fill="#fff"
                  stroke="rgba(0,0,0,0.6)"
                  strokeWidth="2.5"
                  paintOrder="stroke"
                >
                  {z.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption className="mt-3 flex items-center gap-2 text-[11px] text-muted">
        <span>Less time</span>
        <span className="h-1.5 flex-1 rounded-full" style={{ background: HEAT_LEGEND }} />
        <span>More time</span>
      </figcaption>
    </figure>
  );
}
