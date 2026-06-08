"use client";

import { useState } from "react";
import AdminAddModelPanel from "./AdminAddModelPanel";
import ModelDashboardKpiRow from "./ModelDashboardKpiRow";
import ModelQueueTable from "./ModelQueueTable";

export default function ModelManagementPanel() {
  const [kpiKey, setKpiKey] = useState(0);
  const [showAddModel, setShowAddModel] = useState(false);

  function handleUsersChanged() {
    setKpiKey((k) => k + 1);
  }

  return (
    <div>
      <ModelDashboardKpiRow key={kpiKey} />
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => setShowAddModel(true)}
          className="font-ui text-[10px] tracking-[0.2em] uppercase px-5 py-2.5 bg-[#0A0A0A] text-white hover:bg-[#C8A97A] transition-colors"
        >
          Add model
        </button>
      </div>
      <ModelQueueTable onUsersChanged={handleUsersChanged} />
      {showAddModel && (
        <AdminAddModelPanel
          onClose={() => setShowAddModel(false)}
          onSaved={handleUsersChanged}
        />
      )}
    </div>
  );
}
