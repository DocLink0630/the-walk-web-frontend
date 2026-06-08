"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  approveModelProfile,
  fetchAdminUserDetail,
  toggleModelFeatured,
  updateUserStatus,
} from "@/lib/admin/users-api";
import { ADMIN_ASSIGNABLE_TIERS, formatModelTier } from "@/lib/admin/model-tiers";
import { SKIN_COLOR_OPTIONS } from "@/components/registration/personal/constants";
import type {
  AdminUser,
  AdminUserDetail,
  AssignableModelTier,
  UserStatus,
} from "@/types/admin";

const inputCls =
  "w-full border border-[#E0E0E0] px-3 py-2 font-ui text-[10px] tracking-[0.1em] outline-none focus:border-[#C8A97A] bg-white";

const STATUS_LABELS: Record<UserStatus, string> = {
  PENDING_EMAIL_VERIFICATION: "Pending email",
  PENDING_ADMIN_REVIEW: "Pending review",
  PENDING_PAYMENT: "Pending payment",
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  SUSPENDED: "Suspended",
  DELETED: "Deleted",
};

function skinColorLabel(id?: string | null): string {
  if (!id) return "—";
  return SKIN_COLOR_OPTIONS.find((o) => o.id === id)?.label ?? id;
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="font-ui text-[8px] tracking-[0.2em] uppercase text-[#9A9A9A] mb-1">
        {label}
      </p>
      <p className="font-ui text-[10px] text-[#0A0A0A] leading-relaxed">{value}</p>
    </div>
  );
}

interface ModelReviewPanelProps {
  user: AdminUser;
  onClose: () => void;
  onUpdated: () => void;
}

