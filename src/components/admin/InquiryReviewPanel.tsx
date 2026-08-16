"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import {
  fetchAdminInquiry,
  updateInquiryItems,
  updateInquiryStatus,
} from "@/lib/admin/inquiries-api";
import { useAdminPendingRegistrations } from "@/hooks/useAdminPendingRegistrations";
import { INQUIRY_STATUS_LABELS, inquiryStatusSelectOptions } from "@/lib/inquiry/status";
import type { Inquiry, InquiryItem, InquiryStatus } from "@/types/inquiry";
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

function formatNameList(names: string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

function itemIds(items: InquiryItem[] | undefined): string[] {
  return (items ?? []).map((item) => item.id);
}

export default function InquiryReviewPanel({
  inquiryId,
  onClose,
  onUpdated,
}: InquiryReviewPanelProps) {
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<InquiryStatus>("NEW");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );
  const { refreshCounts } = useAdminPendingRegistrations();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void fetchAdminInquiry(inquiryId).then((result) => {
      if (cancelled) return;
      if (result.ok) {
        setInquiry(result.data);
        setStatus(result.data.status);
        setSelectedIds(itemIds(result.data.items));
      } else {
        setBanner({ type: "err", text: result.message });
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [inquiryId]);

  const items = inquiry?.items ?? [];
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const removedItems = items.filter((item) => !selectedSet.has(item.id));
  const statusChanged = Boolean(inquiry && status !== inquiry.status);
  const itemsChanged = removedItems.length > 0;
  const canSave = !saving && (statusChanged || itemsChanged);

  function toggleItem(id: string) {
    if (selectedIds.includes(id)) {
      if (selectedIds.length <= 1) {
        setBanner({
          type: "err",
          text: "Keep at least one talent on the inquiry.",
        });
        return;
      }
      setBanner(null);
      setSelectedIds(selectedIds.filter((itemId) => itemId !== id));
      return;
    }
    setBanner(null);
    setSelectedIds([...selectedIds, id]);
  }

  async function handleSave() {
    if (!inquiry || !canSave) return;

    if (itemsChanged) {
      const removedNames = formatNameList(removedItems.map((item) => item.modelName));
      const confirmed = window.confirm(
        `An SMS will be sent to ${inquiry.phone} that ${removedNames} ${
          removedItems.length === 1 ? "is" : "are"
        } not available. Continue?`,
      );
      if (!confirmed) return;
    }

    setSaving(true);
    setBanner(null);

    let latest = inquiry;
    const messages: string[] = [];

    if (itemsChanged) {
      const itemsResult = await updateInquiryItems(inquiry.id, selectedIds, true);
      if (!itemsResult.ok) {
        setSaving(false);
        setBanner({ type: "err", text: itemsResult.message });
        return;
      }
      latest = itemsResult.data;
      const names = formatNameList(removedItems.map((item) => item.modelName));
      messages.push(`Client notified that ${names} ${removedItems.length === 1 ? "is" : "are"} unavailable.`);
    }

    if (statusChanged) {
      const statusResult = await updateInquiryStatus(inquiry.id, status);
      if (!statusResult.ok) {
        setInquiry(latest);
        setSelectedIds(itemIds(latest.items));
        setSaving(false);
        setBanner({ type: "err", text: statusResult.message });
        onUpdated();
        void refreshCounts();
        return;
      }
      latest = statusResult.data;
      messages.push("Status updated.");
    }

    setInquiry(latest);
    setStatus(latest.status);
    setSelectedIds(itemIds(latest.items));
    setSaving(false);
    setBanner({ type: "ok", text: messages.join(" ") });
    onUpdated();
    void refreshCounts();
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
                  Selected talent ({selectedIds.length} of {items.length})
                </p>
                <ul className="space-y-2">
                  {items.map((item) => {
                    const selected = selectedSet.has(item.id);
                    return (
                      <li
                        key={item.id}
                        className={`flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${
                          selected
                            ? "border-gray-200 bg-white"
                            : "border-red-200 bg-red-50/60"
                        }`}
                      >
                        <div className={selected ? "" : "opacity-60"}>
                          <p className="font-medium text-gray-900">{item.modelName}</p>
                          <p className="text-gray-500 capitalize">
                            {item.modelType}
                            {item.category ? ` · ${item.category}` : ""}
                            {item.priceRate ? ` · ${item.priceRate}` : ""}
                          </p>
                          {!selected && (
                            <p className="text-xs text-red-700 mt-1">Not available</p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleItem(item.id)}
                          className={`shrink-0 rounded-full p-1.5 border ${
                            selected
                              ? "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "border-red-300 bg-white text-red-600 hover:bg-red-50"
                          }`}
                          aria-label={
                            selected
                              ? `Deselect ${item.modelName}`
                              : `Keep ${item.modelName}`
                          }
                          aria-pressed={selected}
                        >
                          {selected ? (
                            <Check className="size-4" strokeWidth={2.25} />
                          ) : (
                            <X className="size-4" strokeWidth={2.25} />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
                {itemsChanged && (
                  <p className="text-xs text-gray-500 mt-2">
                    Saving will SMS {inquiry.phone} that the deselected talent{" "}
                    {removedItems.length === 1 ? "is" : "are"} not available.
                  </p>
                )}
              </div>

              <div>
                <label className={adminLabel}>Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as InquiryStatus)}
                  className={adminInput}
                >
                  {inquiryStatusSelectOptions(status).map((s) => (
                    <option key={s} value={s}>
                      {INQUIRY_STATUS_LABELS[s] ?? s}
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
                  disabled={!canSave}
                  onClick={() => void handleSave()}
                  className={adminBtnPrimary}
                >
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
