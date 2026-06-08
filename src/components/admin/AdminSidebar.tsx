"use client";

import Link from "next/link";
import { LayoutGrid, LogOut, UserCircle, Users } from "lucide-react";
import { ADMIN_NAV_ITEMS, type AdminSection } from "@/types/admin-nav";

const NAV_ICONS: Record<AdminSection, typeof Users> = {
  students: Users,
  models: UserCircle,
};

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  userEmail?: string;
  onLogout: () => void;
  onNavigate?: () => void;
}

export default function AdminSidebar({
  activeSection,
  onSectionChange,
  userEmail,
  onLogout,
  onNavigate,
}: AdminSidebarProps) {
  return (
    <div className="flex h-full flex-col bg-[#0A0A0A] text-white">
      <div className="border-b border-white/10 px-5 py-6">
        <Link
          href="/"
          onClick={onNavigate}
          className="font-display text-xl font-light tracking-widest text-white hover:text-[#C8A97A] transition-colors"
        >
          THE WALK
        </Link>
        <div className="mt-3 flex items-center gap-2">
          <LayoutGrid className="size-3.5 text-[#C8A97A]" strokeWidth={1.5} />
          <span className="font-ui text-[9px] tracking-[0.3em] uppercase text-[#C8A97A]">
            Admin
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1" aria-label="Admin navigation">
        {ADMIN_NAV_ITEMS.map((item) => {
          const Icon = NAV_ICONS[item.id];
          const active = activeSection === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSectionChange(item.id);
                onNavigate?.();
              }}
              className={`w-full flex items-start gap-3 rounded-sm px-3 py-3 text-left transition-colors ${
                active
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon
                className={`mt-0.5 size-4 shrink-0 ${active ? "text-[#C8A97A]" : ""}`}
                strokeWidth={1.5}
              />
              <span>
                <span className="block font-ui text-[10px] tracking-[0.2em] uppercase">
                  {item.label}
                </span>
                <span className="mt-1 block font-ui text-[8px] tracking-[0.08em] text-white/40 normal-case leading-snug">
                  {item.description}
                </span>
              </span>
            </button>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-5 py-5 space-y-4">
        {userEmail && (
          <p className="font-ui text-[9px] tracking-[0.08em] text-white/50 truncate">
            {userEmail}
          </p>
        )}
        <Link
          href="/"
          onClick={onNavigate}
          className="block font-ui text-[9px] tracking-[0.2em] uppercase text-white/50 hover:text-[#C8A97A] transition-colors"
        >
          Public site
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-2 font-ui text-[9px] tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors"
        >
          <LogOut className="size-3.5" strokeWidth={1.5} />
          Logout
        </button>
      </div>
    </div>
  );
}
