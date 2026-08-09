import { notFound } from "next/navigation";
import Link from "next/link";
import { getProject } from "@/lib/projects";
import { ProjectForm } from "@/components/admin/ProjectForm";

export const metadata = { title: "Edit project" };

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) notFound();

  return (
    <div>
      <Link href="/admin" className="text-sm text-zinc-500 hover:text-zinc-900">
        ← Back to projects
      </Link>
      <h2 className="mt-3 font-display text-2xl text-zinc-900">Edit project</h2>
      <p className="mt-1 text-sm text-zinc-500">{project.title}</p>
      <div className="mt-6">
        <ProjectForm project={project} />
      </div>
    </div>
  );
}
