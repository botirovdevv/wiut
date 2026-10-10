"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Stagger index: each step adds 90ms of delay. */
  index?: number;
  as?: ElementType;
  className?: string;
  id?: string;
}

/**
 * Fades content up as it enters the viewport (once). Uses IntersectionObserver, never scroll
 * listeners. Under prefers-reduced-motion the CSS shows content immediately.
 */
export default function Reveal({ children, index = 0, as: Tag = "div", className = "", id }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // The root extends far above the viewport, so anything the user has scrolled past counts as
    // intersecting. A fast fling or an anchor jump that skips an element still reveals it.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "100000px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      id={id}
      data-shown={shown}
      className={`reveal-up ${className}`}
      style={{ "--i": index } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
