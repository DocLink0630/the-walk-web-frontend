"use client";

import { X } from "lucide-react";
import { useAdminPendingRegistrations } from "@/hooks/useAdminPendingRegistrations";

export default function AdminToastContainer() {
  const { toasts, dismissToast } = useAdminPendingRegistrations();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 rounded-lg border border-amber-200 bg-white px-4 py-3 shadow-lg"
        >
          <div className="mt-0.5 size-2 shrink-0 rounded-full bg-amber-500" />
          <p className="flex-1 text-sm text-gray-900 leading-snug">{toast.message}</p>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            className="shrink-0 text-gray-400 hover:text-gray-700"
            aria-label="Dismiss"
          >
            <X className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
