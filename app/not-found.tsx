import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
      <p className="font-mono text-6xl font-bold text-neutral-200">404</p>
      <h1 className="mt-4 text-xl font-semibold text-neutral-900">
        Pagina niet gevonden
      </h1>
      <p className="mt-2 text-sm text-neutral-500">
        De pagina die je zoekt bestaat niet of is verplaatst.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-2xl bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-700"
      >
        Terug naar home
      </Link>
    </div>
  );
}
