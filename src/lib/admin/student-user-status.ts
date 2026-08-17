import type { UserStatus } from "@/types/admin";
import { MODEL_STATUS_LABELS } from "./model-user-status";

export const STUDENT_QUEUE_STATUSES: UserStatus[] = [
  "PENDING_ADMIN_REVIEW",
  "PENDING_PAYMENT",
  "ACTIVE",
  "DELETED",
];

export const STUDENT_STATUS_LABELS: Record<UserStatus, string> = {
  ...MODEL_STATUS_LABELS,
  PENDING_ADMIN_REVIEW: "Pending review",
  ACTIVE: "Approved",
};

export function studentStatusOptions(current: UserStatus): UserStatus[] {
  if (STUDENT_QUEUE_STATUSES.includes(current)) {
    return STUDENT_QUEUE_STATUSES;
  }
  return [current, ...STUDENT_QUEUE_STATUSES];
}
