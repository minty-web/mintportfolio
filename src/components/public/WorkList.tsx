"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useEffect, useState } from "react";
import type { PublicProject } from "@/lib/types";
import { CountUp, EASE, Reveal } from "./Reveal";

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function Row({
  project,
  index,
  onHover,
}: {
  project: PublicProject;
  index: number;
  onHover: (project: PublicProject | null) => void;
}) {
  const meta = project.tags.join(" / ") || hostname(project.url);

  return (
    <li>
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${project.title} — opens the live site in a new tab`}
        onMouseEnter={() => onHover(project)}
        onMouseLeave={() => onHover(null)}
        onFocus={() => onHover(project)}
        onBlur={() => onHover(null)}
        className="group relative block border-t border-line py-7 md:py-9"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:gap-8">
          <span className="label shrink-0 text-muted/50">
            <CountUp to={index + 1} pad={2} className="tabular-nums" />
            <span className="text-line"> /</span>
          </span>
          <h3 className="font-sans text-3xl font-semibold leading-tight tracking-[-0.02em] text-ink transition-transform duration-500 ease-out group-hover:translate-x-2 md:text-6xl">
            {project.title}
          </h3>
          <span className="label shrink-0 text-muted transition-colors duration-500 group-hover:text-accent md:ml-auto">
            {meta}
          </span>
        </div>

        {/* underline draws in from the left on hover */}
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-hover:scale-x-100"
        />
        {/* external-link indicator */}
        <span
          aria-hidden
          className="label absolute right-0 top-1/2 -translate-y-1/2 text-accent opacity-0 transition-all duration-500 group-hover:opacity-100"
        >
          ↗
        </span>
      </a>
    </li>
  );
}

/**
 * Vertical list of project rows. On desktop, hovering a row fades in a
 * thumbnail that trails the cursor with a slight spring lag.
 */
export function WorkList({ projects }: { projects: PublicProject[] }) {
  const reduce = !!useReducedMotion();

  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);
  const px = useSpring(mx, { stiffness: 120, damping: 20, mass: 0.6 });
  const py = useSpring(my, { stiffness: 120, damping: 20, mass: 0.6 });

  const [active, setActive] = useState<PublicProject | null>(null);

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my, reduce]);

  return (
    <section id="work" className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8 md:py-36">
      <Reveal>
        <header className="mb-14 flex items-baseline justify-between gap-4">
          <h2 className="font-sans text-3xl font-semibold tracking-tight md:text-5xl">
            Selected <span className="font-serif italic font-normal">work</span>
          </h2>
          <span className="label shrink-0 text-muted">
            <CountUp to={projects.length} className="tabular-nums" />{" "}
            {projects.length === 1 ? "project" : "projects"}
          </span>
        </header>
      </Reveal>

      <ul>
        {projects.map((project, i) => (
          <Row key={project.id} project={project} index={i} onHover={setActive} />
        ))}
      </ul>

      {/* Cursor-trailing preview (desktop only) */}
      {!reduce && (
        <AnimatePresence>
          {active && (
            <motion.div
              className="pointer-events-none fixed left-0 top-0 z-[80] hidden w-[24rem] max-w-[70vw] md:block"
              style={{ x: px, y: py }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              <div className="ml-6 mt-6">
                <div className="aspect-[4/3] overflow-hidden border border-line bg-bg-2">
                  {active.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element -- arbitrary external URL from admin data
                    <img
                      src={active.thumbnail}
                      alt={`${active.title} — preview`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-bg-2">
                      <span className="font-serif text-4xl italic text-muted">
                        {active.title.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="label text-muted">{active.title}</span>
                  <span className="label text-accent">↗</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </section>
  );
}
