export type AdminSection =
  | "dashboard"
  | "models"
  | "students"
  | "events"
  | "gallery"
  | "inquiries";

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
  {
    id: "students",
    label: "Students",
    description: "Academy applications from the website",
  },
  {
    id: "events",
    label: "Events",
    description: "Manage public events and visibility",
  },
  {
    id: "gallery",
    label: "Gallery",
    description: "Manage gallery images and order",
  },
  {
    id: "inquiries",
    label: "Inquiries",
    description: "Review and manage client booking requests",
  },
];
