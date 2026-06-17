"use client";

import StudentQueueTable from "./StudentQueueTable";
import { adminSectionTitle } from "./admin-ui";

export default function StudentManagementPanel() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className={adminSectionTitle}>Students</h2>
        <p className="text-sm text-gray-500 mt-1">
          Review academy applications submitted through the website.
        </p>
      </div>

      <StudentQueueTable />
    </div>
  );
}
