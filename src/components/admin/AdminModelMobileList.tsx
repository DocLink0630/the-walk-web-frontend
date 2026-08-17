"use client";

import type { AdminUser, UserStatus } from "@/types/admin";
import {
  adminBtnAccent,
  adminBtnPrimary,
  adminInput,
  adminLabel,
  adminMobileCard,
  adminStatusBadge,
} from "./admin-ui";

interface AdminModelMobileListProps {
  users: AdminUser[];
  statusLabels: Record<UserStatus, string>;
  allStatuses: UserStatus[];
  pendingStatus: Record<string, UserStatus>;
  updatingId: string | null;
  onStatusChange: (userId: string, status: UserStatus) => void;
  onUpdate: (user: AdminUser) => void;
  onReview?: (user: AdminUser) => void;
  onDelete?: (user: AdminUser) => void;
  deletingId?: string | null;
  formatDate: (iso: string) => string;
  /** Prefer contact number over email in the secondary line */
  secondaryField?: "email" | "contactNumber";
  selectable?: boolean;
  selectedIds?: Set<string>;
  onToggleSelect?: (userId: string) => void;
  isSelectDisabled?: (user: AdminUser) => boolean;
}

export default function AdminModelMobileList({
  users,
  statusLabels,
  allStatuses,
  pendingStatus,
  updatingId,
  onStatusChange,
  onUpdate,
  onReview,
  onDelete,
  deletingId,
  formatDate,
  secondaryField = "email",
  selectable = false,
  selectedIds,
  onToggleSelect,
  isSelectDisabled,
}: AdminModelMobileListProps) {
  return (
    <div className="space-y-3 md:hidden">
      {users.map((user) => {
        const secondary =
          secondaryField === "contactNumber"
            ? user.contactNumber?.trim() || "—"
            : user.email;
        const selectDisabled = isSelectDisabled?.(user) ?? false;
        const isSelected = selectedIds?.has(user.id) ?? false;

        return (
          <article key={user.id} className={adminMobileCard}>
            <div className="space-y-1">
              {selectable && (
                <label className="flex items-center gap-2 pb-1">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    disabled={selectDisabled}
                    onChange={() => onToggleSelect?.(user.id)}
                    className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-400 disabled:opacity-40"
                    aria-label={`Select ${user.displayName ?? user.email}`}
                  />
                  <span className="text-xs text-gray-500">
                    {selectDisabled ? "Already a model" : "Select"}
                  </span>
                </label>
              )}
              <p className="text-base font-semibold text-gray-900">
                {user.displayName ??
                  (secondaryField === "contactNumber" ? secondary : user.email)}
              </p>
              {user.displayName && (
                <p className="text-sm text-gray-600 break-all">{secondary}</p>
              )}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className={adminStatusBadge}>{statusLabels[user.status]}</span>
                <span className="text-xs text-gray-400">Joined {formatDate(user.createdAt)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              {onReview && (
                <button
                  type="button"
                  onClick={() => onReview(user)}
                  className={adminBtnAccent + " w-full"}
                >
                  Review profile
                </button>
              )}
              <div>
                <label className={adminLabel}>Change status</label>
                <select
                  value={pendingStatus[user.id] ?? user.status}
                  onChange={(e) => onStatusChange(user.id, e.target.value as UserStatus)}
                  className={adminInput}
                >
                  {(allStatuses.includes(user.status)
                    ? allStatuses
                    : [user.status, ...allStatuses]
                  ).map((s) => (
                    <option key={s} value={s}>
                      {statusLabels[s]}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                disabled={
                  updatingId === user.id ||
                  (pendingStatus[user.id] ?? user.status) === user.status
                }
                onClick={() => onUpdate(user)}
                className={adminBtnPrimary + " w-full"}
              >
                {updatingId === user.id ? "Saving…" : "Save status"}
              </button>
              {onDelete && (
                <button
                  type="button"
                  disabled={deletingId === user.id || updatingId === user.id}
                  onClick={() => onDelete(user)}
                  className="w-full text-sm px-4 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 transition-colors rounded-lg disabled:opacity-50"
                >
                  {deletingId === user.id ? "Deleting…" : "Delete permanently"}
                </button>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
