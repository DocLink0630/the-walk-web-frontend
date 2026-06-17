"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useAdminAuthStore } from "@/stores/adminAuthStore";
import { ADMIN_NAV_ITEMS, type AdminSection } from "@/types/admin-nav";
import AdminSidebar from "./AdminSidebar";
import { adminPageTitle } from "./admin-ui";

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
    <div className="flex min-h-screen min-h-dvh bg-gray-100">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 lg:translate-x-0 ${
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

      <div className="flex min-h-screen min-h-dvh flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen((open) => !open)}
            className="lg:hidden flex size-10 items-center justify-center rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <h1 className={`${adminPageTitle} min-w-0 truncate`}>{activeItem.label}</h1>
        </header>

        <main className="flex-1 px-4 py-5 sm:px-6 sm:py-8 lg:px-10">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
