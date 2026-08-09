import { randomUUID } from "node:crypto";
import type { PublicProject } from "./types";
import { readProjects, writeProjects } from "./store";

export type ProjectInput = {
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  tags: string[];
  featured: boolean;
};

/** Projects in admin order (order asc, then creation time as a tiebreak). */
export async function getProjects(): Promise<PublicProject[]> {
  const projects = await readProjects();
  return [...projects].sort(
    (a, b) => a.order - b.order || a.createdAt.localeCompare(b.createdAt)
  );
}

export async function getProject(id: string): Promise<PublicProject | null> {
  const projects = await readProjects();
  return projects.find((p) => p.id === id) ?? null;
}

/** Sort by order and renumber to a compact 0..n-1 before writing. */
async function persist(projects: PublicProject[]): Promise<void> {
  const ordered = [...projects].sort(
    (a, b) => a.order - b.order || a.createdAt.localeCompare(b.createdAt)
  );
  await writeProjects(ordered.map((p, i) => ({ ...p, order: i })));
}

export async function createProject(input: ProjectInput): Promise<PublicProject> {
  const projects = await readProjects();
  const maxOrder = projects.reduce((max, p) => Math.max(max, p.order), -1);
  const now = new Date().toISOString();
  const project: PublicProject = {
    id: randomUUID(),
    title: input.title,
    description: input.description,
    url: input.url,
    thumbnail: input.thumbnail,
    tags: input.tags,
    featured: input.featured,
    order: maxOrder + 1,
    createdAt: now,
    updatedAt: now,
  };
  await persist([...projects, project]);
  return project;
}

export async function updateProject(
  id: string,
  input: ProjectInput
): Promise<PublicProject> {
  const projects = await readProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) throw new Error("Project not found");
  const updated: PublicProject = {
    ...projects[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  projects[index] = updated;
  await persist(projects);
  return updated;
}

/** Delete a project and return the thumbnail URL of the removed project. */
export async function deleteProject(id: string): Promise<string | null> {
  const projects = await readProjects();
  const removed = projects.find((p) => p.id === id);
  await persist(projects.filter((p) => p.id !== id));
  return removed?.thumbnail ?? null;
}

/** Swap a project with its neighbour in the admin-defined order. */
export async function moveProject(
  id: string,
  direction: "up" | "down"
): Promise<void> {
  const projects = await getProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return;
  const neighbour = direction === "up" ? index - 1 : index + 1;
  if (neighbour < 0 || neighbour >= projects.length) return;

  const a = projects[index];
  const b = projects[neighbour];
  const tmp = a.order;
  a.order = b.order;
  b.order = tmp;

  await persist(projects);
}
