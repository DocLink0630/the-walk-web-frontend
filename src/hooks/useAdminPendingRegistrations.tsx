"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  fetchPendingRegistrationCounts,
  PENDING_COUNT_LABELS,
  PENDING_COUNT_SECTIONS,
  type PendingCountSection,
  type PendingRegistrationCounts,
} from "@/lib/admin/pending-registrations-api";

export interface AdminToast {
  id: string;
  message: string;
}

interface AdminPendingRegistrationsContextValue {
  counts: PendingRegistrationCounts;
  loading: boolean;
  refreshCounts: () => Promise<void>;
  toasts: AdminToast[];
  dismissToast: (id: string) => void;
}

const EMPTY_COUNTS: PendingRegistrationCounts = {
  models: 0,
  students: 0,
  beauticians: 0,
  photographers: 0,
  influencers: 0,
  reviews: 0,
};

const AdminPendingRegistrationsContext =
  createContext<AdminPendingRegistrationsContextValue | null>(null);

const POLL_INTERVAL_MS = 30_000;
const TOAST_DURATION_MS = 6_000;

function detectNewRegistrations(
  previous: PendingRegistrationCounts | null,
  current: PendingRegistrationCounts,
): AdminToast[] {
  if (!previous) return [];

  const toasts: AdminToast[] = [];
  const now = Date.now();

  for (const section of PENDING_COUNT_SECTIONS) {
    const delta = current[section as PendingCountSection] - previous[section as PendingCountSection];
    if (delta > 0) {
      const label = PENDING_COUNT_LABELS[section];
      const suffix = delta === 1 ? "application" : "applications";
      toasts.push({
        id: `${section}-${now}-${delta}`,
        message: `${delta} new ${label.toLowerCase()} ${suffix} pending review`,
      });
    }
  }

  return toasts;
}

export function AdminPendingRegistrationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [counts, setCounts] = useState<PendingRegistrationCounts>(EMPTY_COUNTS);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<AdminToast[]>([]);
  const previousCountsRef = useRef<PendingRegistrationCounts | null>(null);
  const initialLoadRef = useRef(true);

  const refreshCounts = useCallback(async () => {
    const result = await fetchPendingRegistrationCounts();
    if (!result.ok) return;

    const next = result.data;
    if (!initialLoadRef.current) {
      const newToasts = detectNewRegistrations(previousCountsRef.current, next);
      if (newToasts.length > 0) {
        setToasts((prev) => [...prev, ...newToasts]);
      }
    } else {
      initialLoadRef.current = false;
    }

    previousCountsRef.current = next;
    setCounts(next);
    setLoading(false);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    void refreshCounts();
    const interval = setInterval(() => {
      void refreshCounts();
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refreshCounts]);

  useEffect(() => {
    if (toasts.length === 0) return;

    const timers = toasts.map((toast) =>
      setTimeout(() => dismissToast(toast.id), TOAST_DURATION_MS),
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [toasts, dismissToast]);

  return (
    <AdminPendingRegistrationsContext.Provider
      value={{ counts, loading, refreshCounts, toasts, dismissToast }}
    >
      {children}
    </AdminPendingRegistrationsContext.Provider>
  );
}

export function useAdminPendingRegistrations() {
  const ctx = useContext(AdminPendingRegistrationsContext);
  if (!ctx) {
    throw new Error(
      "useAdminPendingRegistrations must be used within AdminPendingRegistrationsProvider",
    );
  }
  return ctx;
}
