import { FUNNEL_STAGES } from "@/components/dashboard/CarFunnel";
import { EXAMPLE_FUNNEL } from "@/lib/example";

export default function MiniFunnel() {
  const { label, counts } = EXAMPLE_FUNNEL;
  const top = Math.max(1, counts.passed);
  return (
    <figure>
      <figcaption className="mb-3 text-sm font-medium">{label}</figcaption>
      <ul className="space-y-2">
        {FUNNEL_STAGES.map((s, i) => {
          const v = counts[s.key];
          const w = (v / top) * 100;
          const staff = s.key === "approached";
          return (
            <li key={s.key} className="grid grid-cols-[minmax(0,1fr)_3.5rem] items-center gap-3 text-xs">
              <div className="relative h-7">
                {/* Bars narrow stage by stage; no background track, the shape tells the story. */}
                <div
                  className={`absolute inset-y-0 left-0 rounded-[6px] ${staff ? "bg-accent/60" : "bg-accent/25"}`}
                  style={{ width: `${Math.max(w, 4)}%`, opacity: staff ? 1 : 1 - i * 0.08 }}
                />
                <span className="relative flex h-full items-center px-2.5 font-medium whitespace-nowrap">
                  {s.label}
                </span>
              </div>
              <span className="text-right font-mono tabular-nums">
                <b className="font-semibold">{v}</b> <span className="text-muted">{Math.round(w)}%</span>
              </span>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
