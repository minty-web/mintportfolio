import Link from "next/link";
import { getProjects } from "@/lib/projects";
import { moveProjectAction } from "@/lib/actions";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";

export default async function AdminDashboard() {
  const projects = await getProjects();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-zinc-900">Projects</h2>
          <p className="mt-1 text-sm text-zinc-500">
            {projects.length} {projects.length === 1 ? "project" : "projects"} — use the
            arrows to change their order.
          </p>
        </div>
        <Link
          href="/admin/new"
          className="bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
        >
          + Add project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="mt-8 border border-dashed border-zinc-300 bg-white p-10 text-center">
          <p className="text-sm text-zinc-500">
            No projects yet. Add your first project to get started.
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {projects.map((project, index) => (
            <li
              key={project.id}
              className="flex flex-col gap-4 border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center"
            >
              {/* Thumbnail */}
              <div className="h-16 w-24 shrink-0 overflow-hidden border border-zinc-200 bg-zinc-100">
                {project.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.thumbnail}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-zinc-900">{project.title}</span>
                  {project.featured && (
                    <span className="bg-zinc-100 px-1.5 py-0.5 text-xs uppercase tracking-wide text-zinc-600">
                      Featured
                    </span>
                  )}
                </div>
                {project.tags.length > 0 && (
                  <p className="mt-1 truncate text-sm text-zinc-500">
                    {project.tags.join(", ")}
                  </p>
                )}
                <p className="mt-0.5 truncate text-xs text-zinc-400">
                  {project.url}
                </p>
              </div>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-2">
                <form action={moveProjectAction} className="flex">
                  <input type="hidden" name="id" value={project.id} />
                  <button
                    type="submit"
                    name="direction"
                    value="up"
                    disabled={index === 0}
                    aria-label={`Move ${project.title} up`}
                    className="border border-zinc-300 px-2.5 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="submit"
                    name="direction"
                    value="down"
                    disabled={index === projects.length - 1}
                    aria-label={`Move ${project.title} down`}
                    className="ml-1 border border-zinc-300 px-2.5 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    ↓
                  </button>
                </form>

                <Link
                  href={`/admin/edit/${project.id}`}
                  className="border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50"
                >
                  Edit
                </Link>

                <ConfirmDeleteButton id={project.id} title={project.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
