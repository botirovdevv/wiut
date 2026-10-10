"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getJob, getResult, type JobResult, type JobStatus } from "@/lib/api";
import JobProgress from "./JobProgress";
import ResultsDashboard from "./dashboard/ResultsDashboard";
import ZoneEditor from "./ZoneEditor";

const POLL_MS = 1500;
const MAX_FAILURES = 3;

export default function JobView() {
  const { id } = useParams<{ id: string }>();
  const [status, setStatus] = useState<JobStatus>({ status: "queued", progress: 0 });
  const [result, setResult] = useState<JobResult | null>(null);
  const [note, setNote] = useState<string | null>(null);
  // Bumped after zones are re-submitted to restart polling.
  const [round, setRound] = useState(0);

  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    let failures = 0;

    async function tick() {
      try {
        const s = await getJob(id);
        if (!alive) return;
        failures = 0;
        setNote(null);
        setStatus(s);
        if (s.status === "done") {
          const r = await getResult(id);
          if (alive) setResult(r);
          return;
        }
        if (s.status === "error") return;
      } catch (e) {
        if (!alive) return;
        failures++;
        if (failures >= MAX_FAILURES) {
          setNote(`Can't reach the backend (${e instanceof Error ? e.message : e}). Retrying…`);
        }
      }
      timer = setTimeout(tick, POLL_MS);
    }

    tick();
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [id, round]);

  const onZonesSubmitted = useCallback(() => {
    setResult(null);
    setStatus({ status: "queued", progress: 0 });
    setRound((r) => r + 1);
  }, []);

  if (!result) return <JobProgress status={status} note={note} />;
  if (result.zones.length === 0) return <ZoneEditor jobId={id} meta={result.meta} onSubmitted={onZonesSubmitted} />;
  return <ResultsDashboard jobId={id} result={result} />;
}
