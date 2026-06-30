"use client";

import type { AdminSection } from "@/types/admin-nav";
import ServiceProviderQueueTable from "./ServiceProviderQueueTable";

interface Props {
  providerType: Extract<AdminSection, "beauticians" | "photographers">;
}

export default function ServiceProviderManagementPanel({ providerType }: Props) {
  const typeLabel = providerType === "beauticians" ? "Beauticians" : "Photographers";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{typeLabel}</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Review applications, approve providers, assign rates, and manage accounts.
        </p>
      </div>
      <ServiceProviderQueueTable providerType={providerType} />
    </div>
  );
}
