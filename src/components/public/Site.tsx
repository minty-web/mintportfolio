"use client";

import { MotionConfig } from "framer-motion";
import type { PublicProject } from "@/lib/types";
import { CustomCursor } from "./CustomCursor";
import { Hero } from "./Hero";
import { Process } from "./Process";
import { SiteFooter } from "./SiteFooter";
import { SiteIntro } from "./SiteIntro";
import { SiteNav } from "./SiteNav";
import { SmoothScroll } from "./SmoothScroll";
import { WorkList } from "./WorkList";

/**
 * Root of the public site. Wraps everything in a single client boundary so
 * motion configuration and the intro/preloader coordinate cleanly.
 */
export function Site({ projects }: { projects: PublicProject[] }) {
  const featuredCount = projects.filter((p) => p.featured).length;

  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      <CustomCursor />
      <SiteIntro />
      <SiteNav />
      <main>
        <Hero />
        <WorkList projects={projects} />
        <Process projectCount={projects.length} featuredCount={featuredCount} />
      </main>
      <SiteFooter />
    </MotionConfig>
  );
}
