"use client";

import InfluencerQueueTable from "./InfluencerQueueTable";

export default function InfluencerManagementPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Influencers</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Review applications, approve influencers, and permanently delete accounts when needed.
        </p>
      </div>
      <InfluencerQueueTable />
    </div>
  );
}
