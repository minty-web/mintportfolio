"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Gently pulls a wrapped element toward the cursor within a small radius.
 */
export function Magnetic({
  children,
  strength = 0.3,
}: {
  children: ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 14, mass: 0.15 });
  const sy = useSpring(y, { stiffness: 180, damping: 14, mass: 0.15 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ x: sx, y: sy }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

/**
 * Custom cursor: a small accent dot tracking 1:1, plus a lagging ring
 * that trails behind (spring/lerp). Visibility is CSS-gated to fine-pointer
 * devices; the native cursor is only hidden once the custom one is active.
 */
export function CustomCursor() {
  const [linkHover, setLinkHover] = useState(false);

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const ringX = useSpring(x, { stiffness: 240, damping: 24, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 240, damping: 24, mass: 0.6 });

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reducedMotion) return;

    document.documentElement.classList.add("custom-cursor");

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a, button, [data-magnetic]");
      setLinkHover(!!target);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });

    return () => {
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [x, y]);

  return (
    <>
      <motion.div
        aria-hidden
        className="cursor-el pointer-events-none fixed left-0 top-0 z-[200] -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-accent"
        style={{ x, y }}
      />
      <motion.div
        aria-hidden
        className="cursor-el pointer-events-none fixed left-0 top-0 z-[200] -ml-[17px] -mt-[17px] h-[34px] w-[34px] rounded-full border border-ink/70 mix-blend-difference"
        style={{ x: ringX, y: ringY }}
        animate={{
          scale: linkHover ? 1.8 : 1,
          backgroundColor: linkHover ? "rgba(242,242,239,0.85)" : "rgba(242,242,239,0)",
        }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      />
    </>
  );
}
