"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { fetchAdminInquiry, updateInquiryStatus } from "@/lib/admin/inquiries-api";
import {
  INQUIRY_QUEUE_STATUSES,
  INQUIRY_STATUS_LABELS,
} from "@/lib/inquiry/status";
import type { Inquiry, InquiryStatus } from "@/types/inquiry";
import {
  adminAlertErr,
  adminAlertOk,
  adminBtnPrimary,
  adminBtnSecondary,
  adminInput,
  adminLabel,
  adminMutedBox,
  adminSectionTitle,
} from "./admin-ui";

interface InquiryReviewPanelProps {
  inquiryId: string;
  onClose: () => void;
  onUpdated: () => void;
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function InquiryReviewPanel({
  inquiryId,
  onClose,
  onUpdated,
}: InquiryReviewPanelProps) {
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<InquiryStatus>("NEW");
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void fetchAdminInquiry(inquiryId).then((result) => {
      if (cancelled) return;
      if (result.ok) {
        setInquiry(result.data);
        setStatus(result.data.status);
      } else {
        setBanner({ type: "err", text: result.message });
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [inquiryId]);

  async function handleSave() {
    if (!inquiry) return;
    setSaving(true);
    setBanner(null);
    const result = await updateInquiryStatus(inquiry.id, status);
    setSaving(false);
    if (!result.ok) {
      setBanner({ type: "err", text: result.message });
      return;
    }
    setInquiry(result.data);
    setBanner({ type: "ok", text: "Status updated." });
    onUpdated();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4">
          <h3 className={adminSectionTitle}>Inquiry details</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {loading && <p className="text-sm text-gray-500">Loading…</p>}

          {banner && (
            <div className={banner.type === "ok" ? adminAlertOk : adminAlertErr}>
              {banner.text}
            </div>
          )}

          {inquiry && !loading && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Client</p>
                  <p className="text-sm text-gray-900">
                    {inquiry.clientName ?? "—"}
                  </p>
                  <p className="text-sm text-gray-600">{inquiry.clientEmail}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Phone</p>
                  <p className="text-sm text-gray-900">{inquiry.phone}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Submitted</p>
                  <p className="text-sm text-gray-900">{formatDate(inquiry.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Event date</p>
                  <p className="text-sm text-gray-900">{inquiry.eventDate ?? "—"}</p>
                </div>
              </div>

              {inquiry.message && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Project details</p>
                  <div className={adminMutedBox}>{inquiry.message}</div>
                </div>
              )}

              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">
                  Selected talent ({inquiry.items.length})
                </p>
                <ul className="space-y-2">
                  {inquiry.items.map((item) => (
                    <li
                      key={item.id}
                      className="rounded-lg border border-gray-200 px-4 py-3 text-sm"
                    >
                      <p className="font-medium text-gray-900">{item.modelName}</p>
                      <p className="text-gray-500 capitalize">
                        {item.modelType}
                        {item.category ? ` · ${item.category}` : ""}
                        {item.priceRate ? ` · ${item.priceRate}` : ""}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <label className={adminLabel}>Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as InquiryStatus)}
                  className={adminInput}
                >
                  {INQUIRY_QUEUE_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {INQUIRY_STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap gap-2 justify-end pt-2">
                <button type="button" onClick={onClose} className={adminBtnSecondary}>
                  Close
                </button>
                <button
                  type="button"
                  disabled={saving || status === inquiry.status}
                  onClick={() => void handleSave()}
                  className={adminBtnPrimary}
                >
                  {saving ? "Saving…" : "Save status"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
