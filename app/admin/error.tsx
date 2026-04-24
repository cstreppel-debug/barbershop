"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[Admin error]", error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
      <p className="text-3xl">⚠️</p>
      <h2 className="mt-3 text-base font-semibold text-neutral-900">
        Er is een fout opgetreden
      </h2>
      <p className="mt-1.5 text-sm text-neutral-500">
        {error.message ?? "Onbekende fout."}
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-xs text-neutral-300">{error.digest}</p>
      )}
      <button
        onClick={unstable_retry}
        className="mt-5 rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-700"
      >
        Opnieuw proberen
      </button>
    </div>
  );
}
