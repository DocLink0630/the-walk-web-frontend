"use client";

import { useEffect, useState } from "react";
import { fetchAdminUsers } from "@/lib/admin/users-api";
import type { UserRole, UserStatus } from "@/types/admin";
import { adminCard, adminKpiLabel, adminKpiValue } from "./admin-ui";

interface KpiCard {
  label: string;
  value: number | null;
  loading: boolean;
}

function KpiTile({ label, value, loading }: KpiCard) {
  return (
    <div className={adminCard}>
      <p className={adminKpiLabel}>{label}</p>
      <p className={adminKpiValue}>{loading ? "—" : (value ?? 0).toLocaleString()}</p>
    </div>
  );
}

const STUDENT_ROLES: UserRole[] = ["STUDENT"];

async function countFor(
  filter: { status?: UserStatus; roles?: UserRole[] },
): Promise<number> {
  const result = await fetchAdminUsers({ page: 1, limit: 1, ...filter });
  if (!result.ok) return 0;
  return result.data.meta.total;
}

export default function StudentDashboardKpiRow() {
  const [pendingReview, setPendingReview] = useState<number | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const [review, activeCount] = await Promise.all([
        countFor({ roles: STUDENT_ROLES, status: "PENDING_ADMIN_REVIEW" }),
        countFor({ roles: STUDENT_ROLES, status: "ACTIVE" }),
      ]);
      if (!cancelled) {
        setPendingReview(review);
        setActive(activeCount);
        setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      <KpiTile label="Student applications pending" value={pendingReview} loading={loading} />
      <KpiTile label="Enrolled students" value={active} loading={loading} />
    </div>
  );
}
