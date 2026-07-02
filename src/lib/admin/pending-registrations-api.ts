import { adminAuthHeaders } from "@/lib/admin/token";
import type { AdminSection } from "@/types/admin-nav";

export interface PendingRegistrationCounts {
  models: number;
  students: number;
  beauticians: number;
  photographers: number;
  influencers: number;
}

export type PendingCountSection =
  | "models"
  | "students"
  | "beauticians"
  | "photographers"
  | "influencers";

export const PENDING_COUNT_SECTIONS: PendingCountSection[] = [
  "models",
  "students",
  "beauticians",
  "photographers",
  "influencers",
];

export const PENDING_COUNT_LABELS: Record<PendingCountSection, string> = {
  models: "Model",
  students: "Student",
  beauticians: "Beautician",
  photographers: "Photographer",
  influencers: "Influencer",
};

export function countForSection(
  counts: PendingRegistrationCounts,
  section: AdminSection,
): number {
  if (!(section in counts)) return 0;
  return counts[section as PendingCountSection];
}

export async function fetchPendingRegistrationCounts(): Promise<
  | { ok: true; data: PendingRegistrationCounts }
  | { ok: false; message: string }
> {
  const res = await fetch("/api/admin/pending-registrations", {
    headers: adminAuthHeaders(),
  });

  if (!res.ok) {
    let message = "Failed to load pending counts";
    try {
      const body = (await res.json()) as { message?: string };
      if (body?.message) message = body.message;
    } catch {
      /* ignore */
    }
    return { ok: false, message };
  }

  const data = (await res.json()) as PendingRegistrationCounts;
  return { ok: true, data };
}
