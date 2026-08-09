"use client";

import { AnimatePresence, animate, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { EASE_IN_OUT } from "./Reveal";

/**
 * Preloader: counts 00 → 100%, then wipes up to reveal the hero.
 * Pure overlay (pointer-events: none) — the nav behind stays clickable.
 */
export function SiteIntro() {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const controls = animate(0, 100, {
      duration: 1.1,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => setDone(true),
    });
    return () => controls.stop();
  }, [reduce]);

  if (reduce) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[90] flex items-end justify-end bg-[#0a0a0a] p-8 md:p-14"
          exit={{ y: "-100%", transition: { duration: 0.75, ease: EASE_IN_OUT } }}
        >
          <span className="font-sans text-[clamp(5rem,18vw,14rem)] font-semibold leading-none tracking-[-0.04em] text-ink">
            {String(count).padStart(2, "0")}
            <span className="text-accent">%</span>
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
