"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createProjectAction, updateProjectAction } from "@/lib/actions";
import type { PublicProject } from "@/lib/types";

type FormState = { error?: string } | undefined;

const initialState: FormState = undefined;

const inputClass =
  "w-full border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none";
const labelClass =
  "mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500";

export function ProjectForm({ project }: { project?: PublicProject }) {
  const action = project ? updateProjectAction : createProjectAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-5">
      {project && <input type="hidden" name="id" value={project.id} />}

      {state?.error && (
        <p
          role="alert"
          className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {state.error}
        </p>
      )}

      <label className="block">
        <span className={labelClass}>Title *</span>
        <input
          name="title"
          required
          maxLength={200}
          defaultValue={project?.title}
          placeholder="e.g. Field Notes Journal"
          className={inputClass}
        />
      </label>

      <label className="block">
        <span className={labelClass}>Description</span>
        <textarea
          name="description"
          rows={4}
          maxLength={1000}
          defaultValue={project?.description}
          placeholder="Short description shown on the card…"
          className={inputClass}
        />
      </label>

      <label className="block">
        <span className={labelClass}>Live site URL *</span>
        <input
          name="url"
          type="url"
          required
          defaultValue={project?.url}
          placeholder="https://my-project.example.com"
          className={inputClass}
        />
      </label>

      <label className="block">
        <span className={labelClass}>Thumbnail URL</span>
        <input
          name="thumbnail"
          defaultValue={project?.thumbnail}
          placeholder="https://… or /uploads/…"
          className={inputClass}
        />
        <span className="mt-1 block text-xs text-zinc-400">
          Paste an image URL. A placeholder block is shown if empty or broken.
        </span>
      </label>

      <label className="block">
        <span className={labelClass}>Tags (comma separated)</span>
        <input
          name="tags"
          defaultValue={project?.tags.join(", ")}
          placeholder="web, react, dashboard"
          className={inputClass}
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-zinc-700">
        <input
          name="featured"
          type="checkbox"
          defaultChecked={project?.featured}
          className="h-4 w-4 accent-zinc-900"
        />
        Mark as featured (shows a badge on the card)
      </label>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
        >
          {pending ? "Saving…" : project ? "Save changes" : "Add project"}
        </button>
        <Link href="/admin" className="text-sm text-zinc-500 hover:text-zinc-900">
          Cancel
        </Link>
      </div>
    </form>
  );
}
