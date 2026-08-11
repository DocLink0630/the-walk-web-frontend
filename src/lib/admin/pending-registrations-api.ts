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

/** Sections that can show a sidebar notification badge. */
export const BADGE_COUNT_SECTIONS = [
  ...PENDING_COUNT_SECTIONS,
  "reviews",
] as const satisfies ReadonlyArray<keyof PendingRegistrationCounts>;

export type BadgeCountSection = (typeof BADGE_COUNT_SECTIONS)[number];

export const SEEN_BASELINES_STORAGE_KEY = "admin-pending-seen-baselines";

export const EMPTY_PENDING_COUNTS: PendingRegistrationCounts = {
  models: 0,
  students: 0,
  beauticians: 0,
  photographers: 0,
  influencers: 0,
  reviews: 0,
};

export function isBadgeCountSection(section: AdminSection): section is BadgeCountSection {
  return (BADGE_COUNT_SECTIONS as readonly string[]).includes(section);
}

export function loadSeenBaselines(): PendingRegistrationCounts {
  if (typeof window === "undefined") return { ...EMPTY_PENDING_COUNTS };

  try {
    const raw = window.localStorage.getItem(SEEN_BASELINES_STORAGE_KEY);
    if (!raw) return { ...EMPTY_PENDING_COUNTS };
    const parsed = JSON.parse(raw) as Partial<PendingRegistrationCounts>;
    const baselines = { ...EMPTY_PENDING_COUNTS };
    for (const section of BADGE_COUNT_SECTIONS) {
      const value = parsed[section];
      baselines[section] = typeof value === "number" && value >= 0 ? value : 0;
    }
    return baselines;
  } catch {
    return { ...EMPTY_PENDING_COUNTS };
  }
}

export function saveSeenBaselines(baselines: PendingRegistrationCounts): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SEEN_BASELINES_STORAGE_KEY, JSON.stringify(baselines));
  } catch {
    // Ignore quota / private-mode failures.
  }
}

/** Clamp baselines so they never exceed live counts (e.g. after approvals). */
export function clampSeenBaselines(
  live: PendingRegistrationCounts,
  seen: PendingRegistrationCounts,
): PendingRegistrationCounts {
  const next = { ...seen };
  let changed = false;
  for (const section of BADGE_COUNT_SECTIONS) {
    if (live[section] < next[section]) {
      next[section] = live[section];
      changed = true;
    }
  }
  return changed ? next : seen;
}

export function computeUnseenCounts(
  live: PendingRegistrationCounts,
  seen: PendingRegistrationCounts,
): PendingRegistrationCounts {
  const unseen = { ...EMPTY_PENDING_COUNTS };
  for (const section of BADGE_COUNT_SECTIONS) {
    unseen[section] = Math.max(0, live[section] - seen[section]);
  }
  return unseen;
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
