export type AdminSection = "students" | "models";

export interface AdminNavItem {
  id: AdminSection;
  label: string;
  description: string;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    id: "students",
    label: "Students",
    description: "Registrations and academy onboarding",
  },
  {
    id: "models",
    label: "Models",
    description: "Agency roster and model applications",
  },
];
