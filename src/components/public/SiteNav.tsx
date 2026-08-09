"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site";
import { EASE } from "./Reveal";
import { Magnetic } from "./CustomCursor";

const links = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

/** Sticky nav — hides on scroll down, reveals on scroll up. */
export function SiteNav() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > last && y > 160);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 border-b border-line/60 bg-bg/85 backdrop-blur-md"
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: hidden ? -120 : 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link
          href="#top"
          className="font-mono text-xs uppercase tracking-[0.22em] text-ink transition-colors hover:text-accent"
        >
          {siteConfig.name}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Magnetic key={link.href}>
              <a
                href={link.href}
                className="label text-muted transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            </Magnetic>
          ))}
        </nav>

        <span className="label flex shrink-0 items-center gap-2 border border-line px-3 py-1.5 text-ink/80">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          {siteConfig.availability}
        </span>
      </div>
    </motion.header>
  );
}
