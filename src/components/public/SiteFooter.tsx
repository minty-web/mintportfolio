"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { Reveal } from "./Reveal";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const today = new Date().toISOString().slice(0, 10);

  return (
    <footer id="contact" className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8 md:py-36">
      <Reveal>
        <p className="label text-muted">Contact</p>
        <h2 className="mt-6 font-sans text-[clamp(3rem,11vw,9rem)] font-semibold leading-[0.95] tracking-[-0.03em]">
          Let&apos;s <span className="font-serif italic font-normal">talk</span>
          <span className="text-accent">.</span>
        </h2>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-12 flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <a
            href={`mailto:${siteConfig.email}`}
            className="group font-sans text-2xl font-medium tracking-tight transition-colors hover:text-accent md:text-4xl"
          >
            {siteConfig.email}
            <span
              aria-hidden
              className="inline-block transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </a>

          <div className="label flex flex-wrap gap-6 text-muted">
            <a
              href={siteConfig.url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-ink"
            >
              Website ↗
            </a>
            <Link href="/admin" className="transition-colors hover:text-ink">
              Admin
            </Link>
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
          <span className="label text-muted">
            © {year} {siteConfig.name}
          </span>
          <span className="label text-muted">
            Built with Next.js — <span className="text-ink/70">{today}</span>
          </span>
        </div>
      </Reveal>
    </footer>
  );
}
