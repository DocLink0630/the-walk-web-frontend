import type { UserStatus } from "@/types/admin";
import { MODEL_STATUS_LABELS } from "./model-user-status";

export const STUDENT_QUEUE_STATUSES: UserStatus[] = [
  "PENDING_ADMIN_REVIEW",
  "PENDING_PAYMENT",
  "ACTIVE",
  "DELETED",
];

/** Forward pipeline only (excludes DELETED, which is always allowed as a side exit). */
const STUDENT_STATUS_PIPELINE: UserStatus[] = [
  "PENDING_ADMIN_REVIEW",
  "PENDING_PAYMENT",
  "ACTIVE",
];

export const STUDENT_STATUS_LABELS: Record<UserStatus, string> = {
  ...MODEL_STATUS_LABELS,
  PENDING_ADMIN_REVIEW: "Pending review",
  ACTIVE: "Approved",
};

export function studentStatusOptions(current: UserStatus): UserStatus[] {
  const idx = STUDENT_STATUS_PIPELINE.indexOf(current);
  if (idx === -1) {
    return current === "DELETED" ? ["DELETED"] : [current, "DELETED"];
  }

  const options: UserStatus[] = [
    ...STUDENT_STATUS_PIPELINE.slice(idx),
    "DELETED",
  ];
  return options;
}

export function canTransitionStudentStatus(
  from: UserStatus,
  to: UserStatus,
): boolean {
  return studentStatusOptions(from).includes(to);
}
