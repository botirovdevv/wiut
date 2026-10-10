// DEV-ONLY mock backend. Only reachable through mockApi() in lib/api.ts, which is
// constant-folded away in production builds. Never import this module directly.
import type { JobResult, JobStatus, ZoneInput } from "./api";
import fixture from "../mocks/result.json";

if (process.env.NODE_ENV === "production") {
  throw new Error("lib/mock.ts must never be loaded in production");
}

const result = fixture as unknown as JobResult;
const PROCESS_MS = 6000;

interface MockJob {
  startedAt: number;
  zones: JobResult["zones"];
  file?: File;
  blobUrl?: string;
  frameUrl?: string;
}

// Keyed by job id. Lives in module memory, so it survives client-side navigation but not a reload.
const jobs = new Map<string, MockJob>();

function job(id: string): MockJob {
  let j = jobs.get(id);
  if (!j) {
    // Unknown id (e.g. page reload): pretend it already finished. "mock-nozones" exercises the zone editor.
    j = { startedAt: Date.now() - PROCESS_MS, zones: id.startsWith("mock-nozones") ? [] : result.zones };
    jobs.set(id, j);
  }
  return j;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function health() {
  await sleep(150);
  return { ok: true };
}

export async function uploadJob(
  file: File,
  onProgress: (f: number) => void,
  isAborted: () => boolean,
): Promise<{ job_id: string }> {
  for (let i = 1; i <= 20; i++) {
    await sleep(60);
    if (isAborted()) throw new Error("Upload cancelled");
    onProgress(i / 20);
  }
  const id = `mock-${Math.random().toString(36).slice(2, 8)}`;
  jobs.set(id, { startedAt: Date.now(), zones: result.zones, file, blobUrl: URL.createObjectURL(file) });
  return { job_id: id };
}

export async function getJob(id: string): Promise<JobStatus> {
  await sleep(120);
  const p = Math.min(1, (Date.now() - job(id).startedAt) / PROCESS_MS);
  if (p >= 1) return { status: "done", progress: 1 };
  return { status: p < 0.1 ? "queued" : "processing", progress: p };
}

export async function getResult(id: string): Promise<JobResult> {
  await sleep(200);
  return { ...result, zones: job(id).zones };
}

export async function submitZones(id: string, zones: ZoneInput[]) {
  await sleep(300);
  const j = job(id);
  j.zones = zones.map((z, i) => ({ id: `z${i + 1}`, ...z }));
  j.startedAt = Date.now();
  return { ok: true };
}

export async function videoUrl(id: string): Promise<string | null> {
  const j = job(id);
  return j.file?.type.startsWith("video/") ? j.blobUrl! : null;
}

export async function frameUrl(id: string): Promise<string> {
  const j = job(id);
  if (j.frameUrl) return j.frameUrl;
  let url: string | null = null;
  if (j.file?.type.startsWith("image/")) url = j.blobUrl!;
  else if (j.file?.type.startsWith("video/")) url = await firstFrame(j.blobUrl!).catch(() => null);
  j.frameUrl = url ?? placeholderFrame();
  return j.frameUrl;
}

function firstFrame(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const v = document.createElement("video");
    v.muted = true;
    v.playsInline = true;
    v.preload = "auto";
    v.src = src;
    v.onloadeddata = () => {
      v.currentTime = Math.min(0.1, v.duration || 0);
    };
    v.onseeked = () => {
      const c = document.createElement("canvas");
      c.width = result.meta.width;
      c.height = result.meta.height;
      c.getContext("2d")!.drawImage(v, 0, 0, c.width, c.height);
      resolve(c.toDataURL("image/jpeg", 0.85));
    };
    v.onerror = () => reject(new Error("cannot decode video"));
    setTimeout(() => reject(new Error("timeout")), 8000);
  });
}

function placeholderFrame(): string {
  const { width: w, height: h } = result.meta;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a4150"/><stop offset="1" stop-color="#1b1f27"/></linearGradient></defs>
<rect width="${w}" height="${h}" fill="url(#g)"/>
<path d="M0 ${h * 0.42} L${w} ${h * 0.36}" stroke="#4b5363" stroke-width="6"/>
<text x="${w / 2}" y="${h * 0.2}" fill="#8b93a3" font-family="sans-serif" font-size="64" text-anchor="middle">MOCK FRAME</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
