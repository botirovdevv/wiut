"use client";

import { useEffect, useRef } from "react";
import type { Heatmap as HeatmapData, Meta, Zone } from "@/lib/api";
import { centroid, pointsAttr } from "@/lib/geometry";
import { HEAT_LEGEND, paintHeat } from "@/lib/heat";


export default function Heatmap({
  heatmap, frame, zones, meta,
}: { heatmap: HeatmapData; frame?: string; zones: Zone[]; meta: Meta }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) paintHeat(canvasRef.current, heatmap.grid, heatmap.cols, heatmap.rows);
  }, [heatmap]);

  const W = meta.width || 1920;
  const H = meta.height || 1080;
  const fontSize = W / 42;

  return (
    <section className="surface">
      <h2 className="section-title mb-4">Where visitors spent time</h2>
      <div className="relative overflow-hidden rounded-media bg-media" style={{ aspectRatio: `${W} / ${H}` }}>
        {!frame && <div className="skeleton absolute inset-0" />}
        {frame && (
          // eslint-disable-next-line @next/next/no-img-element -- dynamic backend/blob URL, not optimisable
          <img src={frame} alt="First frame of the showroom video" className="absolute inset-0 size-full object-fill" />
        )}
        <canvas ref={canvasRef} className="absolute inset-0 size-full" />
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 size-full">
          {zones.map((z) => {
            const [cx, cy] = centroid(z.polygon);
            return (
              <g key={z.id}>
                <polygon
                  points={pointsAttr(z.polygon)}
                  fill="rgba(255,255,255,0.05)"
                  stroke="#fff"
                  strokeWidth={W / 400}
                  strokeLinejoin="round"
                />
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={fontSize}
                  fontWeight={700}
                  fill="#fff"
                  stroke="rgba(0,0,0,0.75)"
                  strokeWidth={fontSize / 6}
                  paintOrder="stroke"
                >
                  {z.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-muted">
        <span>Less time</span>
        <span className="h-2 flex-1 rounded-full" style={{ background: HEAT_LEGEND }} />
        <span>More time</span>
      </div>
    </section>
  );
}
