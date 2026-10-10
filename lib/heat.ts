// Sequential heat ramp shared by the dashboard heatmap and the landing preview.

export type RGB = [number, number, number];

// blue -> cyan -> yellow -> red
export const HEAT_STOPS: [number, RGB][] = [
  [0, [37, 99, 235]],
  [0.35, [34, 211, 238]],
  [0.65, [250, 204, 21]],
  [1, [239, 68, 68]],
];

export function ramp(v: number): RGB {
  for (let i = 1; i < HEAT_STOPS.length; i++) {
    const [p1, c1] = HEAT_STOPS[i];
    const [p0, c0] = HEAT_STOPS[i - 1];
    if (v <= p1) {
      const t = (v - p0) / (p1 - p0 || 1);
      return [0, 1, 2].map((k) => Math.round(c0[k] + (c1[k] - c0[k]) * t)) as RGB;
    }
  }
  return HEAT_STOPS[HEAT_STOPS.length - 1][1];
}

export const HEAT_LEGEND = `linear-gradient(90deg, ${HEAT_STOPS.map(([p, c]) => `rgb(${c.join(",")}) ${p * 100}%`).join(", ")})`;

/** Paints a normalised heat grid into a canvas at one pixel per cell (CSS scales it up smoothly). */
export function paintHeat(canvas: HTMLCanvasElement, grid: number[][], cols: number, rows: number) {
  if (!cols || !rows) return;
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const img = ctx.createImageData(cols, rows);
  let max = 0;
  for (const row of grid) for (const v of row) if (v > max) max = v;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const v = max > 0 ? (grid[r]?.[c] ?? 0) / max : 0;
      const [R, G, B] = ramp(v);
      const i = (r * cols + c) * 4;
      img.data[i] = R;
      img.data[i + 1] = G;
      img.data[i + 2] = B;
      img.data[i + 3] = v < 0.04 ? 0 : Math.round(50 + 140 * v);
    }
  }
  ctx.putImageData(img, 0, 0);
}
