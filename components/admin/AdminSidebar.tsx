"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Scissors,
  Users,
  Clock,
  LogOut,
} from "lucide-react";
import { logout } from "@/actions/logout";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin",          label: "Dashboard",       icon: LayoutDashboard },
  { href: "/admin/services", label: "Behandelingen",   icon: Scissors },
  { href: "/admin/barbers",  label: "Medewerkers",     icon: Users },
  { href: "/admin/hours",    label: "Openingstijden",  icon: Clock },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r border-neutral-200 bg-white">
      {/* Brand */}
      <div className="flex h-16 items-center gap-2.5 border-b border-neutral-100 px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900">
          <Scissors size={14} strokeWidth={1.75} className="text-white" />
        </div>
        <span className="text-sm font-semibold text-neutral-900">
          De Zaak
        </span>
      </div>

      {/* Navigatie */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {NAV.map(({ href, label, icon: Icon }) => {
            // Dashboard is exact-match; andere routes: startsWith
            const isActive =
              href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-neutral-900 font-medium text-white"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                  )}
                >
                  <Icon size={15} strokeWidth={isActive ? 2 : 1.75} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Uitloggen */}
      <div className="border-t border-neutral-100 p-3">
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            <LogOut size={15} strokeWidth={1.75} />
            Uitloggen
          </button>
        </form>
      </div>
    </aside>
  );
}
