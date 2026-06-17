"use client";

import { useState } from "react";
import AdminAddModelPanel from "./AdminAddModelPanel";
import ModelQueueTable from "./ModelQueueTable";
import { adminBtnPrimary, adminSectionTitle } from "./admin-ui";

export default function ModelManagementPanel() {
  const [showAddModel, setShowAddModel] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className={adminSectionTitle}>Models</h2>
          <p className="text-sm text-gray-500 mt-1">
            Search, review, and update model accounts.
          </p>
        </div>
        <button type="button" onClick={() => setShowAddModel(true)} className={adminBtnPrimary}>
          Add model
        </button>
      </div>

      <ModelQueueTable />

      {showAddModel && (
        <AdminAddModelPanel onClose={() => setShowAddModel(false)} onSaved={() => {}} />
      )}
    </div>
  );
}
