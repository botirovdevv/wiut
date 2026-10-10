import type { Funnel, FunnelCounts, Zone } from "@/lib/api";

export const FUNNEL_STAGES: { key: keyof FunnelCounts; label: string }[] = [
  { key: "passed", label: "Passed" },
  { key: "stopped", label: "Stopped" },
  { key: "circled", label: "Walked around" },
  { key: "touched", label: "Touched / opened door" },
  { key: "sat_in", label: "Sat inside" },
  { key: "approached", label: "Approached by staff" },
];

export default function CarFunnel({ funnel, zones }: { funnel: Funnel; zones: Zone[] }) {
  // Show zones in their declared order, plus any funnel keys the backend sent without a matching zone.
  const ids = [...zones.map((z) => z.id), ...Object.keys(funnel).filter((id) => !zones.some((z) => z.id === id))];
  const label = (id: string) => zones.find((z) => z.id === id)?.label ?? id;

  return (
    <section className="surface">
      <h2 className="section-title mb-4">Per-car funnel</h2>
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {ids.map((id) => {
          const f = funnel[id];
          if (!f) return null;
          const top = Math.max(1, f.passed);
          return (
            <div key={id}>
              <h3 className="mb-3 font-semibold tracking-tight">{label(id)}</h3>
              <ul className="space-y-1.5">
                {FUNNEL_STAGES.map((s) => {
                  const v = f[s.key] ?? 0;
                  const w = (v / top) * 100;
                  const staff = s.key === "approached";
                  return (
                    <li key={s.key} className="grid grid-cols-[1fr_auto] items-center gap-x-2 text-sm">
                      <div className="relative h-7 overflow-hidden rounded-media bg-panel-2">
                        <div
                          className={`absolute inset-y-0 left-0 rounded-media ${staff ? "bg-accent/75" : "bg-accent/30"}`}
                          style={{ width: `${Math.max(w, v > 0 ? 2 : 0)}%` }}
                        />
                        <span className="relative z-10 flex h-full items-center px-2 text-xs font-medium whitespace-nowrap">
                          {s.label}
                        </span>
                      </div>
                      <span className="w-16 text-right font-mono tabular-nums">
                        <b className="font-semibold">{v}</b> <span className="text-xs text-muted">{Math.round(w)}%</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
