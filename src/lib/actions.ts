"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSession, destroySession, requireAdmin, verifyCredentials } from "@/lib/auth";
import { createProject, deleteProject, moveProject, updateProject } from "@/lib/projects";
import type { ProjectInput } from "@/lib/projects";
import { IMAGE_TYPES, MAX_UPLOAD_BYTES, deleteImage, saveImage } from "@/lib/images";

type ActionState = { error?: string } | undefined;

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export async function loginAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "Enter both username and password." };
  }

  let valid = false;
  try {
    valid = await verifyCredentials(username, password);
  } catch {
    return { error: "Admin is not configured. Check your ADMIN_* environment variables." };
  }

  if (!valid) {
    return { error: "Invalid username or password." };
  }

  try {
    await createSession();
  } catch {
    return {
      error:
        "Login failed — the server is not configured. Add SESSION_SECRET (and ADMIN_USERNAME / ADMIN_PASSWORD_HASH) to the Netlify environment variables, then redeploy.",
    };
  }
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}

// ---------------------------------------------------------------------------
// Project mutations
// ---------------------------------------------------------------------------

const URL_PATTERN = /^(https?:\/\/|\/)/i;

function parseProjectForm(formData: FormData): ProjectInput | { error: string } {
  const title = String(formData.get("title") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const thumbnail = String(formData.get("thumbnail") ?? "").trim();
  const featured = formData.get("featured") === "on";

  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 10);

  if (!title) return { error: "Title is required." };
  if (title.length > 200) return { error: "Title must be 200 characters or fewer." };
  if (!url) return { error: "Project URL is required." };
  if (!URL_PATTERN.test(url)) return { error: "Project URL must start with http:// or https://." };
  if (description.length > 1000) return { error: "Description must be 1000 characters or fewer." };
  if (thumbnail && !URL_PATTERN.test(thumbnail)) {
    return { error: "Thumbnail must be a URL starting with http:// or https://." };
  }

  return { title, description, url, thumbnail, tags, featured };
}

/**
 * If a thumbnail file was uploaded, validate and store it, returning its URL.
 * Otherwise keep the thumbnail value from the form (URL or empty).
 */
async function resolveThumbnail(
  formData: FormData,
  fallback: string
): Promise<{ thumbnail: string } | { error: string }> {
  const file = formData.get("thumbnailFile");

  if (!file || typeof file === "string" || file.size === 0) {
    return { thumbnail: fallback };
  }

  const ext = IMAGE_TYPES[file.type as keyof typeof IMAGE_TYPES];
  if (!ext) {
    return {
      error: "Unsupported image type. Use JPG, PNG, WebP, GIF, or AVIF.",
    };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { error: "Image must be under 5 MB." };
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const thumbnail = await saveImage(bytes, ext);
  return { thumbnail };
}

export async function createProjectAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const input = parseProjectForm(formData);
  if ("error" in input) return input;

  const thumbnail = await resolveThumbnail(formData, input.thumbnail);
  if ("error" in thumbnail) return thumbnail;

  try {
    await createProject({ ...input, thumbnail: thumbnail.thumbnail });
  } catch (err) {
    console.error("[admin] createProject failed:", err);
    return {
      error:
        "Could not save the project. Check the Netlify function logs (look for `[store]`) for the exact cause.",
    };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateProjectAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing project id." };

  const input = parseProjectForm(formData);
  if ("error" in input) return input;

  const thumbnail = await resolveThumbnail(formData, input.thumbnail);
  if ("error" in thumbnail) return thumbnail;

  try {
    await updateProject(id, { ...input, thumbnail: thumbnail.thumbnail });
  } catch (err) {
    console.error("[admin] updateProject failed:", err);
    return {
      error:
        "Could not save the project. Check the Netlify function logs (look for `[store]`) for the exact cause.",
    };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/admin/edit/${id}`);
  redirect("/admin");
}

export async function deleteProjectAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const deletedThumbnail = await deleteProject(id);
  if (deletedThumbnail?.startsWith("/api/image/uploads/")) {
    await deleteImage(deletedThumbnail);
  }
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function moveProjectAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const direction = String(formData.get("direction") ?? "");
  if (!id || (direction !== "up" && direction !== "down")) return;
  await moveProject(id, direction);
  revalidatePath("/");
  revalidatePath("/admin");
}
