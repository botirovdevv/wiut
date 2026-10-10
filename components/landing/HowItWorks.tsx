import { Lightning, Scan, UploadSimple } from "@phosphor-icons/react/ssr";
import Reveal from "@/components/site/Reveal";

const STEPS = [
  { Icon: UploadSimple, title: "Upload", text: "Record the showroom floor on your phone, or upload an existing clip up to 200 MB." },
  { Icon: Scan, title: "Detect", text: "Visitors and staff are tracked around every car: stops, walk-arounds, door opens, seat tests." },
  { Icon: Lightning, title: "Act", text: "Get a report with missed visitors, staff response times and a short summary for the manager." },
];

export default function HowItWorks() {
  return (
    <section id="how" className="border-t border-line py-20 md:py-28">
      <Reveal>
        <h2 className="text-3xl font-semibold tracking-tighter md:text-5xl">How it works</h2>
      </Reveal>
      {/* Mobile: vertical rail. md+: one row with a horizontal rail through the icons. */}
      <ol className="relative mt-12 grid gap-10 md:mt-16 md:grid-cols-3 md:gap-12">
        <span
          aria-hidden
          className="absolute top-6 bottom-6 left-6 w-px bg-gradient-to-b from-accent/50 via-line to-transparent md:top-6 md:right-[12%] md:bottom-auto md:h-px md:w-auto md:bg-gradient-to-r"
        />
        {STEPS.map(({ Icon, title, text }, i) => (
          <Reveal as="li" key={title} index={i} className="relative grid grid-cols-[3rem_1fr] gap-5 md:grid-cols-1 md:gap-6">
            <span className="relative grid size-12 place-items-center rounded-[16px] bg-bg ring-1 ring-white/[0.08]">
              <span className="grid size-10 place-items-center rounded-[12px] bg-panel text-accent">
                <Icon size={20} aria-hidden />
              </span>
            </span>
            <div>
              <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
              <p className="mt-2 max-w-[36ch] text-sm leading-relaxed text-muted">{text}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
