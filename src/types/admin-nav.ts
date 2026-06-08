export type AdminSection = "dashboard" | "models";

export interface AdminNavItem {
  id: AdminSection;
  label: string;
  description: string;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    description: "Overview and model activity",
  },
  {
    id: "models",
    label: "Models",
    description: "Agency roster and model applications",
  },
];
