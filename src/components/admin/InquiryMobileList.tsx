"use client";

import type { Inquiry, InquiryStatus } from "@/types/inquiry";
import {
  INQUIRY_STATUS_LABELS,
  formatInquiryTalentSummary,
  inquiryStatusSelectOptions,
} from "@/lib/inquiry/status";
import {
  adminBtnAccent,
  adminBtnPrimary,
  adminBtnSecondary,
  adminInput,
  adminMobileCard,
  adminStatusBadge,
} from "./admin-ui";

interface InquiryMobileListProps {
  inquiries: Inquiry[];
  pendingStatus: Record<string, InquiryStatus>;
  updatingId: string | null;
  onStatusChange: (id: string, status: InquiryStatus) => void;
  onUpdate: (inquiry: Inquiry) => void;
  onReview: (inquiry: Inquiry) => void;
  formatDate: (iso: string) => string;
}

export default function InquiryMobileList({
  inquiries,
  pendingStatus,
  updatingId,
  onStatusChange,
  onUpdate,
  onReview,
  formatDate,
}: InquiryMobileListProps) {
  return (
    <div className="space-y-3 md:hidden">
      {inquiries.map((inquiry) => (
        <div key={inquiry.id} className={adminMobileCard}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {inquiry.clientName ?? inquiry.clientEmail ?? "Client"}
              </p>
              <p className="text-sm text-gray-500 truncate">{inquiry.phone}</p>
            </div>
            <span className={adminStatusBadge}>
              {INQUIRY_STATUS_LABELS[inquiry.status] ?? inquiry.status}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {formatInquiryTalentSummary(inquiry.items)}
            {inquiry.eventDate ? ` · ${inquiry.eventDate}` : ""}
          </p>
          <p className="text-xs text-gray-400">{formatDate(inquiry.createdAt)}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => onReview(inquiry)}
              className={adminBtnAccent + " !px-3 !py-1.5 text-xs"}
            >
              View
            </button>
            <select
              value={pendingStatus[inquiry.id] ?? inquiry.status}
              onChange={(e) =>
                onStatusChange(inquiry.id, e.target.value as InquiryStatus)
              }
              className={adminInput + " !py-1.5 text-xs min-w-[120px]"}
            >
              {inquiryStatusSelectOptions(pendingStatus[inquiry.id] ?? inquiry.status).map(
                (s) => (
                  <option key={s} value={s}>
                    {INQUIRY_STATUS_LABELS[s] ?? s}
                  </option>
                ),
              )}
            </select>
            <button
              type="button"
              disabled={
                updatingId === inquiry.id ||
                (pendingStatus[inquiry.id] ?? inquiry.status) === inquiry.status
              }
              onClick={() => onUpdate(inquiry)}
              className={adminBtnPrimary + " !px-3 !py-1.5 text-xs"}
            >
              {updatingId === inquiry.id ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
