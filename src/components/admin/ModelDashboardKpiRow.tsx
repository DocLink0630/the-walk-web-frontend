"use client";

import { useEffect, useState } from "react";
import { fetchAdminUsers } from "@/lib/admin/users-api";
import type { UserRole, UserStatus } from "@/types/admin";

interface KpiCard {
  label: string;
  value: number | null;
  loading: boolean;
}

function KpiTile({ label, value, loading }: KpiCard) {
  return (
    <div className="border border-[#E0E0E0] bg-white px-5 py-4">
      <p className="font-ui text-[9px] tracking-[0.25em] uppercase text-[#9A9A9A] mb-2">
        {label}
      </p>
      <p className="font-display text-3xl font-light text-[#0A0A0A]">
        {loading ? "—" : (value ?? 0).toLocaleString()}
      </p>
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
  const [pendingEmail, setPendingEmail] = useState<number | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const [review, email, activeCount, totalCount] = await Promise.all([
        countFor({ roles: MODEL_ROLES, status: "PENDING_ADMIN_REVIEW" }),
        countFor({ roles: MODEL_ROLES, status: "PENDING_EMAIL_VERIFICATION" }),
        countFor({ roles: MODEL_ROLES, status: "ACTIVE" }),
        countFor({ roles: MODEL_ROLES }),
      ]);
      if (!cancelled) {
        setPendingReview(review);
        setPendingEmail(email);
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
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 mb-10">
      <KpiTile label="Pending model review" value={pendingReview} loading={loading} />
      <KpiTile label="Pending email" value={pendingEmail} loading={loading} />
      <KpiTile label="Active models" value={active} loading={loading} />
      <KpiTile label="Total models" value={total} loading={loading} />
    </div>
  );
}
