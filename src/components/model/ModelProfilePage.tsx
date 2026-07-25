"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getClientToken } from "@/lib/client/token";
import type { AdminModelRegistrationMedia } from "@/types/admin";
import { patchOwnModelProfile } from "@/lib/model/profile-api";
import { downloadModelProfilePdf } from "@/lib/pdf/download-pdf";
import ModelProfileMediaSection from "./ModelProfileMediaSection";
import MembershipPackagesSection from "./MembershipPackagesSection";
import MembershipPackagesModal from "./MembershipPackagesModal";

interface ModelOwnProfile {
  id: string;
  email: string;
  status: string;
  viewCount?: number;
  modelProfile?: {
    fullName?: string;
    shortBio?: string | null;
    heightEnc?: string | null;
    weightEnc?: string | null;
    chestEnc?: string | null;
    shoulderEnc?: string | null;
    waistEnc?: string | null;
    eyeColorEnc?: string | null;
    hairColorEnc?: string | null;
    contactNumberEnc?: string | null;
    whatsappNumberEnc?: string | null;
    tier?: string;
    rate?: string | null;
    gender?: string;
  } | null;
  registrationMedia?: AdminModelRegistrationMedia | null;
}

async function fetchOwnProfile(token: string): Promise<ModelOwnProfile | null> {
  try {
    const res = await fetch("/api/model/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default function ModelProfilePage() {
  const { user, isAuthenticated, isModel, isLoading } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<ModelOwnProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [bio, setBio] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [chest, setChest] = useState("");
  const [shoulder, setShoulder] = useState("");
  const [waist, setWaist] = useState("");
  const [eyeColor, setEyeColor] = useState("");
  const [hairColor, setHairColor] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [registrationMedia, setRegistrationMedia] =
    useState<AdminModelRegistrationMedia | null>(null);
  const [exportingPdf, setExportingPdf] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/?login=1");
      return;
    }
    if (!isModel) {
      router.replace("/");
      return;
    }

    const token = getClientToken();
    if (!token) return;

    void fetchOwnProfile(token).then((data) => {
      setProfile(data);
      if (data?.modelProfile) {
        setBio(data.modelProfile.shortBio ?? "");
        setHeight(data.modelProfile.heightEnc ?? "");
        setWeight(data.modelProfile.weightEnc ?? "");
        setChest(data.modelProfile.chestEnc ?? "");
        setShoulder(data.modelProfile.shoulderEnc ?? "");
        setWaist(data.modelProfile.waistEnc ?? "");
        setEyeColor(data.modelProfile.eyeColorEnc ?? "");
        setHairColor(data.modelProfile.hairColorEnc ?? "");
        setContactNumber(data.modelProfile.contactNumberEnc ?? "");
        setWhatsapp(data.modelProfile.whatsappNumberEnc ?? "");
      }
      setRegistrationMedia(data?.registrationMedia ?? null);
      setLoadingProfile(false);
    });
  }, [isAuthenticated, isLoading, isModel, router]);

  const isActive = profile?.status === "ACTIVE";

  async function handleExportPdf() {
    setExportingPdf(true);
    setBanner(null);
    const result = await downloadModelProfilePdf();
    setExportingPdf(false);
    if (!result.ok) {
      setBanner({ type: "err", text: result.message });
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const token = getClientToken();
    if (!token) return;

    setSaving(true);
    setBanner(null);

    const result = await patchOwnModelProfile({
      shortBio: bio,
      heightEnc: height,
      weightEnc: weight,
      chestEnc: chest,
      shoulderEnc: shoulder,
      waistEnc: waist,
      eyeColorEnc: eyeColor,
      hairColorEnc: hairColor,
      contactNumberEnc: contactNumber,
      whatsappNumberEnc: whatsapp,
    });

    setSaving(false);
    setBanner(result.ok ? { type: "ok", text: "Profile updated." } : { type: "err", text: result.message ?? "Update failed" });
  }

  const inputCls =
    "w-full border border-[#E0E0E0] px-3 py-2.5 font-ui text-[10px] tracking-[0.05em] bg-white outline-none focus:border-[#C8A97A] transition-colors";

  if (isLoading || loadingProfile) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <p className="font-ui text-[10px] tracking-[0.2em] uppercase text-[#9A9A9A]">
          Loading…
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-24 pb-16 px-4">
      {isActive && (
        <MembershipPackagesModal
          modelName={profile?.modelProfile?.fullName ?? user?.name ?? ""}
        />
      )}
      <div className="max-w-xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="min-w-0 flex-1">
            <p className="font-ui text-[8px] tracking-[0.35em] uppercase text-[#C8A97A] mb-2">
              Model account
            </p>
            <h1 className="font-display text-3xl font-light text-[#0A0A0A] mb-1">
              {profile?.modelProfile?.fullName ?? user?.name ?? user?.email}
            </h1>
            <p className="font-ui text-[9px] tracking-[0.1em] text-[#9A9A9A]">
              {user?.email}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void handleExportPdf()}
            disabled={exportingPdf || loadingProfile}
            className="shrink-0 font-ui text-[11px] tracking-[0.2em] uppercase px-5 py-2.5 bg-[#0A0A0A] text-white border border-[#C8A97A] hover:bg-[#C8A97A] hover:text-[#0A0A0A] disabled:opacity-50 transition-colors"
          >
            {exportingPdf ? "Exporting…" : "Export"}
          </button>
        </div>

        {banner && (
          <p
            className={
              "font-ui text-[10px] mb-6 px-4 py-3 border " +
              (banner.type === "ok"
                ? "border-[#C8A97A]/40 bg-[#FFFBF5] text-[#4A4A4A]"
                : "border-red-200 bg-red-50 text-red-700")
            }
          >
            {banner.text}
          </p>
        )}

        <p className="font-ui text-[10px] text-[#6B6B6B] leading-relaxed mb-8 max-w-md">
          Download a PDF comp card with your photos, measurements, and profile details.
        </p>

        {typeof profile?.viewCount === "number" && (
          <div className="flex items-center gap-3 mb-8">
            <div className="border border-[#E0E0E0] bg-white px-5 py-3 inline-flex items-center gap-3">
              <span className="font-display text-2xl font-light text-[#C8A97A]">
                {profile.viewCount.toLocaleString()}
              </span>
              <span className="font-ui text-[8px] tracking-[0.25em] uppercase text-[#9A9A9A]">
                Profile Views
              </span>
            </div>
          </div>
        )}

        {!isActive && (
          <div className="border border-[#C8A97A] bg-[#C8A97A]/10 px-5 py-4 mb-8">
            <p className="font-ui text-[9px] tracking-[0.2em] uppercase text-[#9A7329] mb-1">
              Under admin review
            </p>
            <p className="font-ui text-[10px] text-[#0A0A0A] leading-relaxed">
              Your profile has been submitted and is currently being reviewed by the team. You
              will be notified once your account is activated.
            </p>
          </div>
        )}

        {isActive && (
          <form onSubmit={handleSave} className="space-y-6">
            <section className="bg-white border border-[#E0E0E0] p-6 space-y-5">
              <h2 className="font-ui text-[9px] tracking-[0.25em] uppercase text-[#0A0A0A]">
                Profile details
              </h2>

              <div className="space-y-1">
                <label className="font-ui text-[8px] tracking-[0.2em] uppercase text-[#9A9A9A]">
                  Bio
                </label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className={inputCls + " resize-y"}
                  placeholder="Tell clients about yourself…"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Height", value: height, set: setHeight, placeholder: "e.g. 178cm" },
                  { label: "Weight", value: weight, set: setWeight, placeholder: "e.g. 65kg" },
                  { label: "Chest", value: chest, set: setChest, placeholder: "e.g. 90cm" },
                  { label: "Shoulder", value: shoulder, set: setShoulder, placeholder: "e.g. 42cm" },
                  { label: "Waist", value: waist, set: setWaist, placeholder: "e.g. 70cm" },
                  { label: "Eye colour", value: eyeColor, set: setEyeColor, placeholder: "e.g. Brown" },
                  { label: "Hair colour", value: hairColor, set: setHairColor, placeholder: "e.g. Black" },
                ].map(({ label, value, set, placeholder }) => (
                  <div key={label} className="space-y-1">
                    <label className="font-ui text-[8px] tracking-[0.2em] uppercase text-[#9A9A9A]">
                      {label}
                    </label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => set(e.target.value)}
                      className={inputCls}
                      placeholder={placeholder}
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Contact number", value: contactNumber, set: setContactNumber, placeholder: "e.g. +94 77 123 4567" },
                  { label: "WhatsApp number", value: whatsapp, set: setWhatsapp, placeholder: "e.g. +94 77 123 4567" },
                ].map(({ label, value, set, placeholder }) => (
                  <div key={label} className="space-y-1">
                    <label className="font-ui text-[8px] tracking-[0.2em] uppercase text-[#9A9A9A]">
                      {label}
                    </label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => set(e.target.value)}
                      className={inputCls}
                      placeholder={placeholder}
                    />
                  </div>
                ))}
              </div>
            </section>

            <ModelProfileMediaSection
              media={registrationMedia}
              onMediaChange={setRegistrationMedia}
              onError={(message) => setBanner({ type: "err", text: message })}
            />

            {banner && (
              <div
                className={
                  banner.type === "ok"
                    ? "border border-[#C8A97A] bg-[#C8A97A]/10 px-5 py-3"
                    : "border border-red-300 bg-red-50 px-5 py-3"
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
              type="submit"
              disabled={saving}
              className="w-full font-ui text-[10px] tracking-[0.2em] uppercase px-6 py-3.5 bg-[#0A0A0A] text-white hover:bg-[#C8A97A] disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </form>
        )}

        <div className="mt-12">
          <MembershipPackagesSection />
        </div>

        {!isActive && (
          <div className="bg-white border border-[#E0E0E0] p-6">
            <p className="font-ui text-[9px] tracking-[0.25em] uppercase text-[#0A0A0A] mb-4">
              Your details
            </p>
            <div className="space-y-3">
              {[
                ["Full name", profile?.modelProfile?.fullName],
                ["Height", profile?.modelProfile?.heightEnc],
                ["Gender", profile?.modelProfile?.gender],
              ]
                .filter(([, v]) => v)
                .map(([label, val]) => (
                  <div key={label as string}>
                    <p className="font-ui text-[8px] tracking-[0.2em] uppercase text-[#9A9A9A]">
                      {label}
                    </p>
                    <p className="font-ui text-[10px] text-[#0A0A0A]">{val}</p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
