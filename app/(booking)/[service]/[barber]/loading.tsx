import { StepIndicator } from "@/components/booking/StepIndicator";

export default function Loading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <StepIndicator current={3} />

      {/* Samenvatting skeleton */}
      <div className="mb-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
        <div className="mb-3 h-3 w-20 animate-pulse rounded bg-neutral-200" />
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="h-4 w-36 animate-pulse rounded bg-neutral-200" />
            <div className="h-3 w-24 animate-pulse rounded bg-neutral-200" />
          </div>
          <div className="space-y-1.5">
            <div className="h-3 w-16 animate-pulse rounded bg-neutral-200" />
            <div className="h-3 w-12 animate-pulse rounded bg-neutral-200" />
          </div>
        </div>
      </div>

      {/* Kalender skeleton */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-4 h-4 w-32 animate-pulse rounded bg-neutral-100" />
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => (
            <div
              key={i}
              className="mx-auto h-9 w-9 animate-pulse rounded-lg bg-neutral-100"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
