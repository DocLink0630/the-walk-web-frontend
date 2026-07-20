"use client";

import { ArrowRight } from "lucide-react";
import type { AdminSection } from "@/types/admin-nav";
import ModelDashboardKpiRow from "./ModelDashboardKpiRow";
import StudentDashboardKpiRow from "./StudentDashboardKpiRow";
import { adminCard, adminPageDesc, adminSectionTitle } from "./admin-ui";

interface AdminDashboardPanelProps {
  onSectionChange: (section: AdminSection) => void;
}

export default function AdminDashboardPanel({ onSectionChange }: AdminDashboardPanelProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className={`${adminSectionTitle} text-xl sm:text-2xl mb-2`}>Overview</h2>
        <p className={adminPageDesc}>
          Pending applications and active roster at a glance.
        </p>
      </div>

      <ModelDashboardKpiRow />

      <div>
        <h3 className={`${adminSectionTitle} mb-3`}>Academy</h3>
        <StudentDashboardKpiRow />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onSectionChange("models")}
          className={`${adminCard} group w-full text-left transition hover:border-amber-400 hover:shadow-md`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-amber-700 transition-colors">
                Manage models
              </p>
              <p className="text-sm text-gray-500">
                Review applications, edit profiles, and approve or reject.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 group-hover:text-amber-700 shrink-0">
              Open models
              <ArrowRight className="size-4" strokeWidth={1.75} />
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSectionChange("students")}
          className={`${adminCard} group w-full text-left transition hover:border-amber-400 hover:shadow-md`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-amber-700 transition-colors">
                Manage students
              </p>
              <p className="text-sm text-gray-500">
                Review academy applications submitted through the website.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 group-hover:text-amber-700 shrink-0">
              Open students
              <ArrowRight className="size-4" strokeWidth={1.75} />
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSectionChange("events")}
          className={`${adminCard} group w-full text-left transition hover:border-amber-400 hover:shadow-md`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-amber-700 transition-colors">
                Manage events
              </p>
              <p className="text-sm text-gray-500">
                Add events with detail pages or hide built-in listings.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 group-hover:text-amber-700 shrink-0">
              Open events
              <ArrowRight className="size-4" strokeWidth={1.75} />
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSectionChange("gallery")}
          className={`${adminCard} group w-full text-left transition hover:border-amber-400 hover:shadow-md`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-amber-700 transition-colors">
                Manage gallery
              </p>
              <p className="text-sm text-gray-500">
                Upload images, reorder the grid, and hide hardcoded photos.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 group-hover:text-amber-700 shrink-0">
              Open gallery
              <ArrowRight className="size-4" strokeWidth={1.75} />
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSectionChange("inquiries")}
          className={`${adminCard} group w-full text-left transition hover:border-amber-400 hover:shadow-md`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-amber-700 transition-colors">
                Manage inquiries
              </p>
              <p className="text-sm text-gray-500">
                Review client booking requests and update their status.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 group-hover:text-amber-700 shrink-0">
              Open inquiries
              <ArrowRight className="size-4" strokeWidth={1.75} />
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
