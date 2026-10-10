import { Lightning } from "@phosphor-icons/react/ssr";
import type { Meta } from "@/lib/api";
import { fmtNum, mmss } from "@/lib/format";

export function ManagerSummary({ text }: { text: string }) {
  return (
    <section className="surface">
      <h2 className="section-title mb-4">Manager summary</h2>
      {/* Plain text from the model, rendered as text (never as HTML). */}
      <p className="max-w-[65ch] text-[15px] leading-relaxed whitespace-pre-wrap text-fg/90">
        {text?.trim() || "No summary was generated."}
      </p>
    </section>
  );
}

export function PerformanceStrip({ meta }: { meta: Meta }) {
  const speedup = meta.processing_time_s > 0 ? meta.duration_s / meta.processing_time_s : 0;
  const items = [
    { label: "Processing time", value: `${fmtNum(meta.processing_time_s)}s` },
    { label: "Video length", value: mmss(meta.duration_s) },
    { label: "Analysed at", value: `${fmtNum(meta.fps_processed)} fps` },
  ];
  return (
    <section className="grid gap-4 rounded-surface border border-accent/25 bg-accent/5 p-4 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-8 sm:px-6">
      {speedup > 0 && (
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-control bg-accent text-accent-ink">
            <Lightning size={20} weight="fill" aria-hidden />
          </span>
          <div>
            <div className="font-mono text-2xl font-semibold tracking-tight text-accent tabular-nums">
              {fmtNum(speedup)}x
            </div>
            <div className="text-xs text-muted">faster than real time</div>
          </div>
        </div>
      )}
      <dl className="grid grid-cols-3 gap-4">
        {items.map((i) => (
          <div key={i.label}>
            <dt className="text-xs text-muted">{i.label}</dt>
            <dd className="mt-0.5 font-mono text-base font-semibold tabular-nums">{i.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
