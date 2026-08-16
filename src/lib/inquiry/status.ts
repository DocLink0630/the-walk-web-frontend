import type { InquiryItem, InquiryStatus } from "@/types/inquiry";

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
  NEW: "New",
  IN_PROGRESS: "In progress",
  CONFIRMED: "Confirmed",
  CLOSED: "Completed",
};

export const INQUIRY_QUEUE_STATUSES: InquiryStatus[] = [
  "NEW",
  "CONFIRMED",
  "CLOSED",
];

export const INQUIRY_STATUS_COLORS: Record<InquiryStatus, string> = {
  NEW: "bg-amber-50 text-amber-800 border-amber-200",
  IN_PROGRESS: "bg-blue-50 text-blue-800 border-blue-200",
  CONFIRMED: "bg-green-50 text-green-800 border-green-200",
  CLOSED: "bg-emerald-50 text-emerald-800 border-emerald-200",
};

export function inquiryStatusSelectOptions(current?: InquiryStatus): InquiryStatus[] {
  if (current && !INQUIRY_QUEUE_STATUSES.includes(current)) {
    return [current, ...INQUIRY_QUEUE_STATUSES];
  }
  return INQUIRY_QUEUE_STATUSES;
}

const TALENT_TYPE_LABELS: Record<string, string> = {
  model: "Model",
  beautician: "Beautician",
  photographer: "Photographer",
};

export function formatInquiryTalentType(type: string | null | undefined): string {
  const trimmed = type?.trim() ?? "";
  if (!trimmed) return "Talent";
  return TALENT_TYPE_LABELS[trimmed.toLowerCase()] ?? trimmed;
}

export function formatInquiryTalentSummary(
  items: InquiryItem[] | undefined,
  maxVisible = 2,
): string {
  const list = items ?? [];
  if (list.length === 0) return "—";

  const labels = list.map((item) => {
    const name = item.modelName?.trim() || "Talent";
    return `${name} (${formatInquiryTalentType(item.modelType)})`;
  });

  if (labels.length <= maxVisible) return labels.join(", ");
  return `${labels.slice(0, maxVisible).join(", ")} +${labels.length - maxVisible} more`;
}
