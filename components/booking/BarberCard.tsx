"use client";

import Link from "next/link";
import Image from "next/image";
import { Shuffle } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Barber } from "@/lib/types";
import { cn } from "@/lib/utils";

// ── Avatar ────────────────────────────────────────────────────

function Avatar({
  name,
  avatarUrl,
  size = "md",
}: {
  name: string;
  avatarUrl: string | null;
  size?: "md" | "lg";
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const dim = size === "lg" ? 56 : 44;

  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={name}
        width={dim}
        height={dim}
        className={cn(
          "rounded-full object-cover",
          size === "lg" ? "h-14 w-14" : "h-11 w-11"
        )}
      />
    );
  }

  return (
    <span
      className={cn(
        "flex items-center justify-center rounded-full bg-neutral-100 font-semibold text-neutral-600",
        size === "lg" ? "h-14 w-14 text-lg" : "h-11 w-11 text-sm"
      )}
    >
      {initials}
    </span>
  );
}

// ── BarberCard ────────────────────────────────────────────────

export function BarberCard({
  barber,
  href,
}: {
  barber: Barber;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md"
    >
      <Avatar name={barber.name} avatarUrl={barber.avatar_url} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-neutral-900 group-hover:text-neutral-700">
          {barber.name}
        </p>
        {barber.bio && (
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-neutral-500">
            {barber.bio}
          </p>
        )}
      </div>
    </Link>
  );
}

// ── NoPreferenceButton ────────────────────────────────────────

export function NoPreferenceButton({
  serviceId,
  barberIds,
}: {
  serviceId: string;
  barberIds: string[];
}) {
  const router = useRouter();

  function pickRandom() {
    const id = barberIds[Math.floor(Math.random() * barberIds.length)];
    router.push(`/${serviceId}/${id}`);
  }

  return (
    <button
      onClick={pickRandom}
      className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-neutral-300 bg-white p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow-md"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
        <Shuffle size={18} strokeWidth={1.75} />
      </span>
      <div>
        <p className="text-sm font-semibold text-neutral-900">Geen voorkeur</p>
        <p className="text-sm text-neutral-500">
          We kiezen een beschikbare kapper voor je
        </p>
      </div>
    </button>
  );
}

// ── Skeleton ──────────────────────────────────────────────────

export function BarberCardSkeleton() {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-neutral-100" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-3.5 w-1/3 animate-pulse rounded bg-neutral-100" />
        <div className="h-3 w-full animate-pulse rounded bg-neutral-100" />
        <div className="h-3 w-4/5 animate-pulse rounded bg-neutral-100" />
      </div>
    </div>
  );
}
