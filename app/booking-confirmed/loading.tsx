export default function BookingConfirmedLoading() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="mb-8 flex flex-col items-center gap-4">
        <div className="h-20 w-20 animate-pulse rounded-full bg-neutral-200" />
        <div className="h-7 w-52 animate-pulse rounded bg-neutral-200" />
        <div className="h-4 w-72 animate-pulse rounded bg-neutral-100" />
        <div className="h-6 w-28 animate-pulse rounded-lg bg-neutral-100" />
      </div>
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-100 px-5 py-4">
          <div className="h-3 w-24 animate-pulse rounded bg-neutral-200" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 border-b border-neutral-100 px-5 py-3.5 last:border-0">
            <div className="h-3.5 w-3.5 animate-pulse rounded bg-neutral-200" />
            <div className="h-3 w-20 animate-pulse rounded bg-neutral-200" />
            <div className="h-3 w-36 animate-pulse rounded bg-neutral-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
