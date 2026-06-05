/** IDs match walk-web-backend prisma seed for registration_skin_color_options */
export const SKIN_COLOR_OPTIONS = [
  { id: "skin-color-fair", label: "Fair" },
  { id: "skin-color-light", label: "Light" },
  { id: "skin-color-medium", label: "Medium" },
  { id: "skin-color-tan", label: "Tan" },
  { id: "skin-color-deep", label: "Deep" },
  { id: "skin-color-rich-deep", label: "Rich Deep" },
] as const;

import type { ModelTier } from "@/types/api/model-profile";

/** ModelProfileDto.tier — walk-web-backend ModelTier enum */
export const MODEL_TIER_OPTIONS: {
  value: ModelTier;
  label: string;
  description: string;
}[] = [
  {
    value: "FRESHER",
    label: "Fresher",
    description: "New to professional modelling or building your first portfolio",
  },
  {
    value: "EXPERIENCED",
    label: "Experienced",
    description: "Previous runway, editorial, or commercial work",
  },
  {
    value: "SUPERMODEL",
    label: "Super model",
    description: "Established career with major campaigns or international work",
  },
];

/** ModelSource / StudentSource — same enum values in Prisma */
export const REFERRAL_SOURCE_OPTIONS = [
  { value: "WALK_IN", label: "Walk in" },
  { value: "ONLINE", label: "Online" },
  { value: "REFERRAL", label: "Referral" },
  { value: "OTHER", label: "Other" },
] as const;
