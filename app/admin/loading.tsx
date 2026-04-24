export default function AdminLoading() {
  return (
    <div className="p-6 lg:p-8">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-6 w-32 animate-pulse rounded bg-neutral-200" />
        <div className="mt-1.5 h-3.5 w-48 animate-pulse rounded bg-neutral-100" />
      </div>

      {/* Metrics skeleton */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
          >
            <div className="h-10 w-10 animate-pulse rounded-xl bg-neutral-100" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-20 animate-pulse rounded bg-neutral-100" />
              <div className="h-7 w-12 animate-pulse rounded bg-neutral-200" />
            </div>
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-100 bg-neutral-50 px-5 py-3">
          <div className="h-3 w-64 animate-pulse rounded bg-neutral-200" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-6 border-b border-neutral-100 px-5 py-4 last:border-0"
          >
            <div className="h-3 w-16 animate-pulse rounded bg-neutral-100" />
            <div className="h-3 w-24 animate-pulse rounded bg-neutral-100" />
            <div className="h-3 flex-1 animate-pulse rounded bg-neutral-100" />
            <div className="h-3 w-20 animate-pulse rounded bg-neutral-100" />
            <div className="h-5 w-20 animate-pulse rounded-full bg-neutral-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
