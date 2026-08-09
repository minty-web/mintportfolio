"use client";

import { motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "@/lib/site";
import { EASE } from "./Reveal";

/** Wait until the preloader count + wipe has started clearing. */
const INTRO_DELAY = 1.3;

function Word({
  children,
  italic = false,
  delay,
  reduce,
}: {
  children: string;
  italic?: boolean;
  delay: number;
  reduce: boolean;
}) {
  return (
    <span className="inline-block overflow-hidden pb-[0.09em] -mb-[0.09em] align-bottom">
      <motion.span
        className={`inline-block ${italic ? "font-serif italic font-normal" : ""}`}
        initial={reduce ? false : { y: "118%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.85, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function RotatingBadge() {
  return (
    <div aria-hidden className="spin-slow relative h-24 w-24 md:h-28 md:w-28">
      <svg viewBox="0 0 100 100" className="h-full w-full text-muted">
        <defs>
          <path
            id="badge-circle"
            d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"
            fill="none"
          />
        </defs>
        <text className="fill-current font-mono" style={{ fontSize: "8px", letterSpacing: "2.5px" }}>
          <textPath href="#badge-circle">
            OPEN FOR PROJECTS • AVAILABLE • OPEN FOR PROJECTS •
          </textPath>
        </text>
      </svg>
      <span className="absolute inset-0 m-auto h-1.5 w-1.5 rounded-full bg-accent" />
    </div>
  );
}

export function Hero() {
  const reduce = !!useReducedMotion();
  const base = reduce ? 0 : INTRO_DELAY;

  return (
    <section
      id="top"
      className="relative mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-end px-5 pb-12 pt-36 sm:px-8"
    >
      <div className="pointer-events-none absolute right-6 top-32 md:right-12 md:top-40">
        <RotatingBadge />
      </div>

      <p className="label text-muted">
        Portfolio — {new Date().getFullYear()}
      </p>

      <h1 className="mt-8 font-sans text-[clamp(3rem,9.5vw,8.75rem)] font-semibold leading-[0.93] tracking-[-0.03em]">
        <Word reduce={reduce} delay={base}>Building</Word>{" "}
        <Word reduce={reduce} delay={base + 0.07}>for</Word>{" "}
        <Word reduce={reduce} delay={base + 0.14}>the</Word>{" "}
        <Word reduce={reduce} delay={base + 0.21} italic>open</Word>{" "}
        <Word reduce={reduce} delay={base + 0.28} italic>web</Word>
        <motion.span
          className="inline-block text-accent"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: base + 0.42 }}
        >
          .
        </motion.span>
      </h1>

      <motion.p
        className="mt-8 max-w-md text-base leading-relaxed text-muted md:text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: base + 0.5 }}
      >
        A curated index of web projects. Every card opens the live site in a
        new tab.
      </motion.p>

      <dl className="mt-14 grid grid-cols-1 gap-y-3 border-t border-line pt-6 sm:grid-cols-3 sm:gap-x-8">
        {[
          ["Location", "Anywhere / Remote"],
          ["Role", siteConfig.role],
          ["Status", siteConfig.availability],
        ].map(([key, value]) => (
          <div
            key={key}
            className="flex items-baseline justify-between gap-4 sm:flex-col sm:items-start sm:gap-1"
          >
            <dt className="label text-muted/70">{key}</dt>
            <dd className="text-sm text-ink/90">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
