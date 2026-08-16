"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { approveServiceProvider, deleteAdminUser, fetchAdminUserDetail, updateUserStatus } from "@/lib/admin/users-api";
import type { AdminUser, AdminUserDetail } from "@/types/admin";
import type { AdminSection } from "@/types/admin-nav";
import ModelReviewMediaSection from "./ModelReviewMediaSection";
import {
  adminAlertErr,
  adminAlertOk,
  adminBtnDanger,
  adminBtnPrimary,
  adminBtnSecondary,
  adminCard,
  adminInput,
  adminLabel,
  adminPageTitle,
  adminSectionTitle,
} from "./admin-ui";

function DetailRow({ label, value }: { label: string; value?: string | number | null | string[] }) {
  if (value == null || value === "") return null;
  const display = Array.isArray(value) ? value.join(", ") : String(value);
  if (!display) return null;
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 mb-0.5">{label}</p>
      <p className="text-sm text-gray-900">{display}</p>
    </div>
  );
}

interface ServiceProviderReviewPanelProps {
  user: AdminUser;
  providerType: Extract<AdminSection, "beauticians" | "photographers">;
  onClose: () => void;
  onUpdated: () => void;
}

export default function ServiceProviderReviewPanel({
  user,
  providerType,
  onClose,
  onUpdated,
}: ServiceProviderReviewPanelProps) {
  const [detail, setDetail] = useState<AdminUserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [banner, setBanner] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [rate, setRate] = useState("");

  const canReview = user.status === "PENDING_ADMIN_REVIEW";
  const isBeautician = providerType === "beauticians";
  const typeLabel = isBeautician ? "Beautician" : "Photographer";

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      const result = await fetchAdminUserDetail(user.id);
      if (cancelled) return;
      if (!result.ok) { setError(result.message); setLoading(false); return; }
      setDetail(result.data);
      const profile = isBeautician ? result.data.beauticianProfile : result.data.photographerProfile;
      if (profile?.rateCard) setRate(profile.rateCard);
      setLoading(false);
    }
    void load();
    return () => { cancelled = true; };
  }, [user.id, isBeautician]);

  async function handleApprove() {
    if (!rate.trim()) { setBanner({ type: "err", text: "Enter a rate before approving." }); return; }
    setApproving(true);
    setBanner(null);
    const result = await approveServiceProvider(user.id, rate.trim());
    setApproving(false);
    if (!result.ok) { setBanner({ type: "err", text: result.message }); return; }
    setBanner({ type: "ok", text: `${typeLabel} approved and activated.` });
    onUpdated();
  }

  async function handleReject() {
    setRejecting(true);
    setBanner(null);
    const result = await updateUserStatus(user.id, "REJECTED");
    setRejecting(false);
    if (!result.ok) { setBanner({ type: "err", text: result.message }); return; }
    setBanner({ type: "ok", text: "Application rejected." });
    onUpdated();
  }

  async function handleDelete() {
    const name = profile?.fullName ?? user.displayName ?? user.email;
    if (
      !confirm(
        `Permanently delete "${name}"?\n\nThis removes their account, Auth0 login, profile, and all uploaded files. This cannot be undone.`,
      )
    ) {
      return;
    }
    setDeleting(true);
    setBanner(null);
    const result = await deleteAdminUser(user.id);
    setDeleting(false);
    if (!result.ok) { setBanner({ type: "err", text: result.message }); return; }
    onUpdated();
    onClose();
  }

  const profile = isBeautician ? detail?.beauticianProfile : detail?.photographerProfile;

  return (
    <div className="fixed inset-0 z-40 flex bg-black/40">
      <div className="ml-auto h-full w-full max-w-2xl bg-white shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 shrink-0">
          <h2 className={adminPageTitle}>{typeLabel} Review</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <p className="text-sm text-gray-500">Loading…</p>
          ) : error ? (
            <p className={adminAlertErr}>{error}</p>
          ) : (
            <>
              <div className={adminCard + " space-y-3"}>
                <p className={adminSectionTitle}>Account</p>
                <DetailRow label="Email" value={user.email} />
                <DetailRow label="Status" value={user.status} />
                <DetailRow label="Applied" value={new Date(user.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} />
              </div>

              {profile && (
                <div className={adminCard + " space-y-3"}>
                  <p className={adminSectionTitle}>{typeLabel} Profile</p>
                  <DetailRow label="Full name" value={profile.fullName} />
                  <DetailRow label="Specialties" value={profile.specialties} />
                  <DetailRow label="Years of experience" value={profile.yearsOfExperience} />
                  <DetailRow label="Location" value={profile.location} />
                  <DetailRow label="Bio" value={profile.shortBio} />
                  {!isBeautician && "equipmentOverview" in profile && (
                    <DetailRow label="Equipment" value={(profile as { equipmentOverview?: string | null }).equipmentOverview} />
                  )}
                  <DetailRow label="Submitted rate" value={profile.rateCard} />
                </div>
              )}

              <ModelReviewMediaSection
                userId={user.id}
                media={detail?.registrationMedia}
                showNic={false}
                showWorkExperience={false}
                onMediaUpdated={(registrationMedia) =>
                  setDetail((prev) => (prev ? { ...prev, registrationMedia } : prev))
                }
                onError={(text) => setBanner({ type: "err", text })}
              />

              {canReview && (
                <div className={adminCard + " space-y-3"}>
                  <p className={adminSectionTitle}>Assign rate</p>
                  <p className="text-xs text-gray-500">Set the publicly visible rate before approving. The applicant&apos;s submitted rate is shown above.</p>
                  <div className="space-y-1">
                    <label className={adminLabel}>Rate (required to approve)</label>
                    <input
                      type="text"
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                      placeholder="e.g. LKR 15,000 / day"
                      className={adminInput}
                    />
                  </div>
                </div>
              )}

              {banner && (
                <p className={banner.type === "ok" ? adminAlertOk : adminAlertErr}>{banner.text}</p>
              )}
            </>
          )}
        </div>

        <div className="border-t border-gray-200 px-6 py-4 shrink-0 space-y-2">
          {canReview && (
            <div className="flex gap-2">
              <button type="button" onClick={handleApprove} disabled={approving} className={adminBtnPrimary + " flex-1 disabled:opacity-50"}>
                {approving ? "Approving…" : "Approve & activate"}
              </button>
              <button type="button" onClick={handleReject} disabled={rejecting} className={adminBtnSecondary + " flex-1 disabled:opacity-50"}>
                {rejecting ? "Rejecting…" : "Reject"}
              </button>
            </div>
          )}
          <button type="button" onClick={handleDelete} disabled={deleting} className={adminBtnDanger + " w-full disabled:opacity-50"}>
            {deleting ? "Deleting…" : "Delete account permanently"}
          </button>
        </div>
      </div>
    </div>
  );
}
