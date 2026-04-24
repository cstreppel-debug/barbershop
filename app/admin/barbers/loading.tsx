export default function BarbersLoading() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="h-6 w-32 animate-pulse rounded bg-neutral-200" />
          <div className="mt-1.5 h-3.5 w-24 animate-pulse rounded bg-neutral-100" />
        </div>
        <div className="h-10 w-28 animate-pulse rounded-xl bg-neutral-200" />
      </div>
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-100 bg-neutral-50 px-5 py-3 flex gap-8">
          {["w-28", "w-40", "w-32", "w-16", "w-16"].map((w, i) => (
            <div key={i} className={`h-3 ${w} animate-pulse rounded bg-neutral-200`} />
          ))}
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-8 border-b border-neutral-100 px-5 py-4 last:border-0">
            <div className="h-3.5 w-28 animate-pulse rounded bg-neutral-200" />
            <div className="h-3 w-48 animate-pulse rounded bg-neutral-100" />
            <div className="flex gap-1.5 flex-1">
              {Array.from({ length: 2 }).map((_, j) => (
                <div key={j} className="h-5 w-20 animate-pulse rounded-full bg-neutral-100" />
              ))}
            </div>
            <div className="h-5 w-20 animate-pulse rounded-full bg-neutral-100" />
            <div className="h-8 w-16 animate-pulse rounded-lg bg-neutral-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
