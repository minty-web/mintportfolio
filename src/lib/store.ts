import { promises as fs } from "node:fs";
import path from "node:path";
import type { PublicProject } from "./types";

/**
 * Storage backend.
 *
 * - On Netlify: the whole project list lives in one key of a Netlify Blob
 *   store. No database, no migrations — blobs are enabled by default.
 * - Locally (`next dev` without the Netlify CLI): a plain JSON file, so
 *   development needs zero extra tooling.
 *
 * Backend selection:
 *   `STORAGE=netlify` / `STORAGE=local` force a backend explicitly.
 *   Otherwise we probe Netlify Blobs directly: `getStore()` throws outside a
 *   Netlify environment, so a successful call means we are on Netlify. This
 *   avoids relying on `NETLIFY`/`NETLIFY_SITE_ID` env vars, which are not
 *   always visible to Netlify's Next.js server runtime.
 */

const LOCAL_FILE = path.join(process.cwd(), ".data", "projects.json");

let backend: "netlify" | "local" | null = null;

export async function resolveBackend(): Promise<"netlify" | "local"> {
  if (backend) return backend;

  if (process.env.STORAGE === "netlify") {
    backend = "netlify";
  } else if (process.env.STORAGE === "local") {
    backend = "local";
  } else {
    try {
      const { getStore } = await import("@netlify/blobs");
      getStore({ name: "portfolio" }); // throws outside a Netlify environment
      backend = "netlify";
    } catch {
      backend = "local";
    }
  }

  console.log(`[store] using ${backend} storage`);
  return backend;
}

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
    const data =
      (await resolveBackend()) === "netlify" ? await readBlob() : await readLocal();
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
    if ((await resolveBackend()) === "netlify") {
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
