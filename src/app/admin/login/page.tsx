"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/lib/actions";

type LoginState = { error?: string } | undefined;

const initialState: LoginState = undefined;

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-zinc-100 px-5">
      <div className="w-full max-w-sm border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="font-display text-2xl text-zinc-900">Admin login</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Restricted area — portfolio management.
        </p>

        {state?.error && (
          <p
            role="alert"
            className="mt-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {state.error}
          </p>
        )}

        <form action={formAction} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500">
              Username
            </span>
            <input
              name="username"
              autoComplete="username"
              required
              className="w-full border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500">
              Password
            </span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <Link
          href="/"
          className="mt-6 inline-block text-sm text-zinc-500 hover:text-zinc-900"
        >
          ← Back to site
        </Link>
      </div>
    </div>
  );
}
