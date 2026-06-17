"use client";

import Link from "next/link";
import { CalendarDays, GraduationCap, ImageIcon, LayoutDashboard, LogOut, MessageSquare, UserCircle } from "lucide-react";
import { ADMIN_NAV_ITEMS, type AdminSection } from "@/types/admin-nav";

const NAV_ICONS: Record<AdminSection, typeof LayoutDashboard> = {
  dashboard: LayoutDashboard,
  models: UserCircle,
  students: GraduationCap,
  events: CalendarDays,
  gallery: ImageIcon,
  inquiries: MessageSquare,
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
    <div className="flex h-full flex-col bg-white border-r border-gray-200 shadow-sm">
      <div className="border-b border-gray-200 px-5 py-5">
        <Link
          href="/"
          onClick={onNavigate}
          className="text-lg font-semibold text-gray-900 hover:text-amber-600 transition-colors"
        >
          The Walk
        </Link>
        <p className="text-sm text-gray-500 mt-0.5">Admin</p>
      </div>

      <nav className="flex-1 p-3 space-y-1" aria-label="Admin navigation">
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
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon className="size-[18px] shrink-0" strokeWidth={1.75} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-4 space-y-3">
        {userEmail && (
          <p className="text-sm text-gray-500 truncate" title={userEmail}>
            {userEmail}
          </p>
        )}
        <Link
          href="/"
          onClick={onNavigate}
          className="block text-sm text-gray-600 hover:text-gray-900"
        >
          Public site
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <LogOut className="size-4" />
          Log out
        </button>
      </div>
    </div>
  );
}
