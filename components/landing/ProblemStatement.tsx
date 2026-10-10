import Reveal from "@/components/site/Reveal";

export default function ProblemStatement() {
  return (
    <section className="border-t border-line py-20 md:py-32">
      <Reveal>
        <p className="max-w-[22ch] text-3xl leading-[1.12] font-semibold tracking-tighter text-balance md:text-5xl">
          A visitor left alone at a car usually walks out.{" "}
          <span className="text-muted">Managers find out weeks later, from the sales numbers.</span>
        </p>
      </Reveal>
      <Reveal index={1}>
        <p className="mt-8 max-w-[56ch] text-base leading-relaxed text-muted md:ml-auto md:text-lg">
          ShowroomPulse watches the floor for you. It flags the moment someone has waited too long, and shows which
          cars earn a second look.
        </p>
      </Reveal>
    </section>
  );
}
