"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useAdminAuthStore } from "@/stores/adminAuthStore";
import { ADMIN_NAV_ITEMS, type AdminSection } from "@/types/admin-nav";
import AdminSidebar from "./AdminSidebar";

interface AdminShellProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  children: React.ReactNode;
}

export default function AdminShell({
  activeSection,
  onSectionChange,
  children,
}: AdminShellProps) {
  const router = useRouter();
  const { session, logout } = useAdminAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeItem =
    ADMIN_NAV_ITEMS.find((item) => item.id === activeSection) ?? ADMIN_NAV_ITEMS[0];

  async function handleLogout() {
    await logout();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[min(100%,280px)] transform transition-transform duration-300 ease-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          userEmail={session?.email}
          onLogout={handleLogout}
          onNavigate={() => setSidebarOpen(false)}
        />
      </aside>

      <div className="lg:pl-[280px] flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 border-b border-[#E0E0E0] bg-white/95 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-6 lg:px-8">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setSidebarOpen((open) => !open)}
                className="lg:hidden flex size-10 items-center justify-center border border-[#E0E0E0] text-[#0A0A0A] hover:border-[#C8A97A] transition-colors shrink-0"
                aria-label="Open menu"
              >
                {sidebarOpen ? (
                  <X className="size-5" strokeWidth={1.5} />
                ) : (
                  <Menu className="size-5" strokeWidth={1.5} />
                )}
              </button>
              <div className="min-w-0">
                <h1 className="font-display text-xl md:text-2xl font-light text-[#0A0A0A] truncate">
                  {activeItem.label}
                </h1>
                <p className="font-ui text-[9px] tracking-[0.15em] text-[#9A9A9A] uppercase truncate hidden sm:block">
                  {activeItem.description}
                </p>
              </div>
            </div>
            <span className="font-ui text-[8px] tracking-[0.2em] uppercase text-[#C8A97A] shrink-0 hidden md:inline">
              Dashboard
            </span>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10 max-w-[1400px] w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
