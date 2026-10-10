import type { Meta, Point, Zone } from "./api";

/** Polygons are expected in frame pixels; if the backend sends 0–1 normalised coords, scale them up. */
export function toPixelZones(zones: Zone[], meta: Pick<Meta, "width" | "height">): Zone[] {
  const all = zones.flatMap((z) => z.polygon.flat());
  const normalised = all.length > 0 && all.every((v) => v >= 0 && v <= 1);
  if (!normalised) return zones;
  return zones.map((z) => ({
    ...z,
    polygon: z.polygon.map(([x, y]) => [x * meta.width, y * meta.height] as Point),
  }));
}

export function centroid(poly: Point[]): Point {
  const n = poly.length || 1;
  const [sx, sy] = poly.reduce(([ax, ay], [x, y]) => [ax + x, ay + y], [0, 0]);
  return [sx / n, sy / n];
}

export const pointsAttr = (poly: Point[]) => poly.map((p) => p.join(",")).join(" ");
