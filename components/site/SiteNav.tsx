"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Scan } from "@phosphor-icons/react";
import HealthDot from "@/components/HealthDot";

const LINKS = [
  { href: "/#how", label: "How it works" },
  { href: "/#features", label: "Features" },
  { href: "/#speed", label: "Speed" },
];

export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5 font-semibold tracking-tight" aria-label="ShowroomPulse home">
      <span className="grid size-8 place-items-center rounded-[10px] bg-accent text-accent-ink">
        <Scan size={18} weight="bold" aria-hidden />
      </span>
      <span>
        ShowroomPulse<span className="text-accent"> AI</span>
      </span>
    </Link>
  );
}

export default function SiteNav() {
  const [open, setOpen] = useState(false);

  // Lock page scroll and allow Esc to close while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-3 z-40 px-3 sm:top-5 sm:px-4">
        <nav
          aria-label="Main"
          className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 rounded-full bg-bg/70 pr-2 pl-4 ring-1 ring-white/[0.09] backdrop-blur-xl sm:pl-5"
        >
          <Logo />

          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="rounded-full px-3.5 py-2 text-sm text-muted transition duration-300 ease-fluid hover:bg-white/5 hover:text-fg"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <HealthDot compact />
            <Link href="/#analyse" className="group btn-primary hidden min-h-10 py-1.5 pr-1.5 text-sm sm:inline-flex">
              Analyse a video
              <span className="btn-icon size-7">
                <ArrowUpRight size={14} weight="bold" aria-hidden />
              </span>
            </Link>
            <button
              type="button"
              className="relative grid size-10 place-items-center rounded-full bg-white/5 md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              {/* Two bars morph into an X. */}
              <span
                className={`absolute h-0.5 w-4 rounded-full bg-fg transition duration-500 ease-fluid ${
                  open ? "rotate-45" : "-translate-y-[3px]"
                }`}
              />
              <span
                className={`absolute h-0.5 w-4 rounded-full bg-fg transition duration-500 ease-fluid ${
                  open ? "-rotate-45" : "translate-y-[3px]"
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      <div
        id="mobile-menu"
        className={`fixed inset-0 z-[39] bg-bg/90 backdrop-blur-2xl transition-opacity duration-500 ease-fluid md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <ul className="flex h-full flex-col justify-center gap-2 px-8">
          {[...LINKS, { href: "/#analyse", label: "Analyse a video" }].map((l, i) => (
            <li
              key={l.href}
              className={`transition duration-700 ease-fluid ${open ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
              style={{ transitionDelay: open ? `${100 + i * 60}ms` : "0ms" }}
            >
              <Link
                href={l.href}
                tabIndex={open ? 0 : -1}
                onClick={(e) => {
                  setOpen(false);
                  // On the home page, scroll ourselves once the scroll lock is released; a hash
                  // navigation fired while body is overflow:hidden does not move the page.
                  const target = document.getElementById(l.href.split("#")[1]);
                  if (!target) return; // other pages: let the Link navigate to /#section
                  e.preventDefault();
                  requestAnimationFrame(() =>
                    requestAnimationFrame(() => {
                      target.scrollIntoView({ behavior: "smooth", block: "start" });
                      history.replaceState(null, "", l.href);
                    }),
                  );
                }}
                className={`block py-2 text-4xl font-semibold tracking-tighter ${
                  l.href === "/#analyse" ? "text-accent" : "text-fg"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
