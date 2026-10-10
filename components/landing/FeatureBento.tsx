import type { ReactNode } from "react";
import { BellRinging, ChatText, Fire, Funnel, ListBullets } from "@phosphor-icons/react/ssr";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import Reveal from "@/components/site/Reveal";
import { EXAMPLE_ALERTS, EXAMPLE_SUMMARY } from "@/lib/example";
import { mmss } from "@/lib/format";
import ExampleTag from "./previews/ExampleTag";
import MiniFunnel from "./previews/MiniFunnel";
import MiniHeatmap from "./previews/MiniHeatmap";
import MiniTimeline from "./previews/MiniTimeline";

function Cell({
  icon: Icon, title, text, children, className = "", index = 0, tint = "",
}: {
  icon: PhosphorIcon;
  title: string;
  text: string;
  children: ReactNode;
  className?: string;
  index?: number;
  tint?: string;
}) {
  return (
    <Reveal index={index} className={`bezel ${className}`}>
      <article className={`bezel-core flex h-full flex-col gap-5 p-5 sm:p-6 ${tint}`}>
        <header className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-[10px] bg-accent/10 text-accent">
              <Icon size={16} aria-hidden />
            </span>
            <h3 className="font-semibold tracking-tight">{title}</h3>
          </div>
          <ExampleTag />
        </header>
        <p className="max-w-[46ch] text-sm leading-relaxed text-muted">{text}</p>
        <div className="mt-auto">{children}</div>
      </article>
    </Reveal>
  );
}

export default function FeatureBento() {
  return (
    <section id="features" className="border-t border-line py-20 md:py-28">
      <Reveal>
        <h2 className="max-w-[18ch] text-3xl font-semibold tracking-tighter text-balance md:text-5xl">
          What one clip tells you
        </h2>
      </Reveal>
      <Reveal index={1}>
        <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-muted md:text-lg">
          Every report has the same five views. The ones below use example data.
        </p>
      </Reveal>

      {/* lg rhythm: 7/5, then 4/8, then one full-width row. md: 2 cols. Mobile: 1 col. */}
      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-5">
        <Cell
          icon={Funnel}
          title="Interest per car"
          text="From walking past to sitting inside, see where each car loses people and whether staff stepped in."
          className="md:col-span-2 lg:col-span-7"
        >
          <MiniFunnel />
        </Cell>
        <Cell
          icon={Fire}
          title="Floor heatmap"
          text="Where visitors actually spent their time, drawn over the first frame with every car zone outlined."
          className="md:col-span-2 lg:col-span-5"
          index={1}
        >
          <MiniHeatmap />
        </Cell>
        <Cell
          icon={BellRinging}
          title="Missed-visitor alerts"
          text="Groups left alone too long are flagged with the exact moment."
          className="md:col-span-2 lg:col-span-4"
          index={2}
          tint="bg-[linear-gradient(160deg,rgb(232_185_49/0.07),transparent_55%)]"
        >
          <ul className="space-y-2">
            {EXAMPLE_ALERTS.map((a) => (
              <li key={a.t} className="flex items-start gap-3 rounded-media border border-warn/20 bg-warn/5 p-3 text-sm">
                <span className="shrink-0 rounded-full bg-warn/15 px-2 py-0.5 font-mono text-xs text-warn tabular-nums">
                  {mmss(a.t)}
                </span>
                {a.message}
              </li>
            ))}
          </ul>
        </Cell>
        <Cell
          icon={ListBullets}
          title="Event timeline"
          text="Every stop, door open and staff approach on one track. Tap a marker to jump the video there."
          className="md:col-span-2 lg:col-span-8"
          index={3}
        >
          <MiniTimeline />
        </Cell>
        <Cell
          icon={ChatText}
          title="Manager summary"
          text="A short write-up in plain language, ready to read out at the morning briefing."
          className="md:col-span-2 lg:col-span-12"
          index={4}
          tint="bg-[radial-gradient(ellipse_at_top_right,rgb(62_207_142/0.08),transparent_60%)]"
        >
          <blockquote className="max-w-[72ch] border-l-2 border-accent/50 pl-4 text-sm leading-relaxed text-fg/85">
            {EXAMPLE_SUMMARY}
          </blockquote>
        </Cell>
      </div>
    </section>
  );
}
