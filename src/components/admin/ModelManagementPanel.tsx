"use client";

import { useState } from "react";
import ModelDashboardKpiRow from "./ModelDashboardKpiRow";
import ModelQueueTable from "./ModelQueueTable";

export default function ModelManagementPanel() {
  const [kpiKey, setKpiKey] = useState(0);

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-2xl font-light text-[#0A0A0A] mb-1">
          Models
        </h2>
        <p className="font-ui text-[10px] tracking-[0.15em] text-[#9A9A9A] uppercase">
          Review model registrations and approve agency roster access
        </p>
      </div>

      <ModelDashboardKpiRow key={kpiKey} />
      <ModelQueueTable onUsersChanged={() => setKpiKey((k) => k + 1)} />
    </div>
  );
}
