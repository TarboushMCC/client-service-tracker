"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Users, Plus, BookText } from "lucide-react";
import clsx from "clsx";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "/clients", label: "Clients", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 bg-sidebar text-sidebar-foreground flex flex-col px-4 py-6 sticky top-0 h-screen">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
          <BookText size={16} className="text-accent-foreground" />
        </div>
        <span className="font-serif text-lg font-semibold tracking-tight">Ledger</span>
      </div>

      <nav className="flex flex-col gap-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                active
                  ? "bg-sidebar-active text-white"
                  : "text-sidebar-muted hover:bg-sidebar-active hover:text-white"
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/clients/new"
        className="mt-4 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
      >
        <Plus size={16} />
        New client
      </Link>

      <div className="mt-auto px-2 text-xs text-sidebar-muted">
        Stored locally on this machine.
      </div>
    </aside>
  );
}
