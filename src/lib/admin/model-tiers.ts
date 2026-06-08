import type { AssignableModelTier } from "@/types/admin";

export const ADMIN_ASSIGNABLE_TIERS: {
  value: AssignableModelTier;
  label: string;
}[] = [
  { value: "FRESHER", label: "Fresher" },
  { value: "EXPERIENCED", label: "Experienced" },
  { value: "SUPERMODEL", label: "Super model" },
];

export function formatModelTier(tier?: string | null): string {
  if (!tier) return "—";
  const found = ADMIN_ASSIGNABLE_TIERS.find((t) => t.value === tier);
  if (found) return found.label;
  if (tier === "PENDING") return "Pending review";
  return tier;
}
