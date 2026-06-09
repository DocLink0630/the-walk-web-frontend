import type { UserStatus } from "@/types/admin";

/** Statuses shown in the model admin queue filter */
export const MODEL_QUEUE_STATUSES: UserStatus[] = [
  "PENDING_ADMIN_REVIEW",
  "ACTIVE",
  "REJECTED",
  "PENDING_EMAIL_VERIFICATION",
  "PENDING_PAYMENT",
  "INACTIVE",
  "SUSPENDED",
  "DELETED",
];

export const MODEL_STATUS_LABELS: Record<UserStatus, string> = {
  PENDING_EMAIL_VERIFICATION: "Pending email (legacy)",
  PENDING_ADMIN_REVIEW: "Pending review",
  PENDING_PAYMENT: "Pending payment",
  REJECTED: "Rejected",
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  SUSPENDED: "Suspended",
  DELETED: "Deleted",
};
