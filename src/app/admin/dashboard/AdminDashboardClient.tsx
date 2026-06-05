"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { useAdminAuthStore } from "@/stores/adminAuthStore";

export default function AdminDashboardClient() {
  const router = useRouter();
  const { fetchSession, probeAdminAccess, session, isLoading } = useAdminAuthStore();
  const [ready, setReady] = useState(false);

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
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <p className="font-ui text-[10px] tracking-[0.2em] uppercase text-[#9A9A9A]">
          Loading dashboard…
        </p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <AdminShell>
      <AdminDashboard />
    </AdminShell>
  );
}
