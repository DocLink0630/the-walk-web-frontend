"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchAdminUsers, updateUserStatus } from "@/lib/admin/users-api";
import type { AdminUser, UserRole, UserStatus } from "@/types/admin";
import AdminUserMobileList from "./AdminUserMobileList";

const ALL_STATUSES: UserStatus[] = [
  "PENDING_EMAIL_VERIFICATION",
  "PENDING_ADMIN_REVIEW",
  "PENDING_PAYMENT",
  "ACTIVE",
  "INACTIVE",
  "SUSPENDED",
  "DELETED",
];

const STATUS_LABELS: Record<UserStatus, string> = {
  PENDING_EMAIL_VERIFICATION: "Pending email",
  PENDING_ADMIN_REVIEW: "Pending review",
  PENDING_PAYMENT: "Pending payment",
  REJECTED: "Rejected",
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  SUSPENDED: "Suspended",
  DELETED: "Deleted",
};

const inputCls =
  "border border-[#E0E0E0] px-3 py-2 font-ui text-[10px] tracking-[0.1em] outline-none focus:border-[#C8A97A] bg-white";

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

interface UserQueueTableProps {
  onUsersChanged?: () => void;
}

export default function UserQueueTable({ onUsersChanged }: UserQueueTableProps) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [banner, setBanner] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "">(
    "PENDING_ADMIN_REVIEW",
  );
  const [roleFilter, setRoleFilter] = useState<UserRole | "">("STUDENT");

  const [pendingStatus, setPendingStatus] = useState<Record<string, UserStatus>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await fetchAdminUsers({
      page,
      limit: 20,
      search: search || undefined,
      status: statusFilter || undefined,
      roles: roleFilter ? [roleFilter] : undefined,
    });
    if (!result.ok) {
      setError(result.message);
      setUsers([]);
      setLoading(false);
      return;
    }
    setUsers(result.data.data);
    setTotalPages(result.data.meta.totalPages);
    const initial: Record<string, UserStatus> = {};
    for (const u of result.data.data) {
      initial[u.id] = u.status;
    }
    setPendingStatus(initial);
    setLoading(false);
  }, [page, search, statusFilter, roleFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

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

    setBanner({ type: "ok", text: `Updated ${user.email} to ${STATUS_LABELS[next]}` });
    await loadUsers();
    onUsersChanged?.();
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
        <div className="sm:col-span-2">
          <label className="block font-ui text-[9px] tracking-[0.25em] uppercase text-[#4A4A4A] mb-1">
            Search email
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setPage(1);
                  setSearch(searchInput.trim());
                }
              }}
              placeholder="user@example.com"
              className={inputCls + " w-full flex-1"}
            />
            <button
              type="button"
              onClick={() => {
                setPage(1);
                setSearch(searchInput.trim());
              }}
              className="font-ui text-[9px] tracking-[0.2em] uppercase px-4 py-2 border border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors shrink-0"
            >
              Search
            </button>
          </div>
        </div>

        <div>
          <label className="block font-ui text-[9px] tracking-[0.25em] uppercase text-[#4A4A4A] mb-1">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setPage(1);
              setStatusFilter(e.target.value as UserStatus | "");
            }}
            className={inputCls + " w-full"}
          >
            <option value="">All statuses</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-ui text-[9px] tracking-[0.25em] uppercase text-[#4A4A4A] mb-1">
            Role
          </label>
          <select
            value={roleFilter}
            onChange={(e) => {
              setPage(1);
              setRoleFilter(e.target.value as UserRole | "");
            }}
            className={inputCls + " w-full"}
          >
            <option value="">All roles</option>
            <option value="STUDENT">Student</option>
            <option value="MODEL">Model</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
        </div>
      </div>

      {banner && (
        <div
          className={
            banner.type === "ok"
              ? "border border-[#C8A97A] bg-[#C8A97A]/10 px-4 py-3"
              : "border border-red-300 bg-red-50 px-4 py-3"
          }
        >
          <p
            className={
              "font-ui text-[10px] tracking-[0.05em] " +
              (banner.type === "ok" ? "text-[#0A0A0A]" : "text-red-700")
            }
          >
            {banner.text}
          </p>
        </div>
      )}

      {error && (
        <div className="border border-red-300 bg-red-50 px-4 py-3">
          <p className="font-ui text-[10px] text-red-700">{error}</p>
        </div>
      )}

      {!loading && users.length > 0 && (
        <AdminUserMobileList
          users={users}
          statusLabels={STATUS_LABELS}
          allStatuses={ALL_STATUSES}
          pendingStatus={pendingStatus}
          updatingId={updatingId}
          onStatusChange={(userId, status) =>
            setPendingStatus((prev) => ({ ...prev, [userId]: status }))
          }
          onUpdate={handleUpdate}
          formatDate={formatDate}
        />
      )}

      {!loading && users.length === 0 && (
        <div className="md:hidden border border-[#E0E0E0] bg-white px-4 py-10 text-center">
          <p className="font-ui text-[10px] text-[#9A9A9A]">No users found</p>
        </div>
      )}

      {loading && (
        <div className="md:hidden border border-[#E0E0E0] bg-white px-4 py-10 text-center">
          <p className="font-ui text-[10px] text-[#9A9A9A]">Loading users…</p>
        </div>
      )}

      <div className="hidden md:block border border-[#E0E0E0] bg-white overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="border-b border-[#E0E0E0] bg-[#FAFAFA]">
              {["Email", "Roles", "Status", "Step", "Joined", "Action"].map((h) => (
                <th
                  key={h}
                  className="text-left font-ui text-[9px] tracking-[0.2em] uppercase text-[#9A9A9A] px-4 py-3"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center font-ui text-[10px] text-[#9A9A9A]">
                  Loading users…
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center font-ui text-[10px] text-[#9A9A9A]">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b border-[#F0F0F0] last:border-0">
                  <td className="px-4 py-3 font-ui text-[10px] tracking-[0.05em] text-[#0A0A0A]">
                    {user.email}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((r) => (
                        <span
                          key={r}
                          className="font-ui text-[8px] tracking-[0.1em] uppercase px-2 py-0.5 border border-[#E0E0E0] text-[#4A4A4A]"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-ui text-[9px] tracking-[0.1em] uppercase text-[#4A4A4A]">
                    {STATUS_LABELS[user.status]}
                  </td>
                  <td className="px-4 py-3 font-ui text-[10px] text-[#4A4A4A]">
                    {user.onboardingStep}
                  </td>
                  <td className="px-4 py-3 font-ui text-[10px] text-[#9A9A9A]">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <select
                        value={pendingStatus[user.id] ?? user.status}
                        onChange={(e) =>
                          setPendingStatus((prev) => ({
                            ...prev,
                            [user.id]: e.target.value as UserStatus,
                          }))
                        }
                        className={inputCls + " min-w-[140px]"}
                      >
                        {ALL_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {STATUS_LABELS[s]}
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
                        className="font-ui text-[8px] tracking-[0.15em] uppercase px-3 py-2 bg-[#0A0A0A] text-white hover:bg-[#C8A97A] disabled:opacity-40 transition-colors whitespace-nowrap"
                      >
                        {updatingId === user.id ? "…" : "Update"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="font-ui text-[9px] tracking-[0.2em] uppercase px-4 py-2 border border-[#E0E0E0] disabled:opacity-40 hover:border-[#C8A97A] transition-colors"
          >
            Previous
          </button>
          <span className="font-ui text-[9px] tracking-[0.15em] text-[#9A9A9A]">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((p) => p + 1)}
            className="font-ui text-[9px] tracking-[0.2em] uppercase px-4 py-2 border border-[#E0E0E0] disabled:opacity-40 hover:border-[#C8A97A] transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
