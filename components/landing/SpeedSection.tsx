import { DeviceMobile, Lightning, Polygon, ChatText } from "@phosphor-icons/react/ssr";
import Reveal from "@/components/site/Reveal";
import { EXAMPLE_META } from "@/lib/example";
import { fmtNum, mmss } from "@/lib/format";
import ExampleTag from "./previews/ExampleTag";

const POINTS = [
  { Icon: DeviceMobile, title: "Works from a phone", text: "Record on the spot. The upload page opens the camera directly." },
  { Icon: Polygon, title: "Your own zones", text: "If cars are not found automatically, outline them on the first frame and re-run." },
  { Icon: ChatText, title: "Plain-language summary", text: "The numbers come with a short note a manager can act on." },
];

export default function SpeedSection() {
  const { processing_time_s: proc, duration_s: dur, fps_processed: fps } = EXAMPLE_META;
  const speedup = dur / proc;
  return (
    <section id="speed" className="grid gap-12 border-t border-line py-20 md:py-28 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
      <div>
        <Reveal>
          <h2 className="max-w-[14ch] text-3xl font-semibold tracking-tighter text-balance md:text-5xl">
            Faster than the video itself
          </h2>
        </Reveal>
        <Reveal index={1}>
          <p className="mt-5 max-w-[48ch] text-base leading-relaxed text-muted md:text-lg">
            Every report shows how long the analysis took next to the length of the clip, so the speed is measured, not
            claimed.
          </p>
        </Reveal>
        <ul className="mt-10 space-y-6">
          {POINTS.map(({ Icon, title, text }, i) => (
            <Reveal as="li" key={title} index={i + 2} className="flex gap-4">
              <Icon size={22} className="mt-0.5 shrink-0 text-accent" aria-hidden />
              <div>
                <h3 className="font-semibold tracking-tight">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>

      <Reveal index={1} className="bezel self-center">
        <div className="bezel-core p-6 sm:p-8">
          <div className="flex items-start justify-between gap-3">
            <span className="grid size-11 place-items-center rounded-[12px] bg-accent text-accent-ink">
              <Lightning size={22} weight="fill" aria-hidden />
            </span>
            <ExampleTag />
          </div>
          <div className="mt-6 font-mono text-6xl font-semibold tracking-tighter text-accent tabular-nums sm:text-7xl">
            {fmtNum(speedup)}x
          </div>
          <div className="mt-1 text-sm text-muted">faster than real time</div>

          {/* Two bars on the same scale: clip length vs time spent analysing it. */}
          <div className="mt-8 space-y-4">
            <div>
              <div className="mb-1.5 flex justify-between text-xs">
                <span className="text-muted">Video length</span>
                <span className="font-mono tabular-nums">{mmss(dur)}</span>
              </div>
              <div className="h-2.5 rounded-full bg-fg/25" />
            </div>
            <div>
              <div className="mb-1.5 flex justify-between text-xs">
                <span className="text-muted">Processing time</span>
                <span className="font-mono tabular-nums">{mmss(proc)}</span>
              </div>
              <div className="h-2.5 rounded-full bg-accent" style={{ width: `${(proc / dur) * 100}%` }} />
            </div>
          </div>

          <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-6">
            {[
              ["Processing", `${fmtNum(proc)}s`],
              ["Clip", mmss(dur)],
              ["Analysed at", `${fps} fps`],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-muted">{k}</dt>
                <dd className="mt-0.5 font-mono text-base font-semibold tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>
    </section>
  );
}
