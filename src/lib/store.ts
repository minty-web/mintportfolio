import { promises as fs } from "node:fs";
import path from "node:path";
import type { PublicProject } from "./types";

/**
 * Storage backend.
 *
 * - On Netlify: the whole project list lives in one key of a Netlify Blob
 *   store. No database, no migrations — the store is enabled by default on
 *   Netlify.
 * - Locally (`next dev` without the Netlify CLI): a plain JSON file, so
 *   development needs zero extra tooling.
 *
 * Selection: `NETLIFY=true` is set by Netlify automatically at build and
 * runtime. `STORAGE=netlify` / `STORAGE=local` forces either side.
 */

const LOCAL_FILE = path.join(process.cwd(), ".data", "projects.json");

const useNetlify =
  process.env.NETLIFY === "true" || process.env.STORAGE === "netlify";

async function readLocal(): Promise<PublicProject[] | null> {
  try {
    const raw = await fs.readFile(LOCAL_FILE, "utf8");
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PublicProject[]) : null;
  } catch {
    return null;
  }
}

async function writeLocal(projects: PublicProject[]): Promise<void> {
  await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await fs.writeFile(LOCAL_FILE, JSON.stringify(projects, null, 2), "utf8");
}

async function readBlob(): Promise<PublicProject[] | null> {
  const { getStore } = await import("@netlify/blobs");
  const store = getStore({ name: "portfolio" });
  const data: unknown = await store.get("projects", { type: "json" });
  return Array.isArray(data) ? (data as PublicProject[]) : null;
}

async function writeBlob(projects: PublicProject[]): Promise<void> {
  const { getStore } = await import("@netlify/blobs");
  const store = getStore({ name: "portfolio" });
  await store.setJSON("projects", projects);
}

export async function readProjects(): Promise<PublicProject[]> {
  const data = useNetlify ? await readBlob() : await readLocal();
  return data ?? [];
}

export async function writeProjects(projects: PublicProject[]): Promise<void> {
  if (useNetlify) {
    await writeBlob(projects);
  } else {
    await writeLocal(projects);
  }
}
