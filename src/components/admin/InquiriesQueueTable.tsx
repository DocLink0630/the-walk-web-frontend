"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchAdminInquiries, updateInquiryStatus } from "@/lib/admin/inquiries-api";
import { useAdminPendingRegistrations } from "@/hooks/useAdminPendingRegistrations";
import {
  INQUIRY_QUEUE_STATUSES,
  INQUIRY_STATUS_LABELS,
  formatInquiryTalentSummary,
  inquiryStatusSelectOptions,
} from "@/lib/inquiry/status";
import type { Inquiry, InquiryStatus } from "@/types/inquiry";
import AdminPagination from "./AdminPagination";
import InquiryMobileList from "./InquiryMobileList";
import InquiryReviewPanel from "./InquiryReviewPanel";
import {
  adminAlertErr,
  adminAlertOk,
  adminBtnAccent,
  adminBtnPrimary,
  adminBtnSecondary,
  adminInput,
  adminLabel,
  adminTableWrap,
  adminTd,
  adminTh,
} from "./admin-ui";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function InquiriesQueueTable() {
  const { refreshCounts } = useAdminPendingRegistrations();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [banner, setBanner] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | "">("");

  const [pendingStatus, setPendingStatus] = useState<Record<string, InquiryStatus>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [reviewId, setReviewId] = useState<string | null>(null);

  const loadInquiries = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await fetchAdminInquiries({
      page,
      limit: 20,
      search: search || undefined,
      status: statusFilter || undefined,
    });
    if (!result.ok) {
      setError(result.message);
      setInquiries([]);
      setLoading(false);
      return;
    }
    const rows = Array.isArray(result.data.data) ? result.data.data : [];
    setInquiries(rows);
    setTotalPages(result.data.meta?.totalPages ?? 1);
    const initial: Record<string, InquiryStatus> = {};
    for (const row of rows) {
      initial[row.id] = row.status;
    }
    setPendingStatus(initial);
    setLoading(false);
  }, [page, search, statusFilter]);

  useEffect(() => {
    void loadInquiries();
  }, [loadInquiries]);

  async function handleUpdate(inquiry: Inquiry) {
    const next = pendingStatus[inquiry.id];
    if (!next || next === inquiry.status) return;

    setUpdatingId(inquiry.id);
    setBanner(null);
    const result = await updateInquiryStatus(inquiry.id, next);
    setUpdatingId(null);

    if (!result.ok) {
      setBanner({ type: "err", text: result.message });
      return;
    }

    setBanner({
      type: "ok",
      text: `Updated inquiry to ${INQUIRY_STATUS_LABELS[next]}`,
    });
    await loadInquiries();
    void refreshCounts();
  }

  function applySearch() {
    setPage(1);
    setSearch(searchInput.trim());
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto] lg:grid-cols-[1fr_200px]">
        <div>
          <label className={adminLabel}>Search</label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") applySearch();
              }}
              placeholder="Client, email, or phone"
              className={adminInput + " flex-1"}
            />
            <button type="button" onClick={applySearch} className={adminBtnSecondary + " shrink-0"}>
              Search
            </button>
          </div>
        </div>

        <div>
          <label className={adminLabel}>Status</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setPage(1);
              setStatusFilter(e.target.value as InquiryStatus | "");
            }}
            className={adminInput}
          >
            <option value="">All statuses</option>
            {INQUIRY_QUEUE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {INQUIRY_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {banner && (
        <div className={banner.type === "ok" ? adminAlertOk : adminAlertErr}>{banner.text}</div>
      )}
      {error && <div className={adminAlertErr}>{error}</div>}

      {!loading && inquiries.length > 0 && (
        <InquiryMobileList
          inquiries={inquiries}
          pendingStatus={pendingStatus}
          updatingId={updatingId}
          onStatusChange={(id, status) =>
            setPendingStatus((prev) => ({ ...prev, [id]: status }))
          }
          onUpdate={handleUpdate}
          onReview={(inquiry) => setReviewId(inquiry.id)}
          formatDate={formatDate}
        />
      )}

      {!loading && inquiries.length === 0 && (
        <div className="md:hidden rounded-xl border border-gray-200 bg-white px-4 py-10 text-center">
          <p className="text-sm text-gray-500">
            No inquiries found.
            {statusFilter === "NEW" && " Try “All statuses”."}
          </p>
        </div>
      )}

      {loading && (
        <div className="md:hidden rounded-xl border border-gray-200 bg-white px-4 py-10 text-center">
          <p className="text-sm text-gray-500">Loading…</p>
        </div>
      )}

      <div className={adminTableWrap}>
        <table className="w-full min-w-[760px]">
          <thead>
            <tr>
              {["Submitted", "Client", "Phone", "Talent", "Event date", "Status", ""].map(
                (h) => (
                  <th key={h || "actions"} className={adminTh}>
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className={`${adminTd} text-center text-gray-500`}>
                  Loading…
                </td>
              </tr>
            ) : inquiries.length === 0 ? (
              <tr>
                <td colSpan={7} className={`${adminTd} text-center text-gray-500`}>
                  No inquiries found.
                  {statusFilter === "NEW" && " Try “All statuses”."}
                </td>
              </tr>
            ) : (
              inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-gray-50/80">
                  <td className={`${adminTd} text-gray-500`}>
                    {formatDate(inquiry.createdAt)}
                  </td>
                  <td className={adminTd}>
                    <p>{inquiry.clientName ?? "—"}</p>
                    <p className="text-xs text-gray-500">{inquiry.clientEmail}</p>
                  </td>
                  <td className={adminTd}>{inquiry.phone}</td>
                  <td className={`${adminTd} max-w-[220px]`}>
                    <p className="truncate" title={formatInquiryTalentSummary(inquiry.items, 8)}>
                      {formatInquiryTalentSummary(inquiry.items)}
                    </p>
                  </td>
                  <td className={`${adminTd} text-gray-500`}>
                    {inquiry.eventDate ?? "—"}
                  </td>
                  <td className={adminTd}>
                    <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                      {INQUIRY_STATUS_LABELS[inquiry.status] ?? inquiry.status}
                    </span>
                  </td>
                  <td className={adminTd}>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setReviewId(inquiry.id)}
                        className={adminBtnAccent + " !px-3 !py-1.5 text-xs"}
                      >
                        View
                      </button>
                      <select
                        value={pendingStatus[inquiry.id] ?? inquiry.status}
                        onChange={(e) =>
                          setPendingStatus((prev) => ({
                            ...prev,
                            [inquiry.id]: e.target.value as InquiryStatus,
                          }))
                        }
                        className={adminInput + " !py-1.5 text-xs min-w-[130px]"}
                      >
                        {inquiryStatusSelectOptions(
                          pendingStatus[inquiry.id] ?? inquiry.status,
                        ).map((s) => (
                          <option key={s} value={s}>
                            {INQUIRY_STATUS_LABELS[s] ?? s}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        disabled={
                          updatingId === inquiry.id ||
                          (pendingStatus[inquiry.id] ?? inquiry.status) === inquiry.status
                        }
                        onClick={() => handleUpdate(inquiry)}
                        className={adminBtnPrimary + " !px-3 !py-1.5 text-xs"}
                      >
                        {updatingId === inquiry.id ? "Saving…" : "Save"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AdminPagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        disabled={loading}
      />

      {reviewId && (
        <InquiryReviewPanel
          inquiryId={reviewId}
          onClose={() => setReviewId(null)}
          onUpdated={() => {
            void loadInquiries();
            void refreshCounts();
          }}
        />
      )}
    </div>
  );
}
