"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutGrid, Shield, ExternalLink, Settings, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function Sidebar({ role }: { role: "ADMIN" | "CONTRIBUTOR" }) {
  const path = usePathname();

  const NavItem = ({ href, icon: Icon, label }: any) => (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-xl border transition",
        path === href
          ? "border-white/15 bg-white/5"
          : "border-white/10 hover:bg-white/5 hover:border-white/15"
      )}
    >
      <Icon size={18} />
      <span className="text-sm">{label}</span>
    </Link>
  );

  return (
    <div className="card p-4 space-y-3">
      <div className="px-1">
        <div className="text-sm font-semibold">Guardian Hub</div>
        <div className="text-xs opacity-70">Access your internal tools</div>
      </div>

      <div className="space-y-2">
        <NavItem href="/hub" icon={LayoutGrid} label="Dashboard" />
        {role === "ADMIN" && <NavItem href="/admin" icon={Shield} label="Admin Console" />}
      </div>

      <div className="pt-2 border-t border-white/10 space-y-2">
        <a
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 hover:bg-white/5 hover:border-white/15 transition"
          href="https://status.guardianoverride.com"
          target="_blank"
          rel="noreferrer"
        >
          <ExternalLink size={18} />
          <span className="text-sm">Status</span>
        </a>

        <button
          className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 hover:bg-white/5 hover:border-white/15 transition"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut size={18} />
          <span className="text-sm">Sign out</span>
        </button>
      </div>
    </div>
  );
}
