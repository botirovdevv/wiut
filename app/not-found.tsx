import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/ssr";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60dvh] max-w-xl flex-col items-start justify-center py-16">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tighter md:text-5xl">This page is not on the floor</h1>
      <p className="mt-4 max-w-[44ch] leading-relaxed text-muted">
        The link may be old, or the report was removed. You can start a new analysis from the home page.
      </p>
      <Link href="/" className="group btn-ghost mt-8 pl-1.5">
        <span className="grid size-8 place-items-center rounded-full bg-white/5 transition duration-300 ease-fluid group-hover:-translate-x-0.5">
          <ArrowLeft size={14} weight="bold" aria-hidden />
        </span>
        Back to home
      </Link>
    </section>
  );
}
