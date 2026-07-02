import type { InquiryStatus } from "@/types/inquiry";

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
  NEW: "New",
  IN_PROGRESS: "In progress",
  CONFIRMED: "Confirmed",
  CLOSED: "Completed",
};

export const INQUIRY_QUEUE_STATUSES: InquiryStatus[] = [
  "NEW",
  "IN_PROGRESS",
  "CONFIRMED",
  "CLOSED",
];

export const INQUIRY_STATUS_COLORS: Record<InquiryStatus, string> = {
  NEW: "bg-amber-50 text-amber-800 border-amber-200",
  IN_PROGRESS: "bg-blue-50 text-blue-800 border-blue-200",
  CONFIRMED: "bg-green-50 text-green-800 border-green-200",
  CLOSED: "bg-emerald-50 text-emerald-800 border-emerald-200",
};
