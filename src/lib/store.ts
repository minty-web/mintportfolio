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
 * Backend selection (in priority order):
 *   `STORAGE=netlify`  → Netlify Blobs
 *   `STORAGE=local`    → local JSON file
 *   Netlify runtime    → Netlify Blobs  (NETLIFY=true is set by Netlify)
 *   otherwise          → local JSON file
 */

const LOCAL_FILE = path.join(process.cwd(), ".data", "projects.json");

function detectNetlify(): boolean {
  if (process.env.STORAGE === "netlify") return true;
  if (process.env.STORAGE === "local") return false;
  return (
    process.env.NETLIFY === "true" ||
    Boolean(process.env.NETLIFY_SITE_ID && !process.env.STORAGE)
  );
}

const useNetlify = detectNetlify();

// Log once so the Netlify function logs show which backend is in use.
console.log(`[store] using ${useNetlify ? "Netlify Blobs" : "local JSON file"} storage (STORAGE=${process.env.STORAGE ?? "unset"}, NETLIFY=${process.env.NETLIFY ?? "unset"})`);

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
  try {
    const data = useNetlify ? await readBlob() : await readLocal();
    return data ?? [];
  } catch (err) {
    console.error("[store] readProjects failed:", err);
    throw new Error(
      "Could not read project data from storage. Check the server logs."
    );
  }
}

export async function writeProjects(projects: PublicProject[]): Promise<void> {
  try {
    if (useNetlify) {
      await writeBlob(projects);
    } else {
      await writeLocal(projects);
    }
  } catch (err) {
    console.error("[store] writeProjects failed:", err);
    throw new Error(
      "Could not write project data to storage. Check the server logs."
    );
  }
}
