// Seeds sample projects into the LOCAL dev store (`.data/projects.json`).
// Production content on Netlify lives in Netlify Blobs and is managed via
// /admin — there is nothing to seed server-side.
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

const FILE = path.join(process.cwd(), ".data", "projects.json");

const samples = [
  {
    title: "Field Notes Journal",
    description:
      "A minimal journaling app with daily prompts, streaks, and a calm reading view. Built for people who write a little, every day.",
    url: "https://example.com/field-notes",
    thumbnail: "https://picsum.photos/seed/fieldnotes/800/600",
    tags: ["web", "react"],
    featured: true,
  },
  {
    title: "Atlas & Co. Storefront",
    description:
      "A fictional outdoor-gear storefront: searchable catalogue, cart, and checkout in one fluid flow. Mobile-first and keyboard-friendly.",
    url: "https://example.com/atlas-store",
    thumbnail: "https://picsum.photos/seed/atlasstore/800/600",
    tags: ["e-commerce", "nextjs"],
    featured: true,
  },
  {
    title: "Orbit Dashboard",
    description:
      "A real-time analytics dashboard with live charts, alerting, and a dark theme that is easy on the eyes for long shifts.",
    url: "https://example.com/orbit-dashboard",
    thumbnail: "https://picsum.photos/seed/orbitdash/800/600",
    tags: ["dashboard", "typescript"],
    featured: false,
  },
  {
    title: "Paper Trails",
    description:
      "A tiny static-site generator playground. Edits are instant, deploys are push-button, and the output is fast everywhere.",
    url: "https://example.com/paper-trails",
    thumbnail: "https://picsum.photos/seed/papertrails/800/600",
    tags: ["tooling", "static-site"],
    featured: false,
  },
  {
    title: "Common Thread",
    description:
      "A community forum for a local makerspace — threads, workshops, and an event calendar shared across the city.",
    url: "https://example.com/common-thread",
    thumbnail: "https://picsum.photos/seed/commonthread/800/600",
    tags: ["web", "community"],
    featured: false,
  },
  {
    title: "Nimbus Weather",
    description:
      "A weather micro-site with playful visuals and one-glance forecasts. No sign-up, no cookies, just the sky.",
    url: "https://example.com/nimbus",
    thumbnail: "https://picsum.photos/seed/nimbus/800/600",
    tags: ["web", "api"],
    featured: false,
  },
];

async function main() {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      console.log(
        `Seed skipped — ${parsed.length} project(s) already present in .data/projects.json`
      );
      return;
    }
  } catch {
    // file missing → seed
  }

  const now = new Date().toISOString();
  const projects = samples.map((s, i) => ({
    id: randomUUID(),
    ...s,
    order: i,
    createdAt: now,
    updatedAt: now,
  }));

  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(projects, null, 2), "utf8");
  console.log(`Seeded ${projects.length} sample projects into .data/projects.json`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
