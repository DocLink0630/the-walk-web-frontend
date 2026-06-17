"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import AdminAddModelForm from "./AdminAddModelForm";
import { useAdminModelAddStore } from "@/stores/adminModelAddStore";
import { adminPageDesc, adminPageTitle } from "./admin-ui";

interface AdminAddModelPanelProps {
  onClose: () => void;
  onSaved: () => void;
}

export default function AdminAddModelPanel({
  onClose,
  onSaved,
}: AdminAddModelPanelProps) {
  const store = useAdminModelAddStore();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function handleClose() {
    store.reset();
    onClose();
  }

  function handleSuccess() {
    onSaved();
    // Brief success view, then close
    setTimeout(() => {
      store.reset();
      onClose();
    }, 1800);
  }

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <button
        type="button"
        aria-label="Close add model panel"
        className="absolute inset-0 bg-black/40"
        onClick={handleClose}
      />
      <aside className="relative w-full max-w-2xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-5 py-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-amber-700 mb-1">Models</p>
            <h2 className={adminPageTitle}>Add model manually</h2>
            <p className={adminPageDesc + " mt-1"}>
              Creates the account, uploads documents, and sets status to Active.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="shrink-0 p-2 border border-[#E0E0E0] hover:border-[#0A0A0A] transition-colors"
            aria-label="Close"
          >
            <X className="size-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 px-5 py-6">
          <AdminAddModelForm onSuccess={handleSuccess} />
        </div>
      </aside>
    </div>
  );
}
