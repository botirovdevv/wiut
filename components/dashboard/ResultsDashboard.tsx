"use client";

import { useCallback, useMemo, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { Plus } from "@phosphor-icons/react";
import { frameUrl, videoUrl, type JobResult } from "@/lib/api";
import { toPixelZones } from "@/lib/geometry";
import { useMediaUrl } from "@/lib/useMediaUrl";
import AlertsFeed from "./AlertsFeed";
import CarFunnel from "./CarFunnel";
import Heatmap from "./Heatmap";
import KpiCards from "./KpiCards";
import { ManagerSummary, PerformanceStrip } from "./SummaryAndPerf";
import VideoWithTimeline from "./VideoWithTimeline";

export default function ResultsDashboard({ jobId, result }: { jobId: string; result: JobResult }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState(0);
  const video = useMediaUrl(videoUrl, jobId);
  const frame = useMediaUrl(frameUrl, jobId);
  const zones = useMemo(() => toPixelZones(result.zones, result.meta), [result.zones, result.meta]);

  const seek = useCallback((t: number, scroll = false) => {
    const v = videoRef.current;
    setTime(t);
    if (!v) return;
    v.currentTime = t;
    v.play().catch(() => {});
    if (scroll) videoSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // `--i` drives the staggered reveal (see .reveal in globals.css); skipped under reduced motion.
  const step = (i: number) => ({ className: "reveal", style: { "--i": i } as CSSProperties });

  return (
    <div className="space-y-4 pt-2 md:space-y-6 md:pt-6">
      <div {...step(0)} className="reveal flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tighter md:text-4xl">Showroom report</h1>
          <p className="mt-1 font-mono text-xs text-muted">Job {jobId}</p>
        </div>
        <Link href="/" className="btn-ghost text-sm">
          <Plus size={16} weight="bold" aria-hidden />
          New video
        </Link>
      </div>

      <div {...step(1)}>
        <PerformanceStrip meta={result.meta} />
      </div>
      <div {...step(2)}>
        <KpiCards kpis={result.kpis} />
      </div>

      <div {...step(3)} className="reveal grid gap-4 md:gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div ref={videoSectionRef} className="scroll-mt-4">
          <VideoWithTimeline
            videoRef={videoRef}
            src={video.url}
            poster={frame.url}
            ready={video.ready}
            events={result.events}
            zones={zones}
            duration={result.meta.duration_s}
            currentTime={time}
            onTime={setTime}
            onSeek={seek}
          />
        </div>
        <div className="space-y-4 md:space-y-6">
          <AlertsFeed alerts={result.alerts} zones={zones} onSeek={(t) => seek(t, true)} />
          <ManagerSummary text={result.summary_text} />
        </div>
      </div>

      <div {...step(4)}>
        <CarFunnel funnel={result.funnel} zones={zones} />
      </div>
      <div {...step(5)}>
        <Heatmap heatmap={result.heatmap} frame={frame.url} zones={zones} meta={result.meta} />
      </div>
    </div>
  );
}
