import { getProjects } from "@/lib/projects";
import { siteConfig } from "@/lib/site";
import { Site } from "@/components/public/Site";

export const metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

// Projects live in Netlify Blobs (runtime store) — not available during
// `next build`, so the landing page is rendered on demand.
export const dynamic = "force-dynamic";

export default async function Home() {
  const projects = await getProjects();

  return <Site projects={projects} />;
}
