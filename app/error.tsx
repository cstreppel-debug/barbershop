"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[Error boundary]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-4xl">🔧</p>
      <h2 className="mt-4 text-lg font-semibold text-neutral-900">
        Er is iets misgegaan
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-500">
        Er is een fout opgetreden. Probeer het opnieuw of ga terug naar het
        begin.
      </p>
      {error.digest && (
        <p className="mt-3 font-mono text-xs text-neutral-300">
          {error.digest}
        </p>
      )}
      <div className="mt-6 flex gap-3">
        <button
          onClick={unstable_retry}
          className="rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
        >
          Opnieuw proberen
        </button>
        <Link
          href="/"
          className="rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-700"
        >
          Begin opnieuw
        </Link>
      </div>
    </div>
  );
}
