"use client";

import type { ReactNode } from "react";
import { adminBtnDanger } from "./admin-ui";

interface AdminBulkDeleteBarProps {
  selectedCount: number;
  deleting: boolean;
  disabled?: boolean;
  onDelete: () => void | Promise<void>;
  extraActions?: ReactNode;
}

export default function AdminBulkDeleteBar({
  selectedCount,
  deleting,
  disabled,
  onDelete,
  extraActions,
}: AdminBulkDeleteBarProps) {
  if (selectedCount === 0) return null;

  function handleClick() {
    const noun = selectedCount === 1 ? "account" : "accounts";
    if (
      !confirm(
        `Permanently delete ${selectedCount} ${noun}?\n\nThis removes Auth0 logins, profiles, and uploaded files. This cannot be undone.`,
      )
    ) {
      return;
    }
    void onDelete();
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-sm text-gray-700">
        {selectedCount} selected
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {extraActions}
        <button
          type="button"
          disabled={deleting || disabled}
          onClick={handleClick}
          className={adminBtnDanger}
        >
          {deleting ? "Deleting…" : `Delete selected (${selectedCount})`}
        </button>
      </div>
    </div>
  );
}
