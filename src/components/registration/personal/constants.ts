/** IDs match walk-web-backend prisma seed for registration_skin_color_options */
export const SKIN_COLOR_OPTIONS = [
  { id: "skin-color-fair", label: "Fair" },
  { id: "skin-color-light", label: "Light" },
  { id: "skin-color-medium", label: "Medium" },
  { id: "skin-color-tan", label: "Tan" },
  { id: "skin-color-deep", label: "Deep" },
  { id: "skin-color-rich-deep", label: "Rich Deep" },
] as const;

/** ModelSource / StudentSource — same enum values in Prisma */
export const REFERRAL_SOURCE_OPTIONS = [
  { value: "WALK_IN", label: "Walk in" },
  { value: "ONLINE", label: "Online" },
  { value: "REFERRAL", label: "Referral" },
  { value: "OTHER", label: "Other" },
] as const;
