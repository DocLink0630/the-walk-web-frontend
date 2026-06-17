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

const MODEL_ROLES: UserRole[] = ["MODEL"];

async function countFor(
  filter: { status?: UserStatus; roles?: UserRole[] },
): Promise<number> {
  const result = await fetchAdminUsers({ page: 1, limit: 1, ...filter });
  if (!result.ok) return 0;
  return result.data.meta.total;
}

export default function ModelDashboardKpiRow() {
  const [pendingReview, setPendingReview] = useState<number | null>(null);
  const [rejected, setRejected] = useState<number | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const [review, rejectedCount, activeCount, totalCount] = await Promise.all([
        countFor({ roles: MODEL_ROLES, status: "PENDING_ADMIN_REVIEW" }),
        countFor({ roles: MODEL_ROLES, status: "REJECTED" }),
        countFor({ roles: MODEL_ROLES, status: "ACTIVE" }),
        countFor({ roles: MODEL_ROLES }),
      ]);
      if (!cancelled) {
        setPendingReview(review);
        setRejected(rejectedCount);
        setActive(activeCount);
        setTotal(totalCount);
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <KpiTile label="Pending review" value={pendingReview} loading={loading} />
      <KpiTile label="Rejected" value={rejected} loading={loading} />
      <KpiTile label="Active" value={active} loading={loading} />
      <KpiTile label="Total models" value={total} loading={loading} />
    </div>
  );
}
