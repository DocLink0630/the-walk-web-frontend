"use client";

import { useState } from "react";
import DashboardKpiRow from "./DashboardKpiRow";
import UserQueueTable from "./UserQueueTable";

export default function StudentManagementPanel() {
  const [kpiKey, setKpiKey] = useState(0);

  return (
    <div>
      <DashboardKpiRow key={kpiKey} />
      <UserQueueTable onUsersChanged={() => setKpiKey((k) => k + 1)} />
    </div>
  );
}
