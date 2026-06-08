"use client";

import { ArrowRight } from "lucide-react";
import type { AdminSection } from "@/types/admin-nav";
import ModelDashboardKpiRow from "./ModelDashboardKpiRow";

interface AdminDashboardPanelProps {
  onSectionChange: (section: AdminSection) => void;
}

export default function AdminDashboardPanel({ onSectionChange }: AdminDashboardPanelProps) {
  return (
    <div className="space-y-10">
      <div>
        <p className="font-ui text-[9px] tracking-[0.35em] uppercase text-[#C8A97A] mb-3">
          Overview
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-light text-[#0A0A0A] mb-2">
          Model agency at a glance
        </h2>
        <p className="font-ui text-[11px] tracking-[0.05em] text-[#6B6B6B] max-w-xl leading-relaxed">
          Track pending applications, email verification, and active roster counts. Open Models to
          review profiles and approve listings.
        </p>
      </div>

      <ModelDashboardKpiRow />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onSectionChange("models")}
          className="group text-left border border-[#E0E0E0] bg-white px-5 py-5 hover:border-[#C8A97A] transition-colors"
        >
          <p className="font-ui text-[9px] tracking-[0.25em] uppercase text-[#9A9A9A] mb-2">
            Quick action
          </p>
          <p className="font-display text-xl font-light text-[#0A0A0A] mb-2 group-hover:text-[#C8A97A] transition-colors">
            Manage model applications
          </p>
          <p className="font-ui text-[10px] text-[#6B6B6B] leading-relaxed mb-4">
            Review registrations, assign tiers and rates, and activate models on the public roster.
          </p>
          <span className="inline-flex items-center gap-2 font-ui text-[9px] tracking-[0.2em] uppercase text-[#0A0A0A] group-hover:text-[#C8A97A] transition-colors">
            Go to Models
            <ArrowRight className="size-3.5" strokeWidth={1.5} />
          </span>
        </button>

        <div className="border border-[#E0E0E0] bg-white px-5 py-5">
          <p className="font-ui text-[9px] tracking-[0.25em] uppercase text-[#9A9A9A] mb-2">
            Approval flow
          </p>
          <ol className="space-y-2 font-ui text-[10px] text-[#4A4A4A] leading-relaxed list-decimal list-inside">
            <li>Model registers → Pending email</li>
            <li>Email verified → Pending review</li>
            <li>Admin approves tier &amp; rate → Active</li>
          </ol>
          <p className="mt-4 font-ui text-[9px] tracking-[0.08em] text-[#9A9A9A] leading-relaxed">
            You can move a model to Pending review manually if email verification is skipped.
          </p>
        </div>
      </div>
    </div>
  );
}
