import { StepIndicator } from "@/components/booking/StepIndicator";
import { BarberCardSkeleton } from "@/components/booking/BarberCard";

export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <StepIndicator current={2} />

      {/* Service summary skeleton */}
      <div className="mb-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
        <div className="h-3 w-32 animate-pulse rounded bg-neutral-200" />
        <div className="mt-2 h-4 w-48 animate-pulse rounded bg-neutral-200" />
        <div className="mt-2 h-3 w-full animate-pulse rounded bg-neutral-200" />
        <div className="mt-3 flex gap-4">
          <div className="h-3 w-16 animate-pulse rounded bg-neutral-200" />
          <div className="h-3 w-12 animate-pulse rounded bg-neutral-200" />
        </div>
      </div>

      <div className="mb-5 h-3 w-24 animate-pulse rounded bg-neutral-100" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <BarberCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
