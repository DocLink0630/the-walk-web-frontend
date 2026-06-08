"use client";

import type { AdminSection } from "@/types/admin-nav";
import ModelManagementPanel from "./ModelManagementPanel";
import StudentManagementPanel from "./StudentManagementPanel";

interface AdminDashboardProps {
  section: AdminSection;
}

export default function AdminDashboard({ section }: AdminDashboardProps) {
  return section === "students" ? (
    <StudentManagementPanel />
  ) : (
    <ModelManagementPanel />
  );
}
