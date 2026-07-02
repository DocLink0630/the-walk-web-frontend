"use client";

import type { AdminSection } from "@/types/admin-nav";
import AdminDashboardPanel from "./AdminDashboardPanel";
import AdminEventsPanel from "./AdminEventsPanel";
import AdminGalleryPanel from "./AdminGalleryPanel";
import InquiriesPanel from "./InquiriesPanel";
import InfluencerManagementPanel from "./InfluencerManagementPanel";
import ReviewsPanel from "./ReviewsPanel";
import ModelManagementPanel from "./ModelManagementPanel";
import ServiceProviderManagementPanel from "./ServiceProviderManagementPanel";
import StudentManagementPanel from "./StudentManagementPanel";

interface AdminDashboardProps {
  section: AdminSection;
  onSectionChange: (section: AdminSection) => void;
}

export default function AdminDashboard({ section, onSectionChange }: AdminDashboardProps) {
  if (section === "dashboard") {
    return <AdminDashboardPanel onSectionChange={onSectionChange} />;
  }

  if (section === "models") {
    return <ModelManagementPanel />;
  }

  if (section === "students") {
    return <StudentManagementPanel />;
  }

  if (section === "beauticians") {
    return <ServiceProviderManagementPanel providerType="beauticians" />;
  }

  if (section === "photographers") {
    return <ServiceProviderManagementPanel providerType="photographers" />;
  }

  if (section === "influencers") {
    return <InfluencerManagementPanel />;
  }

  if (section === "events") {
    return <AdminEventsPanel />;
  }

  if (section === "gallery") {
    return <AdminGalleryPanel />;
  }

  if (section === "reviews") {
    return <ReviewsPanel />;
  }

  return <InquiriesPanel />;
}
