"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { AdminPendingRegistrationsProvider } from "@/hooks/useAdminPendingRegistrations";
import { useAdminAuthStore } from "@/stores/adminAuthStore";
import type { AdminSection } from "@/types/admin-nav";

export default function AdminDashboardClient() {
  const router = useRouter();
  const { fetchSession, probeAdminAccess, session, isLoading } = useAdminAuthStore();
  const [ready, setReady] = useState(false);
  const [section, setSection] = useState<AdminSection>("dashboard");

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const ok = await fetchSession();
      if (cancelled) return;
      if (!ok) {
        router.replace("/admin/login");
        return;
      }
      const canAdmin = await probeAdminAccess();
      if (cancelled) return;
      if (!canAdmin) {
        await useAdminAuthStore.getState().logout();
        router.replace("/admin/login");
        return;
      }
      setReady(true);
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [fetchSession, probeAdminAccess, router]);

  if (!ready || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">Loading dashboard…</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <AdminPendingRegistrationsProvider>
      <AdminShell activeSection={section} onSectionChange={setSection}>
        <AdminDashboard section={section} onSectionChange={setSection} />
      </AdminShell>
    </AdminPendingRegistrationsProvider>
  );
}
