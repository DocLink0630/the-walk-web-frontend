import { fetchAdminUsers } from "@/lib/admin/users-api";
import { fetchPendingReviewsCount } from "@/lib/admin/reviews-api";
import type { UserRole } from "@/types/admin";
import type { AdminSection } from "@/types/admin-nav";

export interface PendingRegistrationCounts {
  models: number;
  students: number;
  beauticians: number;
  photographers: number;
  influencers: number;
  reviews: number;
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

const SECTION_ROLES: Record<PendingCountSection, UserRole[]> = {
  models: ["MODEL"],
  students: ["STUDENT"],
  beauticians: ["BEAUTICIAN"],
  photographers: ["PHOTOGRAPHER"],
  influencers: ["INFLUENCER"],
};

export function countForSection(
  counts: PendingRegistrationCounts,
  section: AdminSection,
): number {
  if (!(section in counts)) return 0;
  return counts[section as keyof PendingRegistrationCounts];
}

async function countPendingForRoles(roles: UserRole[]): Promise<number | null> {
  const result = await fetchAdminUsers({
    page: 1,
    limit: 1,
    status: "PENDING_ADMIN_REVIEW",
    roles,
  });
  if (!result.ok) return null;
  return result.data.meta.total;
}

export async function fetchPendingRegistrationCounts(): Promise<
  | { ok: true; data: PendingRegistrationCounts }
  | { ok: false; message: string }
> {
  const [roleResults, reviewsCount] = await Promise.all([
    Promise.all(
      PENDING_COUNT_SECTIONS.map((section) => countPendingForRoles(SECTION_ROLES[section])),
    ),
    fetchPendingReviewsCount(),
  ]);

  if (roleResults.every((total) => total === null) && reviewsCount === null) {
    return { ok: false, message: "Failed to load pending counts" };
  }

  const data = PENDING_COUNT_SECTIONS.reduce((acc, section, index) => {
    acc[section] = roleResults[index] ?? 0;
    return acc;
  }, {} as PendingRegistrationCounts);

  data.reviews = reviewsCount ?? 0;

  return { ok: true, data };
}
