"use client";

import { useCallback, useEffect, useState } from "react";
import { deleteAdminUser, fetchAdminUsers } from "@/lib/admin/users-api";
import { useAdminPendingRegistrations } from "@/hooks/useAdminPendingRegistrations";
import type { AdminUser, UserStatus } from "@/types/admin";
import InfluencerReviewPanel from "./InfluencerReviewPanel";
import {
  adminAlertErr,
  adminBtnPrimary,
  adminBtnSecondary,
  adminInput,
  adminTableWrap,
  adminTd,
  adminTh,
} from "./admin-ui";

const TABS = [
  { id: "active" as const, label: "Active influencers", status: "ACTIVE" as UserStatus },
  { id: "pending" as const, label: "Pending review", status: "PENDING_ADMIN_REVIEW" as UserStatus },
  { id: "rejected" as const, label: "Rejected", status: "REJECTED" as UserStatus },
];

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

export default function InfluencerQueueTable() {
  const { refreshCounts } = useAdminPendingRegistrations();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [banner, setBanner] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("pending");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const currentTab = TABS.find((t) => t.id === tab) ?? TABS[0];

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await fetchAdminUsers({
      page,
      limit: 20,
      search: search || undefined,
      status: currentTab.status,
      roles: ["INFLUENCER"],
    });
    setLoading(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setUsers(result.data.data);
    setTotalPages(result.data.meta.totalPages);
  }, [page, search, currentTab.status]);

  useEffect(() => {
    void load();
  }, [load]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  function handleTabChange(id: (typeof TABS)[number]["id"]) {
    setTab(id);
    setPage(1);
    setBanner(null);
  }

  async function handleDelete(user: AdminUser) {
    const name = user.displayName ?? user.email;
    if (
      !confirm(
        `Permanently delete "${name}"?\n\nThis removes their account, Auth0 login, profile, and all uploaded files. This cannot be undone.`,
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

    setBanner({ type: "ok", text: "Influencer account deleted." });
    if (selectedUser?.id === user.id) setSelectedUser(null);
    void refreshCounts();
    void load();
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => handleTabChange(t.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t.id
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 max-w-sm">
        <input
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name or email…"
          className={adminInput + " flex-1"}
        />
        <button type="submit" className={adminBtnSecondary}>
          Search
        </button>
      </form>

      {banner && (
        <p className={banner.type === "ok" ? "text-sm text-green-700" : adminAlertErr}>
          {banner.text}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-gray-500 py-8 text-center">Loading…</p>
      ) : error ? (
        <p className={adminAlertErr}>{error}</p>
      ) : users.length === 0 ? (
        <p className="text-sm text-gray-500 py-8 text-center">No influencers found.</p>
      ) : (
        <div className={adminTableWrap}>
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className={adminTh}>Name / Email</th>
                <th className={adminTh}>Status</th>
                <th className={adminTh}>Applied</th>
                <th className={adminTh}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className={adminTd}>
                    <div>
                      <p className="font-medium text-gray-900">{u.displayName ?? "—"}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </div>
                  </td>
                  <td className={adminTd}>
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                        u.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : u.status === "PENDING_ADMIN_REVIEW"
                            ? "bg-yellow-100 text-yellow-800"
                            : u.status === "REJECTED"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className={adminTd + " text-gray-500"}>{formatDate(u.createdAt)}</td>
                  <td className={adminTd}>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedUser(u)}
                        className={adminBtnPrimary + " text-xs py-1 px-3"}
                      >
                        Review
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(u)}
                        disabled={deletingId === u.id}
                        className="text-xs px-3 py-1 border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {deletingId === u.id ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center gap-2 text-sm">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className={adminBtnSecondary + " disabled:opacity-40"}
          >
            Prev
          </button>
          <span className="text-gray-500">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className={adminBtnSecondary + " disabled:opacity-40"}
          >
            Next
          </button>
        </div>
      )}

      {selectedUser && (
        <InfluencerReviewPanel
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdated={() => {
            void refreshCounts();
            void load();
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
}
