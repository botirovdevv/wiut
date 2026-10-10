import Link from "next/link";
import { CircleNotch, Warning } from "@phosphor-icons/react/ssr";
import type { JobStatus } from "@/lib/api";

const LABEL: Record<JobStatus["status"], string> = {
  queued: "Queued, waiting for a worker",
  processing: "Analysing video",
  done: "Done",
  error: "Analysis failed",
};

export default function JobProgress({ status, note }: { status: JobStatus; note?: string | null }) {
  const pct = Math.round(Math.max(0, Math.min(1, status.progress || 0)) * 100);
  const isError = status.status === "error";
  return (
    <section className="surface mx-auto mt-6 max-w-xl md:mt-16" aria-live="polite">
      <div className="flex items-center gap-3">
        <span
          className={`grid size-10 shrink-0 place-items-center rounded-control ${
            isError ? "bg-bad/10 text-bad" : "bg-accent/10 text-accent"
          }`}
        >
          {isError ? (
            <Warning size={20} aria-hidden />
          ) : (
            <CircleNotch size={20} className="animate-spin motion-reduce:animate-none" aria-hidden />
          )}
        </span>
        <h1 className="flex-1 text-lg font-semibold tracking-tight">{LABEL[status.status] ?? status.status}</h1>
        {!isError && <span className="font-mono text-sm text-muted tabular-nums">{pct}%</span>}
      </div>

      {!isError && (
        <>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-panel-2">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out-expo"
              style={{ width: `${Math.max(pct, 3)}%` }}
            />
          </div>
          <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-muted">
            Detecting people and cars, tracking groups and measuring staff response. This page updates by itself.
          </p>
        </>
      )}
      {note && <p className="mt-3 text-sm text-warn">{note}</p>}
      {isError && (
        <>
          <p className="mt-4 rounded-media bg-bad/10 p-3 text-sm text-bad">{status.error || "Unknown error"}</p>
          <Link href="/" className="btn-primary mt-5 w-full">
            Upload another video
          </Link>
        </>
      )}
    </section>
  );
}
