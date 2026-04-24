import { StepIndicator } from "@/components/booking/StepIndicator";

export default function Loading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <StepIndicator current={4} />

      {/* Samenvatting skeleton */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
        <div className="border-b border-neutral-200 px-5 py-4">
          <div className="h-3 w-16 animate-pulse rounded bg-neutral-200" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 border-b border-neutral-100 px-5 py-3.5 last:border-0">
            <div className="h-3.5 w-3.5 animate-pulse rounded bg-neutral-200" />
            <div className="h-3 w-20 animate-pulse rounded bg-neutral-200" />
            <div className="h-3 w-32 animate-pulse rounded bg-neutral-200" />
          </div>
        ))}
      </div>

      {/* Formulier skeleton */}
      <div className="space-y-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i}>
            <div className="mb-1.5 h-3 w-24 animate-pulse rounded bg-neutral-100" />
            <div className="h-10 w-full animate-pulse rounded-xl bg-neutral-100" />
          </div>
        ))}
        <div className="h-10 w-full animate-pulse rounded-2xl bg-neutral-200" />
      </div>
    </div>
  );
}
