"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  clampSeenBaselines,
  computeUnseenCounts,
  EMPTY_PENDING_COUNTS,
  fetchPendingRegistrationCounts,
  isBadgeCountSection,
  loadSeenBaselines,
  PENDING_COUNT_LABELS,
  PENDING_COUNT_SECTIONS,
  saveSeenBaselines,
  type PendingCountSection,
  type PendingRegistrationCounts,
} from "@/lib/admin/pending-registrations-api";
import type { AdminSection } from "@/types/admin-nav";

export interface AdminToast {
  id: string;
  message: string;
}

interface AdminPendingRegistrationsContextValue {
  counts: PendingRegistrationCounts;
  unseenCounts: PendingRegistrationCounts;
  loading: boolean;
  refreshCounts: () => Promise<void>;
  markSectionSeen: (section: AdminSection) => void;
  toasts: AdminToast[];
  dismissToast: (id: string) => void;
}

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

  const inquiryDelta = current.inquiries - previous.inquiries;
  if (inquiryDelta > 0) {
    toasts.push({
      id: `inquiries-${now}-${inquiryDelta}`,
      message:
        inquiryDelta === 1 ? "1 new inquiry" : `${inquiryDelta} new inquiries`,
    });
  }

  return toasts;
}

export function AdminPendingRegistrationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [counts, setCounts] = useState<PendingRegistrationCounts>(EMPTY_PENDING_COUNTS);
  const [seenBaselines, setSeenBaselines] = useState<PendingRegistrationCounts>(EMPTY_PENDING_COUNTS);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<AdminToast[]>([]);
  const previousCountsRef = useRef<PendingRegistrationCounts | null>(null);
  const initialLoadRef = useRef(true);
  const countsRef = useRef(counts);

  useEffect(() => {
    setSeenBaselines(loadSeenBaselines());
  }, []);

  useEffect(() => {
    countsRef.current = counts;
  }, [counts]);

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
    setSeenBaselines((prev) => {
      const clamped = clampSeenBaselines(next, prev);
      if (clamped !== prev) {
        saveSeenBaselines(clamped);
      }
      return clamped;
    });
    setLoading(false);
  }, []);

  const markSectionSeen = useCallback((section: AdminSection) => {
    if (!isBadgeCountSection(section)) return;

    setSeenBaselines((prev) => {
      const live = countsRef.current[section];
      if (prev[section] === live) return prev;
      const next = { ...prev, [section]: live };
      saveSeenBaselines(next);
      return next;
    });
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const unseenCounts = useMemo(
    () => computeUnseenCounts(counts, seenBaselines),
    [counts, seenBaselines],
  );

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
      value={{
        counts,
        unseenCounts,
        loading,
        refreshCounts,
        markSectionSeen,
        toasts,
        dismissToast,
      }}
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
