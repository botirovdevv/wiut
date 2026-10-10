// Typed client for the ShowroomPulse AI backend. Field names mirror the API contract exactly.

export type JobState = "queued" | "processing" | "done" | "error";

export interface JobStatus {
  status: JobState;
  progress: number; // 0–1
  error?: string;
}

export interface Meta {
  duration_s: number;
  fps_processed: number;
  processing_time_s: number;
  width: number;
  height: number;
}

export type Point = [number, number];

export interface Zone {
  id: string;
  label: string;
  polygon: Point[];
}

export interface Kpis {
  visitors: number;
  groups: number;
  avg_first_approach_s: number;
  unattended_exits: number;
  alerts: number;
}

export interface FunnelCounts {
  passed: number;
  stopped: number;
  circled: number;
  touched: number;
  sat_in: number;
  approached: number;
}

export type Funnel = Record<string, FunnelCounts>;

export type EventType =
  | "enter"
  | "stop"
  | "circle"
  | "door_open"
  | "sit_in"
  | "approach"
  | "unattended_exit"
  | "alert";

export interface JobEvent {
  t_start: number;
  t_end: number;
  type: EventType;
  zone_id: string;
  group_id: string;
  text: string;
}

export interface Heatmap {
  cols: number;
  rows: number;
  grid: number[][];
}

export interface Alert {
  t: number;
  zone_id: string;
  message: string;
}

export interface JobResult {
  meta: Meta;
  zones: Zone[];
  kpis: Kpis;
  funnel: Funnel;
  events: JobEvent[];
  heatmap: Heatmap;
  alerts: Alert[];
  summary_text: string;
}

export interface ZoneInput {
  label: string;
  polygon: Point[];
}

export const MAX_UPLOAD_BYTES = 200 * 1024 * 1024;

// `next build` always runs with NODE_ENV=production, so this folds to `false` in any
// production bundle and the mock branch (plus mocks/result.json) is dead-code eliminated.
// next.config.ts additionally fails the build if NEXT_PUBLIC_MOCK=1 is set for production.
export const MOCK =
  process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_MOCK === "1";

// The condition is spelled out literally (not via MOCK) so the bundler constant-folds it and
// never follows the import into lib/mock.ts / mocks/result.json for production builds.
async function mockApi() {
  if (process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_MOCK === "1") {
    return import("./mock");
  }
  return null;
}

function apiBase(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) throw new Error("NEXT_PUBLIC_API_URL is not set");
  return url.replace(/\/+$/, "");
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${apiBase()}${path}`, { cache: "no-store", ...init });
  if (!res.ok) {
    let detail = "";
    try {
      detail = await res.text();
    } catch {}
    throw new Error(`${res.status} ${res.statusText}${detail ? `: ${detail.slice(0, 200)}` : ""}`);
  }
  return (await res.json()) as T;
}

const enc = encodeURIComponent;

export async function health(): Promise<{ ok: boolean }> {
  const m = await mockApi();
  if (m) return m.health();
  return request("/health");
}

export interface UploadHandle {
  promise: Promise<{ job_id: string }>;
  abort: () => void;
}

/** Uploads via XHR so upload progress events work (fetch has no upload progress). */
export function uploadJob(file: File, onProgress: (fraction: number) => void): UploadHandle {
  if (MOCK) {
    let aborted = false;
    return {
      promise: mockApi().then((m) => m!.uploadJob(file, onProgress, () => aborted)),
      abort: () => {
        aborted = true;
      },
    };
  }

  const xhr = new XMLHttpRequest();
  const promise = new Promise<{ job_id: string }>((resolve, reject) => {
    let url: string;
    try {
      url = `${apiBase()}/api/jobs`;
    } catch (e) {
      reject(e);
      return;
    }
    xhr.open("POST", url);
    xhr.responseType = "json";
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(e.loaded / e.total);
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300 && xhr.response?.job_id) {
        onProgress(1);
        resolve(xhr.response as { job_id: string });
      } else {
        const detail = xhr.response?.detail ?? xhr.statusText;
        reject(new Error(`Upload failed (${xhr.status})${detail ? `: ${JSON.stringify(detail)}` : ""}`));
      }
    };
    xhr.onerror = () => reject(new Error("Network error. Is the backend reachable?"));
    xhr.onabort = () => reject(new Error("Upload cancelled"));
    const form = new FormData();
    form.append("file", file);
    xhr.send(form);
  });
  return { promise, abort: () => xhr.abort() };
}

export async function getJob(id: string): Promise<JobStatus> {
  const m = await mockApi();
  if (m) return m.getJob(id);
  return request(`/api/jobs/${enc(id)}`);
}

export async function getResult(id: string): Promise<JobResult> {
  const m = await mockApi();
  if (m) return m.getResult(id);
  return request(`/api/jobs/${enc(id)}/result`);
}

export async function submitZones(id: string, zones: ZoneInput[]): Promise<{ ok: boolean }> {
  const m = await mockApi();
  if (m) return m.submitZones(id, zones);
  return request(`/api/jobs/${enc(id)}/zones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ zones }),
  });
}

/** Media URLs are resolved asynchronously so mock mode can hand back local blob URLs. */
export async function videoUrl(id: string): Promise<string | null> {
  const m = await mockApi();
  if (m) return m.videoUrl(id);
  return `${apiBase()}/api/jobs/${enc(id)}/video`;
}

export async function frameUrl(id: string): Promise<string> {
  const m = await mockApi();
  if (m) return m.frameUrl(id);
  return `${apiBase()}/api/jobs/${enc(id)}/frame.jpg`;
}
