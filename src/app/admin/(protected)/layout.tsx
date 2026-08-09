import type { ReactNode } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logoutAction } from "@/lib/actions";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-dvh bg-zinc-100">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <h1 className="font-display text-xl text-zinc-900">Admin</h1>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <Link href="/admin" className="text-zinc-600 hover:text-zinc-900">
              Projects
            </Link>
            <Link href="/admin/new" className="text-zinc-600 hover:text-zinc-900">
              Add project
            </Link>
            <Link href="/" className="text-zinc-600 hover:text-zinc-900">
              View site ↗
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-sm text-zinc-600 hover:text-zinc-900"
              >
                Log out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-4xl px-5 py-8 sm:px-8">{children}</main>
    </div>
  );
}
