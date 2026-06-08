"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import AdminAddModelForm from "./AdminAddModelForm";
import { useAdminModelAddStore } from "@/stores/adminModelAddStore";

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
        <div className="sticky top-0 z-10 border-b border-[#E0E0E0] bg-white px-5 py-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-ui text-[9px] tracking-[0.3em] uppercase text-[#C8A97A] mb-1">
              Models
            </p>
            <h2 className="font-display text-xl font-light text-[#0A0A0A]">
              Add model manually
            </h2>
            <p className="font-ui text-[10px] text-[#6B6B6B] mt-1 leading-relaxed">
              Creates the account, uploads documents, approves tier/rate, and sets status to Active.
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
