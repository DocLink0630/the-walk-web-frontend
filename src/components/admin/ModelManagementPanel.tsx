"use client";

import { useState } from "react";
import AdminAddModelPanel from "./AdminAddModelPanel";
import ModelQueueTable from "./ModelQueueTable";

export default function ModelManagementPanel() {
  const [showAddModel, setShowAddModel] = useState(false);

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => setShowAddModel(true)}
          className="font-ui text-[10px] tracking-[0.2em] uppercase px-5 py-2.5 bg-[#0A0A0A] text-white hover:bg-[#C8A97A] transition-colors"
        >
          Add model
        </button>
      </div>
      <ModelQueueTable />
      {showAddModel && (
        <AdminAddModelPanel
          onClose={() => setShowAddModel(false)}
          onSaved={() => {}}
        />
      )}
    </div>
  );
}
