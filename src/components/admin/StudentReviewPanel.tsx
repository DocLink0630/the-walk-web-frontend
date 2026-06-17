"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { deleteAdminUser, fetchAdminUserDetail, updateUserStatus } from "@/lib/admin/users-api";
import { STUDENT_STATUS_LABELS } from "@/lib/admin/student-user-status";
import { formatModelTier } from "@/lib/admin/model-tiers";
import { SKIN_COLOR_OPTIONS } from "@/components/registration/personal/constants";
import type { AdminUser, AdminUserDetail } from "@/types/admin";
import {
  adminAlertErr,
  adminAlertOk,
  adminBtnDanger,
  adminBtnPrimary,
  adminBtnSecondary,
  adminCard,
  adminMutedBox,
  adminPageTitle,
  adminSectionTitle,
} from "./admin-ui";

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 mb-0.5">{label}</p>
      <p className="text-sm text-gray-900">{value}</p>
    </div>
  );
}

function skinColorLabel(id?: string | null) {
  if (!id) return null;
  return SKIN_COLOR_OPTIONS.find((o) => o.id === id)?.label ?? id;
}

interface StudentReviewPanelProps {
  user: AdminUser;
  onClose: () => void;
  onUpdated: () => void;
}

export default function StudentReviewPanel({
  user,
  onClose,
  onUpdated,
}: StudentReviewPanelProps) {
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

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  async function handleApprove() {
    setApproving(true);
    setBanner(null);
    const result = await updateUserStatus(user.id, "ACTIVE");
    setApproving(false);

    if (!result.ok) {
      setBanner({ type: "err", text: result.message });
      return;
    }

    setBanner({ type: "ok", text: "Student application approved." });
    onUpdated();
  }

  async function handleReject() {
    if (!window.confirm("Reject this student application?")) return;

    setRejecting(true);
    setBanner(null);
    const result = await updateUserStatus(user.id, "REJECTED");
    setRejecting(false);

    if (!result.ok) {
      setBanner({ type: "err", text: result.message });
      return;
    }

    setBanner({ type: "ok", text: "Student application rejected." });
    onUpdated();
  }

  async function handleDelete() {
    const name = profile?.fullName || user.email;
    if (
      !window.confirm(
        `Permanently delete "${name}"?\n\nThis removes their account, uploaded files, and records. This cannot be undone.`,
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

    onClose();
    onUpdated();
  }

  const profile = detail?.studentProfile;
  const media = detail?.registrationMedia;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <button
        type="button"
        aria-label="Close review panel"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <aside className="relative w-full max-w-3xl sm:max-w-2xl lg:max-w-3xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-4 md:px-6 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-medium text-amber-700 mb-1">Student application</p>
            <h2 className={`${adminPageTitle} truncate`}>
              {profile?.fullName || user.email}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5 truncate">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            aria-label="Close"
          >
            <X className="size-4" strokeWidth={1.75} />
          </button>
        </div>

        <div className="flex-1 px-4 py-5 md:px-6 space-y-6">
          {loading && <p className="text-sm text-gray-500">Loading application…</p>}
          {error && <div className={adminAlertErr}>{error}</div>}
          {banner && (
            <div className={banner.type === "ok" ? adminAlertOk : adminAlertErr}>{banner.text}</div>
          )}

          {!loading && !error && (
            <>
              <section className="space-y-3">
                <h3 className={adminSectionTitle}>Account</h3>
                <div className="grid grid-cols-2 gap-4">
                  <DetailRow label="Status" value={STUDENT_STATUS_LABELS[user.status]} />
                  <DetailRow label="Student code" value={profile?.modelCode} />
                  <DetailRow label="Tier" value={formatModelTier(profile?.tier)} />
                  <DetailRow label="Referral source" value={profile?.source} />
                </div>
              </section>

              <section className={adminMutedBox + " space-y-3"}>
                <h3 className={adminSectionTitle}>Application details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DetailRow label="Full name" value={profile?.fullName} />
                  <DetailRow label="Gender" value={profile?.gender} />
                  <DetailRow label="Age" value={profile?.age != null ? String(profile.age) : null} />
                  <DetailRow label="Date of birth" value={profile?.dobEnc} />
                  <DetailRow label="NIC" value={profile?.nicEnc} />
                  <DetailRow label="Contact number" value={profile?.contactNumberEnc} />
                  <DetailRow label="WhatsApp" value={profile?.whatsappNumberEnc} />
                  <DetailRow label="Address" value={profile?.addressEnc} />
                  <DetailRow label="Height" value={profile?.heightEnc} />
                  <DetailRow label="Weight" value={profile?.weightEnc} />
                  <DetailRow label="Chest" value={profile?.chestEnc} />
                  <DetailRow label="Shoulder" value={profile?.shoulderEnc} />
                  <DetailRow label="Waist" value={profile?.waistEnc} />
                  <DetailRow label="Shoe size" value={profile?.shoeSizeEnc} />
                  <DetailRow label="Eye color" value={profile?.eyeColorEnc} />
                  <DetailRow label="Hair color" value={profile?.hairColorEnc} />
                  <DetailRow label="Skin color" value={skinColorLabel(profile?.skinColorOptionId)} />
                  <DetailRow label="Preferred branch" value={profile?.preferredBranchRaw} />
                  <DetailRow label="Preferred start date" value={profile?.preferredDate} />
                  <DetailRow label="Talents" value={profile?.talentsEnc} />
                  <DetailRow label="Short bio" value={profile?.shortBio} />
                </div>
              </section>

              {media && (
                <section className="space-y-4">
                  <h3 className={adminSectionTitle}>Uploaded photos</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {media.profilePhoto && (
                      <div className={adminCard + " !p-3 space-y-2"}>
                        <p className="text-xs font-medium text-gray-500">Profile photo</p>
                        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
                          <Image
                            src={media.profilePhoto.url}
                            alt="Profile photo"
                            fill
                            className="object-cover"
                            sizes="240px"
                          />
                        </div>
                      </div>
                    )}
                    {media.nicFront && (
                      <div className={adminCard + " !p-3 space-y-2"}>
                        <p className="text-xs font-medium text-gray-500">NIC front</p>
                        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
                          <Image
                            src={media.nicFront.url}
                            alt="NIC front"
                            fill
                            className="object-cover"
                            sizes="240px"
                          />
                        </div>
                      </div>
                    )}
                    {media.nicBack && (
                      <div className={adminCard + " !p-3 space-y-2"}>
                        <p className="text-xs font-medium text-gray-500">NIC back</p>
                        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
                          <Image
                            src={media.nicBack.url}
                            alt="NIC back"
                            fill
                            className="object-cover"
                            sizes="240px"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  {media.portfolioPhotos.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-500">Portfolio</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {media.portfolioPhotos.map((photo) => (
                          <div
                            key={photo.storageFileId}
                            className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100"
                          >
                            <Image
                              src={photo.url}
                              alt={photo.alt ?? "Portfolio photo"}
                              fill
                              className="object-cover"
                              sizes="160px"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              )}
            </>
          )}
        </div>

        <div className="sticky bottom-0 border-t border-gray-200 bg-white px-4 py-4 md:px-6 flex flex-wrap gap-2">
          {canReview && (
            <>
              <button
                type="button"
                disabled={approving || rejecting || deleting}
                onClick={() => void handleApprove()}
                className={adminBtnPrimary}
              >
                {approving ? "Approving…" : "Approve"}
              </button>
              <button
                type="button"
                disabled={approving || rejecting || deleting}
                onClick={() => void handleReject()}
                className={adminBtnSecondary}
              >
                {rejecting ? "Rejecting…" : "Reject"}
              </button>
            </>
          )}
          <button
            type="button"
            disabled={approving || rejecting || deleting}
            onClick={() => void handleDelete()}
            className={adminBtnDanger + " ml-auto"}
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </aside>
    </div>
  );
}
