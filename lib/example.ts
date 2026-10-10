// Illustrative data for the landing-page previews ONLY. Every component that renders it shows an
// "Example report" tag. Real analysis results always come from the backend (see lib/api.ts);
// this file is unrelated to dev mock mode and is never used on /jobs/*.
import type { EventType, FunnelCounts } from "./api";

export const EXAMPLE_FUNNEL: { label: string; counts: FunnelCounts } = {
  label: "Toyota Camry",
  counts: { passed: 9, stopped: 6, circled: 4, touched: 3, sat_in: 1, approached: 2 },
};

export const EXAMPLE_DURATION_S = 312;

export const EXAMPLE_EVENTS: { type: EventType; t_start: number; t_end: number }[] = [
  { type: "enter", t_start: 4, t_end: 10 },
  { type: "stop", t_start: 11, t_end: 41 },
  { type: "circle", t_start: 18, t_end: 35 },
  { type: "door_open", t_start: 36, t_end: 45 },
  { type: "sit_in", t_start: 45, t_end: 71 },
  { type: "approach", t_start: 53, t_end: 98 },
  { type: "enter", t_start: 120, t_end: 126 },
  { type: "stop", t_start: 127, t_end: 262 },
  { type: "circle", t_start: 141, t_end: 171 },
  { type: "door_open", t_start: 175, t_end: 184 },
  { type: "alert", t_start: 247, t_end: 250 },
  { type: "unattended_exit", t_start: 262, t_end: 268 },
  { type: "approach", t_start: 226, t_end: 290 },
];

export const EXAMPLE_ALERTS = [
  { t: 247, message: "Camry zone: group waiting alone for 4 min" },
  { t: 214, message: "Song Plus: visitor inside the car, no staff nearby" },
];

export const EXAMPLE_SUMMARY =
  "11 visitors in 6 groups. The Camry drew the most interest, but one group waited alone there for 4 minutes and left. First contact took 74 s on average. Put a consultant on the Camry side at peak hours.";

export const EXAMPLE_META = { processing_time_s: 41.7, duration_s: 312, fps_processed: 5 };

/** Small smooth heat grid (32x18) with hot spots near three imaginary cars and the entrance. */
export const EXAMPLE_HEAT = (() => {
  const cols = 32;
  const rows = 18;
  const blobs: [number, number, number, number][] = [
    [0.25, 0.62, 0.1, 1],
    [0.55, 0.48, 0.08, 0.7],
    [0.82, 0.66, 0.09, 0.55],
    [0.5, 0.92, 0.18, 0.4],
  ];
  const grid: number[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: number[] = [];
    for (let c = 0; c < cols; c++) {
      const x = (c + 0.5) / cols;
      const y = (r + 0.5) / rows;
      row.push(blobs.reduce((s, [bx, by, sd, a]) => s + a * Math.exp(-((x - bx) ** 2 + ((y - by) * 0.6) ** 2) / (2 * sd * sd)), 0));
    }
    grid.push(row);
  }
  return { cols, rows, grid };
})();
