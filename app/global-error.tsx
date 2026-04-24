"use client";

export default function GlobalError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="nl">
      <body className="flex min-h-screen items-center justify-center bg-neutral-50 p-4 font-sans">
        <div className="text-center">
          <p className="text-5xl">⚠️</p>
          <h1 className="mt-4 text-xl font-semibold text-neutral-900">
            Er ging iets mis
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Er is een onverwachte fout opgetreden.
          </p>
          <button
            onClick={unstable_retry}
            className="mt-6 rounded-xl bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-neutral-700"
          >
            Opnieuw proberen
          </button>
        </div>
      </body>
    </html>
  );
}
