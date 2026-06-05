"use client";

import { useState } from "react";
import ModelManagementPanel from "./ModelManagementPanel";
import StudentManagementPanel from "./StudentManagementPanel";

type AdminTab = "students" | "models";

const TAB_CLASS =
  "font-ui text-[9px] tracking-[0.25em] uppercase px-5 py-2.5 border transition-colors";
const TAB_ACTIVE = "border-[#0A0A0A] bg-[#0A0A0A] text-white";
const TAB_INACTIVE =
  "border-[#E0E0E0] text-[#4A4A4A] hover:border-[#C8A97A] hover:text-[#0A0A0A]";

export default function AdminDashboard() {
  const [tab, setTab] = useState<AdminTab>("students");

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-light text-[#0A0A0A] mb-1">
          Admin dashboard
        </h1>
        <p className="font-ui text-[10px] tracking-[0.15em] text-[#9A9A9A] uppercase">
          {tab === "students"
            ? "Student registrations and academy onboarding"
            : "Model registrations and agency roster review"}
        </p>
      </div>

      <div className="flex gap-2 mb-10">
        <button
          type="button"
          onClick={() => setTab("students")}
          className={TAB_CLASS + " " + (tab === "students" ? TAB_ACTIVE : TAB_INACTIVE)}
        >
          Students
        </button>
        <button
          type="button"
          onClick={() => setTab("models")}
          className={TAB_CLASS + " " + (tab === "models" ? TAB_ACTIVE : TAB_INACTIVE)}
        >
          Models
        </button>
      </div>

      {tab === "students" ? <StudentManagementPanel /> : <ModelManagementPanel />}
    </div>
  );
}
