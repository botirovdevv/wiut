"use client";

import { useRef, useState, type MouseEvent } from "react";
import { ArrowCounterClockwise, Check, Polygon, Trash, Warning, X } from "@phosphor-icons/react";
import { frameUrl, submitZones, type Meta, type Point, type ZoneInput } from "@/lib/api";
import { centroid, pointsAttr } from "@/lib/geometry";
import { useMediaUrl } from "@/lib/useMediaUrl";

interface Props {
  jobId: string;
  meta: Meta;
  onSubmitted: () => void;
}

// Categorical zone colours, matching the event palette in lib/format.ts.
const COLORS = ["#3ecf8e", "#5fa8d3", "#9d8cd9", "#d983b3", "#e0975a", "#e8b931"];

export default function ZoneEditor({ jobId, meta, onSubmitted }: Props) {
  const frame = useMediaUrl(frameUrl, jobId);
  const svgRef = useRef<SVGSVGElement>(null);
  const [zones, setZones] = useState<ZoneInput[]>([]);
  const [draft, setDraft] = useState<Point[]>([]);
  const [naming, setNaming] = useState(false); // draft is closed and waiting for a label
  const [name, setName] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const W = meta.width || 1920;
  const H = meta.height || 1080;
  const r = W / 160;

  // Tapping within ~22 screen px of the first point closes the polygon (finger-sized on phones).
  function snapDistance(): number {
    const rect = svgRef.current?.getBoundingClientRect();
    return rect && rect.width > 0 ? (22 * W) / rect.width : W * 0.025;
  }

  function toImage(e: MouseEvent): Point {
    const rect = svgRef.current!.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const y = ((e.clientY - rect.top) / rect.height) * H;
    return [Math.round(Math.max(0, Math.min(W, x))), Math.round(Math.max(0, Math.min(H, y)))];
  }

  const dist = (a: Point, b: Point) => Math.hypot(a[0] - b[0], a[1] - b[1]);

  function close(points: Point[]) {
    if (points.length < 3) return;
    setDraft(points);
    setNaming(true);
    setName("");
  }

  function onClick(e: MouseEvent) {
    if (naming) return;
    const p = toImage(e);
    if (draft.length >= 3 && dist(p, draft[0]) < snapDistance()) {
      close(draft);
      return;
    }
    setDraft((d) => [...d, p]);
  }

  function onDoubleClick(e: MouseEvent) {
    e.preventDefault();
    if (naming) return;
    // A double-click also fired two clicks at the same spot: drop the duplicate vertex.
    const pts = [...draft];
    const snap = snapDistance();
    while (pts.length >= 2 && dist(pts[pts.length - 1], pts[pts.length - 2]) < snap / 2) pts.pop();
    close(pts);
  }

  function saveName() {
    const label = name.trim();
    if (!label) return;
    setZones((z) => [...z, { label, polygon: draft }]);
    setDraft([]);
    setNaming(false);
    setName("");
  }

  async function submit() {
    setSending(true);
    setError(null);
    try {
      await submitZones(jobId, zones);
      onSubmitted();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setSending(false);
    }
  }

  const hint = naming
    ? "Name this zone (e.g. the car model)."
    : draft.length === 0
      ? "Tap around a car to outline it."
      : draft.length < 3
        ? "Keep tapping to add corners."
        : "Double-click, tap the first point, or press Close to finish.";

  return (
    <div className="mx-auto max-w-4xl space-y-4 pt-2 md:space-y-6 md:pt-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tighter md:text-4xl">Mark the cars</h1>
        <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-muted md:text-base">
          No car zones were detected automatically. Outline each car on the first frame, name it, then re-run the
          analysis.
        </p>
      </div>

      <section className="surface space-y-4">
        {/* Fixed height so the frame never shifts under the user's finger while the hint changes. */}
        <p className="flex h-10 items-start gap-2 text-sm leading-5 font-medium text-accent" aria-live="polite">
          <Polygon size={18} className="mt-px shrink-0" aria-hidden />
          {hint}
        </p>
        <div className="relative overflow-hidden rounded-media bg-media" style={{ aspectRatio: `${W} / ${H}` }}>
          {frame.url && (
            // eslint-disable-next-line @next/next/no-img-element -- dynamic backend/blob URL
            <img src={frame.url} alt="First frame" className="absolute inset-0 size-full object-fill select-none" draggable={false} />
          )}
          {!frame.ready && <div className="skeleton absolute inset-0" aria-label="Loading frame" />}
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            className={`absolute inset-0 size-full touch-manipulation ${naming ? "" : "cursor-crosshair"}`}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
          >
            {zones.map((z, i) => {
              const [cx, cy] = centroid(z.polygon);
              const c = COLORS[i % COLORS.length];
              return (
                <g key={i}>
                  <polygon points={pointsAttr(z.polygon)} fill={`${c}33`} stroke={c} strokeWidth={W / 400} />
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={W / 42}
                    fontWeight={700}
                    fill="#fff"
                    stroke="#0c0d10"
                    strokeWidth={W / 300}
                    paintOrder="stroke"
                  >
                    {z.label}
                  </text>
                </g>
              );
            })}
            {draft.length > 0 &&
              (naming ? (
                <polygon points={pointsAttr(draft)} fill="#ffffff33" stroke="#fff" strokeWidth={W / 400} />
              ) : (
                <polyline points={pointsAttr(draft)} fill="none" stroke="#fff" strokeWidth={W / 400} strokeDasharray={`${W / 100} ${W / 200}`} />
              ))}
            {draft.map((p, i) => (
              <circle
                key={i}
                cx={p[0]}
                cy={p[1]}
                r={i === 0 && draft.length >= 3 && !naming ? r * 1.8 : r}
                fill={i === 0 ? "#3ecf8e" : "#fff"}
                stroke="#0c0d10"
                strokeWidth={W / 800}
              />
            ))}
          </svg>
        </div>

        {naming ? (
          <form
            className="space-y-2"
            onSubmit={(e) => {
              e.preventDefault();
              saveName();
            }}
          >
            <label htmlFor="zone-name" className="block text-sm font-medium">
              Zone name
            </label>
            <div className="flex gap-2">
              <input
                id="zone-name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Toyota Camry"
                maxLength={60}
                aria-describedby="zone-name-help"
                className="min-h-11 min-w-0 flex-1 rounded-control border border-line bg-panel-2 px-3 text-fg outline-none placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent/25"
              />
              <button className="btn-primary" disabled={!name.trim()}>
                <Check size={18} weight="bold" aria-hidden />
                Save
              </button>
              <button type="button" className="btn-ghost px-3" onClick={() => setNaming(false)} aria-label="Back to drawing">
                <X size={18} aria-hidden />
              </button>
            </div>
            <p id="zone-name-help" className="text-xs text-muted">
              Usually the car model shown in this zone.
            </p>
          </form>
        ) : (
          <div className="flex flex-wrap gap-2">
            <button className="btn-ghost" disabled={draft.length === 0} onClick={() => setDraft((d) => d.slice(0, -1))}>
              <ArrowCounterClockwise size={18} aria-hidden />
              Undo point
            </button>
            <button className="btn-ghost" disabled={draft.length < 3} onClick={() => close(draft)}>
              <Polygon size={18} aria-hidden />
              Close shape
            </button>
            <button className="btn-ghost" disabled={draft.length === 0} onClick={() => setDraft([])}>
              Clear
            </button>
          </div>
        )}
      </section>

      <section className="surface">
        <h2 className="section-title mb-4">Zones ({zones.length})</h2>
        {zones.length === 0 ? (
          <p className="text-sm text-muted">No zones yet. Outline a car above to add one.</p>
        ) : (
          <ul className="space-y-2">
            {zones.map((z, i) => (
              <li key={i} className="flex items-center gap-3 rounded-media bg-panel-2 px-3 py-2">
                <span className="size-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="flex-1 font-medium">{z.label}</span>
                <span className="font-mono text-xs text-muted">{z.polygon.length} points</span>
                <button
                  className="grid size-11 place-items-center rounded-control text-muted transition hover:bg-bad/10 hover:text-bad"
                  onClick={() => setZones((all) => all.filter((_, j) => j !== i))}
                  aria-label={`Delete ${z.label}`}
                >
                  <Trash size={18} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}
        {error && (
          <p role="alert" className="mt-4 flex gap-2 rounded-media bg-bad/10 p-3 text-sm text-bad">
            <Warning size={18} className="mt-px shrink-0" aria-hidden />
            {error}
          </p>
        )}
        <button className="btn-primary mt-5 w-full" disabled={zones.length === 0 || naming || sending} onClick={submit}>
          {sending ? "Submitting" : `Re-run analysis with ${zones.length} zone${zones.length === 1 ? "" : "s"}`}
        </button>
      </section>
    </div>
  );
}