export default function ModelReviewPanel({
  user,
  onClose,
  onUpdated,
}: ModelReviewPanelProps) {
  const [detail, setDetail] = useState<AdminUserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [banner, setBanner] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const [rate, setRate] = useState("");
  const [tier, setTier] = useState<AssignableModelTier>("FRESHER");
  const [talents, setTalents] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [togglingFeatured, setTogglingFeatured] = useState(false);

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
      const expectations = result.data.model_expectations;
      const profile = result.data.modelProfile;

      setRate(expectations?.rateEnc?.trim() || profile?.rate?.trim() || "");
      const applicantTier = expectations?.tier;
      setTier(
        applicantTier && applicantTier !== "PENDING"
          ? (applicantTier as AssignableModelTier)
          : "FRESHER",
      );
      setTalents(
        expectations?.talentsEnc?.trim() || profile?.talentsEnc?.trim() || "",
      );
      setIsFeatured(profile?.isFeatured ?? false);
      setLoading(false);
    }

    load();
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

  async function handleFeaturedToggle(next: boolean) {
    setTogglingFeatured(true);
    setBanner(null);
    const result = await toggleModelFeatured(user.id, next);
    if (!result.ok) {
      setBanner({ type: "err", text: result.message });
      setTogglingFeatured(false);
      return;
    }
    setIsFeatured(next);
    setBanner({
      type: "ok",
      text: next
        ? "Model is now featured on the homepage."
        : "Model removed from homepage featured list.",
    });
    setTogglingFeatured(false);
    onUpdated();
  }

  async function handleApprove() {
    if (!rate.trim() || !talents.trim()) {
      setBanner({ type: "err", text: "Rate and talents are required to approve." });
      return;
    }

    setSaving(true);
    setBanner(null);

    const result = await approveModelProfile(user.id, {
      rate: rate.trim(),
      tier,
      talents: talents.trim(),
    });

    if (!result.ok) {
      setBanner({ type: "err", text: result.message });
      setSaving(false);
      return;
    }

    if (user.status === "PENDING_ADMIN_REVIEW") {
      const statusResult = await updateUserStatus(user.id, "ACTIVE");
      if (!statusResult.ok) {
        setBanner({
          type: "err",
          text: `Profile approved but status update failed: ${statusResult.message}`,
        });
        setSaving(false);
        onUpdated();
        return;
      }
    }

    setBanner({ type: "ok", text: "Model profile approved with tier and rate." });
    setSaving(false);
    onUpdated();
  }

  const profile = detail?.modelProfile;
  const expectations = detail?.model_expectations;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <button
        type="button"
        aria-label="Close review panel"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <aside className="relative w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
        <div className="sticky top-0 z-10 border-b border-[#E0E0E0] bg-white px-4 py-4 md:px-6 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-ui text-[9px] tracking-[0.3em] uppercase text-[#C8A97A] mb-1">
              Model review
            </p>
            <h2 className="font-display text-xl font-light text-[#0A0A0A] truncate">
              {profile?.fullName || user.email}
            </h2>
            <p className="font-ui text-[9px] tracking-[0.1em] text-[#9A9A9A] mt-1 truncate">
              {user.email}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 p-2 border border-[#E0E0E0] hover:border-[#0A0A0A] transition-colors"
            aria-label="Close"
          >
            <X className="size-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 px-4 py-6 md:px-6 space-y-8">
          {loading && (
            <p className="font-ui text-[10px] text-[#9A9A9A]">Loading profile…</p>
          )}

          {error && (
            <div className="border border-red-300 bg-red-50 px-4 py-3">
              <p className="font-ui text-[10px] text-red-700">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              <section className="space-y-3">
                <h3 className="font-ui text-[9px] tracking-[0.25em] uppercase text-[#0A0A0A]">
                  Account
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <DetailRow label="Status" value={STATUS_LABELS[user.status]} />
                  <DetailRow
                    label="Model code"
                    value={profile?.modelCode}
                  />
                  <DetailRow
                    label="Current tier"
                    value={formatModelTier(profile?.tier)}
                  />
                  <DetailRow
                    label="Approved rate"
                    value={profile?.rate || "Not set"}
                  />
                </div>

                <div className="flex items-center justify-between gap-4 border border-[#E0E0E0] bg-[#FAFAFA] px-4 py-3 mt-2">
                  <div>
                    <p className="font-ui text-[9px] tracking-[0.2em] uppercase text-[#0A0A0A]">
                      Featured on homepage
                    </p>
                    <p className="font-ui text-[9px] text-[#6B6B6B] mt-1 leading-relaxed">
                      Shown in the Signature Models section on the public site.
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isFeatured}
                    disabled={togglingFeatured}
                    onClick={() => handleFeaturedToggle(!isFeatured)}
                    className={[
                      "relative shrink-0 w-11 h-6 rounded-full transition-colors duration-300 disabled:opacity-50",
                      isFeatured ? "bg-[#C8A97A]" : "bg-[#D4D4D4]",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300",
                        isFeatured ? "translate-x-5" : "translate-x-0",
                      ].join(" ")}
                    />
                  </button>
                </div>
              </section>

              {expectations && (
                <section className="space-y-3 border border-[#E0E0E0] bg-[#FAFAFA] p-4">
                  <h3 className="font-ui text-[9px] tracking-[0.25em] uppercase text-[#0A0A0A]">
                    Applicant submission
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <DetailRow
                      label="Requested tier"
                      value={formatModelTier(expectations.tier)}
                    />
                    <DetailRow
                      label="Requested rate / range"
                      value={expectations.rateEnc}
                    />
                    <DetailRow label="Talents" value={expectations.talentsEnc} />
                  </div>
                </section>
              )}

              <section className="space-y-3">
                <h3 className="font-ui text-[9px] tracking-[0.25em] uppercase text-[#0A0A0A]">
                  Profile details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <DetailRow label="Gender" value={profile?.gender} />
                  <DetailRow label="Age" value={profile?.age?.toString()} />
                  <DetailRow label="Height" value={profile?.heightEnc} />
                  <DetailRow label="Weight" value={profile?.weightEnc} />
                  <DetailRow label="Skin color" value={skinColorLabel(profile?.skinColorOptionId)} />
                  <DetailRow label="Source" value={profile?.source} />
                </div>
                <DetailRow label="Bio" value={profile?.shortBio} />
                <DetailRow label="Contact" value={profile?.contactNumberEnc} />
                <DetailRow label="WhatsApp" value={profile?.whatsappNumberEnc} />
                <DetailRow label="Address" value={profile?.addressEnc} />
              </section>

              <section className="space-y-3 border border-dashed border-[#E0E0E0] p-4">
                <p className="font-ui text-[9px] tracking-[0.15em] uppercase text-[#9A9A9A]">
                  Work samples
                </p>
                <p className="font-ui text-[10px] text-[#4A4A4A] leading-relaxed">
                  Profile photo, NIC, and portfolio/work images were uploaded at registration
                  and stored on the server. Image URLs are not returned by the current user
                  detail API.
                </p>
              </section>

              <section className="space-y-4 border-t border-[#E0E0E0] pt-6">
                <h3 className="font-ui text-[9px] tracking-[0.25em] uppercase text-[#0A0A0A]">
                  Approve — assign tier & rate
                </h3>
                <p className="font-ui text-[10px] text-[#6B6B6B] leading-relaxed">
                  Confirms the official listing tier, rate, and talents on the model profile.
                  Pending-review models are set to Active after approval.
                </p>

                <div>
                  <label className="block font-ui text-[9px] tracking-[0.25em] uppercase text-[#4A4A4A] mb-1">
                    Official rate / price range
                  </label>
                  <input
                    type="text"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    placeholder="e.g. 15,000 LKR per hour"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block font-ui text-[9px] tracking-[0.25em] uppercase text-[#4A4A4A] mb-1">
                    Official tier
                  </label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value as AssignableModelTier)}
                    className={inputCls}
                  >
                    {ADMIN_ASSIGNABLE_TIERS.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-ui text-[9px] tracking-[0.25em] uppercase text-[#4A4A4A] mb-1">
                    Talents
                  </label>
                  <textarea
                    value={talents}
                    onChange={(e) => setTalents(e.target.value)}
                    rows={3}
                    placeholder="Confirmed talents for listing"
                    className={inputCls + " resize-y min-h-[80px]"}
                  />
                </div>

                {banner && (
                  <div
                    className={
                      banner.type === "ok"
                        ? "border border-[#C8A97A] bg-[#C8A97A]/10 px-4 py-3"
                        : "border border-red-300 bg-red-50 px-4 py-3"
                    }
                  >
                    <p
                      className={
                        "font-ui text-[10px] " +
                        (banner.type === "ok" ? "text-[#0A0A0A]" : "text-red-700")
                      }
                    >
                      {banner.text}
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  disabled={saving}
                  onClick={handleApprove}
                  className="w-full font-ui text-[9px] tracking-[0.2em] uppercase px-4 py-3 bg-[#0A0A0A] text-white hover:bg-[#C8A97A] disabled:opacity-50 transition-colors"
                >
                  {saving ? "Saving…" : "Approve tier & rate"}
                </button>
              </section>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
