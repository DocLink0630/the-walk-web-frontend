"use client";

import type { AdminUser, UserStatus } from "@/types/admin";

const inputCls =
  "w-full border border-[#E0E0E0] px-3 py-2 font-ui text-[10px] tracking-[0.1em] outline-none focus:border-[#C8A97A] bg-white";

interface AdminUserMobileListProps {
  users: AdminUser[];
  statusLabels: Record<UserStatus, string>;
  allStatuses: UserStatus[];
  pendingStatus: Record<string, UserStatus>;
  updatingId: string | null;
  onStatusChange: (userId: string, status: UserStatus) => void;
  onUpdate: (user: AdminUser) => void;
  formatDate: (iso: string) => string;
}

export default function AdminUserMobileList({
  users,
  statusLabels,
  allStatuses,
  pendingStatus,
  updatingId,
  onStatusChange,
  onUpdate,
  formatDate,
}: AdminUserMobileListProps) {
  return (
    <div className="md:hidden space-y-3">
      {users.map((user) => (
        <article
          key={user.id}
          className="border border-[#E0E0E0] bg-white p-4 space-y-3"
        >
          <div>
            <p className="font-ui text-[10px] tracking-[0.05em] text-[#0A0A0A] break-all">
              {user.email}
            </p>
            <p className="font-ui text-[9px] tracking-[0.1em] uppercase text-[#9A9A9A] mt-1">
              Joined {formatDate(user.createdAt)}
            </p>
          </div>

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

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="font-ui text-[8px] tracking-[0.2em] uppercase text-[#9A9A9A] mb-1">
                Status
              </p>
              <p className="font-ui text-[9px] tracking-[0.1em] uppercase text-[#4A4A4A]">
                {statusLabels[user.status]}
              </p>
            </div>
            <div>
              <p className="font-ui text-[8px] tracking-[0.2em] uppercase text-[#9A9A9A] mb-1">
                Step
              </p>
              <p className="font-ui text-[10px] text-[#4A4A4A]">{user.onboardingStep}</p>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <select
              value={pendingStatus[user.id] ?? user.status}
              onChange={(e) => onStatusChange(user.id, e.target.value as UserStatus)}
              className={inputCls}
            >
              {allStatuses.map((s) => (
                <option key={s} value={s}>
                  {statusLabels[s]}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={
                updatingId === user.id ||
                (pendingStatus[user.id] ?? user.status) === user.status
              }
              onClick={() => onUpdate(user)}
              className="w-full font-ui text-[8px] tracking-[0.15em] uppercase px-3 py-2.5 bg-[#0A0A0A] text-white hover:bg-[#C8A97A] disabled:opacity-40 transition-colors"
            >
              {updatingId === user.id ? "Updating…" : "Update status"}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
