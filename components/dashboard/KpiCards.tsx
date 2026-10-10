import { BellRinging, SignOut, Timer, Users, UsersThree } from "@phosphor-icons/react/ssr";
import type { Kpis } from "@/lib/api";
import { fmtNum } from "@/lib/format";

export default function KpiCards({ kpis }: { kpis: Kpis }) {
  // Colour only carries meaning: warn/bad when a number needs a manager's attention.
  const items = [
    { Icon: Users, label: "Visitors", value: fmtNum(kpis.visitors), tone: "text-fg" },
    { Icon: UsersThree, label: "Groups", value: fmtNum(kpis.groups), tone: "text-fg" },
    {
      Icon: Timer,
      label: "Avg first approach",
      value: `${fmtNum(kpis.avg_first_approach_s, 0)}s`,
      tone: kpis.avg_first_approach_s > 60 ? "text-warn" : "text-fg",
    },
    {
      Icon: SignOut,
      label: "Unattended exits",
      value: fmtNum(kpis.unattended_exits),
      tone: kpis.unattended_exits > 0 ? "text-bad" : "text-fg",
    },
    { Icon: BellRinging, label: "Alerts", value: fmtNum(kpis.alerts), tone: kpis.alerts > 0 ? "text-warn" : "text-fg" },
  ];
  return (
    <section className="grid grid-cols-2 gap-px overflow-hidden rounded-surface border border-line bg-line sm:grid-cols-5">
      {items.map(({ Icon, label, value, tone }, i) => (
        <div key={label} className={`bg-panel p-4 sm:p-5 ${i === 0 ? "col-span-2 sm:col-span-1" : ""}`}>
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <Icon size={14} aria-hidden />
            {label}
          </div>
          <div className={`mt-2 font-mono text-3xl font-semibold tracking-tight tabular-nums ${tone}`}>{value}</div>
        </div>
      ))}
    </section>
  );
}
