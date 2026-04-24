"use client";

import { useActionState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { login, type LoginState } from "@/actions/login";
import { cn } from "@/lib/utils";

const initial: LoginState = {};

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return (
    <p className="mt-1.5 text-xs text-red-500" role="alert">
      {messages[0]}
    </p>
  );
}

export function LoginForm() {
  const [state, action, isPending] = useActionState(login, initial);

  return (
    <form action={action} noValidate className="space-y-4">
      {/* E-mail */}
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-neutral-700"
        >
          E-mailadres
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          autoFocus
          required
          placeholder="admin@kapperdeplaats.nl"
          className={cn(
            "w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-neutral-900",
            "placeholder:text-neutral-400 outline-none transition-colors",
            "focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10",
            state.fieldErrors?.email
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
              : "border-neutral-200"
          )}
        />
        <FieldError messages={state.fieldErrors?.email} />
      </div>

      {/* Wachtwoord */}
      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium text-neutral-700"
        >
          Wachtwoord
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className={cn(
            "w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-neutral-900",
            "placeholder:text-neutral-400 outline-none transition-colors",
            "focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10",
            state.fieldErrors?.password
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
              : "border-neutral-200"
          )}
        />
        <FieldError messages={state.fieldErrors?.password} />
      </div>

      {/* Server-fout */}
      {state.serverError && (
        <div
          role="alert"
          className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
        >
          <AlertCircle size={15} className="shrink-0 text-red-500" />
          <p className="text-sm text-red-700">{state.serverError}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl py-2.5",
          "text-sm font-semibold transition-colors",
          isPending
            ? "cursor-not-allowed bg-neutral-200 text-neutral-400"
            : "bg-neutral-900 text-white hover:bg-neutral-700"
        )}
      >
        {isPending && <Loader2 size={14} className="animate-spin" />}
        {isPending ? "Bezig…" : "Inloggen"}
      </button>
    </form>
  );
}
