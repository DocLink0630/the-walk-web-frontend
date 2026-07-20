import type { UserStatus } from "@/types/admin";
import { MODEL_QUEUE_STATUSES, MODEL_STATUS_LABELS } from "./model-user-status";

export const STUDENT_QUEUE_STATUSES = MODEL_QUEUE_STATUSES;

export const STUDENT_STATUS_LABELS: Record<UserStatus, string> = {
  ...MODEL_STATUS_LABELS,
  PENDING_ADMIN_REVIEW: "Pending review",
};
