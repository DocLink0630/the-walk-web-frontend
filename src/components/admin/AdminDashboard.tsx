"use client";

import type { AdminSection } from "@/types/admin-nav";
import AdminDashboardPanel from "./AdminDashboardPanel";
import ModelManagementPanel from "./ModelManagementPanel";

interface AdminDashboardProps {
  section: AdminSection;
  onSectionChange: (section: AdminSection) => void;
}

export default function AdminDashboard({ section, onSectionChange }: AdminDashboardProps) {
  if (section === "dashboard") {
    return <AdminDashboardPanel onSectionChange={onSectionChange} />;
  }

  return <ModelManagementPanel />;
}
