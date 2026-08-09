import { ProjectForm } from "@/components/admin/ProjectForm";

export const metadata = { title: "Add project" };

export default function NewProjectPage() {
  return (
    <div>
      <h2 className="font-display text-2xl text-zinc-900">Add project</h2>
      <p className="mt-1 text-sm text-zinc-500">
        The card is added to the end of the grid. Reorder it afterwards from the
        dashboard.
      </p>
      <div className="mt-6">
        <ProjectForm />
      </div>
    </div>
  );
}
