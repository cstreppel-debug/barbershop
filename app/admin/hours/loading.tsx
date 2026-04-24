export default function HoursLoading() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <div className="h-6 w-40 animate-pulse rounded bg-neutral-200" />
        <div className="mt-1.5 h-3.5 w-56 animate-pulse rounded bg-neutral-100" />
      </div>
      <div className="max-w-2xl space-y-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[140px_1fr] gap-6 rounded-2xl border border-neutral-200 bg-white p-4"
          >
            <div className="space-y-2">
              <div className="h-4 w-24 animate-pulse rounded bg-neutral-200" />
              <div className="h-5 w-16 animate-pulse rounded-full bg-neutral-100" />
            </div>
            <div className="flex items-center gap-4">
              <div className="h-8 w-28 animate-pulse rounded-lg bg-neutral-100" />
              <div className="h-3 w-3 animate-pulse rounded bg-neutral-200" />
              <div className="h-8 w-28 animate-pulse rounded-lg bg-neutral-100" />
            </div>
          </div>
        ))}
        <div className="pt-2">
          <div className="h-10 w-28 animate-pulse rounded-xl bg-neutral-200" />
        </div>
      </div>
    </div>
  );
}
