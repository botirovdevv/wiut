"use client";

import { useEffect, useState } from "react";

/** Resolves an async media URL getter (real backend URL, or a blob URL in mock mode). */
export function useMediaUrl<T>(get: (id: string) => Promise<T>, id: string): { url: T | undefined; ready: boolean } {
  const [state, setState] = useState<{ id: string; url: T } | null>(null);
  useEffect(() => {
    let alive = true;
    get(id).then((url) => alive && setState({ id, url }));
    return () => {
      alive = false;
    };
  }, [get, id]);
  const ready = state?.id === id;
  return { url: ready ? state.url : undefined, ready };
}
