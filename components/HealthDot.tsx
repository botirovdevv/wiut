"use client";

import { useEffect, useState } from "react";
import { health } from "@/lib/api";

// The one status dot on the page: it reflects real backend state (GET /health).
export default function HealthDot({ compact = false }: { compact?: boolean }) {
  const [state, setState] = useState<"checking" | "up" | "down">("checking");

  useEffect(() => {
    let alive = true;
    const check = () =>
      health()
        .then((r) => alive && setState(r.ok ? "up" : "down"))
        .catch(() => alive && setState("down"));
    check();
    const t = setInterval(check, 30000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  const color = state === "up" ? "bg-accent" : state === "down" ? "bg-bad" : "bg-muted";
  const label = state === "up" ? "Backend online" : state === "down" ? "Backend offline" : "Checking backend";
  return (
    <span
      className={`flex items-center gap-2 text-xs text-muted ${compact ? "px-2" : "rounded-full border border-line px-3 py-1"}`}
      role="status"
      title={label}
    >
      <span className="relative flex size-2" aria-hidden>
        {state === "up" && (
          <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-50 motion-reduce:hidden" />
        )}
        <span className={`relative size-2 rounded-full ${color}`} />
      </span>
      <span className={compact ? "sr-only lg:not-sr-only" : "sr-only sm:not-sr-only"}>{label}</span>
    </span>
  );
}
