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

export type KpiMetric = {
  label: string;
  status?: UserStatus;
};

async function countFor(
  filter: { status?: UserStatus; roles?: UserRole[] },
): Promise<number> {
  const result = await fetchAdminUsers({ page: 1, limit: 1, ...filter });
  if (!result.ok) return 0;
  return result.data.meta.total;
}

interface DashboardKpiRowProps {
  roles: UserRole[];
  metrics: KpiMetric[];
  gridClassName?: string;
}

/** `roles` and `metrics` must be stable module-level constants. */
export default function DashboardKpiRow({
  roles,
  metrics,
  gridClassName = "grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4",
}: DashboardKpiRowProps) {
  const [values, setValues] = useState<(number | null)[]>(() =>
    metrics.map(() => null),
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const counts = await Promise.all(
        metrics.map((metric) =>
          countFor({
            roles,
            status: metric.status,
          }),
        ),
      );
      if (!cancelled) {
        setValues(counts);
        setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
    // Stable module-level constants only — see props contract above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={gridClassName}>
      {metrics.map((metric, index) => (
        <KpiTile
          key={metric.label}
          label={metric.label}
          value={values[index] ?? null}
          loading={loading}
        />
      ))}
    </div>
  );
}

export const MODEL_KPI_ROLES: UserRole[] = ["MODEL"];
export const STUDENT_KPI_ROLES: UserRole[] = ["STUDENT"];

export const MODEL_KPI_METRICS: KpiMetric[] = [
  { label: "Pending review", status: "PENDING_ADMIN_REVIEW" },
  { label: "Rejected", status: "REJECTED" },
  { label: "Active", status: "ACTIVE" },
  { label: "Total models" },
];

export const STUDENT_KPI_METRICS: KpiMetric[] = [
  { label: "Student applications pending", status: "PENDING_ADMIN_REVIEW" },
];
