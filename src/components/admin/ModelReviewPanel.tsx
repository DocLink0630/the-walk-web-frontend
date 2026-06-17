"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  approveModelProfile,
  deleteAdminUser,
  fetchAdminUserDetail,
  toggleModelFeatured,
  updateAdminModelProfile,
  updateUserStatus,
} from "@/lib/admin/users-api";
import { ADMIN_ASSIGNABLE_TIERS, formatModelTier } from "@/lib/admin/model-tiers";
import { MODEL_STATUS_LABELS } from "@/lib/admin/model-user-status";
import { SKIN_COLOR_OPTIONS } from "@/components/registration/personal/constants";
import type {
  AdminUser,
  AdminUserDetail,
  AssignableModelTier,
} from "@/types/admin";
import ModelReviewMediaSection from "./ModelReviewMediaSection";
import {
  adminAlertErr,
  adminAlertOk,
  adminBtnDanger,
  adminBtnPrimary,
  adminBtnSecondary,
  adminCard,
  adminInput,
  adminMutedBox,
  adminPageTitle,
  adminSectionTitle,
} from "./admin-ui";

const inputCls = adminInput;

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 mb-0.5">{label}</p>
      <p className="text-sm text-gray-900">{value}</p>
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
  const [savingProfile, setSavingProfile] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [rate, setRate] = useState("");
  const [tier, setTier] = useState<AssignableModelTier>("FRESHER");
  const [talents, setTalents] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [chest, setChest] = useState("");
  const [shoulder, setShoulder] = useState("");
  const [waist, setWaist] = useState("");
  const [shoeSize, setShoeSize] = useState("");
  const [eyeColor, setEyeColor] = useState("");
  const [hairColor, setHairColor] = useState("");
  const [shortBio, setShortBio] = useState("");
  const [skinColorOptionId, setSkinColorOptionId] = useState("");
  const [preferredBranch, setPreferredBranch] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [togglingFeatured, setTogglingFeatured] = useState(false);

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
      setFullName(profile?.fullName?.trim() || "");
      setGender(profile?.gender?.trim() || "");
      setAge(profile?.age != null ? String(profile.age) : "");
      setNic((profile as { nicEnc?: string } | undefined)?.nicEnc?.trim() || "");
      setDob((profile as { dobEnc?: string } | undefined)?.dobEnc?.trim() || "");
      setAddress(profile?.addressEnc?.trim() || "");
      setContactNumber(profile?.contactNumberEnc?.trim() || "");
      setWhatsappNumber(profile?.whatsappNumberEnc?.trim() || "");
      setHeight(profile?.heightEnc?.trim() || "");
      setWeight(profile?.weightEnc?.trim() || "");
      setChest(profile?.chestEnc?.trim() || "");
      setShoulder(profile?.shoulderEnc?.trim() || "");
      setWaist(profile?.waistEnc?.trim() || "");
      setShoeSize(profile?.shoeSizeEnc?.trim() || "");
      setEyeColor(profile?.eyeColorEnc?.trim() || "");
      setHairColor(profile?.hairColorEnc?.trim() || "");
      setShortBio(profile?.shortBio?.trim() || "");
      setSkinColorOptionId(profile?.skinColorOptionId?.trim() || "");
      setPreferredBranch(profile?.preferredBranchRaw?.trim() || "");
      setPreferredDate(profile?.preferredDate?.trim() || "");
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

  async function handleSaveProfile() {
    if (!fullName.trim()) {
      setBanner({ type: "err", text: "Full name is required." });
      return;
    }

    setSavingProfile(true);
    setBanner(null);

    const result = await updateAdminModelProfile(user.id, {
      fullName: fullName.trim(),
      gender: gender.trim() || undefined,
      age: age.trim() ? Number(age.trim()) : undefined,
      nicEnc: nic.trim() || undefined,
      dobEnc: dob.trim() || undefined,
      addressEnc: address.trim() || undefined,
      contactNumberEnc: contactNumber.trim() || undefined,
      whatsappNumberEnc: whatsappNumber.trim() || undefined,
      heightEnc: height.trim() || undefined,
      weightEnc: weight.trim() || undefined,
      chestEnc: chest.trim() || undefined,
      shoulderEnc: shoulder.trim() || undefined,
      waistEnc: waist.trim() || undefined,
      shoeSizeEnc: shoeSize.trim() || undefined,
      eyeColorEnc: eyeColor.trim() || undefined,
      hairColorEnc: hairColor.trim() || undefined,
      shortBio: shortBio.trim() || undefined,
      skinColorOptionId: skinColorOptionId.trim() || undefined,
      preferredBranchRaw: preferredBranch.trim() || undefined,
      preferredDate: preferredDate.trim() || undefined,
      rate: rate.trim() || undefined,
      tier,
      talents: talents.trim() || undefined,
    });

    if (!result.ok) {
      setBanner({ type: "err", text: result.message });
      setSavingProfile(false);
      return;
    }

    setBanner({ type: "ok", text: "Profile saved." });
    setSavingProfile(false);
    onUpdated();
  }

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
    if (!rate.trim()) {
      setBanner({ type: "err", text: "Price range per event is required." });
      return;
    }
    if (!talents.trim()) {
      setBanner({ type: "err", text: "Talents are required to approve." });
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

    const statusResult = await updateUserStatus(user.id, "ACTIVE");
    if (!statusResult.ok) {
      setBanner({
        type: "err",
        text: `Tier and rate saved but activation failed: ${statusResult.message}`,
      });
      setSaving(false);
      onUpdated();
      return;
    }

    setBanner({
      type: "ok",
      text: `Model approved as ${formatModelTier(tier)} and set to Active.`,
    });
    setSaving(false);
    onUpdated();
  }

  async function handleReject() {
    if (!window.confirm("Reject this model application? They will not appear on the public roster.")) {
      return;
    }

    setRejecting(true);
    setBanner(null);

    const result = await updateUserStatus(user.id, "REJECTED");
    if (!result.ok) {
      setBanner({ type: "err", text: result.message });
      setRejecting(false);
      return;
    }

    setBanner({ type: "ok", text: "Model application rejected." });
    setRejecting(false);
    onUpdated();
  }

  async function handleDelete() {
    const name = profile?.fullName || user.email;
    if (
      !window.confirm(
        `Permanently delete "${name}"?\n\nThis will remove their account from Auth0, all uploaded files, and all database records. This cannot be undone.`,
      )
    ) {
      return;
    }

    setDeleting(true);
    setBanner(null);

    const result = await deleteAdminUser(user.id);
    if (!result.ok) {
      setBanner({ type: "err", text: result.message });
      setDeleting(false);
      return;
    }

    onClose();
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
      <aside className="relative w-full max-w-3xl sm:max-w-2xl lg:max-w-3xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-4 md:px-6 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-medium text-amber-700 mb-1">Model review</p>
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
          {loading && <p className="text-sm text-gray-500">Loading profile…</p>}

          {error && <div className={adminAlertErr}>{error}</div>}

          {!loading && !error && (
            <>
              <section className="space-y-3">
                <h3 className={adminSectionTitle}>Account</h3>
                <div className="grid grid-cols-2 gap-4">
                  <DetailRow label="Status" value={MODEL_STATUS_LABELS[user.status]} />
                  <DetailRow label="Model code" value={profile?.modelCode} />
                  <DetailRow label="Current tier" value={formatModelTier(profile?.tier)} />
                  <DetailRow
                    label="Approved price range"
                    value={profile?.rate || "Not set"}
                  />
                </div>

                <div className={`${adminCard} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 !py-4`}>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Featured on homepage</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Shown in Signature Models on the public site.
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isFeatured}
                    disabled={togglingFeatured || user.status !== "ACTIVE"}
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
                {user.status !== "ACTIVE" && (
                  <p className="text-sm text-gray-500">Approve the model before featuring on the homepage.</p>
                )}
              </section>

              {expectations && (
                <section className={adminMutedBox + " space-y-2"}>
                  <h3 className={adminSectionTitle}>Applicant submission</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <DetailRow
                      label="Requested tier"
                      value={formatModelTier(expectations.tier)}
                    />
                    <DetailRow
                      label="Requested price range"
                      value={expectations.rateEnc}
                    />
                    <DetailRow label="Talents" value={expectations.talentsEnc} />
                  </div>
                </section>
              )}

              <section className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className={adminSectionTitle}>Profile details</h3>
                  <button
                    type="button"
                    disabled={savingProfile || saving || rejecting || deleting}
                    onClick={() => void handleSaveProfile()}
                    className={adminBtnPrimary}
                  >
                    {savingProfile ? "Saving…" : "Save profile"}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className={inputCls}
                    >
                      <option value="">Select…</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Skin color
                    </label>
                    <select
                      value={skinColorOptionId}
                      onChange={(e) => setSkinColorOptionId(e.target.value)}
                      className={inputCls}
                    >
                      <option value="">Select…</option>
                      {SKIN_COLOR_OPTIONS.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      NIC
                    </label>
                    <input
                      type="text"
                      value={nic}
                      onChange={(e) => setNic(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of birth
                    </label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact number
                    </label>
                    <input
                      type="text"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      WhatsApp
                    </label>
                    <input
                      type="text"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Height
                    </label>
                    <input
                      type="text"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weight
                    </label>
                    <input
                      type="text"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chest
                    </label>
                    <input
                      type="text"
                      value={chest}
                      onChange={(e) => setChest(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shoulder
                    </label>
                    <input
                      type="text"
                      value={shoulder}
                      onChange={(e) => setShoulder(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Waist
                    </label>
                    <input
                      type="text"
                      value={waist}
                      onChange={(e) => setWaist(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shoe size
                    </label>
                    <input
                      type="text"
                      value={shoeSize}
                      onChange={(e) => setShoeSize(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Eye color
                    </label>
                    <input
                      type="text"
                      value={eyeColor}
                      onChange={(e) => setEyeColor(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hair color
                    </label>
                    <input
                      type="text"
                      value={hairColor}
                      onChange={(e) => setHairColor(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={shortBio}
                    onChange={(e) => setShortBio(e.target.value)}
                    rows={3}
                    className={inputCls + " resize-y min-h-[80px]"}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#E0E0E0] pt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price range per event
                    </label>
                    <input
                      type="text"
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                      placeholder="e.g. 15,000 LKR per event"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Model tier
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
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred branch
                    </label>
                    <input
                      type="text"
                      value={preferredBranch}
                      onChange={(e) => setPreferredBranch(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred date
                    </label>
                    <input
                      type="text"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>
              </section>

              <ModelReviewMediaSection
                userId={user.id}
                media={detail?.registrationMedia}
                onMediaUpdated={(registrationMedia) =>
                  setDetail((prev) => (prev ? { ...prev, registrationMedia } : prev))
                }
                onError={(text) => setBanner({ type: "err", text })}
              />

              {canReview && (
                <section className="space-y-4 border-t border-[#E0E0E0] pt-6">
                  <h3 className={adminSectionTitle}>Approve or reject</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Confirm tier and price above, then approve to activate the model.
                  </p>

                  {banner && (
                    <div className={banner.type === "ok" ? adminAlertOk : adminAlertErr}>
                      {banner.text}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      disabled={saving || rejecting}
                      onClick={handleApprove}
                      className={adminBtnPrimary + " flex-1"}
                    >
                      {saving ? "Approving…" : "Approve model"}
                    </button>
                    <button
                      type="button"
                      disabled={saving || rejecting}
                      onClick={handleReject}
                      className={adminBtnSecondary + " flex-1"}
                    >
                      {rejecting ? "Rejecting…" : "Reject"}
                    </button>
                  </div>
                </section>
              )}

              {!canReview && banner && (
                <div className={banner.type === "ok" ? adminAlertOk : adminAlertErr}>
                  {banner.text}
                </div>
              )}

              {!canReview && user.status !== "PENDING_ADMIN_REVIEW" && (
                <p className="text-sm text-gray-500 border-t border-gray-200 pt-6">
                  This application is {MODEL_STATUS_LABELS[user.status].toLowerCase()}. Approval
                  actions are only available while pending review.
                </p>
              )}

              <section className="border-t border-red-200 pt-6 space-y-3">
                <h3 className="text-base font-semibold text-red-700">Danger zone</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Permanently deletes this account, all files, and the Auth0 login.
                </p>
                <button
                  type="button"
                  disabled={deleting || saving || rejecting}
                  onClick={handleDelete}
                  className={adminBtnDanger}
                >
                  {deleting ? "Deleting…" : "Delete account permanently"}
                </button>
              </section>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
