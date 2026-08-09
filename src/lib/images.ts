import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { resolveBackend } from "./store";

/**
 * Uploaded project images.
 *
 * - On Netlify: stored as blobs in the same store as the project data,
 *   under `uploads/<uuid>.<ext>`.
 * - Locally: saved as files in `.data/uploads/`.
 *
 * Images are served through `/api/image/...` so the rest of the app only ever
 * deals with URLs.
 */

const UPLOAD_DIR = path.join(process.cwd(), ".data", "uploads");

export const IMAGE_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
} as const;

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

export function mimeFor(key: string): string {
  const ext = key.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    case "avif":
      return "image/avif";
    default:
      return "application/octet-stream";
  }
}

/** Store an image and return its public URL. */
export async function saveImage(bytes: Buffer, ext: string): Promise<string> {
  const key = `uploads/${randomUUID()}.${ext}`;

  if ((await resolveBackend()) === "netlify") {
    const { getStore } = await import("@netlify/blobs");
    // Copy into a fresh ArrayBuffer (BlobInput does not accept SharedArrayBuffer).
    const arrayBuffer = new Uint8Array(bytes).buffer;
    await getStore({ name: "portfolio" }).set(key, arrayBuffer);
  } else {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.writeFile(path.join(UPLOAD_DIR, path.basename(key)), bytes);
  }

  return `/api/image/${key}`;
}

/** Read a stored image by blob key (`uploads/...`). */
export async function readImage(key: string): Promise<Buffer | null> {
  if ((await resolveBackend()) === "netlify") {
    const { getStore } = await import("@netlify/blobs");
    const data = await getStore({ name: "portfolio" }).get(key, {
      type: "arrayBuffer",
    });
    return data ? Buffer.from(data) : null;
  }
  try {
    return await fs.readFile(path.join(UPLOAD_DIR, path.basename(key)));
  } catch {
    return null;
  }
}

/** Delete a stored image from its public URL (`/api/image/uploads/...`). */
export async function deleteImage(url: string): Promise<void> {
  if (!url.startsWith("/api/image/uploads/")) return;
  const key = url.replace("/api/image/", "");

  if ((await resolveBackend()) === "netlify") {
    const { getStore } = await import("@netlify/blobs");
    await getStore({ name: "portfolio" }).delete(key);
  } else {
    await fs.unlink(path.join(UPLOAD_DIR, path.basename(key))).catch(() => {});
  }
}
