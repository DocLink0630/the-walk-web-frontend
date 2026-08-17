"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  createModelAccountsFromStudents,
  deleteAdminUser,
  deleteAdminUsers,
  fetchAdminUsers,
  formatBulkDeleteResult,
  updateUserStatus,
} from "@/lib/admin/users-api";
import {
  STUDENT_QUEUE_STATUSES,
  STUDENT_STATUS_LABELS,
  studentStatusOptions,
} from "@/lib/admin/student-user-status";
import type { AdminUser, UserStatus } from "@/types/admin";
import { useAdminPendingRegistrations } from "@/hooks/useAdminPendingRegistrations";
import { useAdminUserSelection } from "@/hooks/useAdminUserSelection";
import AdminBulkDeleteBar from "./AdminBulkDeleteBar";
import AdminModelMobileList from "./AdminModelMobileList";
import AdminPagination from "./AdminPagination";
import StudentReviewPanel from "./StudentReviewPanel";
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

const STUDENT_ROLES = ["STUDENT"] as const;

const STUDENT_LIST_TABS = [
  { id: "all" as const, label: "All", status: "" as const },
  {
    id: "pending" as const,
    label: "Pending Approval",
    status: "PENDING_ADMIN_REVIEW" as UserStatus,
  },
  {
    id: "pendingPayment" as const,
    label: "Pending Payment",
    status: "PENDING_PAYMENT" as UserStatus,
  },
  {
    id: "approved" as const,
    label: "Approved",
    status: "ACTIVE" as UserStatus,
  },
];

type StudentListTab = (typeof STUDENT_LIST_TABS)[number]["id"];

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

function formatContact(user: AdminUser) {
  return user.contactNumber?.trim() || "—";
}

function alreadyHasModelRole(user: AdminUser) {
  return user.roles.includes("MODEL");
}

interface StudentQueueTableProps {
  onUsersChanged?: () => void;
}

