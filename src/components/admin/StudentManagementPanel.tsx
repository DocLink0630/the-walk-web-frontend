"use client";

import { useState } from "react";
import DashboardKpiRow from "./DashboardKpiRow";
import UserQueueTable from "./UserQueueTable";

export default function StudentManagementPanel() {
  const [kpiKey, setKpiKey] = useState(0);

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-2xl font-light text-[#0A0A0A] mb-1">
          Students
        </h2>
        <p className="font-ui text-[10px] tracking-[0.15em] text-[#9A9A9A] uppercase">
          Review student registrations and update account status
        </p>
      </div>

      <DashboardKpiRow key={kpiKey} />
      <UserQueueTable onUsersChanged={() => setKpiKey((k) => k + 1)} />
    </div>
  );
}
