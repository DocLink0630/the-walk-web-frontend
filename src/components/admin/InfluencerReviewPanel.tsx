"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  deleteAdminUser,
  fetchAdminUserDetail,
  updateUserStatus,
} from "@/lib/admin/users-api";
import type { AdminUser, AdminUserDetail } from "@/types/admin";
import ModelReviewMediaSection from "./ModelReviewMediaSection";
import {
  adminAlertErr,
  adminAlertOk,
  adminBtnDanger,
  adminBtnPrimary,
  adminBtnSecondary,
  adminCard,
  adminPageTitle,
  adminSectionTitle,
} from "./admin-ui";

function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: string | number | null | string[];
}) {
  if (value == null || value === "") return null;
  const display = Array.isArray(value) ? value.join(", ") : String(value);
  if (!display) return null;
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 mb-0.5">{label}</p>
      <p className="text-sm text-gray-900 break-words">{display}</p>
    </div>
  );
}

interface InfluencerReviewPanelProps {
  user: AdminUser;
  onClose: () => void;
  onUpdated: () => void;
}

export default function InfluencerReviewPanel({
  user,
  onClose,
  onUpdated,
}: InfluencerReviewPanelProps) {
  const [detail, setDetail] = useState<AdminUserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [banner, setBanner] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const canReview = user.status === "PENDING_ADMIN_REVIEW";

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      const result = await fetchAdminUserDetail(user.id);
      if (cancelled) return;
      if (!result.ok) {
        setError(result.message);
        setLoading(false);
        return;
      }
      setDetail(result.data);
      setLoading(false);
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [user.id]);

  async function handleApprove() {
    setApproving(true);
    setBanner(null);
    const result = await updateUserStatus(user.id, "ACTIVE");
    setApproving(false);
    if (!result.ok) {
      setBanner({ type: "err", text: result.message });
      return;
    }
    setBanner({ type: "ok", text: "Influencer approved and activated." });
    onUpdated();
  }

  async function handleReject() {
    if (!confirm("Reject this influencer application?")) return;
    setRejecting(true);
    setBanner(null);
    const result = await updateUserStatus(user.id, "REJECTED");
    setRejecting(false);
    if (!result.ok) {
      setBanner({ type: "err", text: result.message });
      return;
    }
    setBanner({ type: "ok", text: "Application rejected." });
    onUpdated();
  }

  async function handleDelete() {
    const name = detail?.influencerProfile?.fullName ?? user.displayName ?? user.email;
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
    if (!result.ok) {
      setBanner({ type: "err", text: result.message });
      return;
    }
    onUpdated();
    onClose();
  }

  const profile = detail?.influencerProfile;

  return (
    <div className="fixed inset-0 z-40 flex bg-black/40">
      <div className="ml-auto h-full w-full max-w-2xl bg-white shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 shrink-0">
          <h2 className={adminPageTitle}>Influencer review</h2>
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
                <DetailRow
                  label="Applied"
                  value={new Date(user.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                />
              </div>

              {profile && (
                <div className={adminCard + " space-y-3"}>
                  <p className={adminSectionTitle}>Influencer profile</p>
                  <DetailRow label="Full name" value={profile.fullName} />
                  <DetailRow label="Content categories" value={profile.contentCategories} />
                  <DetailRow label="Instagram" value={profile.instagramUrl} />
                  <DetailRow label="Instagram followers" value={profile.instagramFollowers} />
                  <DetailRow label="TikTok" value={profile.tiktokUrl} />
                  <DetailRow label="TikTok followers" value={profile.tiktokFollowers} />
                  <DetailRow label="YouTube" value={profile.youtubeUrl} />
                  <DetailRow label="YouTube subscribers" value={profile.youtubeSubscribers} />
                  <DetailRow label="Facebook" value={profile.facebookUrl} />
                  <DetailRow label="Facebook followers" value={profile.facebookFollowers} />
                  <DetailRow label="Past brand work" value={profile.pastBrandWork} />
                  <DetailRow label="Rate card" value={profile.rateCard} />
                  <DetailRow label="Bio" value={profile.shortBio} />
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

              {banner && (
                <p className={banner.type === "ok" ? adminAlertOk : adminAlertErr}>{banner.text}</p>
              )}
            </>
          )}
        </div>

        <div className="border-t border-gray-200 px-6 py-4 shrink-0 space-y-2">
          {canReview && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleApprove}
                disabled={approving}
                className={adminBtnPrimary + " flex-1 disabled:opacity-50"}
              >
                {approving ? "Approving…" : "Approve & activate"}
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={rejecting}
                className={adminBtnSecondary + " flex-1 disabled:opacity-50"}
              >
                {rejecting ? "Rejecting…" : "Reject"}
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className={adminBtnDanger + " w-full disabled:opacity-50"}
          >
            {deleting ? "Deleting…" : "Delete account permanently"}
          </button>
        </div>
      </div>
    </div>
  );
}
