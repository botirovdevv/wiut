"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, FilmStrip, VideoCamera, Warning } from "@phosphor-icons/react";
import { MAX_UPLOAD_BYTES, uploadJob, type UploadHandle } from "@/lib/api";
import { fmtBytes } from "@/lib/format";

export default function UploadCard() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const handleRef = useRef<UploadHandle | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const uploading = progress !== null;

  function pick(f: File | undefined) {
    setError(null);
    if (!f) return;
    if (f.size > MAX_UPLOAD_BYTES) {
      setFile(null);
      setError(`File is ${fmtBytes(f.size)}. Max size is 200 MB.`);
      return;
    }
    setFile(f);
  }

  async function start() {
    if (!file) return;
    setError(null);
    setProgress(0);
    const handle = uploadJob(file, setProgress);
    handleRef.current = handle;
    try {
      const { job_id } = await handle.promise;
      router.push(`/jobs/${encodeURIComponent(job_id)}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setProgress(null);
    } finally {
      handleRef.current = null;
    }
  }

  const pct = Math.round((progress ?? 0) * 100);

  return (
    <section id="analyse" className="bezel scroll-mt-28" aria-label="Analyse a video">
      <div className="bezel-core p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold tracking-tight">New analysis</h2>
          <span className="text-xs text-muted">Video or image, up to 200 MB</span>
        </div>
        <label
          className={`flex min-h-40 cursor-pointer flex-col items-center justify-center gap-3 rounded-[16px] border border-dashed p-6 text-center transition duration-300 ease-fluid sm:min-h-56 ${
            file ? "border-accent/60 bg-accent/5" : "border-white/10 bg-bg/60 hover:border-accent/50 hover:bg-accent/[0.03]"
          } ${uploading ? "pointer-events-none opacity-60" : ""}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            pick(e.dataTransfer.files?.[0]);
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="video/*,image/*"
            capture
            className="sr-only"
            disabled={uploading}
            onChange={(e) => pick(e.target.files?.[0])}
          />
          <span className="grid size-14 place-items-center rounded-[16px] bg-accent/10 text-accent ring-1 ring-accent/20">
            {file ? <FilmStrip size={24} aria-hidden /> : <VideoCamera size={24} aria-hidden />}
          </span>
          {file ? (
            <>
              <span className="max-w-full truncate font-semibold">{file.name}</span>
              <span className="text-sm text-muted">{fmtBytes(file.size)}. Tap to change.</span>
            </>
          ) : (
            <>
              <span className="text-lg font-semibold tracking-tight">Record or choose a video</span>
              <span className="text-sm text-muted">On a phone this opens the camera</span>
            </>
          )}
        </label>

        {uploading && (
          <div className="mt-5" aria-live="polite">
            <div className="mb-2 flex justify-between text-sm">
              <span>{pct < 100 ? "Uploading" : "Upload complete, creating job"}</span>
              <span className="font-mono tabular-nums">{pct}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-panel-2">
              <div className="h-full rounded-full bg-accent transition-[width] duration-200" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}

        {error && (
          <p role="alert" className="mt-4 flex gap-2 rounded-media bg-bad/10 p-3 text-sm text-bad">
            <Warning size={18} className="mt-px shrink-0" aria-hidden />
            {error}
          </p>
        )}

        <div className="mt-5">
          {uploading ? (
            <button className="btn-ghost w-full" onClick={() => handleRef.current?.abort()}>
              Cancel upload
            </button>
          ) : (
            <button className="group btn-primary w-full min-h-12 pr-1.5 text-base" disabled={!file} onClick={start}>
              <span className="flex-1 pl-7">Analyse a video</span>
              <span className="btn-icon size-9">
                <ArrowRight size={16} weight="bold" aria-hidden />
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
