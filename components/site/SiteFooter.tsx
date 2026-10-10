import Link from "next/link";
import { Logo } from "./SiteNav";

const LINKS = [
  { href: "/#how", label: "How it works" },
  { href: "/#features", label: "Features" },
  { href: "/#speed", label: "Speed" },
  { href: "/#analyse", label: "Analyse a video" },
];

export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr] md:py-16">
        <div>
          <Logo />
          <p className="mt-4 max-w-[40ch] text-sm leading-relaxed text-muted">
            Video analytics for car showrooms. See which cars draw attention and which visitors were left waiting.
          </p>
        </div>
        <nav aria-label="Footer" className="md:justify-self-end">
          <ul className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-muted transition duration-300 hover:text-fg">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-xs text-muted">
          <span>Built at WIUT Hackathon</span>
          <span>ShowroomPulse AI</span>
        </div>
      </div>
    </footer>
  );
}
