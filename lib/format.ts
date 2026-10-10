import type { EventType } from "./api";

export function mmss(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const s = Math.floor(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function fmtNum(n: number, digits = 1): string {
  if (!Number.isFinite(n)) return "-";
  return Number.isInteger(n) ? String(n) : n.toFixed(digits);
}

export function fmtBytes(b: number): string {
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

// Categorical event colours (data, not decoration). Approach = brand accent; exit/alert = bad/warn.
export const EVENT_STYLE: Record<EventType, { label: string; color: string }> = {
  enter: { label: "Enter", color: "#71727a" },
  stop: { label: "Stop", color: "#5fa8d3" },
  circle: { label: "Walk around", color: "#9d8cd9" },
  door_open: { label: "Door open", color: "#d983b3" },
  sit_in: { label: "Sat inside", color: "#e0975a" },
  approach: { label: "Staff approach", color: "#3ecf8e" },
  unattended_exit: { label: "Unattended exit", color: "#ef6b6b" },
  alert: { label: "Alert", color: "#e8b931" },
};

export function eventStyle(type: string) {
  return EVENT_STYLE[type as EventType] ?? { label: type, color: "#94a3b8" };
}
