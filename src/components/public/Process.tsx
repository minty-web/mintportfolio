"use client";

import { CountUp, Reveal } from "./Reveal";

const steps = [
  {
    n: "01",
    title: "Discover",
    text: "The goal, the user, the constraint. Questions first, answers later.",
  },
  {
    n: "02",
    title: "Design",
    text: "Structure, hierarchy, and type-led interfaces that feel considered.",
  },
  {
    n: "03",
    title: "Build",
    text: "Fast, accessible, maintainable. Real code, not throwaway prototypes.",
  },
  {
    n: "04",
    title: "Ship",
    text: "Live, measured, iterated. A project only counts when it is public.",
  },
];

export function Process({
  projectCount,
  featuredCount,
}: {
  projectCount: number;
  featuredCount: number;
}) {
  return (
    <section id="about" className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8 md:py-36">
      <Reveal>
        <div className="mb-12 flex items-baseline justify-between gap-4">
          <h2 className="font-sans text-3xl font-semibold tracking-tight md:text-5xl">
            How I <span className="font-serif italic font-normal">work</span>
          </h2>
          <span className="label text-muted">Process</span>
        </div>
      </Reveal>

      {/* Numbered steps in minimal cards divided by hairlines */}
      <div className="grid grid-cols-1 gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <Reveal key={step.n} delay={i * 0.08} className="h-full">
            <div className="flex h-full flex-col bg-bg-2 p-6 md:p-8">
              <span className="label text-accent">{step.n}</span>
              <h3 className="mt-5 font-sans text-xl font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Stats — count up into view */}
      <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-line pt-8 sm:grid-cols-3">
        <div>
          <p className="font-sans text-5xl font-semibold tracking-tight md:text-6xl">
            <CountUp to={projectCount} />
          </p>
          <p className="label mt-2 text-muted">Projects shipped</p>
        </div>
        <div>
          <p className="font-sans text-5xl font-semibold tracking-tight md:text-6xl">
            <CountUp to={featuredCount} />
          </p>
          <p className="label mt-2 text-muted">Featured</p>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <p className="font-sans text-5xl font-semibold tracking-tight md:text-6xl">
            <CountUp to={3} />
            <span className="text-accent">+</span>
          </p>
          <p className="label mt-2 text-muted">Years building</p>
        </div>
      </div>
    </section>
  );
}
