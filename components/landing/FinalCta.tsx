import Link from "next/link";
import { ArrowUp } from "@phosphor-icons/react/ssr";
import Reveal from "@/components/site/Reveal";

export default function FinalCta() {
  return (
    <section className="pt-8 pb-4">
      <Reveal className="bezel">
        <div className="bezel-core relative isolate overflow-hidden px-6 py-16 text-center sm:px-12 md:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -bottom-1/2 -z-10 mx-auto h-full max-w-3xl bg-[radial-gradient(ellipse_at_center,rgb(62_207_142/0.16),transparent_65%)]"
          />
          <h2 className="mx-auto max-w-[20ch] text-3xl font-semibold tracking-tighter text-balance md:text-5xl">
            See your showroom the way your customers do
          </h2>
          <p className="mx-auto mt-5 max-w-[44ch] text-base leading-relaxed text-muted md:text-lg">
            One clip is enough for a first report. Record a few minutes of the floor and upload it from your phone.
          </p>
          <Link href="#analyse" className="group btn-primary mt-9 pr-1.5 text-base">
            Analyse a video
            <span className="btn-icon">
              <ArrowUp size={16} weight="bold" aria-hidden />
            </span>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
