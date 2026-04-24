import Link from "next/link";
import { Clock, Euro } from "lucide-react";
import type { Service } from "@/lib/types";
import { formatPrice, formatDuration } from "@/lib/utils";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/${service.id}`}
      className="group flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md"
    >
      <h2 className="text-base font-semibold text-neutral-900 group-hover:text-neutral-700">
        {service.name}
      </h2>

      {service.description && (
        <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-500">
          {service.description}
        </p>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-4">
        <span className="flex items-center gap-1.5 text-sm text-neutral-500">
          <Clock size={14} strokeWidth={1.75} />
          {formatDuration(service.duration_min)}
        </span>
        <span className="flex items-center gap-1 text-sm font-medium text-neutral-900">
          <Euro size={14} strokeWidth={1.75} />
          {formatPrice(service.price).replace("€", "").trim()}
        </span>
      </div>
    </Link>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="h-4 w-2/3 animate-pulse rounded bg-neutral-100" />
      <div className="mt-3 space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-neutral-100" />
        <div className="h-3 w-4/5 animate-pulse rounded bg-neutral-100" />
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-4">
        <div className="h-3 w-16 animate-pulse rounded bg-neutral-100" />
        <div className="h-3 w-12 animate-pulse rounded bg-neutral-100" />
      </div>
    </div>
  );
}
