"use client"; // Client because it tracks open/close state and handles clicks.

import Link from "next/link"; // Navigation links.
import { usePathname } from "next/navigation"; // Active route styling.

type Props = {
  open: boolean; // Sidebar open state.
  setOpen: (v: boolean) => void; // Setter from parent.
};

function NavItem({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium",
        active ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-100",
      ].join(" ")}
    >
      <span className="h-2 w-2 rounded-full bg-blue-500" aria-hidden />
      <span className="truncate">{label}</span>
    </Link>
  );
}

export default function AdminSidebar({ open, setOpen }: Props) {
  const pathname = usePathname(); // Current route.

  return (
    <aside
      className={[
        "shrink-0 border-r bg-white",
        open ? "w-[240px]" : "w-[72px]",
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-slate-900">
            {open ? "Admin Console" : "Admin"}
          </div>
          {open ? <div className="text-xs text-slate-500">Guardian Hub</div> : null}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg border bg-white p-2 text-slate-700 hover:bg-slate-50"
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
        >
          {open ? "⟨" : "⟩"}
        </button>
      </div>

      {/* Nav */}
      <nav className="space-y-1 px-3">
        <NavItem href="/hub" label={open ? "Dashboard" : "Dash"} active={pathname === "/hub"} />
        <NavItem href="/admin" label={open ? "Tasks" : "Tasks"} active={pathname === "/admin"} />
        <NavItem href="/admin/users" label={open ? "Users" : "Users"} active={pathname.startsWith("/admin/users")} />
        <NavItem href="/admin/settings" label={open ? "Settings" : "Set"} active={pathname.startsWith("/admin/settings")} />
      </nav>

      {/* Footer */}
      <div className="mt-auto px-3 py-4">
        <div className="rounded-xl border bg-slate-50 px-3 py-2 text-xs text-slate-600">
          {open ? "Tip: Drag cards between columns." : "Drag"}
        </div>
      </div>
    </aside>
  );
}
