"use client";

import { deleteProjectAction } from "@/lib/actions";

export function ConfirmDeleteButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  return (
    <form
      action={deleteProjectAction}
      onSubmit={(e) => {
        if (
          !window.confirm(
            `Delete "${title}"? This removes the card from the site and cannot be undone.`
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="border border-red-300 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
      >
        Delete
      </button>
    </form>
  );
}
