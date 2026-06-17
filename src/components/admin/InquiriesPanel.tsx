"use client";

import InquiriesQueueTable from "./InquiriesQueueTable";
import { adminSectionTitle } from "./admin-ui";

export default function InquiriesPanel() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className={adminSectionTitle}>Inquiries</h2>
        <p className="text-sm text-gray-500 mt-1">
          Review client booking requests and update their status.
        </p>
      </div>
      <InquiriesQueueTable />
    </div>
  );
}
