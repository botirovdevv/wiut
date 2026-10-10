import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "@phosphor-icons/react/ssr";
import UploadCard from "@/components/UploadCard";
import Reveal from "@/components/site/Reveal";

export default function Hero() {
  return (
    <section className="relative isolate grid items-center gap-10 pt-6 pb-20 md:pt-12 lg:grid-cols-[1.08fr_1fr] lg:gap-16 lg:pt-16 lg:pb-28">
      {/* Ambient light behind the hero. Soft radial wash, not a neon glow. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 left-1/2 -z-10 h-[640px] w-[min(1200px,100vw)] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgb(62_207_142/0.13),transparent_62%)]"
      />

      <div>
        <Reveal>
          <span className="eyebrow-pill">Showroom video analytics</span>
        </Reveal>
        <Reveal index={1}>
          <h1 className="mt-6 text-[2.6rem] leading-[1.02] font-semibold tracking-tighter text-balance sm:text-6xl lg:text-[4.25rem]">
            Every showroom visitor gets attention <span className="text-accent">on time</span>
          </h1>
        </Reveal>
        <Reveal index={2}>
          <p className="mt-6 max-w-[44ch] text-base leading-relaxed text-muted sm:text-lg">
            Upload one clip of the floor. See which cars draw people in, how fast staff respond and who left waiting.
          </p>
        </Reveal>
        <Reveal index={3} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <Link href="#analyse" className="group btn-primary pr-1.5 text-base lg:hidden">
            Analyse a video
            <span className="btn-icon">
              <ArrowDown size={16} weight="bold" aria-hidden />
            </span>
          </Link>
          <Link
            href="#how"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-fg/80 transition duration-300 hover:text-fg"
          >
            See how it works
            <ArrowUpRight
              size={14}
              className="transition duration-300 ease-fluid group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden
            />
          </Link>
        </Reveal>
      </div>

      <Reveal index={2}>
        <UploadCard />
      </Reveal>
    </section>
  );
}
