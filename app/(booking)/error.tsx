"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function BookingError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[Booking error]", error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <p className="text-4xl">📅</p>
      <h2 className="mt-4 text-lg font-semibold text-neutral-900">
        Boeking kon niet worden geladen
      </h2>
      <p className="mt-2 text-sm text-neutral-500">
        Er is een fout opgetreden tijdens het laden. Probeer de pagina opnieuw
        te laden of begin opnieuw.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={unstable_retry}
          className="rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
        >
          Opnieuw laden
        </button>
        <Link
          href="/"
          className="rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-700"
        >
          Nieuwe boeking
        </Link>
      </div>
    </div>
  );
}