export default function StudentQueueTable({ onUsersChanged }: StudentQueueTableProps) {
  const { refreshCounts } = useAdminPendingRegistrations();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [banner, setBanner] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [activeTab, setActiveTab] = useState<StudentListTab>("pending");
  const statusFilter =
    STUDENT_LIST_TABS.find((tab) => tab.id === activeTab)?.status ?? "PENDING_ADMIN_REVIEW";

  const [pendingStatus, setPendingStatus] = useState<Record<string, UserStatus>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [reviewUser, setReviewUser] = useState<AdminUser | null>(null);
  const [pendingReviewCount, setPendingReviewCount] = useState(0);
  const [pendingPaymentCount, setPendingPaymentCount] = useState(0);
  const [creatingModels, setCreatingModels] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const {
    selectedIds,
    toggleSelect,
    toggleSelectAllOnPage,
    clearSelection,
    allPageSelected,
  } = useAdminUserSelection(users);
  const modelRoleByIdRef = useRef<Map<string, boolean>>(new Map());
  for (const user of users) {
    modelRoleByIdRef.current.set(user.id, alreadyHasModelRole(user));
  }

  const isApprovedTab = activeTab === "approved";

  const emptyMessage =
    activeTab === "pending"
      ? "No student applications pending review."
      : activeTab === "pendingPayment"
        ? "No students pending payment."
        : activeTab === "approved"
          ? "No approved students found."
          : "No students found.";

  const createModelIds = Array.from(selectedIds).filter(
    (id) => modelRoleByIdRef.current.get(id) !== true,
  );

  const loadTabCounts = useCallback(async () => {
    const [review, payment] = await Promise.all([
      fetchAdminUsers({
        page: 1,
        limit: 1,
        status: "PENDING_ADMIN_REVIEW",
        roles: [...STUDENT_ROLES],
      }),
      fetchAdminUsers({
        page: 1,
        limit: 1,
        status: "PENDING_PAYMENT",
        roles: [...STUDENT_ROLES],
      }),
    ]);
    if (review.ok) {
      setPendingReviewCount(review.data.meta.total);
    }
    if (payment.ok) {
      setPendingPaymentCount(payment.data.meta.total);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await fetchAdminUsers({
      page,
      limit: 20,
      search: search || undefined,
      status: statusFilter || undefined,
      roles: [...STUDENT_ROLES],
    });
    if (!result.ok) {
      setError(result.message);
      setUsers([]);
      setLoading(false);
      return;
    }
    const pageUsers = result.data.data;
    setUsers(pageUsers);
    setTotalPages(result.data.meta.totalPages);
    const initial: Record<string, UserStatus> = {};
    for (const u of pageUsers) {
      initial[u.id] = u.status;
    }
    setPendingStatus(initial);
    setLoading(false);
  }, [page, search, statusFilter]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    void loadTabCounts();
  }, [loadTabCounts]);

  useEffect(() => {
    clearSelection();
  }, [activeTab, search, clearSelection]);

  async function refreshAfterChange() {
    await loadUsers();
    await loadTabCounts();
    await refreshCounts();
    onUsersChanged?.();
  }

  async function handleUpdate(user: AdminUser) {
    const next = pendingStatus[user.id];
    if (!next || next === user.status) return;

    setUpdatingId(user.id);
    setBanner(null);
    const result = await updateUserStatus(user.id, next);
    setUpdatingId(null);

    if (!result.ok) {
      setBanner({ type: "err", text: result.message });
      return;
    }

    setBanner({
      type: "ok",
      text: `Updated ${user.displayName ?? user.email} to ${STUDENT_STATUS_LABELS[next]}`,
    });
    await refreshAfterChange();
  }

  async function handleDelete(user: AdminUser) {
    const name = user.displayName ?? user.email;
    if (
      !confirm(
        `Permanently delete "${name}"?\n\nThis removes their account, uploaded files, and records. This cannot be undone.`,
      )
    ) {
      return;
    }

    setDeletingId(user.id);
    setBanner(null);
    const result = await deleteAdminUser(user.id);
    setDeletingId(null);

    if (!result.ok) {
      setBanner({ type: "err", text: result.message });
      return;
    }

    if (reviewUser?.id === user.id) setReviewUser(null);
    setBanner({ type: "ok", text: "Student account deleted." });
    await refreshAfterChange();
  }

  async function handleBulkDelete() {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;

    setBulkDeleting(true);
    setBanner(null);
    const result = await deleteAdminUsers(ids);
    setBulkDeleting(false);
    setBanner(formatBulkDeleteResult(result));

    if (reviewUser && ids.includes(reviewUser.id)) setReviewUser(null);
    if (result.deleted > 0) {
      clearSelection();
      await refreshAfterChange();
    }
  }

  function applySearch() {
    setPage(1);
    setSearch(searchInput.trim());
  }

  async function handleCreateModelAccounts() {
    const ids = createModelIds;
    if (ids.length === 0) return;

    const confirmed = confirm(
      `Create empty model accounts for ${ids.length} selected student${ids.length === 1 ? "" : "s"}?\n\nThey will keep the same email and password and can log in as a model.`,
    );
    if (!confirmed) return;

    setCreatingModels(true);
    setBanner(null);
    const result = await createModelAccountsFromStudents(ids);
    setCreatingModels(false);

    if (!result.ok) {
      setBanner({ type: "err", text: result.message });
      return;
    }

    const { created, skipped, failed } = result.data;
    const summary = `Created ${created.length}, skipped ${skipped.length}, failed ${failed.length}.`;
    const detailParts: string[] = [];
    for (const item of skipped) {
      detailParts.push(`${item.userId}: ${item.reason}`);
    }
    for (const item of failed) {
      detailParts.push(`${item.userId}: ${item.reason}`);
    }
    const detail =
      detailParts.length > 0
        ? ` ${detailParts.slice(0, 3).join("; ")}${detailParts.length > 3 ? "…" : ""}`
        : "";

    setBanner({
      type: failed.length > 0 && created.length === 0 ? "err" : "ok",
      text: summary + detail,
    });
    clearSelection();
    await refreshAfterChange();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1 w-fit">
        {STUDENT_LIST_TABS.map((tab) => {
          const tabCount =
            tab.id === "pending"
              ? pendingReviewCount
              : tab.id === "pendingPayment"
                ? pendingPaymentCount
                : 0;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setPage(1);
                setActiveTab(tab.id);
              }}
              className={[
                "inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition",
                activeTab === tab.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900",
              ].join(" ")}
            >
              {tab.label}
              {tabCount > 0 && (
                <span
                  className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-amber-500 text-white text-[11px] font-semibold leading-none"
                  aria-label={`${tabCount} ${tab.label.toLowerCase()}`}
                >
                  {tabCount > 99 ? "99+" : tabCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
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
              placeholder="Name or email"
              className={adminInput + " flex-1"}
            />
            <button type="button" onClick={applySearch} className={adminBtnSecondary + " shrink-0"}>
              Search
            </button>
          </div>
        </div>
      </div>

      <AdminBulkDeleteBar
        selectedCount={selectedIds.size}
        deleting={bulkDeleting}
        disabled={loading || creatingModels}
        onDelete={handleBulkDelete}
        extraActions={
          isApprovedTab ? (
            <button
              type="button"
              disabled={creatingModels || bulkDeleting || createModelIds.length === 0}
              onClick={() => void handleCreateModelAccounts()}
              className={adminBtnPrimary}
            >
              {creatingModels
                ? "Creating…"
                : `Create model accounts (${createModelIds.length})`}
            </button>
          ) : null
        }
      />

      {banner && (
        <div className={banner.type === "ok" ? adminAlertOk : adminAlertErr}>{banner.text}</div>
      )}

      {error && <div className={adminAlertErr}>{error}</div>}

      {!loading && users.length > 0 && (
        <AdminModelMobileList
          users={users}
          statusLabels={STUDENT_STATUS_LABELS}
          allStatuses={STUDENT_QUEUE_STATUSES}
          pendingStatus={pendingStatus}
          updatingId={updatingId}
          onStatusChange={(userId, status) =>
            setPendingStatus((prev) => ({ ...prev, [userId]: status }))
          }
          onUpdate={handleUpdate}
          onReview={setReviewUser}
          onDelete={(user) => void handleDelete(user)}
          deletingId={deletingId}
          formatDate={formatDate}
          secondaryField="contactNumber"
          selectable
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
        />
      )}

      {!loading && users.length === 0 && (
        <div className="md:hidden rounded-xl border border-gray-200 bg-white px-4 py-10 text-center">
          <p className="text-sm text-gray-500">{emptyMessage}</p>
        </div>
      )}

      {loading && (
        <div className="md:hidden rounded-xl border border-gray-200 bg-white px-4 py-10 text-center">
          <p className="text-sm text-gray-500">Loading…</p>
        </div>
      )}

      <div className={adminTableWrap}>
        <table className="w-full min-w-[640px]">
          <thead>
            <tr>
              <th className={adminTh}>
                <input
                  type="checkbox"
                  checked={allPageSelected}
                  disabled={users.length === 0 || loading}
                  onChange={toggleSelectAllOnPage}
                  className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-400 disabled:opacity-40"
                  aria-label="Select all students on this page"
                />
              </th>
              {["Name", "Contact", "Status", "Submitted", ""].map((h) => (
                <th key={h || "actions"} className={adminTh}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className={`${adminTd} text-center text-gray-500`}>
                  Loading…
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className={`${adminTd} text-center text-gray-500`}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const hasModel = alreadyHasModelRole(user);
                return (
                  <tr key={user.id} className="hover:bg-gray-50/80">
                    <td className={adminTd}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(user.id)}
                        disabled={creatingModels || bulkDeleting}
                        onChange={() => toggleSelect(user.id)}
                        className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-400 disabled:opacity-40"
                        aria-label={`Select ${user.displayName ?? user.email}`}
                      />
                    </td>
                    <td className={adminTd}>
                      <div className="flex flex-wrap items-center gap-2">
                        <span>{user.displayName ?? "—"}</span>
                        {hasModel && (
                          <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                            Model
                          </span>
                        )}
                      </div>
                    </td>
                    <td className={`${adminTd} text-gray-600`}>{formatContact(user)}</td>
                    <td className={adminTd}>
                      <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                        {STUDENT_STATUS_LABELS[user.status]}
                      </span>
                    </td>
                    <td className={`${adminTd} text-gray-500`}>{formatDate(user.createdAt)}</td>
                    <td className={adminTd}>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setReviewUser(user)}
                          className={adminBtnAccent + " !px-3 !py-1.5 text-xs"}
                        >
                          Review
                        </button>
                        <select
                          value={pendingStatus[user.id] ?? user.status}
                          onChange={(e) =>
                            setPendingStatus((prev) => ({
                              ...prev,
                              [user.id]: e.target.value as UserStatus,
                            }))
                          }
                          className={adminInput + " !py-1.5 text-xs min-w-[130px]"}
                        >
                          {studentStatusOptions(user.status).map((s) => (
                            <option key={s} value={s}>
                              {STUDENT_STATUS_LABELS[s]}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          disabled={
                            updatingId === user.id ||
                            (pendingStatus[user.id] ?? user.status) === user.status
                          }
                          onClick={() => handleUpdate(user)}
                          className={adminBtnPrimary + " !px-3 !py-1.5 text-xs"}
                        >
                          {updatingId === user.id ? "Saving…" : "Save"}
                        </button>
                        <button
                          type="button"
                          disabled={deletingId === user.id || updatingId === user.id || bulkDeleting}
                          onClick={() => void handleDelete(user)}
                          className="text-xs px-3 py-1 border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          {deletingId === user.id ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
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

      {reviewUser && (
        <StudentReviewPanel
          user={reviewUser}
          onClose={() => setReviewUser(null)}
          onUpdated={() => {
            void refreshAfterChange();
          }}
        />
      )}
    </div>
  );
}
