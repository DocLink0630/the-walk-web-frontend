"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchAdminUsers,
  updateUserStatus,
  deleteAdminUser,
  deleteAdminUsers,
  formatBulkDeleteResult,
} from "@/lib/admin/users-api";
import {
  MODEL_QUEUE_STATUSES,
  MODEL_STATUS_LABELS,
} from "@/lib/admin/model-user-status";
import type { AdminUser, UserStatus } from "@/types/admin";
import { useAdminPendingRegistrations } from "@/hooks/useAdminPendingRegistrations";
import { useAdminUserSelection } from "@/hooks/useAdminUserSelection";
import AdminBulkDeleteBar from "./AdminBulkDeleteBar";
import AdminModelMobileList from "./AdminModelMobileList";
import AdminPagination from "./AdminPagination";
import ModelReviewPanel from "./ModelReviewPanel";
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

const MODEL_ROLES = ["MODEL"] as const;

const MODEL_LIST_TABS = [
  {
    id: "pending" as const,
    label: "Pending review",
    status: "PENDING_ADMIN_REVIEW" as UserStatus,
  },
  { id: "current" as const, label: "Current models", status: "ACTIVE" as UserStatus },
];

type ModelListTab = (typeof MODEL_LIST_TABS)[number]["id"];

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

interface ModelQueueTableProps {
  onUsersChanged?: () => void;
}

export default function ModelQueueTable({ onUsersChanged }: ModelQueueTableProps) {
  const { refreshCounts } = useAdminPendingRegistrations();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [banner, setBanner] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [activeTab, setActiveTab] = useState<ModelListTab>("pending");
  const statusFilter =
    MODEL_LIST_TABS.find((tab) => tab.id === activeTab)?.status ?? "PENDING_ADMIN_REVIEW";

  const [pendingStatus, setPendingStatus] = useState<Record<string, UserStatus>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [reviewUser, setReviewUser] = useState<AdminUser | null>(null);
  const [pendingReviewCount, setPendingReviewCount] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const {
    selectedIds,
    toggleSelect,
    toggleSelectAllOnPage,
    clearSelection,
    allPageSelected,
  } = useAdminUserSelection(users);

  const loadPendingReviewCount = useCallback(async () => {
    const result = await fetchAdminUsers({
      page: 1,
      limit: 1,
      status: "PENDING_ADMIN_REVIEW",
      roles: [...MODEL_ROLES],
    });
    if (result.ok) {
      setPendingReviewCount(result.data.meta.total);
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
      roles: [...MODEL_ROLES],
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
    void loadPendingReviewCount();
  }, [loadPendingReviewCount]);

  useEffect(() => {
    clearSelection();
  }, [activeTab, search, clearSelection]);

  async function refreshAfterChange() {
    await loadUsers();
    await loadPendingReviewCount();
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

    setBanner({ type: "ok", text: `Updated ${user.displayName ?? user.email} to ${MODEL_STATUS_LABELS[next]}` });
    await refreshAfterChange();
  }

  async function handleDelete(user: AdminUser) {
    const name = user.displayName ?? user.email;
    if (
      !confirm(
        `Permanently delete "${name}"?\n\nThis removes their account, Auth0 login, profile, portfolio files, and all database records. This cannot be undone.`,
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
    setBanner({ type: "ok", text: "Model account deleted." });
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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1 w-fit">
        {MODEL_LIST_TABS.map((tab) => (
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
            {tab.id === "pending" && pendingReviewCount > 0 && (
              <span
                className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-amber-500 text-white text-[11px] font-semibold leading-none"
                aria-label={`${pendingReviewCount} pending review`}
              >
                {pendingReviewCount > 99 ? "99+" : pendingReviewCount}
              </span>
            )}
          </button>
        ))}
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
              placeholder="Email or name"
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
        disabled={loading}
        onDelete={handleBulkDelete}
      />

      {banner && (
        <div className={banner.type === "ok" ? adminAlertOk : adminAlertErr}>{banner.text}</div>
      )}

      {error && <div className={adminAlertErr}>{error}</div>}

      {!loading && users.length > 0 && (
        <AdminModelMobileList
          users={users}
          statusLabels={MODEL_STATUS_LABELS}
          allStatuses={MODEL_QUEUE_STATUSES}
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
          selectable
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
        />
      )}

      {!loading && users.length === 0 && (
        <div className="md:hidden rounded-xl border border-gray-200 bg-white px-4 py-10 text-center">
          <p className="text-sm text-gray-500">
            {activeTab === "current"
              ? "No active models found."
              : "No models pending review."}
          </p>
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
                  aria-label="Select all models on this page"
                />
              </th>
              {["Name", "Email", "Status", "Joined", ""].map((h) => (
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
                  {activeTab === "current"
                    ? "No active models found."
                    : "No models pending review."}
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/80">
                  <td className={adminTd}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(user.id)}
                      disabled={bulkDeleting}
                      onChange={() => toggleSelect(user.id)}
                      className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-400 disabled:opacity-40"
                      aria-label={`Select ${user.displayName ?? user.email}`}
                    />
                  </td>
                  <td className={adminTd}>{user.displayName ?? "—"}</td>
                  <td className={`${adminTd} text-gray-600`}>{user.email}</td>
                  <td className={adminTd}>
                    <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                      {MODEL_STATUS_LABELS[user.status]}
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
                        {MODEL_QUEUE_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {MODEL_STATUS_LABELS[s]}
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

      {reviewUser && (
        <ModelReviewPanel
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
